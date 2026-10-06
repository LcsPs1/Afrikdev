// Catalogue officiel et critères d'obtention des badges AFRIKDEV (Bilingue FR/EN)

export const BADGES_CATALOG = [
  {
    id: "pioneer",
    title: "Pionnier AfrikDev",
    titleEn: "AfrikDev Pioneer",
    icon: "🌍",
    color: "#06B6D4",
    category: "Distinction Fondateur",
    categoryEn: "Founding Distinction",
    description: "Fait partie des premiers membres et bâtisseurs de la communauté technologique panafricaine AfrikDev.",
    descriptionEn: "Among the earliest members and founding builders of the AfrikDev Pan-African tech community.",
    howToEarn: "Inscrit parmi les 1 000 premiers développeurs de la plateforme ou contributeur de la première heure.",
    howToEarnEn: "Registered among the first 1,000 developers on the platform or early community contributor."
  },
  {
    id: "python-arch",
    title: "Python Architect",
    titleEn: "Python Architect",
    icon: "🐍",
    color: "#10B981",
    category: "Expertise Stack",
    categoryEn: "Tech Stack Expertise",
    description: "Concepteur chevronné d'architectures backend robustes, scalables et distribuées avec Python et Django.",
    descriptionEn: "Seasoned engineer of scalable, distributed, and resilient backend systems with Python and Django.",
    howToEarn: "Niveau Expert/Avancé en Python/Django sur le profil et au moins 3 projets ou microservices publiés.",
    howToEarnEn: "Advanced/Expert level in Python/Django on profile with at least 3 published projects or microservices."
  },
  {
    id: "top-mentor",
    title: "Top Mentor",
    titleEn: "Top Mentor",
    icon: "🤝",
    color: "#F59E0B",
    category: "Communauté & Entraide",
    categoryEn: "Community & Mentorship",
    description: "Pilier de l'entraide technique, guide et soutient activement les talents émergents du continent.",
    descriptionEn: "Cornerstone of developer mentorship, actively guiding and empowering emerging African talents.",
    howToEarn: "Avoir apporté au moins 5 réponses validées comme 'meilleure réponse' et accompagné des pairs sur le forum.",
    howToEarnEn: "Contributed at least 5 accepted solutions on the Q&A forum and mentored junior developers."
  },
  {
    id: "ai-pioneer",
    title: "AI Pioneer",
    titleEn: "AI Pioneer",
    icon: "🤖",
    color: "#8B5CF6",
    category: "Innovation & Data",
    categoryEn: "Innovation & AI",
    description: "Innovateur dans le machine learning, les modèles de langage (LLM) et le traitement des langues africaines.",
    descriptionEn: "Innovator in machine learning, large language models (LLMs), and low-resource African NLP.",
    howToEarn: "Avoir conçu et publié au moins 1 projet intégrant l'IA (FastAPI, PyTorch, LangChain ou NLP local).",
    howToEarnEn: "Built and published at least 1 production AI project (FastAPI, PyTorch, LangChain, or local NLP)."
  },
  {
    id: "fintech-builder",
    title: "FinTech Builder",
    titleEn: "FinTech Builder",
    icon: "💳",
    color: "#059669",
    category: "Impact Économique",
    categoryEn: "Economic Impact",
    description: "Bâtisseur de solutions d'inclusion financière, de passerelles de paiement Mobile Money et d'USSD.",
    descriptionEn: "Builder of financial inclusion engines, Mobile Money payment gateways, and USSD banking protocols.",
    howToEarn: "Avoir intégré ou développé une solution connectée aux moyens de paiement africains (Wave, Orange Money, MoMo, etc.).",
    howToEarnEn: "Integrated or deployed a live system connecting African payment providers (Wave, MoMo, Orange Money)."
  },
  {
    id: "mobile-wizard",
    title: "Mobile Wizard",
    titleEn: "Mobile Wizard",
    icon: "📱",
    color: "#3B82F6",
    category: "Expertise Mobile",
    categoryEn: "Mobile Engineering",
    description: "Artisan d'applications mobiles fluides, réactives et optimisées pour les environnements bas débit.",
    descriptionEn: "Craftsman of responsive mobile applications engineered for offline-first and low-bandwidth environments.",
    howToEarn: "Avoir déployé ou publié au moins 2 applications mobiles (Flutter, React Native ou Kotlin).",
    howToEarnEn: "Deployed or published at least 2 production mobile applications (Flutter, React Native, or Kotlin)."
  },
  {
    id: "devops-master",
    title: "DevOps Master",
    titleEn: "DevOps Master",
    icon: "⚡",
    color: "#EC4899",
    category: "Infrastructure & Cloud",
    categoryEn: "Cloud & Infrastructure",
    description: "Maître du déploiement continu, des conteneurs et des infrastructures cloud hautement résilientes.",
    descriptionEn: "Master of automated CI/CD pipelines, container orchestration, and fault-tolerant cloud infrastructures.",
    howToEarn: "Avoir mis en place des pipelines CI/CD automatisés, Docker/Kubernetes ou des architectures cloud résilientes.",
    howToEarnEn: "Implemented automated CI/CD pipelines, Docker/Kubernetes clusters, or resilient cloud systems."
  },
  {
    id: "security-guardian",
    title: "Security Guardian",
    titleEn: "Security Guardian",
    icon: "🛡️",
    color: "#E11D48",
    category: "Sécurité & Audit",
    categoryEn: "Security & Auditing",
    description: "Protecteur des données numériques, auditeur de code et garant des bonnes pratiques de cybersécurité.",
    descriptionEn: "Guardian of digital assets, vulnerability auditor, and champion of security best practices.",
    howToEarn: "Avoir contribué à un audit de sécurité, protégé une API ou résolu des vulnérabilités critiques.",
    howToEarnEn: "Contributed to security audits, hardened authentication APIs, or patched critical vulnerabilities."
  },
  {
    id: "design-hero",
    title: "Design System Hero",
    titleEn: "Design System Hero",
    icon: "🎨",
    color: "#F43F5E",
    category: "Design & UX",
    categoryEn: "Design & UX",
    description: "Créateur d'interfaces utilisateur haut de gamme, intuitives, accessibles et alignées sur les meilleurs standards.",
    descriptionEn: "Creator of premium, accessible, and intuitive UI components adhering to top design system principles.",
    howToEarn: "Avoir créé un Design System réutilisable ou conçu une interface plébiscitée par la communauté.",
    howToEarnEn: "Authored an accessible design system or designed a top-rated interface acclaimed by peers."
  },
  {
    id: "open-source-lead",
    title: "Open Source Lead",
    titleEn: "Open Source Lead",
    icon: "🚀",
    color: "#6366F1",
    category: "Code Ouvert",
    categoryEn: "Open Source",
    description: "Champion du partage libre de code et de la contribution collective à l'autonomie logicielle africaine.",
    descriptionEn: "Champion of public open-source code and collective software independence across the continent.",
    howToEarn: "Être mainteneur ou contributeur actif d'un dépôt public open-source sur GitHub/GitLab.",
    howToEarnEn: "Active maintainer or verified contributor to public open-source repositories on GitHub/GitLab."
  },
  {
    id: "speaker-tech",
    title: "Speaker Tech",
    titleEn: "Tech Speaker",
    icon: "🎙️",
    color: "#D97706",
    category: "Rayonnement",
    categoryEn: "Knowledge Sharing",
    description: "Partageur de savoirs qui anime des conférences, webinaires et masterclasses au sein de l'écosystème.",
    descriptionEn: "Thought leader and keynote speaker hosting workshops, webinars, and masterclasses across Africa.",
    howToEarn: "Avoir animé un atelier technique ou été intervenant lors d'un événement partenaire AfrikDev.",
    howToEarnEn: "Delivered a technical workshop or keynote session at an AfrikDev partner conference."
  },
  {
    id: "contributeur-emerite",
    title: "Contributeur Émérite",
    titleEn: "Distinguished Contributor",
    icon: "⭐",
    color: "#EAB308",
    category: "Réputation & Engagement",
    categoryEn: "Reputation & Impact",
    description: "Membre exceptionnel reconnu pour la régularité et la haute qualité de ses contributions techniques.",
    descriptionEn: "Distinguished member renowned for consistent, high-impact contributions and technical leadership.",
    howToEarn: "Avoir dépassé les 2 000 points de réputation cumulés grâce à des posts, projets et partages approuvés.",
    howToEarnEn: "Exceeded 2,000 reputation points earned through approved projects, posts, and architectural insights."
  },
  {
    id: "fullstack-maestro",
    title: "Full-Stack Maestro",
    titleEn: "Full-Stack Maestro",
    icon: "⚡",
    color: "#14B8A6",
    category: "Expertise Stack",
    categoryEn: "Tech Stack Expertise",
    description: "Capable de concevoir et mener à terme une application complète de l'interface jusqu'au serveur et à la base de données.",
    descriptionEn: "Versatile engineer capable of architecting entire software systems from frontend UI to database clusters.",
    howToEarn: "Avoir publié un projet validé combinant un frontend moderne (React/Next) et un backend robuste (Django/Node).",
    howToEarnEn: "Published an end-to-end project uniting a modern frontend (React/Next) with a robust backend (Django/Node)."
  },
  {
    id: "community-champion",
    title: "Champion Communautaire",
    titleEn: "Community Champion",
    icon: "🏆",
    color: "#A855F7",
    category: "Communauté & Entraide",
    categoryEn: "Community Leadership",
    description: "Animateur et fédérateur d'une communauté ou d'un club tech dynamique sur AfrikDev.",
    descriptionEn: "Community leader who establishes and cultivates a thriving engineering hub on AfrikDev.",
    howToEarn: "Créer et animer un hub ou groupe thématique ayant réuni plus de 50 membres engagés.",
    howToEarnEn: "Founded and actively moderated a technology hub or regional chapter with 50+ engaged developers."
  }
];

