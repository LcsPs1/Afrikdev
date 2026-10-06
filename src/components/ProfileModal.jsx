import { useTranslation } from '../i18n/LanguageContext';
import { translateText, getTranslationAction } from '../services/translator';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  MapPin,
  Briefcase,
  Star,
  Send,
  CheckCircle2,
  Award,
  Sparkles,
  ExternalLink,
  LogOut,
  KeyRound,
  UserCheck,
  UserPlus,
  Info,
  ShieldCheck,
  AtSign,
  Mail,
  FolderGit2,
  FileText,
  Cpu,
  Check,
  Edit3,
  Camera,
  Save,
  Upload,
  User,
  Globe,
  Languages,
  Clock,
  Users,
  MoreHorizontal,
  UserX,
  VolumeX
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, FacebookIcon, GoogleIcon } from './SocialIcons';
import { CountryFlag } from './CountryFlag';
import { BADGES_CATALOG, getBadgeDetails } from '../data/badgesData';
import { AFRICAN_COUNTRIES } from '../data/africanCountries';
import { REAL_OAUTH_URLS } from '../data/oauthConfig';
import { DICEBEAR_AVATARS, DICEBEAR_CATEGORIES, AVATAR_PRESETS } from '../data/dicebearAvatars';
import { getPresenceStatus } from '../services/presenceService';
import {
  isFollowingDeveloper,
  toggleFollowDeveloper,
  formatFollowersCount,
  toggleBlockUser,
  toggleMuteUser
} from '../services/followService';

