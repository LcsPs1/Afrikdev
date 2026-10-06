/**
 * Service de gestion de présence et d'activité utilisateur pour AFRIKDEV
 * Calcule dynamiquement le statut :
 *  - 🟢 En ligne (< 2 min)
 *  - ⚪ Actif il y a 5 min (2 - 10 min)
 *  - ⚪ Hors ligne — il y a 2 h (1 - 24 h)
 *  - ⚪ Hors ligne — hier (24 - 48 h)
 *  - ⚪ Hors ligne — 02 oct. (> 48 h)
 *  - Dernière connexion : JJ mmm. AAAA à HH:MM
 * Prend en compte les préférences de confidentialité (showOnlineStatus, showLastSeen).
 */

const MONTHS_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatLastLogin(dateInput, language = 'fr') {
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;

  const day = String(d.getDate()).padStart(2, '0');
  const month = (language === 'en' ? MONTHS_EN : MONTHS_FR)[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  if (language === 'en') {
    return `Last login: ${month} ${day}, ${year} at ${hours}:${minutes}`;
  }
  return `Dernière connexion : ${day} ${month} ${year} à ${hours}:${minutes}`;
}

export function getPresenceStatus(developer, language = 'fr') {
  if (!developer) {
    return {
      isOnline: false,
      statusType: 'offline',
      label: language === 'en' ? 'Offline' : 'Hors ligne',
      dotClass: 'gray',
      lastLoginFormatted: null,
      canShowStatus: true,
      canShowLastSeen: true
    };
  }

  // Paramètres de confidentialité
  const showOnlineStatus = developer.showOnlineStatus !== false && developer.show_online_status !== false;
  const showLastSeen = developer.showLastSeen !== false && developer.show_last_seen !== false;

  // Si l'utilisateur a désactivé toute visibilité
  if (!showOnlineStatus && !showLastSeen) {
    return {
      isOnline: false,
      statusType: 'hidden',
      label: language === 'en' ? 'Member' : 'Membre AFRIKDEV',
      dotClass: 'none',
      lastLoginFormatted: null,
      canShowStatus: false,
      canShowLastSeen: false
    };
  }

  const now = Date.now();
  let lastSeenMs = null;

  if (developer.last_seen || developer.lastSeen) {
    const parsed = new Date(developer.last_seen || developer.lastSeen).getTime();
    if (!isNaN(parsed)) lastSeenMs = parsed;
  }

  // Détermination du temps écoulé
  const diffSec = lastSeenMs ? Math.max(0, Math.floor((now - lastSeenMs) / 1000)) : null;
  const diffMin = diffSec !== null ? Math.floor(diffSec / 60) : null;
  const diffHours = diffMin !== null ? Math.floor(diffMin / 60) : null;

  // Calcul du format de dernière connexion
  const lastLoginRaw = developer.last_login || developer.lastLogin;
  const lastLoginFormatted = showLastSeen ? formatLastLogin(lastLoginRaw, language) : null;

  // Cas 1 : En ligne (< 2 minutes d'inactivité)
  const isOnlineCondition = (diffMin !== null && diffMin < 2) || (developer.is_online === true && diffMin === null);
  if (isOnlineCondition && showOnlineStatus) {
    return {
      isOnline: true,
      statusType: 'online',
      label: language === 'en' ? 'Online' : 'En ligne',
      dotClass: 'green',
      lastLoginFormatted,
      canShowStatus: true,
      canShowLastSeen: showLastSeen
    };
  }

  // Si l'utilisateur n'autorise pas l'affichage de sa dernière activité
  if (!showLastSeen) {
    return {
      isOnline: false,
      statusType: 'offline',
      label: language === 'en' ? 'Offline' : 'Hors ligne',
      dotClass: 'gray',
      lastLoginFormatted: null,
      canShowStatus: showOnlineStatus,
      canShowLastSeen: false
    };
  }

  // Cas 2 : Actif récemment (entre 2 et 10 minutes)
  if (diffMin !== null && diffMin <= 10) {
    return {
      isOnline: false,
      statusType: 'recent',
      label: language === 'en' ? `Active ${diffMin}m ago` : `Actif il y a ${diffMin} min`,
      dotClass: 'gray',
      lastLoginFormatted,
      canShowStatus: true,
      canShowLastSeen: true
    };
  }

  // Cas 3 : Actif dans l'heure (11 - 60 minutes)
  if (diffMin !== null && diffMin < 60) {
    return {
      isOnline: false,
      statusType: 'recent',
      label: language === 'en' ? `Active ${diffMin}m ago` : `Actif il y a ${diffMin} min`,
      dotClass: 'gray',
      lastLoginFormatted,
      canShowStatus: true,
      canShowLastSeen: true
    };
  }

  // Cas 4 : Hors ligne il y a X h (< 24 heures)
  if (diffHours !== null && diffHours < 24) {
    return {
      isOnline: false,
      statusType: 'offline',
      label: language === 'en' ? `Offline — ${diffHours}h ago` : `Hors ligne — il y a ${diffHours} h`,
      dotClass: 'gray',
      lastLoginFormatted,
      canShowStatus: true,
      canShowLastSeen: true
    };
  }

  // Cas 5 : Hors ligne — hier (< 48 heures)
  if (diffHours !== null && diffHours < 48) {
    return {
      isOnline: false,
      statusType: 'offline',
      label: language === 'en' ? 'Offline — yesterday' : 'Hors ligne — hier',
      dotClass: 'gray',
      lastLoginFormatted,
      canShowStatus: true,
      canShowLastSeen: true
    };
  }

  // Cas 6 : Hors ligne depuis plus longtemps
  if (lastSeenMs) {
    const d = new Date(lastSeenMs);
    const day = String(d.getDate()).padStart(2, '0');
    const month = (language === 'en' ? MONTHS_EN : MONTHS_FR)[d.getMonth()];
    return {
      isOnline: false,
      statusType: 'offline',
      label: language === 'en' ? `Offline — ${month} ${day}` : `Hors ligne — ${day} ${month}`,
      dotClass: 'gray',
      lastLoginFormatted,
      canShowStatus: true,
      canShowLastSeen: true
    };
  }

  return {
    isOnline: false,
    statusType: 'offline',
    label: language === 'en' ? 'Offline' : 'Hors ligne',
    dotClass: 'gray',
    lastLoginFormatted,
    canShowStatus: true,
    canShowLastSeen: true
  };
}

/**
 * Envoie un battement de coeur (Heartbeat / Ping) au serveur Django
 */
export async function sendHeartbeat(currentUser) {
  if (!currentUser) return null;

  try {
    const payload = {
      developer_id: currentUser.id || null,
      email: currentUser.email || null
    };

    const res = await fetch('http://localhost:8000/api/developers/heartbeat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Mode hors-ligne / fallback local
  }
  return null;
}
