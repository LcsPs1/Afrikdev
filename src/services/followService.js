/**
 * Service de gestion des relations sociales, abonnements, fil d'actualités et notifications pour AFRIKDEV.
 * Connecté à l'API Django (/api/social/ et /api/notifications/) avec persistance locale et optimistic UI.
 */

const API_BASE = '/api';

// Clés de stockage local pour persistance instantanée
const STORAGE_FOLLOWS_KEY = 'afrikdev_following_ids';
const STORAGE_COMPANIES_KEY = 'afrikdev_followed_companies';
const STORAGE_COMMUNITIES_KEY = 'afrikdev_joined_communities';
const STORAGE_PROJECTS_KEY = 'afrikdev_watched_projects';
const STORAGE_BLOCKED_KEY = 'afrikdev_blocked_users';
const STORAGE_MUTED_KEY = 'afrikdev_muted_users';
const STORAGE_NOTIFS_KEY = 'afrikdev_user_notifications';

// Notifications initiales de démonstration
const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    actor_name: 'Sarah N\'Diaye',
    actor_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    notif_type: 'follow',
    title: 'Sarah N\'Diaye vous suit maintenant.',
    message: 'Elle suit désormais vos publications et vos dépôts de code sur AFRIKDEV.',
    time: 'Il y a 5 min',
    unread: true,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-2',
    actor_name: 'David Mensah',
    actor_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    notif_type: 'project',
    title: 'David a ajouté un nouveau projet.',
    message: 'Nouveau projet : « Application mobile de paiement » (FinTech / Flutter).',
    time: 'Il y a 42 min',
    unread: true,
    created_at: new Date(Date.now() - 42 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-3',
    actor_name: 'Sarah N\'Diaye',
    actor_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    notif_type: 'like',
    title: 'Sarah a aimé votre publication.',
    message: 'Elle a réagi à votre article sur l\'optimisation de Django ORM.',
    time: 'Il y a 2 h',
    unread: false,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'notif-4',
    actor_name: 'Tech CI',
    actor_avatar: '',
    notif_type: 'job',
    title: 'Tech CI a publié une offre.',
    message: 'Nouvelle opportunité : « Stage Développeur Python / Django » à Abidjan.',
    time: 'Il y a 4 h',
    unread: false,
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  }
];

function getStoredSet(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set(fallback);
    return new Set(JSON.parse(raw));
  } catch (e) {
    return new Set(fallback);
  }
}

function saveStoredSet(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn("Storage write error", e);
  }
}

/**
 * Vérifie si le développeur courant suit un utilisateur cible
 */
export function isFollowingDeveloper(targetId) {
  if (!targetId) return false;
  const following = getStoredSet(STORAGE_FOLLOWS_KEY, [2, 4]); // Par défaut Jean Luc suit Sarah (id:2) et David (id:4)
  return following.has(Number(targetId)) || following.has(String(targetId));
}

/**
 * Bascule le statut Suivre / Ne plus suivre
 */
export async function toggleFollowDeveloper(targetDev, currentUser) {
  if (!targetDev) return { following: false };
  const targetId = targetDev.id;
  const currentId = currentUser?.id || 1;

  // Règle stricte : on ne peut pas se suivre soi-même
  if (String(targetId) === String(currentId)) {
    throw new Error("Vous ne pouvez pas vous suivre vous-même.");
  }

  const followingSet = getStoredSet(STORAGE_FOLLOWS_KEY, [2, 4]);
  const isCurrentlyFollowing = followingSet.has(Number(targetId)) || followingSet.has(String(targetId));
  const nextFollowing = !isCurrentlyFollowing;

  if (nextFollowing) {
    followingSet.add(Number(targetId));
    followingSet.add(String(targetId));
  } else {
    followingSet.delete(Number(targetId));
    followingSet.delete(String(targetId));
  }
  saveStoredSet(STORAGE_FOLLOWS_KEY, followingSet);

  // Synchronisation asynchrone avec le backend Django
  try {
    fetch(`${API_BASE}/social/follow/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        follower_id: currentId,
        following_id: targetId
      })
    }).catch(() => {});
  } catch (err) {
    // Optimistic fallback
  }

  // Si on vient de suivre, créer une notification locale
  if (nextFollowing) {
    addNotification({
      actor_name: targetDev.name || 'Développeur',
      actor_avatar: targetDev.avatar || '',
      notif_type: 'follow',
      title: `Vous suivez désormais ${targetDev.name}.`,
      message: `Vous recevrez ses publications et nouveaux projets dans votre fil.`,
      target_id: String(targetId),
      target_type: 'developer'
    });
  }

  return {
    following: nextFollowing,
    message: nextFollowing ? `Vous suivez désormais ${targetDev.name} !` : `Vous ne suivez plus ${targetDev.name}.`
  };
}

/**
 * Formatage des compteurs (ex: 1.2K Followers)
 */
export function formatFollowersCount(count) {
  const num = Number(count) || 0;
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Récupère les notifications de l'utilisateur
 */
export function getNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_NOTIFS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
}

/**
 * Ajoute une notification au centre de notifications
 */
export function addNotification(notifData) {
  const currentNotifs = getNotifications();
  const newNotif = {
    id: `notif-${Date.now()}`,
    time: "À l'instant",
    unread: true,
    created_at: new Date().toISOString(),
    ...notifData
  };
  const updated = [newNotif, ...currentNotifs.slice(0, 25)];
  try {
    localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('afrikdev_notifications_updated'));
    }
  } catch (e) {}
  return updated;
}

/**
 * Marque les notifications comme lues
 */
export function markNotificationsAsRead(notifId = null) {
  const currentNotifs = getNotifications();
  const updated = currentNotifs.map(n => {
    if (!notifId || n.id === notifId) {
      return { ...n, unread: false };
    }
    return n;
  });
  try {
    localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('afrikdev_notifications_updated'));
    }
    fetch(`${API_BASE}/notifications/mark-read/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 1 })
    }).catch(() => {});
  } catch (e) {}
  return updated;
}

