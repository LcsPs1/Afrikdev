import hashlib
import hmac
import secrets

from django.conf import settings
from django.db import models
from django.utils import timezone

class Developer(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='developer_profile'
    )
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    title = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    flag = models.CharField(max_length=10, default="🌍")
    city = models.CharField(max_length=100)
    avatar = models.URLField(max_length=500)
    bio = models.TextField()
    skills = models.JSONField(default=list, help_text="Liste des compétences (ex: ['React', 'Django'])")
    available = models.BooleanField(default=True)
    projects_count = models.IntegerField(default=0)
    reputation = models.IntegerField(default=100)
    github = models.CharField(max_length=100, blank=True)
    badges = models.JSONField(default=list, blank=True)
    followers_count = models.IntegerField(default=245)
    following_count = models.IntegerField(default=182)
    last_seen = models.DateTimeField(null=True, blank=True, default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    show_online_status = models.BooleanField(default=True, help_text="Afficher mon statut 'En ligne'")
    show_last_seen = models.BooleanField(default=True, help_text="Afficher ma dernière activité")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-reputation']

    def __str__(self):
        return f"{self.name} ({self.country})"

    @property
    def is_online(self):
        """Détermine si l'utilisateur est en ligne (< 2 minutes d'inactivité) et s'il autorise l'affichage."""
        if not self.show_online_status:
            return False
        if not self.last_seen:
            return False
        diff_sec = (timezone.now() - self.last_seen).total_seconds()
        return diff_sec < 120

    @property
    def activity_status(self):
        """
        Calcule le statut textuel d'activité pour l'affichage :
        - 🟢 En ligne (< 2 min)
        - ⚪ Actif il y a X min (2-60 min)
        - ⚪ Hors ligne — il y a X h (1-24 h)
        - ⚪ Hors ligne — hier (24-48 h)
        - ⚪ Hors ligne — JJ/MM (> 48 h)
        """
        if not self.show_online_status and not self.show_last_seen:
            return None

        if self.show_online_status and self.is_online:
            return {
                "status": "online",
                "label": "En ligne",
                "dot": "green"
            }

        if not self.show_last_seen or not self.last_seen:
            return {
                "status": "offline",
                "label": "Hors ligne",
                "dot": "gray"
            }

        diff_sec = (timezone.now() - self.last_seen).total_seconds()
        minutes = int(diff_sec // 60)
        hours = int(diff_sec // 3600)

        if minutes < 60:
            label = f"Actif il y a {max(1, minutes)} min"
        elif hours < 24:
            label = f"Hors ligne — il y a {hours} h"
        elif hours < 48:
            label = "Hors ligne — hier"
        else:
            label = f"Hors ligne — {self.last_seen.strftime('%d %b')}"

        return {
            "status": "recent" if minutes < 10 else "offline",
            "label": label,
            "dot": "gray"
        }


class SocialAccount(models.Model):
    PROVIDER_CHOICES = [
        ('google', 'Google'),
        ('github', 'GitHub'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='social_accounts'
    )
    provider = models.CharField(max_length=30, choices=PROVIDER_CHOICES)
    uid = models.CharField(max_length=255)
    extra_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('provider', 'uid')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} ({self.provider}:{self.uid})"


class Project(models.Model):
    STATUS_CHOICES = [
        ('PROD', '🚀 En production'),
        ('DEV', '🔨 En développement'),
        ('IDEA', '💡 Idée'),
    ]

    title = models.CharField(max_length=200)
    tagline = models.CharField(max_length=300)
    category = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    flag = models.CharField(max_length=10, default="🌍")
    status = models.CharField(max_length=50, default="🚀 En production")
    author_name = models.CharField(max_length=150)
    author_avatar = models.URLField(max_length=500, blank=True)
    technologies = models.JSONField(default=list)
    stars = models.IntegerField(default=0)
    upvotes = models.IntegerField(default=0)
    github_url = models.URLField(blank=True)
    demo_url = models.URLField(blank=True)
    open_roles = models.JSONField(default=list, blank=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-upvotes', '-stars']

    def __str__(self):
        return self.title


class Post(models.Model):
    author_name = models.CharField(max_length=150)
    author_country = models.CharField(max_length=100)
    author_flag = models.CharField(max_length=10, default="🌍")
    author_avatar = models.URLField(max_length=500)
    author_handle = models.CharField(max_length=100)
    content = models.TextField()
    code_snippet = models.TextField(blank=True, null=True)
    likes = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    tags = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Post par {self.author_name} ({self.created_at.strftime('%Y-%m-%d')})"


class Question(models.Model):
    title = models.CharField(max_length=300)
    author_name = models.CharField(max_length=150)
    country = models.CharField(max_length=100)
    flag = models.CharField(max_length=10, default="🌍")
    votes = models.IntegerField(default=0)
    answers_count = models.IntegerField(default=0)
    resolved = models.BooleanField(default=False)
    tags = models.JSONField(default=list)
    excerpt = models.TextField()
    best_answer_text = models.TextField(blank=True, null=True)
    best_answer_author = models.CharField(max_length=150, blank=True, null=True)
    best_answer_votes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-votes', '-created_at']

    def __str__(self):
        return self.title


class Community(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    flag = models.CharField(max_length=10, default="🌍")
    members_count = models.IntegerField(default=1)
    posts_this_week = models.IntegerField(default=0)
    description = models.TextField()
    tags = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Communities'
        ordering = ['-members_count']

    def __str__(self):
        return self.name


class Opportunity(models.Model):
    title = models.CharField(max_length=250)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    opp_type = models.CharField(max_length=100)
    salary = models.CharField(max_length=150)
    flag = models.CharField(max_length=10, default="🌍")
    tags = models.JSONField(default=list)
    posted_time = models.CharField(max_length=100, default="Récemment")
    is_featured = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    deadline = models.DateField(null=True, blank=True, help_text="Date limite de candidature / d'inscription")
    tracks = models.JSONField(default=list, blank=True, help_text="Thématiques proposées (hackathons)")
    max_team_size = models.PositiveSmallIntegerField(null=True, blank=True)
    owner_company = models.ForeignKey(
        'Company',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='opportunities',
        help_text="Entreprise propriétaire : seuls ses recruteurs voient les candidatures reçues",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']

    def __str__(self):
        return f"{self.title} chez {self.company}"

    @property
    def is_hackathon(self):
        return 'hackathon' in self.opp_type.lower()

    @property
    def is_freelance(self):
        return 'freelance' in self.opp_type.lower()


class ModerationReport(models.Model):
    target_type = models.CharField(max_length=100)
    target_summary = models.TextField()
    reason = models.CharField(max_length=250)
    reported_by = models.CharField(max_length=150)
    reported_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="EN_ATTENTE") # EN_ATTENTE | RESOLU | REJETE
    risk_level = models.CharField(max_length=50, default="MOYEN") # CRITIQUE | MOYEN | FAIBLE
    author = models.CharField(max_length=150)

    class Meta:
        ordering = ['-reported_at']

    def __str__(self):
        return f"Signalement {self.id}: {self.reason}"


class Company(models.Model):
    name = models.CharField(max_length=200)
    tagline = models.CharField(max_length=300)
    flag = models.CharField(max_length=10, default="🌍")
    headquarters = models.CharField(max_length=200)
    verified = models.BooleanField(default=True)
    website = models.URLField(blank=True)
    logo = models.URLField(max_length=500, blank=True)
    description = models.TextField()
    open_jobs = models.IntegerField(default=1)
    total_applicants = models.IntegerField(default=0)
    interviews_scheduled = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class JobApplication(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='applications')
    candidate_name = models.CharField(max_length=150)
    role_applied = models.CharField(max_length=200)
    stage = models.CharField(max_length=100, default="Reçue")
    country = models.CharField(max_length=100)
    flag = models.CharField(max_length=10, default="🌍")
    skills = models.JSONField(default=list)
    rating = models.FloatField(default=5.0)
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate_name} -> {self.role_applied}"


def application_cv_path(instance, filename):
    # Nom généré côté serveur : le nom de fichier envoyé par l'utilisateur n'est jamais utilisé
    return f"cvs/{instance.reference}.pdf"


class RecruiterProfile(models.Model):
    """Lie un compte utilisateur Django à une entreprise : c'est ce qui fait de lui un recruteur."""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recruiter_profile')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='recruiters')

    def __str__(self):
        return f"{self.user.get_username()} ({self.company.name})"


class OpportunityApplication(models.Model):
    """Candidature (CDI / freelance) ou inscription (hackathon) déposée depuis le site."""

    STAGE_RECEIVED = "Reçue"
    STAGE_REVIEW = "En revue"
    STAGE_INTERVIEW = "Entretien technique"
    STAGE_OFFER = "Offre formulée"
    STAGE_CHOICES = [
        (STAGE_RECEIVED, STAGE_RECEIVED),
        (STAGE_REVIEW, STAGE_REVIEW),
        (STAGE_INTERVIEW, STAGE_INTERVIEW),
        (STAGE_OFFER, STAGE_OFFER),
    ]

    reference = models.CharField(max_length=40, unique=True, editable=False)
    opportunity = models.ForeignKey(Opportunity, on_delete=models.CASCADE, related_name='applications')

    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    country = models.CharField(max_length=100)
    github = models.URLField(max_length=300, blank=True)
    linkedin = models.URLField(max_length=300, blank=True)
    motivation = models.TextField()
    # Champs spécifiques (portfolio, disponibilité, équipe, thématique...) validés par le serializer
    details = models.JSONField(default=dict, blank=True)
    cv = models.FileField(upload_to=application_cv_path, blank=True)

    stage = models.CharField(max_length=100, choices=STAGE_CHOICES, default=STAGE_RECEIVED)
    terms_accepted_at = models.DateTimeField()
    # Seul le hash du jeton secret est conservé (le candidat garde le jeton pour retirer sa candidature)
    edit_token_hash = models.CharField(max_length=64, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['opportunity', 'email'], name='uniq_application_per_opportunity_email'),
        ]

    def __str__(self):
        return f"{self.reference} — {self.full_name} -> {self.opportunity.title}"

    def save(self, *args, **kwargs):
        if not self.reference:
            while True:
                candidate = f"AFK-{secrets.token_hex(4).upper()}"
                if not OpportunityApplication.objects.filter(reference=candidate).exists():
                    self.reference = candidate
                    break
        super().save(*args, **kwargs)

    @staticmethod
    def _hash_token(token):
        return hashlib.sha256(token.encode('utf-8')).hexdigest()

    def issue_token(self):
        """Génère un jeton secret, en stocke le hash et retourne le jeton en clair (à ne montrer qu'une fois)."""
        token = secrets.token_urlsafe(24)
        self.edit_token_hash = self._hash_token(token)
        return token

    def check_token(self, token):
        return hmac.compare_digest(self.edit_token_hash, self._hash_token(token or ''))


class Follow(models.Model):
    """
    Système de relations Followers / Following entre développeurs.
    Empêche le self-follow et les doublons grâce à des contraintes DB et validation.
    """
    follower = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='following_relations')
    following = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='follower_relations')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['follower', 'following'], name='uniq_follow_relation'),
            models.CheckConstraint(check=~models.Q(follower=models.F('following')), name='prevent_self_follow'),
        ]

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.follower_id == self.following_id:
            raise ValidationError("Un développeur ne peut pas se suivre lui-même.")

    def __str__(self):
        return f"{self.follower.name} suit {self.following.name}"


