// Données réalistes et enrichies pour le prototype AFRIKDEV
export const INITIAL_USER = {
  id: "usr-me",
  name: "Jean Kouassi",
  title: "Lead Full-Stack Developer",
  country: "Côte d'Ivoire",
  flag: "🇨🇮",
  city: "Abidjan",
  avatar: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=250&q=80",
  bio: "Passionné d'architectures distribuées, de Django et React. Bâtisseur de solutions numériques adaptées aux enjeux africains.",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  facebook: "https://facebook.com",
  skills: [
    { name: "React", level: "Expert" },
    { name: "Django", level: "Avancé" },
    { name: "PostgreSQL", level: "Avancé" },
    { name: "Docker", level: "Intermédiaire" },
    { name: "TypeScript", level: "Avancé" },
    { name: "Python", level: "Expert" }
  ],
  stats: {
    posts: 24,
    projects: 6,
    followers: 245,
    following: 182,
    collaborations: 5,
    reputation: 1420
  },
  followers_count: 245,
  following_count: 182,
  last_login: "2026-10-04T13:42:00Z",
  last_seen: new Date().toISOString(),
  show_online_status: true,
  show_last_seen: true,
  badges: [
    { id: "b1", title: "Pionnier AfrikDev", icon: "🌍", color: "#06B6D4" },
    { id: "b2", title: "Python Architect", icon: "🐍", color: "#10B981" },
    { id: "b3", title: "Top Mentor", icon: "🤝", color: "#F59E0B" }
  ]
};

export const DEVELOPERS_DATA = [
  {
    id: "dev-1",
    name: "Amina Diop",
    title: "AI & Data Engineer",
    country: "Sénégal",
    flag: "🇸🇳",
    city: "Dakar",
    avatar: "/avatars/amina-diop.jpg",
    bio: "Spécialiste NLP appliquée aux langues locales (Wolof, Baoulé, Swahili). Active dans la communauté AI Sénégal.",
    skills: ["Python", "PyTorch", "FastAPI", "Docker", "PostgreSQL", "LangChain"],
    available: true,
    projectsCount: 4,
    reputation: 2150,
    github: "aminadiop",
    followers_count: 312,
    following_count: 145,
    last_login: "2026-10-04T11:15:00Z",
    last_seen: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // Hors ligne — il y a 2 h
    show_online_status: true,
    show_last_seen: true,
    badges: ["AI Pioneer", "Speaker Tech"]
  },
  {
    id: "dev-2",
    name: "Koffi Mensah",
    title: "Senior Backend & Cloud Architect",
    country: "Côte d'Ivoire",
    flag: "🇨🇮",
    city: "Yamoussoukro",
    avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=250&q=80",
    bio: "Conception d'APIs résilientes à fort trafic. Passionné par l'inclusion financière et les passerelles de paiement USSD/Mobile Money.",
    skills: ["Django", "Python", "PostgreSQL", "Redis", "Docker", "Kubernetes", "React"],
    available: true,
    projectsCount: 7,
    reputation: 3400,
    github: "kmensah",
    followers_count: 420,
    following_count: 198,
    last_login: "2026-10-04T15:05:00Z",
    last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // Actif il y a 5 min
    show_online_status: true,
    show_last_seen: true,
    badges: ["FinTech Builder", "Contributeur Émérite"]
  },
  {
    id: "dev-3",
    name: "Chukwudi Okafor",
    title: "Mobile Flutter & Go Engineer",
    country: "Nigeria",
    flag: "🇳🇬",
    city: "Lagos",
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=250&q=80",
    bio: "Building offline-first mobile apps for low-bandwidth environments. Flutter Africa community co-lead.",
    skills: ["Flutter", "Dart", "Go", "Firebase", "SQLite", "GraphQL"],
    available: false,
    projectsCount: 8,
    reputation: 4120,
    github: "chuks-dev",
    followers_count: 510,
    following_count: 220,
    last_login: "2026-10-04T15:11:00Z",
    last_seen: new Date(Date.now() - 30 * 1000).toISOString(), // En ligne (< 2 min)
    show_online_status: true,
    show_last_seen: true,
    badges: ["Mobile Wizard", "Open Source Lead"]
  },
  {
    id: "dev-4",
    name: "Fatima Zahra El Alami",
    title: "Frontend Lead & UI/UX Specialist",
    country: "Maroc",
    flag: "🇲🇦",
    city: "Casablanca",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
    bio: "Créatrice d'interfaces ultra-performantes, accessibles et fluides. Formatrice React et Next.js.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Figma", "Redux"],
    available: true,
    projectsCount: 5,
    reputation: 1890,
    github: "fatima-frontend",
    followers_count: 195,
    following_count: 110,
    last_login: "2026-10-03T18:20:00Z",
    last_seen: new Date(Date.now() - 25 * 3600 * 1000).toISOString(), // Hors ligne — hier
    show_online_status: true,
    show_last_seen: true,
    badges: ["Design System Hero"]
  },
  {
    id: "dev-5",
    name: "Samuel Nkurunziza",
    title: "Full-Stack & DevOps Engineer",
    country: "Rwanda",
    flag: "🇷🇼",
    city: "Kigali",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=250&q=80",
    bio: "Poussé par l'innovation GovTech & Smart City Kigali. Passionné d'automatisation CI/CD et micro-services.",
    skills: ["React", "Django", "Node.js", "Docker", "AWS", "Terraform", "PostgreSQL"],
    available: true,
    projectsCount: 6,
    reputation: 2780,
    github: "sam-kigali",
    followers_count: 168,
    following_count: 94,
    last_login: "2026-10-02T09:30:00Z",
    last_seen: new Date(Date.now() - 52 * 3600 * 1000).toISOString(), // Hors ligne — 02 oct.
    show_online_status: true,
    show_last_seen: true,
    badges: ["DevOps Master"]
  },
  {
    id: "dev-6",
    name: "Aïssatou Ndiaye",
    title: "Cybersecurity & Blockchain Dev",
    country: "Sénégal",
    flag: "🇸🇳",
    city: "Dakar",
    avatar: "/avatars/aissatou-ndiaye.jpg",
    bio: "Audit de sécurité applicative, smart contracts Solidity et protection de données biométriques en Afrique de l'Ouest.",
    skills: ["Solidity", "Rust", "Python", "Linux", "PenTesting", "Web3.js"],
    available: true,
    projectsCount: 3,
    reputation: 1650,
    github: "aissatou-sec",
    followers_count: 285,
    following_count: 130,
    last_login: "2026-10-04T14:40:00Z",
    last_seen: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // Actif il y a 8 min
    show_online_status: true,
    show_last_seen: true,
    badges: ["Security Guardian"]
  }
];

