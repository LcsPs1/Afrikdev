import logging
import urllib.parse
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect, JsonResponse
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Developer, SocialAccount

logger = logging.getLogger(__name__)
User = get_user_model()


def generate_jwt_for_user(user):
    """Génère les jetons JWT SimpleJWT pour l'utilisateur."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def get_or_create_social_user(provider, uid, email, name='', avatar='', extra_data=None):
    """
    Recherche ou crée un utilisateur à partir des informations fournies par le provider social.
    Garantit l'association multi-comptes si l'email correspond déjà à un utilisateur existant.
    """
    extra_data = extra_data or {}
    email = (email or '').strip().lower()

    # 1. Recherche par compte social existant
    social_account = SocialAccount.objects.filter(provider=provider, uid=str(uid)).select_related('user').first()
    
    if social_account:
        user = social_account.user
        social_account.extra_data = extra_data
        social_account.save()
    else:
        # 2. Recherche si un utilisateur existe déjà avec cet email
        user = None
        if email:
            user = User.objects.filter(email__iexact=email).first()

        # 3. Si aucun utilisateur n'existe, on en crée un nouveau
        if not user:
            base_username = (
                extra_data.get('login') or
                email.split('@')[0] if email else
                f"{provider}_{uid}"
            )
            base_username = ''.join(c for c in base_username if c.isalnum() or c in '_-')[:30]
            username = base_username or f"dev_{uid}"
            
            # Garantir l'unicité du username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username[:25]}_{counter}"
                counter += 1

            first_name = extra_data.get('given_name') or ''
            last_name = extra_data.get('family_name') or ''
            if not first_name and name:
                parts = name.split(' ', 1)
                first_name = parts[0]
                last_name = parts[1] if len(parts) > 1 else ''

            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name[:30],
                last_name=last_name[:30],
            )
            user.set_unusable_password()
            user.save()

        # Enregistrer le lien SocialAccount
        social_account = SocialAccount.objects.create(
            user=user,
            provider=provider,
            uid=str(uid),
            extra_data=extra_data,
        )

    # 4. Synchroniser ou créer le profil Développeur AfrikDev lié
    developer = Developer.objects.filter(user=user).first()
    if not developer and email:
        developer = Developer.objects.filter(email__iexact=email).first()
        if developer:
            developer.user = user

    if not developer:
        # Création automatique du profil Développeur
        dev_name = name or user.get_full_name() or user.username
        dev_avatar = avatar or f"https://api.dicebear.com/7.x/bottts/svg?seed={user.username}"
        github_handle = extra_data.get('login', '') if provider == 'github' else ''
        bio = extra_data.get('bio') or f"Développeur passionné sur AFRIKDEV ({provider.capitalize()})"

        developer = Developer.objects.create(
            user=user,
            email=email or f"{user.username}@afrikdev.local",
            name=dev_name,
            title='Développeur Full-Stack',
            country='Côte d\'Ivoire',
            flag='🇨🇮',
            city='Abidjan',
            avatar=dev_avatar,
            bio=bio,
            skills=['React', 'Django', 'Python', 'JavaScript'] if provider == 'github' else ['Full-Stack', 'Web'],
            github=github_handle,
            reputation=120,
            available=True,
        )
    else:
        # Mise à jour si champs manquants
        if not developer.avatar and avatar:
            developer.avatar = avatar
        if provider == 'github' and not developer.github and extra_data.get('login'):
            developer.github = extra_data.get('login')
        if not developer.email and email:
            developer.email = email
        if developer.user != user:
            developer.user = user
        developer.save()

    return user, developer


# ============================================================================
# GOOGLE OAUTH
# ============================================================================

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def google_auth_url(request):
    """Renvoie l'URL d'autorisation Google OAuth 2.0 pour le frontend."""
    client_id = settings.GOOGLE_CLIENT_ID
    if not client_id:
        return Response(
            {'error': "GOOGLE_CLIENT_ID non configuré sur le backend."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # Utiliser le host courant ou localhost:8000 par défaut
    redirect_uri = request.GET.get('redirect_uri') or 'http://localhost:8000/accounts/google/login/callback/'

    params = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'openid email profile',
        'access_type': 'offline',
        'prompt': 'select_account',
    }
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
    return Response({'url': url})


def handle_google_code(code, redirect_uri):
    """Échange le code d'autorisation Google contre le profil utilisateur."""
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': redirect_uri,
    }
    token_response = requests.post(token_url, data=token_data, timeout=10)
    if token_response.status_code != 200:
        logger.error("Erreur Google token: %s", token_response.text)
        return None, token_response.json()

    tokens = token_response.json()
    access_token = tokens.get('access_token')

    # Récupération du profil
    userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
    userinfo_response = requests.get(
        userinfo_url,
        headers={'Authorization': f'Bearer {access_token}'},
        timeout=10
    )
    if userinfo_response.status_code != 200:
        logger.error("Erreur Google userinfo: %s", userinfo_response.text)
        return None, userinfo_response.json()

    return userinfo_response.json(), None


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_exchange_code(request):
    """
    Reçoit un code OAuth Google envoyé par le frontend (POST JSON),
    échange contre les jetons JWT AfrikDev et connecte l'utilisateur.
    """
    code = request.data.get('code')
    redirect_uri = request.data.get('redirect_uri') or request.build_absolute_uri('/accounts/google/login/callback/')

    if not code:
        return Response({'error': 'Code manquant.'}, status=status.HTTP_400_BAD_REQUEST)

    userinfo, err = handle_google_code(code, redirect_uri)
    if err or not userinfo:
        return Response({'error': 'Échec de validation Google', 'details': err}, status=status.HTTP_400_BAD_REQUEST)

    user, developer = get_or_create_social_user(
        provider='google',
        uid=userinfo.get('sub'),
        email=userinfo.get('email', ''),
        name=userinfo.get('name', ''),
        avatar=userinfo.get('picture', ''),
        extra_data=userinfo,
    )

    jwt_tokens = generate_jwt_for_user(user)

    return Response({
        'message': 'Authentification Google réussie !',
        'tokens': jwt_tokens,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        },
        'developer': {
            'id': developer.id,
            'name': developer.name,
            'title': developer.title,
            'avatar': developer.avatar,
            'country': developer.country,
            'flag': developer.flag,
            'reputation': developer.reputation,
        } if developer else None
    })