class CompanyFollow(models.Model):
    """Abonnement d'un développeur aux offres et actualités d'une entreprise."""
    follower = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='company_follows')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['follower', 'company'], name='uniq_company_follow'),
        ]

    def __str__(self):
        return f"{self.follower.name} suit l'entreprise {self.company.name}"


class CommunityMembership(models.Model):
    """Adhésion d'un développeur à une communauté tech africaine."""
    ROLE_CHOICES = [
        ('MEMBER', 'Membre'),
        ('MODERATOR', 'Modérateur'),
        ('LEAD', 'Lead Communauté'),
    ]
    developer = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='community_memberships')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='MEMBER')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-joined_at']
        constraints = [
            models.UniqueConstraint(fields=['developer', 'community'], name='uniq_community_membership'),
        ]

    def __str__(self):
        return f"{self.developer.name} dans {self.community.name} ({self.role})"


class ProjectWatch(models.Model):
    """Suivi (Watch / Star) d'un projet open-source ou produit Made in Africa."""
    developer = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='watched_projects')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='watchers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['developer', 'project'], name='uniq_project_watch'),
        ]

    def __str__(self):
        return f"{self.developer.name} suit le projet {self.project.title}"


class UserBlock(models.Model):
    """Blocage d'un profil pour la sécurité et la modération personnelle."""
    blocker = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='blocked_relations')
    blocked = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='blocked_by_relations')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['blocker', 'blocked'], name='uniq_user_block'),
            models.CheckConstraint(check=~models.Q(blocker=models.F('blocked')), name='prevent_self_block'),
        ]

    def __str__(self):
        return f"{self.blocker.name} a bloqué {self.blocked.name}"