export const PROJECTS_DATA = [
  {
    id: "proj-1",
    title: "AfriTransport",
    tagline: "Plateforme temps réel de cartographie et de suivi des transports urbains (Gbaka, Woro-woro, SOTRA)",
    category: "Mobility",
    country: "Côte d'Ivoire",
    flag: "🇨🇮",
    status: "🚀 En production",
    company: "Baobab Tech Labs",
    companyEmail: "contact@baobabtechlabs.ci",
    author: {
      name: "Jean Kouassi & Team",
      avatar: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=250&q=80"
    },
    technologies: ["React", "Django", "PostgreSQL", "PostGIS", "Docker", "MapLibre"],
    stars: 142,
    upvotes: 89,
    githubUrl: "https://github.com/afrikdev/afritransport",
    demoUrl: "https://afritransport.africa",
    openRoles: ["Développeur Flutter (Mobile)", "Data Analyst GPS"],
    description: "Solution collaborative permettant aux usagers et régulateurs de visualiser les trajets, retards et affluences sur les lignes de transport informelles et formelles d'Abidjan."
  },
  {
    id: "proj-2",
    title: "KoloPay Gateway",
    tagline: "API unifiée de paiement mobile money panafricaine (Orange, MTN, Wave, Moov, M-Pesa)",
    category: "FinTech",
    country: "Sénégal",
    flag: "🇸🇳",
    status: "🔨 En développement",
    company: "KoloPay Technologies",
    companyEmail: "partners@kolopay.tech",
    author: {
      name: "Koffi Mensah",
      avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=250&q=80"
    },
    technologies: ["Go", "FastAPI", "Redis", "PostgreSQL", "Docker", "Stripe API"],
    stars: 215,
    upvotes: 164,
    githubUrl: "https://github.com/afrikdev/kolopay",
    demoUrl: "https://sandbox.kolopay.tech",
    openRoles: ["Ingénieur Sécurité Cryptographique"],
    description: "SDK open-source et passerelle unique pour permettre aux développeurs d'encaisser les paiements multi-opérateurs avec 3 lignes de code sans friction bancaire."
  },
  {
    id: "proj-3",
    title: "AgriVoice AI",
    tagline: "Assistant vocal d'aide agricole en langues locales (Wolof, Baoulé, Haoussa, Swahili)",
    category: "AgriTech / IA",
    country: "Nigeria",
    flag: "🇳🇬",
    status: "🚀 En production",
    company: "AgriVoice AI Labs",
    companyEmail: "contact@agrivoice.ai",
    author: {
      name: "Amina Diop & Chukwudi",
      avatar: "/avatars/amina-diop.jpg"
    },
    technologies: ["Python", "PyTorch", "Whisper", "Flutter", "FastAPI"],
    stars: 310,
    upvotes: 240,
    githubUrl: "https://github.com/afrikdev/agrivoice",
    demoUrl: "https://agrivoice.ai",
    openRoles: ["Traducteur linguistique tech", "Développeur Audio Signal"],
    description: "Permet aux producteurs agricoles ruraux de poser vocalement des questions sur les maladies des cultures et la météo, et d'obtenir des conseils fiables dans leur langue maternelle."
  },
  {
    id: "proj-4",
    title: "AfriSante Connect",
    tagline: "Dossier médical d'urgence hors-ligne synchronisé par QR code sécurisé",
    category: "HealthTech",
    country: "Rwanda",
    flag: "🇷🇼",
    status: "💡 Idée",
    company: "AfriSanté Solutions",
    companyEmail: "partenariats@afrisante.rw",
    author: {
      name: "Samuel Nkurunziza",
      avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=250&q=80"
    },
    technologies: ["React Native", "Node.js", "SQLite", "End-to-End Encryption"],
    stars: 88,
    upvotes: 62,
    githubUrl: "https://github.com/afrikdev/afrisante",
    demoUrl: "",
    openRoles: ["UI/UX Designer Médical", "Développeur Mobile React Native"],
    description: "Système résilient fonctionnant sans connexion internet pour les centres de santé isolés afin de prévenir les erreurs de prescription."
  }
];