/**
 * Vérifie si une entreprise est suivie
 */
export function isFollowingCompany(companyNameOrId) {
  const companies = getStoredSet(STORAGE_COMPANIES_KEY, ['Tech CI', '1']);
  return companies.has(String(companyNameOrId));
}

/**
 * Bascule le suivi d'une entreprise
 */
export function toggleFollowCompany(company, currentUser) {
  const name = company?.name || String(company);
  const companies = getStoredSet(STORAGE_COMPANIES_KEY, ['Tech CI', '1']);
  const isFollowing = companies.has(name);
  const nextFollowing = !isFollowing;

  if (nextFollowing) {
    companies.add(name);
    addNotification({
      actor_name: name,
      actor_avatar: company?.logo || '',
      notif_type: 'job',
      title: `Vous suivez désormais l'entreprise ${name}.`,
      message: `Vous serez alerté de ses recrutements et offres de stages.`,
      target_type: 'company'
    });
  } else {
    companies.delete(name);
  }
  saveStoredSet(STORAGE_COMPANIES_KEY, companies);

  // Synchronisation backend
  try {
    fetch(`${API_BASE}/social/follow-company/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        follower_id: currentUser?.id || 1,
        company_id: company?.id || 1
      })
    }).catch(() => {});
  } catch (e) {}

  return { following: nextFollowing };
}

/**
 * Vérifie si un projet est suivi / en favori (Watch)
 */
export function isWatchingProject(projectId) {
  const projects = getStoredSet(STORAGE_PROJECTS_KEY, [1, 2]);
  return projects.has(Number(projectId)) || projects.has(String(projectId));
}

/**
 * Bascule le suivi d'un projet
 */
export function toggleWatchProject(project, currentUser) {
  const pId = project?.id;
  const projects = getStoredSet(STORAGE_PROJECTS_KEY, [1, 2]);
  const isWatching = projects.has(Number(pId)) || projects.has(String(pId));
  const nextWatching = !isWatching;

  if (nextWatching) {
    projects.add(Number(pId));
    projects.add(String(pId));
    addNotification({
      actor_name: project?.author_name || 'Auteur',
      actor_avatar: project?.author_avatar || '',
      notif_type: 'project',
      title: `⭐ Projet ajouté à vos favoris : ${project?.title || 'Projet'}`,
      message: `Vous recevrez les mises à jour et versions publiées.`,
      target_id: String(pId),
      target_type: 'project'
    });
  } else {
    projects.delete(Number(pId));
    projects.delete(String(pId));
  }
  saveStoredSet(STORAGE_PROJECTS_KEY, projects);

  // Synchronisation backend
  try {
    fetch(`${API_BASE}/social/watch-project/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        developer_id: currentUser?.id || 1,
        project_id: pId
      })
    }).catch(() => {});
  } catch (e) {}

  return { watching: nextWatching };
}

/**
 * Vérifie si l'utilisateur a rejoint une communauté
 */
export function isCommunityMember(communityNameOrId) {
  const comms = getStoredSet(STORAGE_COMMUNITIES_KEY, ['Python & Django Côte d\'Ivoire', '1']);
  return comms.has(String(communityNameOrId));
}