// Dictionnaire rapide par clé normalisée (slug ou titre)
const BADGES_MAP = new Map();

BADGES_CATALOG.forEach(badge => {
  BADGES_MAP.set(badge.id.toLowerCase(), badge);
  BADGES_MAP.set(badge.title.toLowerCase(), badge);
  if (badge.titleEn) {
    BADGES_MAP.set(badge.titleEn.toLowerCase(), badge);
  }
});

// Alias courants pour compatibilité totale avec les mock data
BADGES_MAP.set("ai pioneer", BADGES_MAP.get("ai-pioneer"));
BADGES_MAP.set("speaker tech", BADGES_MAP.get("speaker-tech"));
BADGES_MAP.set("fintech builder", BADGES_MAP.get("fintech-builder"));
BADGES_MAP.set("contributeur émérite", BADGES_MAP.get("contributeur-emerite"));
BADGES_MAP.set("contributeur emerite", BADGES_MAP.get("contributeur-emerite"));
BADGES_MAP.set("mobile wizard", BADGES_MAP.get("mobile-wizard"));
BADGES_MAP.set("open source lead", BADGES_MAP.get("open-source-lead"));
BADGES_MAP.set("design system hero", BADGES_MAP.get("design-hero"));
BADGES_MAP.set("devops master", BADGES_MAP.get("devops-master"));
BADGES_MAP.set("security guardian", BADGES_MAP.get("security-guardian"));
BADGES_MAP.set("pionnier afrikdev", BADGES_MAP.get("pioneer"));
BADGES_MAP.set("python architect", BADGES_MAP.get("python-arch"));
BADGES_MAP.set("top mentor", BADGES_MAP.get("top-mentor"));