export const POSTS_DATA = [
  {
    id: "post-1",
    author: {
      name: "Koffi Mensah",
      country: "Côte d'Ivoire",
      flag: "🇨🇮",
      avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=250&q=80",
      handle: "@kmensah"
    },
    time: "Il y a 25 min",
    content: `🚀 Retour d'expérience : Comment nous avons optimisé nos requêtes PostgreSQL sous Django pour encaisser 15 000 transactions Mobile Money simultanées sans faire sauter le serveur !

💡 3 règles d'or appliquées :
1. \`select_related\` & \`prefetch_related\` obligatoires sur toutes les clés étrangères.
2. Indexation partielle \`db_index=True\` sur les statuts de paiement en attente.
3. Déchargement des webhooks vers Celery + Redis pour ne jamais bloquer la boucle HTTP principale.

Partagez vos stacks de paiement ! #Django #PostgreSQL #AfricaTech #DevTips`,
    codeSnippet: `// Django ORM Optimization
const payments = Payment.objects.select_related('wallet', 'merchant')
  .filter(status='PENDING', created_at__gte=cutoff)
  .only('id', 'reference', 'amount', 'wallet__phone');`,
    likes: 42,
    commentsCount: 9,
    shares: 14,
    tags: ["Django", "PostgreSQL", "AfricaTech", "Performance"],
    likedByUser: false,
    comments: [
      {
        id: "c1",
        author: "Jean Kouassi",
        time: "Il y a 10 min",
        avatar: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=250&q=80",
        text: "Excellente analyse Koffi ! As-tu aussi mis en place du PgBouncer pour le connection pooling ?"
      },
      {
        id: "c2",
        author: "Koffi Mensah",
        time: "Il y a 4 min",
        avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=250&q=80",
        text: "Absolument @Jean, PgBouncer en mode transaction a divisé la RAM consommée par 3 !"
      }
    ]
  },
  {
    id: "post-2",
    author: {
      name: "Amina Diop",
      country: "Sénégal",
      flag: "🇸🇳",
      avatar: "/avatars/amina-diop.jpg",
      handle: "@aminadiop"
    },
    time: "Il y a 2h",
    content: `🤝 RECHERCHE COLLABORATEURS : Projet AgriVoice AI !
Nous cherchons 2 développeurs pour nous aider sur la version 2.0 :
- 1 Dev Mobile Flutter pour l'interface hors-ligne
- 1 Dev Python / FastAPI pour le pipeline de transcription vocale.

Le projet est 100% open-source et soutenu par des coopératives agricoles régionales.
Écrivez-moi directement en MP ou répondez ici ! 🌍⚡`,
    likes: 67,
    commentsCount: 16,
    shares: 28,
    tags: ["OpenSource", "Flutter", "Python", "AgriTech"],
    likedByUser: true,
    comments: []
  },
  {
    id: "post-3",
    author: {
      name: "Chukwudi Okafor",
      country: "Nigeria",
      flag: "🇳🇬",
      avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=250&q=80",
      handle: "@chuks_dev"
    },
    time: "Il y a 5h",
    content: `Why offline-first architecture is the superpower of African software engineering 📱💪
When you design for spotty 3G/4G, instant local database writes (WatermelonDB, SQLite, Drift) and seamless background sync, your app feels 10x faster even in Tokyo or London.
Constraints breed world-class engineering!`,
    likes: 128,
    commentsCount: 31,
    shares: 54,
    tags: ["Mobile", "Architecture", "Engineering", "AfricaFirst"],
    mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    mediaType: "image",
    likedByUser: false,
    comments: []
  }
];