class UserMute(models.Model):
    """Mise en sourdine d'un profil pour ne plus voir ses activités sans le bloquer."""
    muter = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='muted_relations')
    muted = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='muted_by_relations')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['muter', 'muted'], name='uniq_user_mute'),
            models.CheckConstraint(check=~models.Q(muter=models.F('muted')), name='prevent_self_mute'),
        ]

    def __str__(self):
        return f"{self.muter.name} a masqué {self.muted.name}"


class Notification(models.Model):
    """
    Système de notifications unifié pour AFRIKDEV :
    - Abonnements (Follow)
    - Publications de personnes suivies
    - Nouveaux projets
    - Interactions (likes, commentaires)
    - Alertes emploi des entreprises suivies
    """
    NOTIF_TYPE_CHOICES = [
        ('follow', 'Abonnement'),
        ('post', 'Nouvelle publication'),
        ('project', 'Nouveau projet'),
        ('like', 'Mention j\'aime'),
        ('comment', 'Commentaire'),
        ('job', 'Offre d\'emploi'),
    ]

    recipient = models.ForeignKey(Developer, on_delete=models.CASCADE, related_name='notifications')
    actor = models.ForeignKey(Developer, on_delete=models.SET_NULL, null=True, blank=True, related_name='triggered_notifications')
    actor_name = models.CharField(max_length=150)
    actor_avatar = models.URLField(max_length=500, blank=True)
    notif_type = models.CharField(max_length=50, choices=NOTIF_TYPE_CHOICES, default='follow')
    title = models.CharField(max_length=250)
    message = models.TextField()
    target_id = models.CharField(max_length=100, blank=True)
    target_type = models.CharField(max_length=50, blank=True) # developer, post, project, opportunity
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notif pour {self.recipient.name} : {self.title}"