def google_callback_redirect(request):
    """Gère le retour GET direct de Google vers le backend et redirige vers le frontend."""
    code = request.GET.get('code')
    error = request.GET.get('error')
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173').rstrip('/')

    if error or not code:
        return HttpResponseRedirect(f"{frontend_url}/?auth_error={error or 'cancelled'}")

    redirect_uri = request.build_absolute_uri('/accounts/google/login/callback/')
    userinfo, err = handle_google_code(code, redirect_uri)

    if err or not userinfo:
        return HttpResponseRedirect(f"{frontend_url}/?auth_error=google_failed")

    user, developer = get_or_create_social_user(
        provider='google',
        uid=userinfo.get('sub'),
        email=userinfo.get('email', ''),
        name=userinfo.get('name', ''),
        avatar=userinfo.get('picture', ''),
        extra_data=userinfo,
    )

    jwt_tokens = generate_jwt_for_user(user)
    redirect_target = (
        f"{frontend_url}/?auth_provider=google"
        f"&access={jwt_tokens['access']}"
        f"&refresh={jwt_tokens['refresh']}"
        f"&username={urllib.parse.quote(user.username)}"
        f"&name={urllib.parse.quote(developer.name if developer else user.username)}"
    )
    return HttpResponseRedirect(redirect_target)


# ============================================================================
# GITHUB OAUTH
# ============================================================================

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def github_auth_url(request):
    """Renvoie l'URL d'autorisation GitHub OAuth pour le frontend."""
    client_id = settings.GITHUB_CLIENT_ID
    if not client_id:
        return Response(
            {'error': "GITHUB_CLIENT_ID non configuré sur le backend."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # Note GitHub OAuth : si redirect_uri n'est pas spécifié, GitHub utilise automatiquement
    # l'Authorization callback URL enregistrée dans la console développeur.
    # Cela évite l'avertissement 'The redirect_uri is not associated with this application'.
    params = {
        'client_id': client_id,
        'scope': 'read:user user:email',
    }
    
    custom_redirect = request.GET.get('redirect_uri')
    if custom_redirect:
        params['redirect_uri'] = custom_redirect.replace('127.0.0.1', 'localhost')

    url = f"https://github.com/login/oauth/authorize?{urllib.parse.urlencode(params)}"
    return Response({'url': url})


def handle_github_code(code, redirect_uri=None):
    """Échange le code d'autorisation GitHub contre le profil développeur GitHub."""
    token_url = "https://github.com/login/oauth/access_token"
    payload = {
        'client_id': settings.GITHUB_CLIENT_ID,
        'client_secret': settings.GITHUB_CLIENT_SECRET,
        'code': code,
    }
    if redirect_uri:
        payload['redirect_uri'] = redirect_uri

    headers = {'Accept': 'application/json'}
    token_response = requests.post(token_url, json=payload, headers=headers, timeout=10)
    if token_response.status_code != 200:
        logger.error("Erreur GitHub token: %s", token_response.text)
        return None, token_response.json()

    token_data = token_response.json()
    access_token = token_data.get('access_token')
    if not access_token:
        return None, token_data

    # Récupérer les informations du profil utilisateur GitHub
    user_headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'AfrikDev-Platform',
    }
    profile_response = requests.get('https://api.github.com/user', headers=user_headers, timeout=10)
    if profile_response.status_code != 200:
        return None, profile_response.json()

    profile_data = profile_response.json()

    # Si l'email est masqué ou nul, récupérer la liste des emails vérifiés
    email = profile_data.get('email')
    if not email:
        emails_response = requests.get('https://api.github.com/user/emails', headers=user_headers, timeout=10)
        if emails_response.status_code == 200:
            emails_list = emails_response.json()
            for item in emails_list:
                if item.get('primary') and item.get('verified'):
                    email = item.get('email')
                    break
            if not email and emails_list:
                email = emails_list[0].get('email')

    profile_data['resolved_email'] = email
    return profile_data, None


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def github_exchange_code(request):
    """Reçoit un code GitHub envoyé par le frontend (POST JSON), échange contre JWT."""
    code = request.data.get('code')
    redirect_uri = request.data.get('redirect_uri')

    if not code:
        return Response({'error': 'Code manquant.'}, status=status.HTTP_400_BAD_REQUEST)

    profile, err = handle_github_code(code, redirect_uri)
    if err or not profile:
        return Response({'error': 'Échec de validation GitHub', 'details': err}, status=status.HTTP_400_BAD_REQUEST)

    user, developer = get_or_create_social_user(
        provider='github',
        uid=profile.get('id'),
        email=profile.get('resolved_email') or profile.get('email', ''),
        name=profile.get('name') or profile.get('login', ''),
        avatar=profile.get('avatar_url', ''),
        extra_data=profile,
    )

    jwt_tokens = generate_jwt_for_user(user)

    return Response({
        'message': 'Authentification GitHub réussie !',
        'tokens': jwt_tokens,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        },
        'developer': {
            'id': developer.id,
            'name': developer.name,
            'title': developer.title,
            'avatar': developer.avatar,
            'country': developer.country,
            'flag': developer.flag,
            'github': developer.github,
            'reputation': developer.reputation,
        } if developer else None
    })