export const QUESTIONS_DATA = [
  {
    id: "q-1",
    title: "Comment gérer le callback asynchrone des API Mobile Money en cas de timeout réseau ?",
    author: "Moussa Traoré",
    country: "Mali",
    flag: "🇲🇱",
    time: "Il y a 1 jour",
    votes: 24,
    answersCount: 5,
    resolved: true,
    tags: ["FinTech", "API", "Webhooks", "Node.js"],
    excerpt: "Lorsqu'un utilisateur initie un paiement Orange Money ou Wave, l'opérateur met parfois 45 secondes à valider. Quel pattern recommandez-vous pour notifier le client sans bloquer le socket ?",
    bestAnswer: {
      author: "Koffi Mensah",
      votes: 19,
      text: "Utilisez un système d'idempotence avec token UUID unique par transaction. Retournez immédiatement 202 Accepted au client avec polling court (ou SSE), puis écoutez le Webhook de l'opérateur avec vérification de signature HMAC SHA256."
    }
  },
  {
    id: "q-2",
    title: "Quelle est la meilleure approche pour faire tourner un modèle LLM léger sur smartphone en Afrique ?",
    author: "Fatima Zahra",
    country: "Maroc",
    flag: "🇲🇦",
    time: "Il y a 2 jours",
    votes: 38,
    answersCount: 8,
    resolved: false,
    tags: ["IA", "LLM", "EdgeAI", "Mobile"],
    excerpt: "Je souhaite intégrer un modèle de synthèse vocale ou NLP local sans consommer la data 4G de l'utilisateur. ONNX Runtime Mobile vs TensorFlow Lite : quels sont vos retours d'expérience ?",
    bestAnswer: null
  },
  {
    id: "q-3",
    title: "PostgreSQL : partitionnement de tables volumineuses par pays pour une plateforme panafricaine",
    author: "Samuel Nkurunziza",
    country: "Rwanda",
    flag: "🇷🇼",
    time: "Il y a 3 jours",
    votes: 17,
    answersCount: 3,
    resolved: true,
    tags: ["PostgreSQL", "Database", "Scaling"],
    excerpt: "Pour respecter les régulations locales de souveraineté des données (ex: RGPD local au Sénégal et Côte d'Ivoire), vaut-il mieux du table partitioning ou du multi-tenant DB ?",
    bestAnswer: {
      author: "Jean Kouassi",
      votes: 14,
      text: "Le partitionnement déclaratif par clé `country_code` avec PostgreSQL 15+ permet d'attacher des foreign tables (FDW) vers des instances locales si une loi exige le stockage sur le territoire !"
    }
  }
];

