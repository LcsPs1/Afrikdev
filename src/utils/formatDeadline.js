export function formatDeadline(deadline) {
  if (!deadline) return null;
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Retourne le statut détaillé d'une deadline.
 * @param {string} deadline  - format "YYYY-MM-DD"
 * @returns {{ closed: boolean, label: string, urgency: 'expired'|'today'|'urgent'|'soon'|'normal'|null }}
 */
export function getDeadlineStatus(deadline) {
  if (!deadline) return { closed: false, label: null, urgency: null };

  const end = new Date(`${deadline}T23:59:59`);
  if (Number.isNaN(end.getTime())) return { closed: false, label: null, urgency: null };

  const now = Date.now();
  const diffMs = end.getTime() - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const formattedDate = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  if (diffMs < 0) {
    return { closed: true, label: `Clôturé le ${formattedDate}`, urgency: 'expired' };
  }
  if (diffDays === 0) {
    return { closed: false, label: `Expire aujourd'hui à minuit`, urgency: 'today' };
  }
  if (diffDays === 1) {
    return { closed: false, label: `Dernier jour — expire demain`, urgency: 'urgent' };
  }
  if (diffDays <= 5) {
    return { closed: false, label: `Dans ${diffDays} jours — ${formattedDate}`, urgency: 'soon' };
  }
  return { closed: false, label: `Jusqu'au ${formattedDate}`, urgency: 'normal' };
}