def github_callback_redirect(request):
    """Gère le retour GET direct de GitHub vers le backend et redirige vers le frontend."""
    code = request.GET.get('code')
    error = request.GET.get('error')
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173').rstrip('/')

    if error or not code:
        return HttpResponseRedirect(f"{frontend_url}/?auth_error={error or 'cancelled'}")

    profile, err = handle_github_code(code)
    if err or not profile:
        return HttpResponseRedirect(f"{frontend_url}/?auth_error=github_failed")

    user, developer = get_or_create_social_user(
        provider='github',
        uid=profile.get('id'),
        email=profile.get('resolved_email') or profile.get('email', ''),
        name=profile.get('name') or profile.get('login', ''),
        avatar=profile.get('avatar_url', ''),
        extra_data=profile,
    )

    jwt_tokens = generate_jwt_for_user(user)
    redirect_target = (
        f"{frontend_url}/?auth_provider=github"
        f"&access={jwt_tokens['access']}"
        f"&refresh={jwt_tokens['refresh']}"
        f"&username={urllib.parse.quote(user.username)}"
        f"&name={urllib.parse.quote(developer.name if developer else user.username)}"
    )
    return HttpResponseRedirect(redirect_target)


# ============================================================================
# ME / USER PROFILE ENDPOINT
# ============================================================================

@api_view(['GET', 'PATCH', 'PUT'])
@permission_classes([permissions.IsAuthenticated])
def auth_me(request):
    """Renvoie ou met à jour le profil de l'utilisateur connecté avec son Developer profile et ses Social Accounts."""
    user = request.user
    developer = getattr(user, 'developer_profile', None)

    if request.method in ['PATCH', 'PUT']:
        data = request.data
        if 'name' in data and data['name']:
            name_parts = data['name'].strip().split(' ', 1)
            user.first_name = name_parts[0][:30]
            user.last_name = (name_parts[1] if len(name_parts) > 1 else '')[:30]
        if 'email' in data and data['email']:
            user.email = data['email']
        user.save()

        if developer:
            for field in ['name', 'title', 'avatar', 'bio', 'country', 'city', 'skills', 'github', 'available', 'badges']:
                if field in data:
                    setattr(developer, field, data[field])
            developer.save()
            developer.refresh_from_db()

    social_accounts = [
        {
            'provider': sa.provider,
            'uid': sa.uid,
            'created_at': sa.created_at,
        }
        for sa in user.social_accounts.all()
    ]

    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
        },
        'developer': {
            'id': developer.id,
            'name': developer.name,
            'title': developer.title,
            'avatar': developer.avatar,
            'country': developer.country,
            'flag': developer.flag,
            'city': developer.city,
            'bio': developer.bio,
            'skills': developer.skills,
            'reputation': developer.reputation,
            'github': developer.github,
            'available': developer.available,
            'badges': developer.badges,
        } if developer else None,
        'social_accounts': social_accounts,
    })