export const COMMUNITIES_DATA = [
  {
    id: "comm-1",
    name: "Python & Django Côte d'Ivoire",
    slug: "python-ci",
    flag: "🇨🇮",
    country: "Côte d'Ivoire",
    membersCount: 840,
    postsThisWeek: 42,
    description: "Communauté des développeurs Python, Django, FastAPI et data scientists de Côte d'Ivoire et de la sous-région.",
    tags: ["Python", "Django", "FastAPI", "Abidjan"],
    isMember: true,
    upcomingEvents: [
      { id: "ev-1", title: "Django Meetup Abidjan #12", date: "2026-10-18", type: "Meetup", location: "Espace Innovation - Plateau, Abidjan", attendees: 64, online: false },
      { id: "ev-2", title: "Workshop : Django REST Framework avancé", date: "2026-10-28", type: "Workshop", location: "En ligne (Zoom)", attendees: 120, online: true }
    ],
    threads: [
      { id: "th-1", author: { name: "Koffi Mensah", avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=250&q=80", flag: "🇨🇮" }, title: "Optimiser les requêtes N+1 avec select_related et prefetch_related en Django ORM", body: "Bonjour la communauté ! Je partage quelques patterns pour éviter les requêtes N+1 dans vos vues Django. Qui a des cas concrets à partager ?", tags: ["Django", "ORM", "Performance"], likes: 38, replies: 14, isPinned: true, createdAt: "Il y a 2 jours" },
      { id: "th-2", author: { name: "Awa Diallo", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80", flag: "🇸🇳" }, title: "FastAPI vs Django REST Framework en 2026 — comparatif complet", body: "Après 6 mois à utiliser FastAPI en production pour une API à 50k req/s, voici mon retour d'expérience comparé à DRF.", tags: ["FastAPI", "DRF", "Python"], likes: 52, replies: 29, isPinned: false, createdAt: "Il y a 4 jours" },
      { id: "th-3", author: { name: "Jean Kouassi", avatar: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=250&q=80", flag: "🇨🇮" }, title: "Déploiement Django sur VPS Ubuntu avec Nginx + Gunicorn + PostgreSQL", body: "Guide pas-à-pas pour déployer votre app Django en production sans serveur PaaS coûteux. Adapté pour nos réalités africaines.", tags: ["Déploiement", "VPS", "Nginx"], likes: 84, replies: 41, isPinned: false, createdAt: "Il y a 1 semaine" }
    ]
  },
  {
    id: "comm-2",
    name: "React & Next.js Africa",
    slug: "react-africa",
    flag: "🌍",
    country: "Panafrique",
    membersCount: 1620,
    postsThisWeek: 95,
    description: "Le hub des passionnés de frontend moderne, design systems, performances web et écosystème React à travers l'Afrique.",
    tags: ["React", "Next.js", "TypeScript", "UI/UX"],
    isMember: true,
    upcomingEvents: [
      { id: "ev-3", title: "AfrikaFront Conference 2026", date: "2026-11-05", type: "Conférence", location: "En ligne + Hub Lagos", attendees: 320, online: true }
    ],
    threads: [
      { id: "th-4", author: { name: "Fatima Zahra El Alami", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80", flag: "🇲🇦" }, title: "React 19 Actions et les nouveaux hooks — ce qui change pour nous", body: "React 19 est officiel. Je breakdown les nouvelles APIs qui simplifient la gestion des formulaires et des mutations côté serveur.", tags: ["React 19", "Hooks", "Server Actions"], likes: 97, replies: 33, isPinned: true, createdAt: "Il y a 1 jour" },
      { id: "th-5", author: { name: "Emeka Okonkwo", avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=250&q=80", flag: "🇳🇬" }, title: "Design system africain : composants adaptés au low-bandwidth", body: "J'ai construit un design system pensé pour nos utilisateurs en Afrique : mode sombre par défaut, tailles de police lisibles en plein soleil.", tags: ["Design System", "Accessibilité", "Performance"], likes: 73, replies: 22, isPinned: false, createdAt: "Il y a 3 jours" }
    ]
  },
  {
    id: "comm-3",
    name: "Flutter Africa",
    slug: "flutter-africa",
    flag: "🌍",
    country: "Panafrique",
    membersCount: 1350,
    postsThisWeek: 68,
    description: "Développement d'applications mobiles cross-platform réactives et performantes adaptées aux réalités du continent.",
    tags: ["Flutter", "Dart", "Mobile", "Android"],
    isMember: false,
    upcomingEvents: [
      { id: "ev-4", title: "Flutter Africa Hackathon", date: "2026-10-25", type: "Hackathon", location: "En ligne (48h)", attendees: 210, online: true },
      { id: "ev-5", title: "Meetup Flutter Nairobi", date: "2026-11-12", type: "Meetup", location: "iHub - Nairobi, Kenya", attendees: 85, online: false }
    ],
    threads: [
      { id: "th-6", author: { name: "Chukwudi Okafor", avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=250&q=80", flag: "🇳🇬" }, title: "Flutter offline-first : synchronisation avec Isar DB + background sync", body: "Comment faire fonctionner son app en mode déconnecté complet et synchroniser intelligemment quand le réseau revient. Pattern testé sur 2G/3G.", tags: ["Flutter", "Offline", "Isar DB"], likes: 65, replies: 28, isPinned: true, createdAt: "Il y a 2 jours" }
    ]
  },
  {
    id: "comm-4",
    name: "AI & Data Science Sénégal",
    slug: "ai-senegal",
    flag: "🇸🇳",
    country: "Sénégal",
    membersCount: 720,
    postsThisWeek: 31,
    description: "Réseau de chercheurs, ingénieurs ML et passionnés d'IA appliquée aux problématiques africaines (santé, agriculture, langues).",
    tags: ["Machine Learning", "NLP", "PyTorch", "Dakar"],
    isMember: false,
    upcomingEvents: [
      { id: "ev-6", title: "AI for Africa Summit", date: "2026-11-20", type: "Conférence", location: "Dakar - UCAD Amphithéâtre", attendees: 450, online: false }
    ],
    threads: [
      { id: "th-7", author: { name: "Amina Diop", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80", flag: "🇸🇳" }, title: "Fine-tuning Whisper pour la reconnaissance vocale en Wolof — WER à 8%", body: "Après 3 mois de travail sur un dataset de 200h de parole en Wolof, on a fine-tuné Whisper. Je partage la méthode et les ressources.", tags: ["NLP", "Whisper", "Wolof", "ASR"], likes: 118, replies: 47, isPinned: true, createdAt: "Il y a 3 jours" }
    ]
  },
  {
    id: "comm-5",
    name: "Cybersecurity & DevOps Africa",
    slug: "cybersec-africa",
    flag: "🌍",
    country: "Panafrique",
    membersCount: 910,
    postsThisWeek: 38,
    description: "Protection des infrastructures critiques, DevSecOps, audits et bonnes pratiques de sécurité numérique.",
    tags: ["Security", "Docker", "Kubernetes", "Linux"],
    isMember: false,
    upcomingEvents: [
      { id: "ev-7", title: "CTF AfrikDev Security Challenge", date: "2026-10-31", type: "CTF", location: "En ligne (24h)", attendees: 180, online: true }
    ],
    threads: [
      { id: "th-8", author: { name: "Samuel Nkurunziza", avatar: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=250&q=80", flag: "🇷🇼" }, title: "Sécuriser son API Django REST en production : JWT, rate limiting, CORS et HTTPS", body: "Checklist complète de sécurité pour vos APIs REST en production. Trop de projets africains sont exposés sans protection basique.", tags: ["Security", "API", "JWT"], likes: 89, replies: 36, isPinned: true, createdAt: "Il y a 5 jours" }
    ]
  }
];

export const OPPORTUNITIES_DATA = [
  {
    id: "opp-1",
    title: "Senior Full-Stack Engineer (React / Django)",
    company: "Baobab Tech Labs",
    location: "Abidjan, Côte d'Ivoire / Télétravail possible",
    type: "CDI",
    salary: "1 800 000 - 2 500 000 FCFA / mois",
    flag: "🇨🇮",
    tags: ["React", "Django", "PostgreSQL", "Docker"],
    posted: "Il y a 1 jour",
    featured: true,
    description: "Rejoignez l'équipe produit pour concevoir des plateformes SaaS à fort trafic pour le marché ouest-africain. Vous serez responsable de l'architecture, de la revue de code et de l'accompagnement des développeurs juniors.",
    deadline: "2026-11-15"
  },
  {
    id: "opp-2",
    title: "Lead Mobile Developer (Flutter)",
    company: "Wave Mobile Money",
    location: "Dakar, Sénégal / Remote",
    type: "CDI",
    salary: "Très attractif + stock-options",
    flag: "🇸🇳",
    tags: ["Flutter", "Dart", "Go", "Offline-First"],
    posted: "Il y a 3 jours",
    featured: true,
    description: "Pilotez l'application mobile utilisée par des millions d'utilisateurs : performances, mode hors-ligne et expérience sur réseaux instables.",
    deadline: "2026-11-30"
  },
  {
    id: "opp-3",
    title: "African AI Challenge 2026",
    company: "AfrikDev x Union Africaine Tech",
    location: "Panafricain — En ligne & Finale à Kigali",
    type: "🏆 Hackathon",
    salary: "$35,000 en prix & financement startup",
    flag: "🌍",
    tags: ["Intelligence Artificielle", "AgriTech", "FinTech", "Climate"],
    posted: "Inscriptions ouvertes",
    featured: true,
    description: "Le plus grand défi IA du continent : 48h pour concevoir une solution à fort impact. Les meilleures équipes rejoignent la finale à Kigali et accèdent à un financement de démarrage.",
    deadline: "2026-12-10",
    tracks: ["Intelligence Artificielle", "AgriTech", "FinTech", "Climate"],
    maxTeamSize: 5
  },
  {
    id: "opp-4",
    title: "Mission Freelance : Audit de sécurité Smart Contracts",
    company: "Sahara Web3 Protocol",
    location: "100% Remote",
    type: "Freelance",
    salary: "4 000 $ / mission",
    flag: "🌍",
    tags: ["Solidity", "Security", "Audit", "Rust"],
    posted: "Il y a 5 jours",
    featured: false,
    description: "Audit de sécurité d'un protocole DeFi avant son lancement : revue des smart contracts, rapport de vulnérabilités et recommandations.",
    deadline: "2026-11-05"
  }
];

// Messagerie Privée Panafricaine
export const MESSAGES_CONVERSATIONS = [
  {
    id: "conv-1",
    contact: {
      id: "dev-2",
      name: "Koffi Mensah",
      country: "Côte d'Ivoire",
      flag: "🇨🇮",
      avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=250&q=80",
      role: "Senior Backend Architect",
      online: true
    },
    unreadCount: 1,
    messages: [
      {
        id: "m-1",
        senderId: "dev-2",
        time: "10:14",
        text: "Salut Jean ! J'ai vu ton retour sur le projet AfriTransport, impressionnant le rendu cartographique !",
      },
      {
        id: "m-2",
        senderId: "usr-me",
        time: "10:18",
        text: "Merci Koffi ! On a galéré sur le calcul de latence des minibus Gbaka, mais MapLibre + WebSockets gèrent super bien.",
        isRead: true
      },
      {
        id: "m-3",
        senderId: "dev-2",
        time: "10:22",
        text: "Pour la passerelle KoloPay, on a packagé ce middleware pour valider les tokens HMAC des webhooks Wave et Orange Money en 4ms :",
        codeSnippet: `// Verify Operator Signature
export function verifyHmac(payload, signature, secret) {
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}`
      },
      {
        id: "m-4",
        senderId: "dev-2",
        time: "10:25",
        text: "Es-tu partant pour qu'on connecte AfriTransport à KoloPay ce week-end ?",
      }
    ]
  },
  {
    id: "conv-2",
    contact: {
      id: "dev-1",
      name: "Amina Diop",
      country: "Sénégal",
      flag: "🇸🇳",
      avatar: "/avatars/amina-diop.jpg",
      role: "AI & Data Engineer",
      online: true
    },
    unreadCount: 0,
    messages: [
      {
        id: "m-201",
        senderId: "dev-1",
        time: "Hier",
        text: "Hello Jean, on avance sur le dataset Wolof pour AgriVoice AI. Tu as déjà testé Whisper fine-tuné sur Edge ?",
      },
      {
        id: "m-202",
        senderId: "usr-me",
        time: "Hier",
        text: "Oui ! Avec ONNX Runtime Mobile et quantification int8, ça tourne nickel sur des téléphones avec 2 Go de RAM.",
        isRead: true
      }
    ]
  },
  {
    id: "conv-3",
    contact: {
      id: "recruiter-1",
      name: "Awa Touré (Wave Recrutement)",
      country: "Sénégal",
      flag: "🇸🇳",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80",
      role: "Talent Acquisition Lead",
      online: false
    },
    unreadCount: 0,
    messages: [
      {
        id: "m-301",
        senderId: "recruiter-1",
        time: "Il y a 2 jours",
        text: "Bonjour Jean, votre profil AFRIKDEV et vos contributions open-source ont retenu notre attention pour un rôle Lead Full-Stack chez Wave. Seriez-vous ouvert à un échange ?",
      }
    ]
  }
];

// Signalements et Fil de Modération
export const MODERATION_REPORTS = [
  {
    id: "rep-1",
    targetType: "Publication",
    targetSummary: "Offre douteuse : 'Gagnez 5 000 USDT en testant un script python non vérifié'",
    reason: "Suspicion d'arnaque / Phishing",
    reportedBy: "Koffi Mensah",
    reportedAt: "Il y a 20 min",
    status: "EN_ATTENTE", // EN_ATTENTE | RESOLU | REJETE
    riskLevel: "CRITIQUE",
    author: "User_Spam_99"
  },
  {
    id: "rep-2",
    targetType: "Commentaire",
    targetSummary: "Propos déplacés et insultes répétées sur un sujet de débat framework",
    reason: "Comportement toxique / Harcèlement",
    reportedBy: "Amina Diop",
    reportedAt: "Il y a 2h",
    status: "EN_ATTENTE",
    riskLevel: "MOYEN",
    author: "TrollCoder"
  },
  {
    id: "rep-3",
    targetType: "Projet",
    targetSummary: "Clone complet d'un projet GitHub sous licence restrictive sans attribution",
    reason: "Non-respect de licence open-source",
    reportedBy: "Samuel Nkurunziza",
    reportedAt: "Il y a 5h",
    status: "RESOLU",
    riskLevel: "FAIBLE",
    author: "CopyDev"
  }
];

// Métriques Administrateur
export const ADMIN_METRICS = {
  totalUsers: 12540,
  activeToday: 2180,
  totalProjects: 854,
  totalPosts: 42120,
  totalCollaborations: 3240,
  pendingReports: 2,
  countryDistribution: [
    { country: "Côte d'Ivoire", flag: "🇨🇮", percentage: 28, users: 3510 },
    { country: "Nigeria", flag: "🇳🇬", percentage: 26, users: 3260 },
    { country: "Sénégal", flag: "🇸🇳", percentage: 18, users: 2250 },
    { country: "Kenya", flag: "🇰🇪", percentage: 12, users: 1500 },
    { country: "Maroc", flag: "🇲🇦", percentage: 9, users: 1120 },
    { country: "Rwanda", flag: "🇷🇼", percentage: 7, users: 900 }
  ],
  topTechnologies: [
    { name: "React", count: 4850, growth: "+24%" },
    { name: "Python / Django", count: 4420, growth: "+31%" },
    { name: "Flutter", count: 3780, growth: "+42%" },
    { name: "PostgreSQL", count: 3200, growth: "+18%" },
    { name: "Docker", count: 2600, growth: "+15%" }
  ]
};

// Données Portail Entreprise & Recruteur
export const COMPANIES_PORTAL_DATA = {
  currentCompany: {
    id: "comp-1",
    name: "Baobab Tech Labs",
    tagline: "Le studio d'ingénierie logicielle d'Abidjan & Dakar",
    country: "Côte d'Ivoire",
    flag: "🇨🇮",
    headquarters: "Abidjan, Côte d'Ivoire (Plateau)",
    verified: true,
    website: "https://baobabtechlabs.africa",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80",
    description: "Nous concevons des produits technologiques à fort impact pour la banque, l'agriculture et les télécoms en Afrique de l'Ouest.",
    stats: {
      openJobs: 3,
      totalApplicants: 48,
      interviewsScheduled: 7
    }
  },
  applicantsPipeline: [
    {
      id: "app-1",
      candidateName: "Koffi Mensah",
      roleApplied: "Senior Backend Architect",
      stage: "Entretien technique", // Reçue | En revue | Entretien technique | Offre formulée
      country: "Côte d'Ivoire",
      flag: "🇨🇮",
      avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=250&q=80",
      skills: ["Django", "Python", "PostgreSQL", "Docker"],
      appliedDate: "Il y a 2 jours",
      rating: 5
    },
    {
      id: "app-2",
      candidateName: "Fatima Zahra El Alami",
      roleApplied: "Lead Frontend React",
      stage: "En revue",
      country: "Maroc",
      flag: "🇲🇦",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      appliedDate: "Il y a 3 jours",
      rating: 4.8
    },
    {
      id: "app-3",
      candidateName: "Chukwudi Okafor",
      roleApplied: "Lead Mobile Developer (Flutter)",
      stage: "Offre formulée",
      country: "Nigeria",
      flag: "🇳🇬",
      avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=250&q=80",
      skills: ["Flutter", "Dart", "Go", "SQLite"],
      appliedDate: "Il y a 1 semaine",
      rating: 4.9
    }
  ]
};