/**
 * Résout n'importe quel badge (chaîne de caractères ou objet partiel)
 * en un objet badge complet avec support multilingue (fr / en).
 */
export function getBadgeDetails(badgeInput, lang = 'fr') {
  if (!badgeInput) {
    return {
      id: "unknown",
      title: lang === 'en' ? "Distinction" : "Distinction",
      icon: "🏅",
      color: "#06B6D4",
      category: lang === 'en' ? "General" : "Général",
      description: lang === 'en' ? "Honorary distinction awarded on AfrikDev." : "Distinction accordée pour l'engagement sur AfrikDev.",
      howToEarn: lang === 'en' ? "Actively participate in the community." : "Participer activement à la communauté."
    };
  }

  const lookupKey = typeof badgeInput === 'string'
    ? badgeInput.trim().toLowerCase()
    : (badgeInput.id || badgeInput.title || '').trim().toLowerCase();

  const found = BADGES_MAP.get(lookupKey);
  if (found) {
    const isEn = lang === 'en';
    return {
      ...found,
      title: isEn && found.titleEn ? found.titleEn : found.title,
      category: isEn && found.categoryEn ? found.categoryEn : found.category,
      description: isEn && found.descriptionEn ? found.descriptionEn : found.description,
      howToEarn: isEn && found.howToEarnEn ? found.howToEarnEn : found.howToEarn,
      ...(typeof badgeInput === 'object' ? badgeInput : {})
    };
  }

  // Fallback si titre non répertorié
  const title = typeof badgeInput === 'string' ? badgeInput : badgeInput.title || 'Badge Spécial';
  const icon = typeof badgeInput === 'object' && badgeInput.icon ? badgeInput.icon : '🏅';
  const color = typeof badgeInput === 'object' && badgeInput.color ? badgeInput.color : '#06B6D4';

  return {
    id: `badge-${title.toLowerCase().replace(/\s+/g, '-')}`,
    title,
    icon,
    color,
    category: lang === 'en' ? "Special Honor" : "Distinction Spéciale",
    description: lang === 'en' ? `Honorary badge "${title}" awarded on AfrikDev.` : `Badge honorifique "${title}" décerné sur AfrikDev.`,
    howToEarn: lang === 'en' ? "Awarded by team or upon community achievements." : "Attribué par l'équipe ou sur accomplissement spécifique dans la communauté."
  };
}
