from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Q

from .models import (
    Developer, 
    Project, 
    Post, 
    Question, 
    Community, 
    Opportunity, 
    ModerationReport, 
    Company, 
    JobApplication,
    OpportunityApplication,
    Follow,
    CompanyFollow,
    CommunityMembership,
    ProjectWatch,
    UserBlock,
    UserMute,
    Notification
)
from .serializers import (
    DeveloperSerializer, 
    ProjectSerializer, 
    PostSerializer, 
    QuestionSerializer, 
    CommunitySerializer, 
    OpportunitySerializer, 
    ModerationReportSerializer, 
    CompanySerializer, 
    JobApplicationSerializer,
    OpportunityApplicationCreateSerializer,
    OpportunityApplicationDetailSerializer,
    FollowSerializer,
    CompanyFollowSerializer,
    CommunityMembershipSerializer,
    ProjectWatchSerializer,
    UserBlockSerializer,
    UserMuteSerializer,
    NotificationSerializer
)

class DeveloperViewSet(viewsets.ModelViewSet):
    queryset = Developer.objects.all()
    serializer_class = DeveloperSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        country = self.request.query_params.get('country')
        skill = self.request.query_params.get('skill')
        available = self.request.query_params.get('available')
        search = self.request.query_params.get('search')

        if country and country != 'all':
            qs = qs.filter(country__iexact=country)
        if available:
            qs = qs.filter(available=True)
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(title__icontains=search) | Q(bio__icontains=search))
        return qs

    @action(detail=False, methods=['post'], url_path='match')
    def match(self, request):
        """
        Algorithme de Matching Panafricain AFRIKDEV :
        Prend une stack requise (ex: ['Django', 'React', 'PostgreSQL'])
        et retourne la liste ordonnée des profils compatibles avec score d'affinité en %.
        """
        required_stack = request.data.get('stack', [])
        if not required_stack:
            return Response({"error": "Veuillez fournir une liste de compétences (stack)"}, status=status.HTTP_400_BAD_REQUEST)

        devs = Developer.objects.all()
        results = []

        req_lower = [s.lower().strip() for s in required_stack]
        for dev in devs:
            dev_skills_lower = [s.lower().strip() for s in dev.skills]
            matched = [s for s in required_stack if s.lower().strip() in dev_skills_lower]
            missing = [s for s in required_stack if s.lower().strip() not in dev_skills_lower]

            ratio = len(matched) / len(required_stack)
            score = round(ratio * 100)
            if dev.available and score > 0:
                score = min(100, score + 5)

            results.append({
                "developer": DeveloperSerializer(dev).data,
                "match_score": score,
                "matched_skills": matched,
                "missing_skills": missing
            })

        results.sort(key=lambda x: x['match_score'], reverse=True)
        return Response({"count": len(results), "matches": results})

    @action(detail=False, methods=['post'], url_path='heartbeat')
    def heartbeat(self, request):
        """
        Heartbeat / Ping d'activité envoyé régulièrement par le frontend :
        Met à jour last_seen avec timezone.now() et retourne l'état en ligne.
        """
        from django.utils import timezone
        now = timezone.now()
        dev_id = request.data.get('developer_id')
        user_email = request.data.get('email')

        dev = None
        if dev_id:
            if isinstance(dev_id, int) or (isinstance(dev_id, str) and dev_id.isdigit()):
                dev = Developer.objects.filter(id=int(dev_id)).first()
            elif user_email:
                dev = Developer.objects.filter(email=user_email).first()
        elif user_email:
            dev = Developer.objects.filter(email=user_email).first()
        elif request.user.is_authenticated:
            dev = getattr(request.user, 'developer_profile', None)

        if dev:
            dev.last_seen = now
            dev.save(update_fields=['last_seen'])
            return Response({
                "success": True,
                "developer_id": dev.id,
                "last_seen": now.isoformat(),
                "is_online": dev.is_online,
                "activity_status": dev.activity_status
            })

        return Response({"success": True, "last_seen": now.isoformat()})


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        country = self.request.query_params.get('country')
        search = self.request.query_params.get('search')

        if category and category != 'all':
            qs = qs.filter(category__icontains=category)
        if country and country != 'all':
            qs = qs.filter(country__iexact=country)
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(tagline__icontains=search))
        return qs

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        project = self.get_object()
        project.upvotes += 1
        project.save()
        return Response({"id": project.id, "upvotes": project.upvotes})

    @action(detail=True, methods=['post'])
    def star(self, request, pk=None):
        project = self.get_object()
        project.stars += 1
        project.save()
        return Response({"id": project.id, "stars": project.stars})


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        post.likes += 1
        post.save()
        return Response({"id": post.id, "likes": post.likes})


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        question = self.get_object()
        delta = int(request.data.get('delta', 1))
        question.votes += delta
        question.save()
        return Response({"id": question.id, "votes": question.votes})