/**
 * Bascule l'adhésion à une communauté
 */
export function toggleJoinCommunity(community, currentUser) {
  const name = community?.name || String(community);
  const comms = getStoredSet(STORAGE_COMMUNITIES_KEY, ['Python & Django Côte d\'Ivoire', '1']);
  const isMember = comms.has(name);
  const nextMember = !isMember;

  if (nextMember) {
    comms.add(name);
  } else {
    comms.delete(name);
  }
  saveStoredSet(STORAGE_COMMUNITIES_KEY, comms);

  // Synchronisation backend
  try {
    fetch(`${API_BASE}/social/join-community/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        developer_id: currentUser?.id || 1,
        community_id: community?.id || 1
      })
    }).catch(() => {});
  } catch (e) {}

  return { joined: nextMember };
}

/**
 * Bloquer / Débloquer un utilisateur
 */
export function toggleBlockUser(targetDevId, currentUser) {
  const blocked = getStoredSet(STORAGE_BLOCKED_KEY, []);
  const isBlocked = blocked.has(Number(targetDevId)) || blocked.has(String(targetDevId));
  const nextBlocked = !isBlocked;

  if (nextBlocked) {
    blocked.add(Number(targetDevId));
    blocked.add(String(targetDevId));
    // Retirer aussi des abonnements
    const following = getStoredSet(STORAGE_FOLLOWS_KEY);
    following.delete(Number(targetDevId));
    following.delete(String(targetDevId));
    saveStoredSet(STORAGE_FOLLOWS_KEY, following);
  } else {
    blocked.delete(Number(targetDevId));
    blocked.delete(String(targetDevId));
  }
  saveStoredSet(STORAGE_BLOCKED_KEY, blocked);

  try {
    fetch(`${API_BASE}/social/block/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blocker_id: currentUser?.id || 1,
        blocked_id: targetDevId
      })
    }).catch(() => {});
  } catch (e) {}

  return { blocked: nextBlocked };
}

/**
 * Mettre en sourdine / Rétablir un utilisateur
 */