export function ProfileModal({
  isOpen,
  onClose,
  developer,
  isCurrentUser = false,
  initialEditing = false,
  onLogout,
  onSwitchAccount,
  onUpdateProfile,
  isUserLoggedIn = false,
  isRecruiterLoggedIn = false,
  onOpenAuth,
  onSendMessage
}) {
  const [contacted, setContacted] = useState(false);
  const [selectedBadgeDetail, setSelectedBadgeDetail] = useState(null);
  const { t, language } = useTranslation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(245);
  const [showAuthGateModal, setShowAuthGateModal] = useState(false);
  const [authGateAction, setAuthGateAction] = useState('follow'); // 'follow' | 'message'
  const [profileActiveTab, setProfileActiveTab] = useState('all'); // 'all' | 'projects' | 'posts' | 'skills'
  const [showFollowListModal, setShowFollowListModal] = useState(null); // null | 'followers' | 'following'
  const [showModerationMenu, setShowModerationMenu] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [editShowOnlineStatus, setEditShowOnlineStatus] = useState(true);
  const [editShowLastSeen, setEditShowLastSeen] = useState(true);
  const [isBioTranslated, setIsBioTranslated] = useState(false);
  const [isBioTranslating, setIsBioTranslating] = useState(false);
  const [cachedBioTranslation, setCachedBioTranslation] = useState('');

  // Réinitialiser la traduction de la bio au changement de langue ou de développeur
  useEffect(() => {
    setIsBioTranslated(false);
    setCachedBioTranslation('');
  }, [language, developer?.id]);

  const handleToggleTranslateBio = async () => {
    if (isBioTranslated) {
      setIsBioTranslated(false);
      return;
    }

    const action = getTranslationAction(developer.bio, language);
    if (!action.canTranslate) return;

    if (cachedBioTranslation) {
      setIsBioTranslated(true);
      return;
    }

    setIsBioTranslating(true);
    try {
      const res = await translateText(developer.bio, action.targetLang, action.sourceLang);
      setCachedBioTranslation(res);
      setIsBioTranslated(true);
    } catch (err) {
      console.warn("Échec traduction bio:", err);
    } finally {
      setIsBioTranslating(false);
    }
  };
  const [showCatalogModal, setShowCatalogModal] = useState(false);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [avatarUrlLoading, setAvatarUrlLoading] = useState(false);
  const [editCountry, setEditCountry] = useState("Côte d'Ivoire");
  const [editCity, setEditCity] = useState('');
  const [editSkills, setEditSkills] = useState('');
  const [editAvailable, setEditAvailable] = useState(true);
  const [editGithub, setEditGithub] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editFacebook, setEditFacebook] = useState('');
  const [editWebsite, setEditWebsite] = useState('');

  // Sync real accounts states
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubInput, setGithubInput] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubResult, setGithubResult] = useState(null);
  const [githubError, setGithubError] = useState('');

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  // Modals pour lier LinkedIn & Facebook via les boutons du bas
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);
  const [linkedinInput, setLinkedinInput] = useState('');
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [facebookInput, setFacebookInput] = useState('');

  // 60 Dicebear avatars category filter
  const [selectedAvatarCategory, setSelectedAvatarCategory] = useState('all');
  const filteredAvatars = selectedAvatarCategory === 'all'
    ? DICEBEAR_AVATARS
    : DICEBEAR_AVATARS.filter(a => a.category === selectedAvatarCategory);

  const handleStartEdit = () => {
    if (!developer) return;
    const rFullName = developer.fullName ||
      (developer.name && developer.name !== developer.username && developer.name !== developer.handle ? developer.name : 'Jean Luc Konan');
    const rUsername = (developer.username || developer.handle || (developer.name ? developer.name : 'LcsPs1')).replace(/^@/, '');
    setEditFullName(rFullName);
    setEditUsername(rUsername);
    setEditTitle(developer.title || 'Ingénieur Open Source & GitHub');
    setEditBio(developer.bio || '');
    setEditAvatar(developer.avatar || AVATAR_PRESETS[0]);
    setAvatarUrlInput('');
    setEditCountry(developer.country || "Côte d'Ivoire");
    setEditCity(developer.city || 'Abidjan');
    setEditSkills(
      (developer.skills || [])
        .map(s => (typeof s === 'string' ? s : s.name))
        .join(', ')
    );
    setEditAvailable(developer.available !== false);
    setEditGithub(developer.github || '');
    setEditLinkedin(developer.linkedin || '');
    setEditFacebook(developer.facebook || '');
    setEditWebsite(developer.website || '');
    setEditShowOnlineStatus(developer.show_online_status !== false && developer.showOnlineStatus !== false);
    setEditShowLastSeen(developer.show_last_seen !== false && developer.showLastSeen !== false);
    setIsEditing(true);
  };

  useEffect(() => {
    if (developer) {
      setFollowersCount(developer.followers_count || developer.stats?.followers || 245);
      setIsFollowing(isFollowingDeveloper(developer.id));
      setProfileActiveTab('all');
      setShowModerationMenu(false);
      setIsBlocked(false);
      setIsMuted(false);
    }
  }, [developer]);

  useEffect(() => {
    if (isOpen && initialEditing && isCurrentUser) {
      handleStartEdit();
    } else if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen, initialEditing, isCurrentUser, developer]);

  if (!isOpen || !developer) return null;

  // Distinct full name vs username (@pseudo)
  const rawFullName = developer.fullName ||
    (developer.name && developer.name !== developer.username && developer.name !== developer.handle ? developer.name : 'Jean Luc Konan');
  const rawUsername = (developer.username || developer.handle || (developer.name ? developer.name : 'LcsPs1')).replace(/^@/, '');
  const displayName = rawFullName;
  const presence = getPresenceStatus(developer, language);

  const sampleFollowers = [
    { id: 2, name: "Sarah N'Diaye", handle: "@sarahdev", country: "Sénégal", title: "Lead Backend · Django", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80" },
    { id: 4, name: "David Mensah", handle: "@davidm", country: "Côte d'Ivoire", title: "Mobile & Flutter Engineer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80" },
    { id: 5, name: "Fatou Diallo", handle: "@fatou_d", country: "Guinée", title: "Data & ML Engineer", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80" },
    { id: 6, name: "Amara Traoré", handle: "@amara_t", country: "Mali", title: "DevOps & Cloud Architect", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80" }
  ];

  const handleContact = () => {
    setContacted(true);
    setTimeout(() => {
      alert(`Message direct envoyé à ${displayName} ! Une notification lui a été transmise.`);
    }, 150);
  };

  const handleFollowToggle = async () => {
    if (!isUserLoggedIn && !isRecruiterLoggedIn) {
      setAuthGateAction('follow');
      setShowAuthGateModal(true);
      return;
    }
    try {
      const res = await toggleFollowDeveloper(developer, currentUser);
      setIsFollowing(res.following);
      setFollowersCount(c => res.following ? c + 1 : Math.max(0, c - 1));
    } catch (err) {
      alert(err.message || "Erreur lors de l'abonnement");
    }
  };

  const handleToggleBlock = () => {
    const res = toggleBlockUser(developer.id, currentUser);
    setIsBlocked(res.blocked);
    if (res.blocked) {
      setIsFollowing(false);
      alert(`${rawFullName} a été bloqué.`);
    } else {
      alert(`${rawFullName} a été débloqué.`);
    }
    setShowModerationMenu(false);
  };

  const handleToggleMute = () => {
    const res = toggleMuteUser(developer.id, currentUser);
    setIsMuted(res.muted);
    alert(res.muted ? `${rawFullName} a été mis en sourdine.` : `${rawFullName} n'est plus en sourdine.`);
    setShowModerationMenu(false);
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Veuillez sélectionner une image de moins de 3 Mo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditAvatar(event.target.result);
        setAvatarUrlInput('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFetchAvatarUrl = (e) => {
    if (e) e.preventDefault();
    const url = avatarUrlInput.trim();
    if (!url) {
      alert("Veuillez renseigner l'URL d'une image d'abord.");
      return;
    }
    setAvatarUrlLoading(true);
    const img = new Image();
    img.onload = () => {
      setEditAvatar(url);
      setAvatarUrlLoading(false);
    };
    img.onerror = () => {
      setAvatarUrlLoading(false);
      alert("Impossible de charger l'image depuis cette URL. Vérifiez que le lien est direct et accessible (jpg, png, webp, svg).");
    };
    img.src = url;
  };

  const handleRemoveCustomAvatar = () => {
    setEditAvatar(AVATAR_PRESETS[0]);
    setAvatarUrlInput('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editFullName.trim()) {
      alert("Veuillez renseigner votre nom complet.");
      return;
    }
    if (!editUsername.trim()) {
      alert("Veuillez renseigner votre nom d'utilisateur (pseudo).");
      return;
    }

    const cleanUsername = editUsername.trim().replace(/^@/, '');
    const parsedSkills = editSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(name => ({ name, level: "Avancé" }));

    const updatedFields = {
      name: editFullName.trim(),
      fullName: editFullName.trim(),
      username: cleanUsername,
      handle: `@${cleanUsername}`,
      title: editTitle.trim() || "Développeur",
      bio: editBio.trim() || developer.bio,
      avatar: editAvatar.trim() || developer.avatar,
      country: editCountry,
      city: editCity.trim() || "Abidjan",
      available: editAvailable,
      skills: parsedSkills.length > 0 ? parsedSkills : developer.skills,
      github: editGithub.trim() || developer.github,
      linkedin: editLinkedin.trim() || developer.linkedin,
      facebook: editFacebook.trim() || developer.facebook,
      website: editWebsite.trim() || developer.website,
      show_online_status: editShowOnlineStatus,
      showOnlineStatus: editShowOnlineStatus,
      show_last_seen: editShowLastSeen,
      showLastSeen: editShowLastSeen
    };

    if (onUpdateProfile) {
      onUpdateProfile(updatedFields);
    }
    setIsEditing(false);
  };

  // Deduplicate badges by title/id to avoid repetitions
  const rawBadges = (developer.badges || []).map(b => getBadgeDetails(b));
  const seenBadges = new Set();
  const devBadges = rawBadges.filter(badge => {
    if (!badge || !badge.title) return false;
    // Retirer le badge compte Google
    if (badge.title.toLowerCase().includes('google')) return false;
    const key = badge.title.trim().toLowerCase();
    if (seenBadges.has(key)) return false;
    seenBadges.add(key);
    return true;
  });

  const handleFetchGithub = async (e) => {
    e.preventDefault();
    if (!githubInput.trim()) return;
    setGithubLoading(true);
    setGithubError('');
    setGithubResult(null);

    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(githubInput.trim())}`);
      if (!res.ok) {
        throw new Error("Compte GitHub introuvable sur api.github.com. Vérifiez le pseudo.");
      }
      const data = await res.json();
      setGithubResult(data);
    } catch (err) {
      setGithubError(err.message || "Erreur de connexion à l'API GitHub.");
    } finally {
      setGithubLoading(false);
    }
  };

  const handleApplyGithub = () => {
    if (!githubResult) return;
    const existingBadges = developer.badges || [];
    const hasGhBadge = existingBadges.some(b => (b.id || b.title) === 'Open Source Lead');
    const updatedBadges = hasGhBadge
      ? existingBadges
      : [{ id: 'b-gh-sync', title: 'Open Source Lead', icon: '🚀', color: '#6366F1' }, ...existingBadges];

    if (onUpdateProfile) {
      onUpdateProfile({
        avatar: githubResult.avatar_url || developer.avatar,
        bio: githubResult.bio || developer.bio,
        github: githubResult.html_url || `https://github.com/${githubResult.login}`,
        projectsCount: githubResult.public_repos ?? developer.projectsCount,
        badges: updatedBadges,
        isGithubVerified: true
      });
    }
    setShowGithubModal(false);
    alert(`Profil mis à jour avec le compte GitHub réel @${githubResult.login} !`);
  };

  const handleApplyGoogle = (e) => {
    e.preventDefault();
    if (!googleEmailInput.trim() || !googleEmailInput.includes('@')) {
      alert("Veuillez renseigner une adresse email valide.");
      return;
    }

    if (onUpdateProfile) {
      onUpdateProfile({
        name: googleNameInput.trim() || displayName,
        googleEmail: googleEmailInput.trim(),
        isGoogleVerified: true
      });
    }
    setShowGoogleModal(false);
    alert(`Compte Google réel (${googleEmailInput.trim()}) associé à votre profil !`);
  };

  const handleApplyLinkedin = (e) => {
    e.preventDefault();
    let url = linkedinInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://linkedin.com/in/${url.replace(/^@/, '')}`;
    }
    if (onUpdateProfile) {
      onUpdateProfile({
        linkedin: url
      });
    }
    setShowLinkedinModal(false);
    alert("Profil LinkedIn associé avec succès !");
  };

  const handleApplyFacebook = (e) => {
    e.preventDefault();
    let url = facebookInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://facebook.com/${url.replace(/^@/, '')}`;
    }
    if (onUpdateProfile) {
      onUpdateProfile({
        facebook: url
      });
    }
    setShowFacebookModal(false);
    alert("Profil Facebook associé avec succès !");
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal-card" onClick={e => e.stopPropagation()}>
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="profile-edit-wrapper">
            <div className="profile-modal-banner edit-banner">
              <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-cyan" />
                <h3 className="modal-title" style={{ fontSize: '1.05rem', margin: 0 }}>Modifier mon profil</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn banner-close"
                onClick={() => setIsEditing(false)}
                title="Annuler les modifications"
              >
                <X size={20} />
              </button>
            </div>

            <div className="profile-modal-body profile-edit-scrollable">
              {/* Photo & Avatar Customization - Disposition spacieuse non coincée avec ombre élégante */}
              <div className="profile-section glass-card profile-avatar-edit-card">
                {/* Ligne supérieure : Avatar 1:1 + Contrôles URL/Fichier */}
                <div className="avatar-edit-top-row">
                  <div className="profile-avatar-wrapper edit-avatar-large">
                    <img
                      src={editAvatar || developer.avatar}
                      alt={editFullName || displayName}
                      className="profile-avatar-lg"
                      onError={(e) => {
                        e.target.src = AVATAR_PRESETS[0];
                      }}
                    />
                    <label className="profile-avatar-upload-badge" title="Importer une photo depuis vos fichiers">
                      <Camera size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  <div className="avatar-edit-controls">
                    <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: 4 }}>
                      Photo de profil (Lien direct ou Fichier) :
                    </label>
                    <div className="avatar-url-input-row">
                      <input
                        type="url"
                        className="form-input text-xs"
                        placeholder="Coller l'adresse d'une image..."
                        value={avatarUrlInput}
                        onChange={e => setAvatarUrlInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleFetchAvatarUrl();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn-primary text-xs"
                        onClick={handleFetchAvatarUrl}
                        disabled={avatarUrlLoading || !avatarUrlInput.trim()}
                        style={{ padding: '7px 16px', fontWeight: 700, whiteSpace: 'nowrap' }}
                        title="Récupérer la photo via le lien"
                      >
                        {avatarUrlLoading ? '...' : 'Go'}
                      </button>
                      <label className="btn-secondary text-xs" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px' }} title="Importer un fichier local">
                        <Upload size={13} />
                        <span>Fichier</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {editAvatar && (
                      <div className="avatar-aspect-note">
                        <span className="text-xs text-muted" style={{ fontSize: '0.74rem' }}>
                          ✓ Proportions 1:1 circulaires garanties (sans déformation)
                        </span>
                        <button
                          type="button"
                          className="text-xs text-rose"
                          onClick={handleRemoveCustomAvatar}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                          title="Supprimer la photo actuelle et remettre un avatar cartoon"
                        >
                          Retirer la photo
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section Pleine Largeur : 60 Avatars Dicebear avec filtres et grille spacieuse */}
                <div className="avatar-presets-bar">
                  <div className="avatar-presets-header">
                    <span className="avatar-presets-title">
                      🎨 Avatars Cartoon, Tech &amp; Shadows DiceBear
                    </span>
                    <span className="avatar-count-badge">
                      {filteredAvatars.length} / {DICEBEAR_AVATARS.length}
                    </span>
                  </div>

                  {/* Sélecteur de catégorie */}
                  <div className="avatar-category-pills">
                    {DICEBEAR_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`avatar-cat-pill ${selectedAvatarCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedAvatarCategory(cat.id)}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Galerie scrollable et spacieuse des 60 avatars */}
                  <div className="avatar-presets-grid-scroll">
                    {filteredAvatars.map((item) => {
                      const isSelected = editAvatar === item.url;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`avatar-preset-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setEditAvatar(item.url);
                            setAvatarUrlInput('');
                          }}
                          title={`${item.name} (${item.category})`}
                        >
                          <img
                            src={item.url}
                            alt={item.name}
                            className="avatar-preset-thumb"
                            loading="lazy"
                          />
                          <span className="avatar-preset-name">{item.name}</span>
                          {isSelected && <span className="avatar-check-badge">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Informations Générales */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Nom complet * :</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={editFullName}
                    onChange={e => setEditFullName(e.target.value)}
                    placeholder="Ex: Jean Luc Konan"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nom d'utilisateur / Pseudo (@) * :</label>
                  <div className="input-with-icon-wrapper" style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--cyan-light)', fontWeight: 700 }}>@</span>
                    <input
                      type="text"
                      required
                      className="form-input"
                      style={{ paddingLeft: 26 }}
                      value={editUsername}
                      onChange={e => setEditUsername(e.target.value)}
                      placeholder="LcsPs1"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Titre professionnel / Rôle tech * :</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Ex: Ingénieur Open Source & GitHub"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio & Parcours :</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  placeholder="Présentez votre parcours, vos technologies préférées et ce que vous construisez..."
                />
              </div>

              {/* Localisation & Disponibilité */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Pays :</label>
                  <select
                    className="form-input"
                    value={editCountry}
                    onChange={e => setEditCountry(e.target.value)}
                  >
                    {AFRICAN_COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ville :</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editCity}
                    onChange={e => setEditCity(e.target.value)}
                    placeholder="Ex: Abidjan, Dakar, Lagos..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Disponibilité :</label>
                  <select
                    className="form-input"
                    value={editAvailable ? 'true' : 'false'}
                    onChange={e => setEditAvailable(e.target.value === 'true')}
                  >
                    <option value="true">{language === 'en' ? 'Available for projects' : 'Disponible pour projets'}</option>
                    <option value="false">{language === 'en' ? 'Busy / On mission' : 'Occupé / En mission'}</option>
                  </select>
                </div>
              </div>

              {/* Compétences techniques */}
              <div className="form-group">
                <label className="form-label">Compétences techniques (séparées par des virgules) :</label>
                <input
                  type="text"
                  className="form-input"
                  value={editSkills}
                  onChange={e => setEditSkills(e.target.value)}
                  placeholder="Ex: React, Node.js, Python, Django, PostgreSQL, Docker, AWS"
                />
              </div>

              {/* Réseaux sociaux & Liens */}
              <div className="profile-section">
                <h4 className="profile-section-title" style={{ fontSize: '0.85rem', marginBottom: 10 }}>
                  Liens & Réseaux Sociaux
                </h4>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Lien GitHub :</label>
                    <input
                      type="url"
                      className="form-input text-xs"
                      value={editGithub}
                      onChange={e => setEditGithub(e.target.value)}
                      placeholder="https://github.com/votre-pseudo"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Lien LinkedIn :</label>
                    <input
                      type="url"
                      className="form-input text-xs"
                      value={editLinkedin}
                      onChange={e => setEditLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/votre-profil"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Lien Facebook :</label>
                    <input
                      type="url"
                      className="form-input text-xs"
                      value={editFacebook}
                      onChange={e => setEditFacebook(e.target.value)}
                      placeholder="https://facebook.com/votre-profil"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Site Web / Portfolio :</label>
                    <input
                      type="url"
                      className="form-input text-xs"
                      value={editWebsite}
                      onChange={e => setEditWebsite(e.target.value)}
                      placeholder="https://mon-site.tech"
                    />
                  </div>
                </div>

                {/* Confidentialité & Activité */}
                <div style={{
                  padding: '12px 14px',
                  background: 'rgba(6, 182, 212, 0.05)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: 14
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <ShieldCheck size={16} className="text-cyan" />
                    <strong style={{ fontSize: '0.88rem' }}>
                      {language === 'en' ? "Privacy & Activity Status" : "Confidentialité & Visibilité de l'activité"}
                    </strong>
                  </div>
                  <p className="text-xs text-muted" style={{ margin: '0 0 10px 0', lineHeight: 1.5 }}>
                    {language === 'en'
                      ? "Control who can see your live online presence and activity timestamps."
                      : "Contrôlez qui peut voir votre statut en direct et votre dernière activité sur AFRIKDEV."}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.84rem' }}>
                      <input
                        type="checkbox"
                        checked={editShowOnlineStatus}
                        onChange={e => setEditShowOnlineStatus(e.target.checked)}
                        style={{ accentColor: '#06B6D4', width: 16, height: 16 }}
                      />
                      <span>
                        <strong>{language === 'en' ? "Display 'Online' green dot" : "Afficher mon statut « En ligne » (point vert)"}</strong>
                        <span className="block text-xs text-muted">
                          {language === 'en' ? "Visible when active on the platform (< 2 minutes)." : "Visible quand vous êtes actif sur la plateforme (< 2 minutes)."}
                        </span>
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.84rem' }}>
                      <input
                        type="checkbox"
                        checked={editShowLastSeen}
                        onChange={e => setEditShowLastSeen(e.target.checked)}
                        style={{ accentColor: '#06B6D4', width: 16, height: 16 }}
                      />
                      <span>
                        <strong>{language === 'en' ? "Display last activity & connection" : "Afficher ma dernière activité"}</strong>
                        <span className="block text-xs text-muted">
                          {language === 'en' ? "Displays 'Active X min ago' and your last login date." : "Affiche « Actif il y a X min » et la date de votre dernière connexion."}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de validation */}
            <div className="modal-footer profile-edit-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <Save size={15} />
                <span>Enregistrer mon profil</span>
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Banner with gradient & close */}
            <div className="profile-modal-banner">
              {isCurrentUser && (
                <button
                  type="button"
                  className="banner-edit-profile-btn"
                  onClick={handleStartEdit}
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(0, 0, 0, 0.55)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                  title="Modifier mon profil"
                >
                  <Edit3 size={13} className="text-cyan" />
                  <span>{language === 'en' ? "Edit Profile" : "Modifier mon profil"}</span>
                </button>
              )}
              <button className="modal-close-btn banner-close" onClick={onClose} title="Fermer">
                <X size={20} />
              </button>
            </div>

            {/* Profile Header (Z-index ensures full name is always on top and never hidden behind banner) */}
            <div className="profile-modal-header">
              <div className="profile-avatar-wrapper">
                <img
                  src={developer.avatar}
                  alt={rawFullName}
                  className="profile-avatar-lg"
                  onError={(e) => {
                    e.target.src = AVATAR_PRESETS[0];
                  }}
                />
                {presence.canShowStatus && (
                  <span
                    className={`status-dot-lg ${presence.dotClass} ${presence.isOnline ? 'online' : 'busy'} ${isCurrentUser ? 'with-camera' : ''}`}
                    title={presence.label}
                  />
                )}
                {isCurrentUser && (
                  <button
                    type="button"
                    className="profile-avatar-camera-btn"
                    onClick={handleStartEdit}
                    title="Modifier ma photo de profil"
                  >
                    <Camera size={13} />
                  </button>
                )}
              </div>

              <div className="profile-header-info">
                <div className="profile-name-row">
                  <h2 className="profile-modal-name">{rawFullName}</h2>
                  <CountryFlag country={developer.country} size="sm" />
                  {isCurrentUser && (
                    <button
                      type="button"
                      className="profile-edit-badge-btn"
                      onClick={handleStartEdit}
                      title="Modifier mes informations"
                    >
                      <Edit3 size={13} />
                      <span>Modifier</span>
                    </button>
                  )}
                </div>
                <div className="profile-modal-handle">@{rawUsername}</div>

                {/* Statut de présence dynamique (🟢 En ligne / ⚪ Actif il y a X min / ⚪ Hors ligne) */}
                {presence.canShowStatus && (
                  <div style={{ margin: '6px 0 6px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className={`profile-live-status-pill ${presence.dotClass}`}>
                      <span className={`live-status-dot ${presence.dotClass}`} />
                      <span>{presence.label}</span>
                    </span>

                    {presence.lastLoginFormatted && (
                      <span
                        className="profile-last-login-tag"
                        title="Dernière connexion enregistrée"
                      >
                        <Clock size={11} className="text-cyan" />
                        <span>{presence.lastLoginFormatted}</span>
                      </span>
                    )}
                  </div>
                )}

                <div className="profile-modal-title">{developer.title || "Ingénieur Open Source & GitHub"}</div>

                {/* Followers and Following (ex: 1.2K Followers · 356 Following) */}
                <div className="profile-followers-row">
                  <button
                    type="button"
                    className="profile-counter-btn"
                    onClick={() => setShowFollowListModal('followers')}
                    title="Voir la liste des abonnés"
                  >
                    <strong className="profile-counter-num">{formatFollowersCount(followersCount)}</strong>{' '}
                    <span className="profile-counter-label">{language === 'en' ? 'Followers' : 'Followers'}</span>
                  </button>
                  <span className="text-muted">•</span>
                  <button
                    type="button"
                    className="profile-counter-btn"
                    onClick={() => setShowFollowListModal('following')}
                    title="Voir la liste des abonnements"
                  >
                    <strong className="profile-counter-num">{formatFollowersCount(developer.following_count || developer.followingCount || developer.stats?.following || 182)}</strong>{' '}
                    <span className="profile-counter-label">{language === 'en' ? 'Following' : 'Following'}</span>
                  </button>
                </div>

                <div className="profile-modal-location">
                  <MapPin size={14} className="text-cyan" />
                  <span>{developer.city || 'Abidjan'}, {developer.country || "Côte d'Ivoire"}</span>
                </div>
              </div>
            </div>

            {/* Onglets de navigation : Projets · Publications · Compétences */}
            <div className="profile-subnav-strip">
              <button
                type="button"
                className={`profile-subtab-btn ${profileActiveTab === 'all' ? 'active' : ''}`}
                onClick={() => setProfileActiveTab('all')}
              >
                <span>{language === 'en' ? 'Overview' : 'Aperçu'}</span>
              </button>
              <button
                type="button"
                className={`profile-subtab-btn ${profileActiveTab === 'projects' ? 'active' : ''}`}
                onClick={() => setProfileActiveTab('projects')}
              >
                <FolderGit2 size={14} />
                <span>{language === 'en' ? 'Projects' : 'Projets'}</span>
              </button>
              <button
                type="button"
                className={`profile-subtab-btn ${profileActiveTab === 'posts' ? 'active' : ''}`}
                onClick={() => setProfileActiveTab('posts')}
              >
                <FileText size={14} />
                <span>{language === 'en' ? 'Publications' : 'Publications'}</span>
              </button>
              <button
                type="button"
                className={`profile-subtab-btn ${profileActiveTab === 'skills' ? 'active' : ''}`}
                onClick={() => setProfileActiveTab('skills')}
              >
                <Cpu size={14} />
                <span>{language === 'en' ? 'Skills' : 'Compétences'}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="profile-modal-body">
              {/* Bio avec traduction à la demande */}
              {profileActiveTab === 'all' && (
                <div className="profile-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h4 className="profile-section-title" style={{ margin: 0 }}>
                      {language === 'en' ? "Bio & Journey" : "Bio & Parcours"}
                    </h4>
                    {developer?.bio && (() => {
                      const action = getTranslationAction(developer.bio, language);
                      if (!action.canTranslate && !isBioTranslated) return null;

                      return (
                        <button
                          type="button"
                          className="bio-translate-btn"
                          onClick={handleToggleTranslateBio}
                          disabled={isBioTranslating}
                          title={isBioTranslated ? action.showOriginalLabel : action.buttonLabel}
                          style={{
                            background: isBioTranslated ? 'rgba(16, 185, 129, 0.12)' : 'rgba(6, 182, 212, 0.08)',
                            border: `1px solid ${isBioTranslated ? 'rgba(16, 185, 129, 0.35)' : 'rgba(6, 182, 212, 0.25)'}`,
                            borderRadius: 'var(--radius-sm)',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            color: isBioTranslated ? '#34d399' : 'var(--cyan-light)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <Languages size={12} />
                          <span>
                            {isBioTranslating
                              ? action.translatingLabel
                              : isBioTranslated
                                ? action.showOriginalLabel
                                : action.buttonLabel}
                          </span>
                        </button>
                      );
                    })()}
                  </div>

                  {isBioTranslated && (
                    <div style={{ fontSize: '0.72rem', color: '#34d399', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>🌐</span>
                      <span>{language === 'en' ? "Bio translated on-demand via API" : "Bio traduite à la demande via l'API"}</span>
                    </div>
                  )}

                  <p className="profile-bio-text">
                    {isBioTranslated ? (cachedBioTranslation || developer.bio) : developer.bio}
                  </p>
                </div>
              )}

              {/* Stats Bar */}
              {profileActiveTab === 'all' && (
                <div className="profile-stats-row glass-card">
                  <div className="stat-box">
                    <span className="stat-val text-amber">{developer.reputation || 1420}</span>
                    <span className="stat-lbl">{language === 'en' ? "Reputation Points" : "Points Réputation"}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-val text-cyan">{developer.projectsCount || 6}</span>
                    <span className="stat-lbl">{language === 'en' ? "Projects Built" : "Projets réalisés"}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-val text-green">{developer.available !== false ? "Disponible" : "Occupé"}</span>
                    <span className="stat-lbl">{language === 'en' ? "Collab Status" : "Statut Collab"}</span>
                  </div>
                </div>
              )}

              {/* Section Projets phares */}
              {(profileActiveTab === 'all' || profileActiveTab === 'projects') && (
                <div className="profile-section">
                  <div className="profile-section-header-row">
                    <h4 className="profile-section-title">
                      {language === 'en' ? "Projects & Open Source" : "Projets & Open Source"}
                    </h4>
                    <span className="badge-tag">
                      <FolderGit2 size={12} />
                      <span>{developer.projectsCount || 4} {language === 'en' ? 'projects' : 'projets'}</span>
                    </span>
                  </div>

                  <div className="profile-projects-list">
                    <div className="profile-project-card glass-card">
                      <div className="profile-proj-top">
                        <div className="profile-proj-title-row">
                          <strong className="profile-proj-name">Passerelle Mobile Money Multi-Opérateurs</strong>
                          <span className="project-status-pill dev">🚀 En production</span>
                        </div>
                        <span className="profile-proj-stars">⭐ 142</span>
                      </div>
                      <p className="profile-proj-desc">
                        Passerelle de paiement panafricaine unifiée pour Wave, Orange Money et MTN MoMo. SDK Python & Flutter avec webhooks et chiffrement.
                      </p>
                      <div className="profile-proj-techs">
                        <span className="tech-badge">Python</span>
                        <span className="tech-badge">FastAPI</span>
                        <span className="tech-badge">Flutter</span>
                        <span className="tech-badge">Mobile Money</span>
                      </div>
                    </div>

                    <div className="profile-project-card glass-card">
                      <div className="profile-proj-top">
                        <div className="profile-proj-title-row">
                          <strong className="profile-proj-name">AfrikTranslate - Moteur IA Local</strong>
                          <span className="project-status-pill dev">🔨 En développement</span>
                        </div>
                        <span className="profile-proj-stars">⭐ 89</span>
                      </div>
                      <p className="profile-proj-desc">
                        Modèle NLP open source de traduction pour les langues africaines (Baoulé, Dioula, Wolof, Yoruba) avec inférence locale rapide.
                      </p>
                      <div className="profile-proj-techs">
                        <span className="tech-badge">PyTorch</span>
                        <span className="tech-badge">HuggingFace</span>
                        <span className="tech-badge">Django</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Publications récents */}
              {(profileActiveTab === 'all' || profileActiveTab === 'posts') && (
                <div className="profile-section">
                  <div className="profile-section-header-row">
                    <h4 className="profile-section-title">
                      {language === 'en' ? "Recent Posts & Snippets" : "Publications & Snippets"}
                    </h4>
                    <span className="badge-tag">
                      <FileText size={12} />
                      <span>{language === 'en' ? "Feed Activity" : "Activité sur le fil"}</span>
                    </span>
                  </div>

                  <div className="profile-posts-list">
                    <div className="profile-post-card glass-card">
                      <div className="profile-post-head">
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-color)' }}>
                          Optimiser ses requêtes SQL sous Django ORM pour fort trafic
                        </strong>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Il y a 2 jours</span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '6px 0 10px 0', lineHeight: 1.5 }}>
                        Toujours privilégier <code>select_related</code> sur les clés étrangères simples et <code>prefetch_related</code> sur les relations ManyToMany afin de bannir les requêtes N+1.
                      </p>
                      <pre className="profile-code-preview">
                        <code>{`# Requête optimisée\nDeveloper.objects.select_related('user').prefetch_related('skills')`}</code>
                      </pre>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: 8 }}>
                        <span>👍 24 j'aime</span>
                        <span>💬 8 commentaires</span>
                        <span>🔗 Partagé</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills with levels */}
              {(profileActiveTab === 'all' || profileActiveTab === 'skills') && (
                <div className="profile-section">
                  <h4 className="profile-section-title">{language === 'en' ? "Technical Skills" : "Compétences techniques"}</h4>
                  <div className="profile-skills-grid">
                    {(developer.skills || []).map(skill => {
                      const skillName = typeof skill === 'string' ? skill : skill.name;
                      const skillLevel = typeof skill === 'object' ? skill.level : 'Avancé';
                      return (
                        <div key={skillName} className="skill-level-card">
                          <span className="skill-name">{skillName}</span>
                          <span className="skill-level-pill">{skillLevel}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Badges and recognitions */}
              {(profileActiveTab === 'all' || profileActiveTab === 'skills') && devBadges.length > 0 && (
                <div className="profile-section">
                  <div className="profile-section-header-row">
                    <h4 className="profile-section-title">{language === 'en' ? "Badges & Distinctions" : "Badges & Distinctions"}</h4>
                    <button
                      type="button"
                      className="profile-catalog-trigger-btn"
                      onClick={() => setShowCatalogModal(true)}
                      title="Voir les 14 badges et leurs critères d'obtention"
                    >
                      <Sparkles size={13} className="text-amber" />
                      <span>{language === 'en' ? "Guide & Criteria" : "Guide & Critères d'obtention"}</span>
                    </button>
                  </div>

                  <div className="badges-row">
                    {devBadges.map(badge => (
                      <div
                        key={badge.id || badge.title}
                        className="badge-item glass-card clickable-badge-item"
                        onClick={() => setSelectedBadgeDetail(badge)}
                        title={`Cliquez pour découvrir le critère d'obtention de "${badge.title}"`}
                        style={{ '--badge-border': badge.color || '#06B6D4' }}
                      >
                        <span className="badge-icon">{badge.icon}</span>
                        <span className="badge-text">{badge.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comptes Associés & Synchronisation Réelle (GitHub & Google) - Masqué pour les visiteurs, visible uniquement pour le propriétaire */}
              {isCurrentUser && (
                <div className="profile-section">
                  <h4 className="profile-section-title">
                    {language === 'en' ? "Linked Accounts & Identity" : "Comptes Associés & Authentification"}
                  </h4>
                  <div className="profile-oauth-cards-grid">
                    {/* Carte GitHub */}
                    <div className={`profile-oauth-card ${developer.isGithubVerified ? 'connected' : ''}`}>
                      <div className="oauth-card-header">
                        <div className="oauth-icon-badge github">
                          <GithubIcon size={20} />
                        </div>
                        <div className="oauth-card-info">
                          <div className="oauth-title-row">
                            <span className="oauth-provider-name">GitHub</span>
                            {developer.isGithubVerified ? (
                              <span className="oauth-status-badge verified">✓ GitHub connecté</span>
                            ) : (
                              <span className="oauth-status-badge unlinked">Non lié</span>
                            )}
                          </div>
                          {developer.isGithubVerified ? (
                            <a
                              href={developer.github || `https://github.com/${developer.githubUsername || developer.username || 'afrikdev'}`}
                              target="_blank"
                              rel="noreferrer"
                              className="oauth-subtitle gh-link-subtitle"
                              style={{ color: 'var(--cyan-light)', textDecoration: 'underline' }}
                            >
                              {(developer.github || `https://github.com/${developer.githubUsername || developer.username || 'afrikdev'}`).replace(/^https?:\/\//, '')}
                            </a>
                          ) : (
                            <span className="oauth-subtitle">
                              {language === 'en' ? "Sync repos, commits & badges" : "Synchroniser dépôts, commits & badges"}
                            </span>
                          )}
                        </div>
                      </div>

                      {developer.isGithubVerified && (
                        <div className="profile-github-stats-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, margin: '8px 0 10px', padding: '8px 10px', background: 'rgba(0, 0, 0, 0.25)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                          <div className="gh-stat-chip">
                            <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--cyan-light)' }}>
                              {developer.projectsCount || 12}
                            </strong>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'lowercase' }}>repositories</span>
                          </div>
                          <div className="gh-stat-chip">
                            <strong style={{ display: 'block', fontSize: '0.88rem', color: '#34d399' }}>
                              {developer.contributionsCount || 347}
                            </strong>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'lowercase' }}>contributions</span>
                          </div>
                          <div className="gh-stat-chip">
                            <strong style={{ display: 'block', fontSize: '0.88rem', color: '#fbbf24' }}>
                              {developer.projectsCount ? Math.max(1, Math.round(developer.projectsCount * 0.7)) : 8}
                            </strong>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'lowercase' }}>projets</span>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        className={`btn-sm ${developer.isGithubVerified ? 'btn-secondary' : 'btn-primary'} w-full`}
                        onClick={() => {
                          setGithubInput(developer.githubUsername || developer.username || '');
                          setGithubResult(null);
                          setGithubError('');
                          setShowGithubModal(true);
                        }}
                      >
                        {developer.isGithubVerified
                          ? (language === 'en' ? "Gérer le compte" : "Gérer le compte")
                          : (language === 'en' ? "Lier compte GitHub" : "Lier compte GitHub réel")}
                      </button>
                    </div>

                    {/* Carte Google */}
                    <div className={`profile-oauth-card ${developer.isGoogleVerified ? 'connected' : ''}`}>
                      <div className="oauth-card-header">
                        <div className="oauth-icon-badge google">
                          <GoogleIcon size={20} />
                        </div>
                        <div className="oauth-card-info">
                          <div className="oauth-title-row">
                            <span className="oauth-provider-name">Google / Gmail</span>
                            {developer.isGoogleVerified ? (
                              <span className="oauth-status-badge verified">✓ Vérifié</span>
                            ) : (
                              <span className="oauth-status-badge unlinked">Non lié</span>
                            )}
                          </div>
                          <span className="oauth-subtitle">
                            {developer.isGoogleVerified && (developer.googleEmail || developer.email)
                              ? (developer.googleEmail || developer.email)
                              : (language === 'en' ? "Official Google OAuth & 2FA" : "Sécurité & 2FA officielle")}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`btn-sm ${developer.isGoogleVerified ? 'btn-secondary' : 'btn-primary'} w-full`}
                        onClick={() => {
                          setGoogleEmailInput(developer.googleEmail || developer.email || '');
                          setGoogleNameInput(displayName);
                          setShowGoogleModal(true);
                        }}
                      >
                        {developer.isGoogleVerified
                          ? (language === 'en' ? "Gérer le compte" : "Gérer le compte")
                          : (language === 'en' ? "Lier compte Google" : "Lier compte Google/Gmail")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Links & Contact */}
              <div className="profile-footer-actions">
                <div className="social-links-group">
                  {/* GitHub */}
                  <a
                    href={developer.github || "https://github.com"}
                    target="_blank"
                    rel="noreferrer"
                    className={`social-icon-btn ${developer.github ? 'connected' : ''}`}
                    title={developer.github ? `GitHub: ${developer.github}` : "GitHub"}
                  >
                    <GithubIcon size={18} />
                  </a>

                  {/* LinkedIn - Permet de lier le compte pour le propriétaire */}
                  {isCurrentUser ? (
                    <button
                      type="button"
                      className={`social-icon-btn ${developer.linkedin ? 'connected' : ''}`}
                      onClick={() => {
                        setLinkedinInput(developer.linkedin || '');
                        setShowLinkedinModal(true);
                      }}
                      title={developer.linkedin ? `LinkedIn : ${developer.linkedin} (Cliquer pour modifier)` : "Lier mon compte LinkedIn"}
                      style={{ position: 'relative' }}
                    >
                      <LinkedinIcon size={18} />
                      {!developer.linkedin && <span className="social-link-plus-badge">+</span>}
                    </button>
                  ) : (
                    <a
                      href={developer.linkedin || "#"}
                      target={developer.linkedin ? "_blank" : "_self"}
                      rel="noreferrer"
                      className={`social-icon-btn ${developer.linkedin ? 'connected' : 'disabled'}`}
                      onClick={(e) => {
                        if (!developer.linkedin) {
                          e.preventDefault();
                          alert("Ce développeur n'a pas encore renseigné son profil LinkedIn.");
                        }
                      }}
                      title={developer.linkedin ? `LinkedIn : ${developer.linkedin}` : "LinkedIn non renseigné"}
                    >
                      <LinkedinIcon size={18} />
                    </a>
                  )}

                  {/* Facebook - Permet de lier le compte pour le propriétaire */}
                  {isCurrentUser ? (
                    <button
                      type="button"
                      className={`social-icon-btn ${developer.facebook ? 'connected' : ''}`}
                      onClick={() => {
                        setFacebookInput(developer.facebook || '');
                        setShowFacebookModal(true);
                      }}
                      title={developer.facebook ? `Facebook : ${developer.facebook} (Cliquer pour modifier)` : "Lier mon compte Facebook"}
                      style={{ position: 'relative' }}
                    >
                      <FacebookIcon size={18} />
                      {!developer.facebook && <span className="social-link-plus-badge">+</span>}
                    </button>
                  ) : (
                    <a
                      href={developer.facebook || "#"}
                      target={developer.facebook ? "_blank" : "_self"}
                      rel="noreferrer"
                      className={`social-icon-btn ${developer.facebook ? 'connected' : 'disabled'}`}
                      onClick={(e) => {
                        if (!developer.facebook) {
                          e.preventDefault();
                          alert("Ce développeur n'a pas encore renseigné son profil Facebook.");
                        }
                      }}
                      title={developer.facebook ? `Facebook : ${developer.facebook}` : "Facebook non renseigné"}
                    >
                      <FacebookIcon size={18} />
                    </a>
                  )}
                </div>

                {isCurrentUser ? (
                  <div className="profile-current-user-actions">
                    <button
                      type="button"
                      className="btn-primary profile-action-btn"
                      onClick={handleStartEdit}
                      title="Modifier mon profil complet"
                    >
                      <Edit3 size={15} />
                      <span>{language === 'en' ? "Edit Profile" : "Modifier mon profil"}</span>
                    </button>

                    {onSwitchAccount && (
                      <button
                        type="button"
                        className="btn-secondary profile-action-btn"
                        onClick={onSwitchAccount}
                        title="Changer de compte ou se reconnecter"
                      >
                        <KeyRound size={15} />
                        <span>{language === 'en' ? "Switch Account" : "Changer de compte"}</span>
                      </button>
                    )}
                    {onLogout && (
                      <button
                        type="button"
                        className="btn-secondary profile-action-btn text-rose"
                        onClick={onLogout}
                        title="Se déconnecter d'AfrikDev"
                      >
                        <LogOut size={15} />
                        <span>{language === 'en' ? "Log Out" : "Déconnexion"}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                    {/* Bouton Suivre */}
                    <button
                      type="button"
                      className={`btn-secondary profile-follow-action-btn ${isFollowing ? 'active followed' : ''}`}
                      onClick={handleFollowToggle}
                      style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck size={16} className="text-cyan" />
                          <span>{language === 'en' ? "Following ✓" : "Abonné ✓"}</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          <span>{language === 'en' ? "Follow" : "Suivre"}</span>
                        </>
                      )}
                    </button>

                    {/* Bouton Message */}
                    <button
                      type="button"
                      className={`btn-primary ${contacted ? 'btn-contacted' : ''}`}
                      onClick={() => {
                        if (!isUserLoggedIn && !isRecruiterLoggedIn) {
                          setAuthGateAction('message');
                          setShowAuthGateModal(true);
                          return;
                        }
                        if (onSendMessage) {
                          onSendMessage(developer);
                        } else {
                          setContacted(true);
                          setTimeout(() => setContacted(false), 3000);
                        }
                      }}
                      style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      {contacted ? (
                        <>
                          <CheckCircle2 size={16} />
                          <span>{language === 'en' ? "Message Sent" : "Message transmis"}</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>{language === 'en' ? "Message" : "Message"}</span>
                        </>
                      )}
                    </button>

                    {/* Menu modération / Plus d'options (Block / Mute) */}
                    <div style={{ position: 'relative' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setShowModerationMenu(prev => !prev)}
                        title="Options de sécurité et modération"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {showModerationMenu && (
                        <div
                          className="profile-moderation-dropdown glass-card"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="profile-mod-item"
                            onClick={handleToggleMute}
                          >
                            <VolumeX size={14} className="text-amber" />
                            <span>{isMuted ? "Ne plus masquer ce profil" : "Mettre en sourdine"}</span>
                          </button>
                          <button
                            type="button"
                            className="profile-mod-item text-rose"
                            onClick={handleToggleBlock}
                          >
                            <UserX size={14} />
                            <span>{isBlocked ? "Débloquer cet utilisateur" : "Bloquer cet utilisateur"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Modal Détail d'un badge sélectionné */}
        {selectedBadgeDetail && (
          <div className="badge-detail-popover-overlay" onClick={() => setSelectedBadgeDetail(null)}>
            <div className="badge-detail-popover glass-card" onClick={e => e.stopPropagation()}>
              <div className="badge-detail-header">
                <div className="badge-detail-icon-circle" style={{ borderColor: selectedBadgeDetail.color }}>
                  <span>{selectedBadgeDetail.icon}</span>
                </div>
                <div className="badge-detail-headings">
                  <span className="badge-detail-cat">{selectedBadgeDetail.category}</span>
                  <h3 className="badge-detail-title">{selectedBadgeDetail.title}</h3>
                </div>
                <button
                  className="badge-detail-close-btn"
                  onClick={() => setSelectedBadgeDetail(null)}
                >
                  <X size={16} />
                </button>
              </div>

              <p className="badge-detail-desc">{selectedBadgeDetail.description}</p>

              <div className="badge-detail-criteria-box">
                <div className="badge-criteria-label">
                  <Award size={14} className="text-amber" />
                  <span>Comment obtenir ce badge :</span>
                </div>
                <p className="badge-criteria-text">{selectedBadgeDetail.howToEarn}</p>
              </div>

              <div className="badge-detail-footer">
                <span className="badge-unlocked-tag">
                  <CheckCircle2 size={13} />
                  <span>Débloqué sur ce profil</span>
                </span>
                <button
                  type="button"
                  className="btn-secondary text-xs"
                  onClick={() => {
                    setSelectedBadgeDetail(null);
                    setShowCatalogModal(true);
                  }}
                >
                  Voir tous les 14 badges
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Catalogue complet des badges */}
        {showCatalogModal && (
          <div className="badge-catalog-modal-overlay" onClick={() => setShowCatalogModal(false)}>
            <div className="badge-catalog-modal glass-card" onClick={e => e.stopPropagation()}>
              <div className="badge-catalog-modal-header">
                <div className="flex items-center gap-3">
                  <div className="badge-catalog-icon-box">
                    <Sparkles size={20} className="text-amber" />
                  </div>
                  <div>
                    <h3 className="badge-catalog-modal-title">Système de Badges AfrikDev</h3>
                    <p className="badge-catalog-modal-subtitle">
                      14 distinctions officielles récompensant l'expertise, la communauté et l'impact tech en Afrique.
                    </p>
                  </div>
                </div>
                <button
                  className="badge-detail-close-btn"
                  onClick={() => setShowCatalogModal(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="badge-catalog-grid">
                {BADGES_CATALOG.map(badge => {
                  const isEarnedByDev = devBadges.some(b => b.id === badge.id || b.title.toLowerCase() === badge.title.toLowerCase());
                  return (
                    <div
                      key={badge.id}
                      className={`badge-catalog-card ${isEarnedByDev ? 'earned' : 'locked'}`}
                      style={{ '--badge-theme': badge.color }}
                    >
                      <div className="badge-catalog-card-top">
                        <span className="badge-catalog-icon">{badge.icon}</span>
                        <div className="badge-catalog-card-info">
                          <span className="badge-catalog-cat">{badge.category}</span>
                          <h4 className="badge-catalog-name">{badge.title}</h4>
                        </div>
                        {isEarnedByDev ? (
                          <span className="badge-status-pill earned" title="Débloqué">
                            <CheckCircle2 size={12} /> Obtenu
                          </span>
                        ) : (
                          <span className="badge-status-pill locked" title="À débloquer">
                            À débloquer
                          </span>
                        )}
                      </div>

                      <p className="badge-catalog-desc">{badge.description}</p>

                      <div className="badge-catalog-how">
                        <strong>🎯 Comment l'obtenir :</strong>
                        <span>{badge.howToEarn}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Modal Synchronisation GitHub Réel API */}
        {showGithubModal && (
          <div className="modal-overlay" onClick={() => setShowGithubModal(false)}>
            <div className="modal-panel" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="flex items-center gap-2">
                  <GithubIcon size={20} />
                  <h3 className="modal-title">Lier un Compte GitHub Réel</h3>
                </div>
                <button className="modal-close-btn" onClick={() => setShowGithubModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-subtext">
                Interrogez l'API officielle GitHub pour importer votre photo de profil, vos projets publics et obtenir le badge <strong>Open Source Lead</strong>.
              </div>

              <form onSubmit={handleFetchGithub} className="modal-body-form">
                <div className="form-group">
                  <label className="form-label">Nom d'utilisateur GitHub réel :</label>
                  <div className="input-with-icon-wrapper">
                    <AtSign size={16} className="input-leading-icon" />
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="ex: torvalds, gaearon, ou votre pseudo"
                      value={githubInput}
                      onChange={e => setGithubInput(e.target.value)}
                      className="admin-input has-leading-icon"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button type="submit" className="btn-secondary" style={{ flex: 1 }} disabled={githubLoading}>
                    {githubLoading ? <span>Recherche API...</span> : <span>Interroger GitHub</span>}
                  </button>
                </div>
              </form>

              {githubError && (
                <div className="sync-error-notice">
                  {githubError}
                </div>
              )}

              {githubResult && (
                <div className="sync-result-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <img
                      src={githubResult.avatar_url}
                      alt={githubResult.login}
                      className="sync-result-avatar"
                    />
                    <div>
                      <div className="sync-result-name">
                        {githubResult.name || githubResult.login}
                      </div>
                      <div className="sync-result-handle">
                        @{githubResult.login} · {githubResult.public_repos || 0} dépôts publics
                      </div>
                    </div>
                  </div>
                  {githubResult.bio && (
                    <p className="sync-result-bio">
                      "{githubResult.bio}"
                    </p>
                  )}
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={handleApplyGithub}
                  >
                    <Check size={16} />
                    <span>Appliquer les données GitHub à mon profil</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Lier Google / Gmail Réel */}
        {showGoogleModal && (
          <div className="modal-overlay" onClick={() => setShowGoogleModal(false)}>
            <div className="modal-panel" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="flex items-center gap-2">
                  <GoogleIcon size={20} />
                  <h3 className="modal-title">Lier un Compte Google / Gmail</h3>
                </div>
                <button className="modal-close-btn" onClick={() => setShowGoogleModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-subtext">
                Associez votre adresse Google réelle pour certifier votre identité et afficher le badge officiel <strong>Compte Google Vérifié</strong>.
              </div>

              <form onSubmit={handleApplyGoogle} className="modal-body-form">
                <div className="form-group">
                  <label className="form-label">Nom complet affiché :</label>
                  <div className="input-with-icon-wrapper">
                    <UserCheck size={16} className="input-leading-icon" />
                    <input
                      type="text"
                      placeholder=""
                      value={googleNameInput}
                      onChange={e => setGoogleNameInput(e.target.value)}
                      className="admin-input has-leading-icon"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Adresse Gmail réelle :</label>
                  <div className="input-with-icon-wrapper">
                    <Mail size={16} className="input-leading-icon" />
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder=""
                      value={googleEmailInput}
                      onChange={e => setGoogleEmailInput(e.target.value)}
                      className="admin-input has-leading-icon"
                    />
                  </div>
                </div>

                <div className="modal-footer-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowGoogleModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    <Check size={16} />
                    <span>Enregistrer et Valider</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Lier LinkedIn Réel */}
        {showLinkedinModal && (
          <div className="modal-overlay" onClick={() => setShowLinkedinModal(false)}>
            <div className="modal-panel" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="flex items-center gap-2">
                  <LinkedinIcon size={20} />
                  <h3 className="modal-title">Lier un Compte LinkedIn</h3>
                </div>
                <button className="modal-close-btn" onClick={() => setShowLinkedinModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-subtext">
                Renseignez l'adresse de votre profil ou votre identifiant LinkedIn pour permettre à vos pairs et recruteurs de vous contacter.
              </div>

              <form onSubmit={handleApplyLinkedin} className="modal-body-form">
                <div className="form-group">
                  <label className="form-label">Profil LinkedIn (URL ou identifiant) :</label>
                  <div className="input-with-icon-wrapper">
                    <ExternalLink size={16} className="input-leading-icon" />
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="ex: linkedin.com/in/jean-luc-konan ou jean-luc-konan"
                      value={linkedinInput}
                      onChange={e => setLinkedinInput(e.target.value)}
                      className="admin-input has-leading-icon"
                    />
                  </div>
                </div>

                <div className="modal-footer-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowLinkedinModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    <Check size={16} />
                    <span>Associer LinkedIn</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Lier Facebook Réel */}
        {showFacebookModal && (
          <div className="modal-overlay" onClick={() => setShowFacebookModal(false)}>
            <div className="modal-panel" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="flex items-center gap-2">
                  <FacebookIcon size={20} />
                  <h3 className="modal-title">Lier un Compte Facebook</h3>
                </div>
                <button className="modal-close-btn" onClick={() => setShowFacebookModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-subtext">
                Associez votre page ou profil Facebook pour élargir votre présence dans la communauté tech.
              </div>

              <form onSubmit={handleApplyFacebook} className="modal-body-form">
                <div className="form-group">
                  <label className="form-label">Profil Facebook (URL ou identifiant) :</label>
                  <div className="input-with-icon-wrapper">
                    <ExternalLink size={16} className="input-leading-icon" />
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="ex: facebook.com/jeanluc.konan ou jeanluc.konan"
                      value={facebookInput}
                      onChange={e => setFacebookInput(e.target.value)}
                      className="admin-input has-leading-icon"
                    />
                  </div>
                </div>

                <div className="modal-footer-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowFacebookModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    <Check size={16} />
                    <span>Associer Facebook</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modale d'invitation à se connecter pour les visiteurs non connectés */}
        {showAuthGateModal && (
          <div className="modal-overlay" onClick={() => setShowAuthGateModal(false)} style={{ zIndex: 1300 }}>
            <div className="modal-panel glass-card" style={{ maxWidth: 440, padding: '24px 20px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <ShieldCheck size={26} className="text-cyan" />
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8 }}>
                {language === 'en' ? "Authentication Required" : "Connexion requise"}
              </h3>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                {authGateAction === 'follow'
                  ? (language === 'en'
                    ? "Sign in or create a free account to follow this developer and see their latest code and projects in your feed."
                    : "Connectez-vous ou créez un compte gratuit pour suivre ce développeur et retrouver ses publications dans votre fil d'actualités.")
                  : (language === 'en'
                    ? "Sign in or create a free account to send direct private messages to this developer."
                    : "Connectez-vous ou créez un compte gratuit pour échanger directement en privé avec ce développeur.")}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  type="button"
                  className="btn-primary w-full"
                  onClick={() => {
                    setShowAuthGateModal(false);
                    if (onOpenAuth) onOpenAuth('login');
                  }}
                >
                  {language === 'en' ? "Sign In" : "Se connecter"}
                </button>

                <button
                  type="button"
                  className="btn-secondary w-full"
                  onClick={() => {
                    setShowAuthGateModal(false);
                    if (onOpenAuth) onOpenAuth('register');
                  }}
                >
                  {language === 'en' ? "Create a free Account" : "Créer un compte gratuit"}
                </button>

                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    marginTop: 4
                  }}
                  onClick={() => setShowAuthGateModal(false)}
                >
                  {language === 'en' ? "Continue browsing as guest" : "Continuer en tant que visiteur"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modale d'affichage des Abonnés / Abonnements */}
        {showFollowListModal && (
          <div className="modal-overlay" onClick={() => setShowFollowListModal(null)} style={{ zIndex: 1350 }}>
            <div className="modal-panel glass-card" style={{ maxWidth: 460, maxHeight: '82vh', display: 'flex', flexDirection: 'column', padding: '20px 22px' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={18} className="text-cyan" />
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                    {showFollowListModal === 'followers'
                      ? (language === 'en' ? `Followers (${followersCount})` : `Abonnés (${followersCount})`)
                      : (language === 'en' ? `Following (${developer.following_count || 182})` : `Abonnements (${developer.following_count || 182})`)}
                  </h3>
                </div>
                <button className="modal-close-btn" onClick={() => setShowFollowListModal(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ overflowY: 'auto', padding: '14px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sampleFollowers.map(user => {
                  const followingThis = isFollowingDeveloper(user.id);
                  return (
                    <div key={user.id} className="follow-user-item glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={user.avatar} alt={user.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <strong style={{ fontSize: '0.88rem', color: 'var(--text-color)' }}>{user.name}</strong>
                            <CountryFlag country={user.country} size="xs" />
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{user.title}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`btn-sm ${followingThis ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ fontSize: '0.74rem', padding: '4px 12px' }}
                        onClick={() => {
                          toggleFollowDeveloper(user, currentUser);
                          setShowFollowListModal(curr => (curr === 'followers' ? 'followers' : 'following'));
                        }}
                      >
                        {followingThis ? (language === 'en' ? "Following ✓" : "Abonné ✓") : (language === 'en' ? "Follow" : "Suivre")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
