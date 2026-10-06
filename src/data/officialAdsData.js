// Données des Publicités et Contenus Officiels AFRIKDEV avec traductions enregistrées (FR / EN)
// Aucune API de traduction requise pour ces contenus : l'anglais ou le français est servi directement selon la langue active.

export const OFFICIAL_ADS = [
  {
    id: 'ad-python-training',
    sponsor: "AfrikAcademy",
    logo: "🐍",
    badgeFr: "🎓 Formation Certifiante",
    badgeEn: "🎓 Certified Course",
    tagFr: "Publicité • Formation Tech",
    tagEn: "Sponsored • Tech Training",
    titleFr: "Formation Python pour débutants",
    titleEn: "Python Training for Beginners",
    descFr: "Apprenez Python de zéro jusqu'au développement d'applications complètes et d'APIs Django résilientes.",
    descEn: "Learn Python from scratch up to building full-stack web applications and resilient Django APIs.",
    ctaFr: "Découvrir la formation →",
    ctaEn: "Explore Course →",
    link: "#formation-python",
    highlightColor: "#3B82F6"
  },
  {
    id: 'ad-cloud-hosting',
    sponsor: "AfrikCloud Edge",
    logo: "⚡",
    badgeFr: "⚡ Latence < 15ms",
    badgeEn: "⚡ Sub-15ms Latency",
    tagFr: "Publicité • Cloud & Infra",
    tagEn: "Sponsored • Cloud & Infra",
    titleFr: "Hébergement Cloud Panafricain Haute Disponibilité",
    titleEn: "High-Availability Pan-African Cloud Hosting",
    descFr: "Déployez vos conteneurs Docker, bases PostgreSQL et frontends React au plus près des utilisateurs à Abidjan, Dakar et Lagos.",
    descEn: "Deploy your Docker containers, PostgreSQL databases, and React frontends closest to users in Abidjan, Dakar, and Lagos.",
    ctaFr: "Obtenir 100$ de crédits gratuits →",
    ctaEn: "Get $100 in Free Cloud Credits →",
    link: "#cloud-afrique",
    highlightColor: "#06B6D4"
  },
  {
    id: 'ad-fintech-challenge',
    sponsor: "AFRIKDEV Foundation",
    logo: "🏆",
    badgeFr: "🏆 35 000 $ USD de dotation",
    badgeEn: "🏆 $35,000 USD Prize Pool",
    tagFr: "Publicité • Hackathon Officiel",
    tagEn: "Sponsored • Official Hackathon",
    titleFr: "African AI & Mobile Money Challenge 2026",
    titleEn: "African AI & Mobile Money Challenge 2026",
    descFr: "Concevez les passerelles de paiement et agents IA de demain connectant Wave, Orange Money et M-Pesa.",
    descEn: "Build tomorrow's payment gateways and AI agents connecting Wave, Orange Money, and M-Pesa across Africa.",
    ctaFr: "Inscrire son équipe →",
    ctaEn: "Register Your Team →",
    link: "#challenge-2026",
    highlightColor: "#F59E0B"
  }
];

export function getLocalizedAd(ad, lang = 'fr') {
  if (!ad) return null;
  const isEn = lang === 'en';
  return {
    ...ad,
    title: isEn ? (ad.titleEn || ad.titleFr) : ad.titleFr,
    desc: isEn ? (ad.descEn || ad.descFr) : ad.descFr,
    badge: isEn ? (ad.badgeEn || ad.badgeFr) : ad.badgeFr,
    tag: isEn ? (ad.tagEn || ad.tagFr) : ad.tagFr,
    cta: isEn ? (ad.ctaEn || ad.ctaFr) : ad.ctaFr
  };
}