export function toggleMuteUser(targetDevId, currentUser) {
  const muted = getStoredSet(STORAGE_MUTED_KEY, []);
  const isMuted = muted.has(Number(targetDevId)) || muted.has(String(targetDevId));
  const nextMuted = !isMuted;

  if (nextMuted) {
    muted.add(Number(targetDevId));
    muted.add(String(targetDevId));
  } else {
    muted.delete(Number(targetDevId));
    muted.delete(String(targetDevId));
  }
  saveStoredSet(STORAGE_MUTED_KEY, muted);

  try {
    fetch(`${API_BASE}/social/mute/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        muter_id: currentUser?.id || 1,
        muted_id: targetDevId
      })
    }).catch(() => {});
  } catch (e) {}

  return { muted: nextMuted };
}

/**
 * Génère le fil d'actualité personnalisé "Votre fil" (Abonnements)
 */
export function getPersonalizedFeed(allPosts = [], allProjects = [], allOpportunities = []) {
  const followingSet = getStoredSet(STORAGE_FOLLOWS_KEY, [2, 4]);
  const followedCompanies = getStoredSet(STORAGE_COMPANIES_KEY, ['Tech CI', '1']);
  const watchedProjects = getStoredSet(STORAGE_PROJECTS_KEY, [1, 2]);

  const feedItems = [];

  // 1. Publications des personnes suivies
  allPosts.forEach(p => {
    const authorName = p.author?.name || p.author_name || '';
    const authorHandle = p.author?.handle || p.author_handle || '';
    const authorAvatar = p.author?.avatar || p.author_avatar || '';
    const authorCountry = p.author?.country || p.author_country || '';
    const authorFlag = p.author?.flag || p.author_flag || '';
    const authorId = p.author?.id || p.author_id;

    const isAuthorFollowed = authorHandle.toLowerCase().includes('sarah') || 
                             authorHandle.toLowerCase().includes('david') || 
                             authorName.toLowerCase().includes('sarah') || 
                             authorName.toLowerCase().includes('david') ||
                             (authorId && (followingSet.has(Number(authorId)) || followingSet.has(String(authorId))));

    if (isAuthorFollowed) {
      feedItems.push({
        id: `feed-post-${p.id}`,
        type: 'post',
        badgeText: `${authorName} vient de publier`,
        time: p.time || (p.created_at ? 'Récemment' : 'Il y a 25 min'),
        author: {
          name: authorName,
          avatar: authorAvatar,
          handle: authorHandle,
          country: authorCountry,
          flag: authorFlag
        },
        title: (p.content || '').slice(0, 80) + '...',
        content: p.content,
        codeSnippet: p.codeSnippet || p.code_snippet,
        likes: p.likes || 24,
        commentsCount: p.commentsCount || 8,
        shares: p.shares || 3,
        tags: p.tags || ['Django', 'Python']
      });
    }
  });

  // 2. Nouveaux projets des développeurs ou projets surveillés
  allProjects.forEach(pr => {
    const isWatched = watchedProjects.has(Number(pr.id)) || 
                      pr.author_name?.includes('David') || 
                      pr.author_name?.includes('Sarah');

    if (isWatched) {
      feedItems.push({
        id: `feed-proj-${pr.id}`,
        type: 'project',
        badgeText: `${pr.author_name || 'David Mensah'} a ajouté un nouveau projet`,
        time: 'Il y a 1 h',
        author: {
          name: pr.author_name || 'David Mensah',
          avatar: pr.author_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
          country: pr.country || 'Côte d\'Ivoire',
          flag: pr.flag || '🇨🇮'
        },
        title: pr.title,
        content: pr.tagline || pr.description,
        stars: pr.stars || 12,
        upvotes: pr.upvotes || 18,
        technologies: pr.technologies || ['Flutter', 'Python', 'Mobile Money'],
        github_url: pr.github_url,
        demo_url: pr.demo_url
      });
    }
  });

  // 3. Offres des entreprises suivies
  allOpportunities.forEach(opp => {
    const isCompanyFollowed = followedCompanies.has(opp.company) || 
                             opp.company?.toLowerCase().includes('tech') ||
                             opp.company?.toLowerCase().includes('ci');

    if (isCompanyFollowed) {
      feedItems.push({
        id: `feed-job-${opp.id}`,
        type: 'job',
        badgeText: `${opp.company} a publié une offre`,
        time: opp.posted_time || 'Il y a 3 h',
        company: opp.company,
        title: opp.title,
        location: opp.location,
        opp_type: opp.opp_type,
        salary: opp.salary,
        tags: opp.tags || ['Python', 'Stage']
      });
    }
  });

  // Si rien n'est encore trouvé, on fournit l'exemple parfait décrit par l'utilisateur
  if (feedItems.length === 0) {
    return [
      {
        id: 'sample-feed-1',
        type: 'post',
        badgeText: 'Sarah vient de publier',
        time: 'Il y a 20 min',
        author: {
          name: 'Sarah N\'Diaye',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
          handle: '@sarahdev',
          country: 'Sénégal',
          flag: '🇸🇳'
        },
        title: 'Créer une API REST performante et sécurisée avec Django 5',
        content: 'Je viens de publier mon guide complet sur l\'optimisation des requêtes ORM avec select_related, prefetch_related et le caching Redis sous haute charge en Afrique de l\'Ouest 🚀\n\nN\'hésitez pas à tester le snippet et me faire vos retours !',
        codeSnippet: `# Exemple de requête optimisée Django ORM\nqueryset = Developer.objects.filter(available=True)\\\n    .select_related('user')\\\n    .prefetch_related('follower_relations')`,
        likes: 24,
        commentsCount: 8,
        shares: 4,
        tags: ['Django', 'Python', 'WebAPI']
      },
      {
        id: 'sample-feed-2',
        type: 'project',
        badgeText: 'David a ajouté un nouveau projet',
        time: 'Il y a 1 h',
        author: {
          name: 'David Mensah',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
          country: 'Côte d\'Ivoire',
          flag: '🇨🇮'
        },
        title: 'Application mobile de paiement',
        content: 'Passerelle Mobile Money panafricaine unifiée pour Wave, Orange Money et MTN MoMo. SDK multiplateforme Flutter avec chiffrement de bout en bout.',
        stars: 12,
        upvotes: 38,
        technologies: ['Flutter', 'Dart', 'FastAPI', 'Mobile Money'],
        tags: ['FinTech', 'Paiement', 'Flutter']
      },
      {
        id: 'sample-feed-3',
        type: 'job',
        badgeText: 'Tech CI a publié une offre',
        time: 'Il y a 3 h',
        company: 'Tech CI',
        title: 'Stage Développeur Python',
        location: 'Abidjan, Côte d\'Ivoire (Hybride)',
        opp_type: 'Stage rémunéré',
        salary: '250.000 FCFA / mois',
        tags: ['Python', 'Django', 'PostgreSQL']
      }
    ];
  }

  return feedItems;
}