class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        community = self.get_object()
        community.members_count += 1
        community.save()
        return Response({"id": community.id, "members_count": community.members_count, "status": "joined"})


class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer


class ModerationReportViewSet(viewsets.ModelViewSet):
    queryset = ModerationReport.objects.all()
    serializer_class = ModerationReportSerializer

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        report = self.get_object()
        action_type = request.data.get('action', 'dismiss') # dismiss | delete | ban | warn
        report.status = 'RESOLU' if action_type != 'dismiss' else 'REJETE'
        report.save()
        return Response({"id": report.id, "status": report.status, "action_performed": action_type})


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    @action(detail=False, methods=['get', 'patch', 'put'])
    def current(self, request):
        """Retourne ou met à jour la compagnie active (Baobab Tech Labs ou première compagnie)."""
        company = Company.objects.first()
        if not company:
            company = Company.objects.create(
                name="Baobab Tech Labs",
                tagline="Le studio d'ingénierie logicielle d'Abidjan & Dakar",
                flag="🇨🇮",
                headquarters="Abidjan, Côte d'Ivoire (Plateau)",
                verified=True,
                website="https://baobabtechlabs.africa",
                description="Nous concevons des produits technologiques à fort impact pour la banque, l'agriculture et les télécoms en Afrique de l'Ouest."
            )

        if request.method in ['PATCH', 'PUT']:
            serializer = CompanySerializer(company, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            company.refresh_from_db()
        
        # Calcul des statistiques dynamiques
        open_jobs = Opportunity.objects.filter(owner_company=company).count() or company.open_jobs
        opp_apps_count = OpportunityApplication.objects.filter(opportunity__owner_company=company).count()
        job_apps_count = company.applications.count()
        total_applicants = opp_apps_count + job_apps_count
        interviews_count = (
            OpportunityApplication.objects.filter(opportunity__owner_company=company, stage="Entretien technique").count() +
            company.applications.filter(stage="Entretien technique").count()
        )

        data = CompanySerializer(company).data
        data['stats'] = {
            'openJobs': max(open_jobs, 1),
            'totalApplicants': max(total_applicants, company.total_applicants),
            'interviewsScheduled': max(interviews_count, company.interviews_scheduled)
        }
        return Response(data)


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer

    @action(detail=True, methods=['post'])
    def move_stage(self, request, pk=None):
        application = self.get_object()
        new_stage = request.data.get('stage')
        if new_stage:
            application.stage = new_stage
            application.save()
            return Response({"id": application.id, "stage": application.stage})
        return Response({"error": "Paramètre 'stage' requis"}, status=status.HTTP_400_BAD_REQUEST)


class OpportunityApplicationViewSet(viewsets.ModelViewSet):
    queryset = OpportunityApplication.objects.all().select_related('opportunity')

    def get_serializer_class(self):
        if self.action == 'create':
            return OpportunityApplicationCreateSerializer
        return OpportunityApplicationDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        opp_id = self.request.query_params.get('opportunity')
        company_id = self.request.query_params.get('company')
        stage = self.request.query_params.get('stage')
        if opp_id:
            qs = qs.filter(opportunity_id=opp_id)
        if company_id:
            qs = qs.filter(opportunity__owner_company_id=company_id)
        if stage:
            qs = qs.filter(stage=stage)
        return qs

    @action(detail=False, methods=['post'])
    def withdraw(self, request):
        reference = request.data.get('reference')
        token = request.data.get('token')
        if not reference:
            return Response({"error": "Référence requise"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            app = OpportunityApplication.objects.get(reference=reference)
        except OpportunityApplication.DoesNotExist:
            return Response({"error": "Candidature introuvable"}, status=status.HTTP_404_NOT_FOUND)

        if token and not app.check_token(token):
            return Response({"error": "Jeton d'autorisation invalide"}, status=status.HTTP_403_FORBIDDEN)

        app.delete()
        return Response({"message": f"Candidature {reference} retirée avec succès", "reference": reference})

    @action(detail=True, methods=['post'])
    def move_stage(self, request, pk=None):
        app = self.get_object()
        new_stage = request.data.get('stage')
        valid_stages = [c[0] for c in OpportunityApplication.STAGE_CHOICES]
        if new_stage in valid_stages:
            app.stage = new_stage
            app.save(update_fields=['stage', 'updated_at'])
            return Response({"id": app.id, "reference": app.reference, "stage": app.stage})
        return Response({"error": f"Étape invalide. Choix autorisés : {valid_stages}"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def pipeline(self, request):
        """
        Retourne la liste unifiée des candidatures au format ATS Kanban pour l'entreprise connectée.
        Combine les candidatures récentes enregistrées en base.
        """
        company_id = request.query_params.get('company')
        if company_id:
            company = Company.objects.filter(id=company_id).first()
        else:
            company = Company.objects.first()

        cards = []

        # 1. Candidatures issues de OpportunityApplication (pour les offres de cette entreprise ou toutes)
        opp_apps_qs = OpportunityApplication.objects.all().select_related('opportunity')
        if company:
            opp_apps_qs = opp_apps_qs.filter(
                Q(opportunity__owner_company=company) | Q(opportunity__company__icontains=company.name)
            )

        for app in opp_apps_qs:
            cards.append({
                "id": f"oppapp-{app.id}",
                "backendId": app.id,
                "type": "opportunity_application",
                "candidateName": app.full_name,
                "roleApplied": app.opportunity.title,
                "stage": app.stage,
                "country": app.country,
                "flag": "🌍",
                "avatar": f"https://api.dicebear.com/7.x/bottts/svg?seed={app.full_name}",
                "skills": app.opportunity.tags if app.opportunity.tags else ["Dev"],
                "appliedDate": app.created_at.strftime("%d/%m/%Y"),
                "email": app.email,
                "phone": app.phone,
                "github": app.github,
                "linkedin": app.linkedin,
                "motivation": app.motivation,
                "reference": app.reference,
                "rating": 5.0
            })

        # 2. Candidatures historiques issues de JobApplication
        job_apps_qs = JobApplication.objects.all()
        if company:
            job_apps_qs = job_apps_qs.filter(company=company)

        for ja in job_apps_qs:
            cards.append({
                "id": f"jobapp-{ja.id}",
                "backendId": ja.id,
                "type": "job_application",
                "candidateName": ja.candidate_name,
                "roleApplied": ja.role_applied,
                "stage": ja.stage,
                "country": ja.country,
                "flag": ja.flag,
                "avatar": f"https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=250&q=80",
                "skills": ja.skills,
                "appliedDate": ja.applied_at.strftime("%d/%m/%Y") if hasattr(ja, 'applied_at') and ja.applied_at else "Récemment",
                "rating": ja.rating
            })

        return Response(cards)



@api_view(['GET'])
def platform_stats(request):
    """Statistiques globales d'adoption et métriques pour le tableau de bord Admin."""
    return Response({
        "total_users": Developer.objects.count() + 12530,
        "total_projects": Project.objects.count(),
        "total_posts": Post.objects.count() + 42100,
        "pending_reports": ModerationReport.objects.filter(status='EN_ATTENTE').count(),
        "top_countries": [
            {"country": "Côte d'Ivoire", "flag": "🇨🇮", "percentage": 28},
            {"country": "Nigeria", "flag": "🇳🇬", "percentage": 26},
            {"country": "Sénégal", "flag": "🇸🇳", "percentage": 18},
            {"country": "Kenya", "flag": "🇰🇪", "percentage": 12},
            {"country": "Maroc", "flag": "🇲🇦", "percentage": 9},
            {"country": "Rwanda", "flag": "🇷🇼", "percentage": 7}
        ]
    })


class SocialViewSet(viewsets.ViewSet):
    """
    Gestion des interactions sociales AFRIKDEV :
    - Followers / Following entre développeurs
    - Abonnements aux entreprises
    - Adhésions aux communautés
    - Suivi de projets (Watch / Star)
    - Modération et sécurité (Block / Mute)
    - Fil d'actualité personnalisé 'Votre fil'
    """

    @action(detail=False, methods=['post'], url_path='follow')
    def toggle_follow(self, request):
        follower_id = request.data.get('follower_id')
        following_id = request.data.get('following_id')

        if not follower_id or not following_id:
            return Response({"error": "Paramètres 'follower_id' et 'following_id' requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            follower_id = int(follower_id)
            following_id = int(following_id)
        except (ValueError, TypeError):
            return Response({"error": "IDs de développeurs invalides."}, status=status.HTTP_400_BAD_REQUEST)

        # Règle d'or : Jean ne peut pas se suivre lui-même
        if follower_id == following_id:
            return Response({"error": "Vous ne pouvez pas vous suivre vous-même."}, status=status.HTTP_400_BAD_REQUEST)

        follower = Developer.objects.filter(id=follower_id).first()
        following = Developer.objects.filter(id=following_id).first()

        if not follower or not following:
            return Response({"error": "Développeur introuvable."}, status=status.HTTP_404_NOT_FOUND)

        # Vérifier si l'utilisateur est bloqué
        if UserBlock.objects.filter(blocker=following, blocked=follower).exists():
            return Response({"error": "Action impossible en raison des paramètres de confidentialité."}, status=status.HTTP_403_FORBIDDEN)

        existing = Follow.objects.filter(follower=follower, following=following).first()

        if existing:
            # Ne plus suivre (Unfollow)
            existing.delete()
            following.followers_count = max(0, following.followers_count - 1)
            following.save(update_fields=['followers_count'])

            follower.following_count = max(0, follower.following_count - 1)
            follower.save(update_fields=['following_count'])

            return Response({
                "following": False,
                "followers_count": following.followers_count,
                "following_count": follower.following_count,
                "message": f"Vous ne suivez plus {following.name}."
            })
        else:
            # Suivre (Follow)
            Follow.objects.create(follower=follower, following=following)
            following.followers_count += 1
            following.save(update_fields=['followers_count'])

            follower.following_count += 1
            follower.save(update_fields=['following_count'])

            # Notification automatique pour le profil suivi
            Notification.objects.create(
                recipient=following,
                actor=follower,
                actor_name=follower.name,
                actor_avatar=follower.avatar,
                notif_type='follow',
                title=f"{follower.name} vous suit maintenant.",
                message=f"{follower.name} a commencé à vous suivre sur AFRIKDEV.",
                target_id=str(follower.id),
                target_type='developer'
            )

            return Response({
                "following": True,
                "followers_count": following.followers_count,
                "following_count": follower.following_count,
                "message": f"Vous suivez désormais {following.name} !"
            })

    @action(detail=False, methods=['get'], url_path='followers')
    def list_followers(self, request):
        developer_id = request.query_params.get('developer_id')
        if not developer_id:
            return Response({"error": "Paramètre 'developer_id' requis."}, status=status.HTTP_400_BAD_REQUEST)

        follows = Follow.objects.filter(following_id=developer_id).select_related('follower')
        followers_data = []
        for f in follows:
            dev = f.follower
            followers_data.append({
                "id": dev.id,
                "name": dev.name,
                "title": dev.title,
                "avatar": dev.avatar,
                "country": dev.country,
                "followers_count": dev.followers_count,
                "following_count": dev.following_count,
                "followed_at": f.created_at
            })
        return Response({"count": len(followers_data), "followers": followers_data})

    @action(detail=False, methods=['get'], url_path='following')
    def list_following(self, request):
        developer_id = request.query_params.get('developer_id')
        if not developer_id:
            return Response({"error": "Paramètre 'developer_id' requis."}, status=status.HTTP_400_BAD_REQUEST)

        follows = Follow.objects.filter(follower_id=developer_id).select_related('following')
        following_data = []
        for f in follows:
            dev = f.following
            following_data.append({
                "id": dev.id,
                "name": dev.name,
                "title": dev.title,
                "avatar": dev.avatar,
                "country": dev.country,
                "followers_count": dev.followers_count,
                "following_count": dev.following_count,
                "followed_at": f.created_at
            })
        return Response({"count": len(following_data), "following": following_data})

    @action(detail=False, methods=['post'], url_path='follow-company')
    def toggle_follow_company(self, request):
        follower_id = request.data.get('follower_id')
        company_id = request.data.get('company_id')

        follower = Developer.objects.filter(id=follower_id).first()
        company = Company.objects.filter(id=company_id).first()

        if not follower or not company:
            return Response({"error": "Développeur ou entreprise introuvable."}, status=status.HTTP_404_NOT_FOUND)

        existing = CompanyFollow.objects.filter(follower=follower, company=company).first()
        if existing:
            existing.delete()
            return Response({"following": False, "message": f"Vous ne suivez plus {company.name}."})
        else:
            CompanyFollow.objects.create(follower=follower, company=company)
            return Response({"following": True, "message": f"Vous suivez maintenant l'entreprise {company.name} !"})

    @action(detail=False, methods=['post'], url_path='join-community')
    def toggle_join_community(self, request):
        developer_id = request.data.get('developer_id')
        community_id = request.data.get('community_id')

        dev = Developer.objects.filter(id=developer_id).first()
        comm = Community.objects.filter(id=community_id).first()

        if not dev or not comm:
            return Response({"error": "Développeur ou communauté introuvable."}, status=status.HTTP_404_NOT_FOUND)

        existing = CommunityMembership.objects.filter(developer=dev, community=comm).first()
        if existing:
            existing.delete()
            comm.members_count = max(0, comm.members_count - 1)
            comm.save(update_fields=['members_count'])
            return Response({"joined": False, "members_count": comm.members_count, "message": f"Vous avez quitté {comm.name}."})
        else:
            CommunityMembership.objects.create(developer=dev, community=comm)
            comm.members_count += 1
            comm.save(update_fields=['members_count'])
            return Response({"joined": True, "members_count": comm.members_count, "message": f"Bienvenue dans {comm.name} !"})

    @action(detail=False, methods=['post'], url_path='watch-project')
    def toggle_watch_project(self, request):
        developer_id = request.data.get('developer_id')
        project_id = request.data.get('project_id')

        dev = Developer.objects.filter(id=developer_id).first()
        proj = Project.objects.filter(id=project_id).first()

        if not dev or not proj:
            return Response({"error": "Développeur ou projet introuvable."}, status=status.HTTP_404_NOT_FOUND)

        existing = ProjectWatch.objects.filter(developer=dev, project=proj).first()
        if existing:
            existing.delete()
            proj.stars = max(0, proj.stars - 1)
            proj.save(update_fields=['stars'])
            return Response({"watching": False, "stars": proj.stars, "message": f"Projet {proj.title} retiré de vos favoris."})
        else:
            ProjectWatch.objects.create(developer=dev, project=proj)
            proj.stars += 1
            proj.save(update_fields=['stars'])
            return Response({"watching": True, "stars": proj.stars, "message": f"Vous suivez le projet {proj.title} !"})

    @action(detail=False, methods=['post'], url_path='block')
    def toggle_block(self, request):
        blocker_id = request.data.get('blocker_id')
        blocked_id = request.data.get('blocked_id')

        if blocker_id == blocked_id:
            return Response({"error": "Impossible de se bloquer soi-même."}, status=status.HTTP_400_BAD_REQUEST)

        blocker = Developer.objects.filter(id=blocker_id).first()
        blocked = Developer.objects.filter(id=blocked_id).first()

        if not blocker or not blocked:
            return Response({"error": "Profil introuvable."}, status=status.HTTP_404_NOT_FOUND)

        existing = UserBlock.objects.filter(blocker=blocker, blocked=blocked).first()
        if existing:
            existing.delete()
            return Response({"blocked": False, "message": f"Vous avez débloqué {blocked.name}."})
        else:
            UserBlock.objects.create(blocker=blocker, blocked=blocked)
            Follow.objects.filter(Q(follower=blocker, following=blocked) | Q(follower=blocked, following=blocker)).delete()
            return Response({"blocked": True, "message": f"Vous avez bloqué {blocked.name}."})

    @action(detail=False, methods=['post'], url_path='mute')
    def toggle_mute(self, request):
        muter_id = request.data.get('muter_id')
        muted_id = request.data.get('muted_id')

        if muter_id == muted_id:
            return Response({"error": "Impossible de se masquer soi-même."}, status=status.HTTP_400_BAD_REQUEST)

        muter = Developer.objects.filter(id=muter_id).first()
        muted = Developer.objects.filter(id=muted_id).first()

        if not muter or not muted:
            return Response({"error": "Profil introuvable."}, status=status.HTTP_404_NOT_FOUND)

        existing = UserMute.objects.filter(muter=muter, muted=muted).first()
        if existing:
            existing.delete()
            return Response({"muted": False, "message": f"Vous ne masquez plus {muted.name}."})
        else:
            UserMute.objects.create(muter=muter, muted=muted)
            return Response({"muted": True, "message": f"{muted.name} a été mis en sourdine."})

    @action(detail=False, methods=['get'], url_path='feed')
    def personalized_feed(self, request):
        """
        Fil d'actualité personnalisé 'Votre fil' :
        Agrège les publications des personnes suivies, les nouveaux projets,
        et les offres publiées par les entreprises suivies.
        """
        developer_id = request.query_params.get('developer_id')
        dev = None
        if developer_id:
            dev = Developer.objects.filter(id=developer_id).first()

        feed_items = []

        if dev:
            following_devs = list(Follow.objects.filter(follower=dev).values_list('following_id', flat=True))
            muted_devs = list(UserMute.objects.filter(muter=dev).values_list('muted_id', flat=True))
            blocked_devs = list(UserBlock.objects.filter(blocker=dev).values_list('blocked_id', flat=True))

            active_following = [did for did in following_devs if did not in muted_devs and did not in blocked_devs]
            followed_companies = list(CompanyFollow.objects.filter(follower=dev).values_list('company_id', flat=True))
            watched_projects = list(ProjectWatch.objects.filter(developer=dev).values_list('project_id', flat=True))

            # 1. Posts des développeurs suivis
            following_names = list(Developer.objects.filter(id__in=active_following).values_list('name', flat=True))
            posts_qs = Post.objects.filter(author_name__in=following_names)[:20]
            for p in posts_qs:
                feed_items.append({
                    "id": f"feed-post-{p.id}",
                    "item_type": "post",
                    "badge_text": f"{p.author_name} vient de publier",
                    "title": p.content[:90] + ("..." if len(p.content) > 90 else ""),
                    "content": p.content,
                    "code_snippet": p.code_snippet,
                    "author_name": p.author_name,
                    "author_avatar": p.author_avatar,
                    "author_country": p.author_country,
                    "likes": p.likes,
                    "comments_count": p.comments_count,
                    "created_at": p.created_at
                })

            # 2. Projets des développeurs suivis ou surveillés
            projects_qs = Project.objects.filter(Q(author_name__in=following_names) | Q(id__in=watched_projects))[:15]
            for pr in projects_qs:
                feed_items.append({
                    "id": f"feed-proj-{pr.id}",
                    "item_type": "project",
                    "badge_text": f"{pr.author_name} a ajouté un nouveau projet",
                    "title": pr.title,
                    "content": pr.tagline or pr.description[:120],
                    "author_name": pr.author_name,
                    "author_avatar": pr.author_avatar,
                    "author_country": pr.country,
                    "stars": pr.stars,
                    "upvotes": pr.upvotes,
                    "category": pr.category,
                    "technologies": pr.technologies,
                    "created_at": pr.created_at
                })

            # 3. Offres des entreprises suivies
            company_names = list(Company.objects.filter(id__in=followed_companies).values_list('name', flat=True))
            jobs_qs = Opportunity.objects.filter(company__in=company_names)[:10]
            for j in jobs_qs:
                feed_items.append({
                    "id": f"feed-job-{j.id}",
                    "item_type": "job",
                    "badge_text": f"{j.company} a publié une offre",
                    "title": j.title,
                    "content": f"{j.opp_type} · {j.location} · {j.salary}",
                    "author_name": j.company,
                    "author_avatar": "",
                    "author_country": j.location,
                    "tags": j.tags,
                    "created_at": j.created_at
                })

        if not feed_items:
            recent_posts = Post.objects.all()[:10]
            for p in recent_posts:
                feed_items.append({
                    "id": f"feed-post-{p.id}",
                    "item_type": "post",
                    "badge_text": f"{p.author_name} a partagé du code",
                    "title": p.content[:90] + ("..." if len(p.content) > 90 else ""),
                    "content": p.content,
                    "code_snippet": p.code_snippet,
                    "author_name": p.author_name,
                    "author_avatar": p.author_avatar,
                    "author_country": p.author_country,
                    "likes": p.likes,
                    "comments_count": p.comments_count,
                    "created_at": p.created_at
                })

        feed_items.sort(key=lambda x: str(x['created_at']), reverse=True)
        return Response({"count": len(feed_items), "feed": feed_items})


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        recipient_id = self.request.query_params.get('recipient_id')
        if recipient_id:
            qs = qs.filter(recipient_id=recipient_id)
        return qs

    @action(detail=False, methods=['post'], url_path='mark-read')
    def mark_read(self, request):
        recipient_id = request.data.get('recipient_id')
        notif_id = request.data.get('notification_id')

        if notif_id:
            Notification.objects.filter(id=notif_id).update(read=True)
        elif recipient_id:
            Notification.objects.filter(recipient_id=recipient_id).update(read=True)
        else:
            Notification.objects.all().update(read=True)

        return Response({"success": True})

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        recipient_id = request.query_params.get('recipient_id')
        qs = Notification.objects.filter(read=False)
        if recipient_id:
            qs = qs.filter(recipient_id=recipient_id)
        return Response({"unread_count": qs.count()})

