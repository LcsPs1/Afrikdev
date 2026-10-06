from django.core.management.base import BaseCommand
from api.models import (
    Developer,
    Project,
    Post,
    Question,
    Community,
    Opportunity,
    ModerationReport,
    Company,
    JobApplication
)

class Command(BaseCommand):
    help = 'Peuple la base de données AFRIKDEV avec les données réelles panafricaines'

    def handle(self, *args, **options):
        self.stdout.write("Initialisation des données AFRIKDEV...")

        # 1. Developers
        if not Developer.objects.exists():
            Developer.objects.create(
                name="Amina Diop",
                title="AI & Data Engineer",
                country="Sénégal",
                flag="🇸🇳",
                city="Dakar",
                avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
                bio="Spécialiste NLP appliquée aux langues locales (Wolof, Baoulé, Swahili). Active dans la communauté AI Sénégal.",
                skills=["Python", "PyTorch", "FastAPI", "Docker", "PostgreSQL", "LangChain"],
                available=True,
                projects_count=4,
                reputation=2150,
                github="aminadiop",
                badges=["AI Pioneer", "Speaker Tech"]
            )
            Developer.objects.create(
                name="Koffi Mensah",
                title="Senior Backend & Cloud Architect",
                country="Côte d'Ivoire",
                flag="🇨🇮",
                city="Yamoussoukro",
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
                bio="Conception d'APIs résilientes à fort trafic et passerelles de paiement USSD/Mobile Money.",
                skills=["Django", "Python", "PostgreSQL", "Redis", "Docker", "Kubernetes", "React"],
                available=True,
                projects_count=7,
                reputation=3400,
                github="kmensah",
                badges=["FinTech Builder", "Contributeur Émérite"]
            )
            Developer.objects.create(
                name="Chukwudi Okafor",
                title="Mobile Flutter & Go Engineer",
                country="Nigeria",
                flag="🇳🇬",
                city="Lagos",
                avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
                bio="Building offline-first mobile apps for low-bandwidth environments. Flutter Africa lead.",
                skills=["Flutter", "Dart", "Go", "Firebase", "SQLite", "GraphQL"],
                available=False,
                projects_count=8,
                reputation=4120,
                github="chuks-dev",
                badges=["Mobile Wizard", "Open Source Lead"]
            )
            self.stdout.write(self.style.SUCCESS("[OK] Developpeurs crees"))

        # 2. Projects
        if not Project.objects.exists():
            Project.objects.create(
                title="AfriTransport",
                tagline="Plateforme temps reel de cartographie des transports urbains (Gbaka, Woro-woro, SOTRA)",
                category="Mobility",
                country="Côte d'Ivoire",
                flag="CI",
                status="En production",
                author_name="Jean Kouassi & Team",
                author_avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
                technologies=["React", "Django", "PostgreSQL", "PostGIS", "Docker", "MapLibre"],
                stars=142,
                upvotes=89,
                github_url="https://github.com/afrikdev/afritransport",
                demo_url="https://afritransport.africa",
                open_roles=["Developpeur Flutter (Mobile)", "Data Analyst GPS"],
                description="Solution collaborative permettant aux usagers et regulateurs de visualiser les trajets et affluences sur les lignes de transport d'Abidjan."
            )
            Project.objects.create(
                title="KoloPay Gateway",
                tagline="API unifiee de paiement mobile money panafricaine (Orange, MTN, Wave, Moov)",
                category="FinTech",
                country="Senegal",
                flag="SN",
                status="En developpement",
                author_name="Koffi Mensah",
                author_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
                technologies=["Go", "FastAPI", "Redis", "PostgreSQL", "Docker"],
                stars=215,
                upvotes=164,
                github_url="https://github.com/afrikdev/kolopay",
                demo_url="https://sandbox.kolopay.tech",
                open_roles=["Ingenieur Securite Cryptographique"],
                description="SDK open-source et passerelle unique pour permettre aux developpeurs d'encaisser les paiements multi-operateurs."
            )
            self.stdout.write(self.style.SUCCESS("[OK] Projets crees"))

        # 3. Communities
        if not Community.objects.exists():
            Community.objects.create(
                name="Python & Django Cote d'Ivoire",
                slug="python-ci",
                flag="CI",
                members_count=840,
                posts_this_week=42,
                description="Communaute des developpeurs Python, Django et data scientists de Cote d'Ivoire.",
                tags=["Python", "Django", "FastAPI", "Abidjan"]
            )
            Community.objects.create(
                name="React & Next.js Africa",
                slug="react-africa",
                flag="AF",
                members_count=1620,
                posts_this_week=95,
                description="Le hub des passionnes de frontend moderne et ecosysteme React.",
                tags=["React", "Next.js", "TypeScript", "UI/UX"]
            )
        # 4. Company & Recruiter
        company, _ = Company.objects.get_or_create(
            name="Baobab Tech Labs",
            defaults={
                "tagline": "Le studio d'ingénierie logicielle d'Abidjan & Dakar",
                "flag": "🇨🇮",
                "headquarters": "Abidjan, Côte d'Ivoire (Plateau)",
                "verified": True,
                "website": "https://baobabtechlabs.africa",
                "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80",
                "description": "Nous concevons des produits technologiques à fort impact pour la banque, l'agriculture et les télécoms en Afrique de l'Ouest.",
                "open_jobs": 3,
                "total_applicants": 48,
                "interviews_scheduled": 7
            }
        )

        from django.contrib.auth import get_user_model
        from api.models import RecruiterProfile, OpportunityApplication
        from django.utils import timezone
        import datetime

        User = get_user_model()
        recruiter_user, created_user = User.objects.get_or_create(
            username="recruteur@afrikdev.com",
            defaults={"email": "recruteur@afrikdev.com", "first_name": "Sarah", "last_name": "Kone"}
        )
        if created_user:
            recruiter_user.set_password("Recrute#2026!")
            recruiter_user.save()

        RecruiterProfile.objects.get_or_create(
            user=recruiter_user,
            defaults={"company": company}
        )

        # 5. Opportunities
        if not Opportunity.objects.exists():
            opp1 = Opportunity.objects.create(
                title="Senior Full-Stack Engineer (React / Django)",
                company="Baobab Tech Labs",
                location="Abidjan, Côte d'Ivoire / Télétravail possible",
                opp_type="CDI",
                salary="1 800 000 - 2 500 000 FCFA / mois",
                flag="🇨🇮",
                tags=["React", "Django", "PostgreSQL", "Docker"],
                posted_time="Il y a 1 jour",
                is_featured=True,
                description="Rejoignez l'équipe produit pour concevoir des plateformes SaaS à fort trafic pour le marché ouest-africain. Vous serez responsable de l'architecture, de la revue de code et de l'accompagnement des développeurs juniors.",
                deadline=datetime.date(2026, 11, 15),
                owner_company=company
            )

            opp2 = Opportunity.objects.create(
                title="Lead Mobile Developer (Flutter)",
                company="Wave Mobile Money",
                location="Dakar, Sénégal / Remote",
                opp_type="CDI",
                salary="Très attractif + stock-options",
                flag="🇸🇳",
                tags=["Flutter", "Dart", "Go", "Offline-First"],
                posted_time="Il y a 3 jours",
                is_featured=True,
                description="Pilotez l'application mobile utilisée par des millions d'utilisateurs : performances, mode hors-ligne et expérience sur réseaux instables.",
                deadline=datetime.date(2026, 11, 30)
            )

            opp3 = Opportunity.objects.create(
                title="African AI Challenge 2026",
                company="AfrikDev x Union Africaine Tech",
                location="Panafricain — En ligne & Finale à Kigali",
                opp_type="🏆 Hackathon",
                salary="$35,000 en prix & financement startup",
                flag="🌍",
                tags=["Intelligence Artificielle", "AgriTech", "FinTech", "Climate"],
                posted_time="Inscriptions ouvertes",
                is_featured=True,
                description="Le plus grand défi IA du continent : 48h pour concevoir une solution à fort impact. Les meilleures équipes rejoignent la finale à Kigali et accèdent à un financement de démarrage.",
                deadline=datetime.date(2026, 12, 10),
                tracks=["Intelligence Artificielle", "AgriTech", "FinTech", "Climate"],
                max_team_size=5
            )

            opp4 = Opportunity.objects.create(
                title="Mission Freelance : Audit de sécurité Smart Contracts",
                company="Sahara Web3 Protocol",
                location="100% Remote",
                opp_type="Freelance",
                salary="4 000 $ / mission",
                flag="🌍",
                tags=["Solidity", "Security", "Audit", "Rust"],
                posted_time="Il y a 5 jours",
                is_featured=False,
                description="Audit de sécurité d'un protocole DeFi avant son lancement : revue des smart contracts, rapport de vulnérabilités et recommandations.",
                deadline=datetime.date(2026, 11, 5)
            )

            # Sample applications for Baobab Tech Labs ATS
            app1 = OpportunityApplication(
                opportunity=opp1,
                full_name="Koffi Mensah",
                email="koffi.mensah@afrikdev.com",
                phone="+225 07 11 22 33 44",
                country="Côte d'Ivoire",
                github="https://github.com/kmensah",
                linkedin="https://linkedin.com/in/koffimensah",
                motivation="Expert Django et microservices avec 6 ans d'expérience dans les passerelles de paiement USSD.",
                details={"portfolio": "https://koffimensah.dev", "availability": "Immédiate"},
                stage="Entretien technique",
                terms_accepted_at=timezone.now()
            )
            app1.issue_token()
            app1.save()

            app2 = OpportunityApplication(
                opportunity=opp1,
                full_name="Fatima Zahra El Alami",
                email="fatima.alami@afrikdev.com",
                phone="+212 6 00 11 22 33",
                country="Maroc",
                github="https://github.com/fz-alami",
                linkedin="https://linkedin.com/in/fatimazahradev",
                motivation="Architecte Frontend React et Next.js spécialisée en interfaces à haute performance et accessibilité.",
                details={"portfolio": "https://fatima-dev.ma", "availability": "Sous 2 semaines"},
                stage="En revue",
                terms_accepted_at=timezone.now()
            )
            app2.issue_token()
            app2.save()

            self.stdout.write(self.style.SUCCESS("[OK] Entreprise, Recruteur et Opportunites crees"))

        self.stdout.write(self.style.SUCCESS("[OK] Base de donnees AFRIKDEV peuplee avec succes !"))
