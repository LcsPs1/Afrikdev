import React, { useState } from 'react';
import {
  Globe,
  Users,
  MessageSquare,
  Check,
  Plus,
  Search,
  Sparkles,
  ArrowLeft,
  CalendarDays,
  MapPin,
  Wifi,
  Heart,
  Reply,
  Pin,
  ChevronRight,
  Send,
  X,
  Flame,
  Zap,
  Trophy,
  BookOpen,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  CheckCircle2,
  Clock,
  Settings,
  Trash2
} from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { AFRICAN_COUNTRIES } from '../data/africanCountries';
import { useTranslation } from '../i18n/LanguageContext';

// Détecte si un événement est passé
function isEventPast(dateStr) {
  if (!dateStr) return false;
  const end = new Date(`${dateStr}T23:59:59`);
  return !Number.isNaN(end.getTime()) && end.getTime() < Date.now();
}

function EventTypeIcon({ type }) {
  const map = {
    Meetup: <Users size={13} className="text-cyan" />,
    Workshop: <BookOpen size={13} className="text-amber" />,
    Hackathon: <Trophy size={13} className="text-amber" />,
    Conference: <Sparkles size={13} className="text-purple" />,
    CTF: <Shield size={13} className="text-rose" />
  };
  return map[type] || <CalendarDays size={13} className="text-cyan" />;
}

function formatEventDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Modal de création d'une nouvelle communauté
function CreateCommunityModal({ isOpen, onClose, onCreate, currentUser }) {
  const { t, language } = useTranslation();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [country, setCountry] = useState("Côte d'Ivoire");
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [membershipType, setMembershipType] = useState('open'); // 'open' | 'approval'

  if (!isOpen) return null;

  const handleNameChange = (val) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const selectedCountryObj = AFRICAN_COUNTRIES.find(c => c.name === country) || { name: 'Panafrique', code: 'un' };
    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newComm = {
      id: `comm-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || `comm-${Date.now()}`,
      country: selectedCountryObj.name,
      flag: selectedCountryObj.name === 'Panafrique' ? '🌍' : selectedCountryObj.name,
      description: description.trim(),
      tags: tags.length > 0 ? tags : ['Tech', 'Community'],
      membersCount: 1,
      postsThisWeek: 0,
      isMember: true,
      membershipType,
      creatorId: currentUser?.id || 'usr-me',
      creatorName: currentUser?.name || 'Jean Kouassi',
      creatorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=250&q=80',
      members: [
        {
          id: currentUser?.id || 'usr-me',
          name: currentUser?.name || 'Jean Kouassi',
          avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=250&q=80',
          title: currentUser?.title || 'Lead Full-Stack Developer',
          role: 'Fondateur / Admin',
          joinedAt: "Aujourd'hui"
        }
      ],
      pendingRequests: [],
      upcomingEvents: [],
      threads: []
    };

    onCreate(newComm);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <Globe size={20} className="text-cyan" />
            <h2 className="modal-title">{t('communities.modalCreateTitle', 'Fonder une nouvelle communauté')}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0 24px 12px', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
          {t('communities.modalCreateSubtitle', 'Créez un espace dédié pour fédérer des talents autour d\'une tech, d\'une ville ou d\'un enjeu africain.')}
        </div>

        <form onSubmit={handleSubmit} className="modal-body-form">
          <div className="form-group">
            <label className="form-label">{t('communities.commName', 'Nom de la communauté *')}</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Rust & WebAssembly Africa, React Abidjan, Nairobi AI Lab..."
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              required
              maxLength={80}
            />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">{t('communities.commSlug', 'Identifiant court (slug) *')}</label>
              <input
                type="text"
                className="form-input"
                placeholder="ex: rust-africa"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('communities.commCountry', 'Pays / Région de rattachement')}</label>
              <select
                className="form-input"
                value={country}
                onChange={e => setCountry(e.target.value)}
              >
                <option value="Panafrique">🌍 Panafrique / En ligne</option>
                {AFRICAN_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('communities.commType', 'Politique d\'adhésion')}</label>
            <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="membershipType"
                  value="open"
                  checked={membershipType === 'open'}
                  onChange={() => setMembershipType('open')}
                />
                <span>{t('communities.commTypeOpen', 'Ouverte (adhésion directe)')}</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="membershipType"
                  value="approval"
                  checked={membershipType === 'approval'}
                  onChange={() => setMembershipType('approval')}
                />
                <span>{t('communities.commTypeApproval', 'Sur approbation (vous validez les membres)')}</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('communities.commDesc', 'Description & Mission de la communauté *')}</label>
            <textarea
              rows={4}
              className="form-textarea"
              placeholder="Expliquez la vision, les activités prévues (meetups, code reviews, hackathons) et les profils recherchés..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('communities.commTags', 'Tags thématiques (séparés par des virgules)')}</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Rust, WebAssembly, Performance, Cloud"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
            />
          </div>

          <div className="modal-footer-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t('common.cancel', 'Annuler')}
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} />
              <span>{t('communities.createBtn', 'Créer la communauté')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NewThreadModal({ community, currentUser, onClose, onSubmit }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onSubmit({
      id: `th-${Date.now()}`,
      author: {
        name: currentUser?.name || 'Jean Kouassi',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=250&q=80',
        flag: currentUser?.flag || '🇨🇮'
      },
      title: title.trim(),
      body: body.trim(),
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean).slice(0, 4),
      likes: 0,
      replies: 0,
      isPinned: false,
      createdAt: "À l'instant"
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <MessageSquare size={20} className="text-cyan" />
            <h2 className="modal-title">{t('communities.newThread', 'Nouvelle discussion')}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '0 24px 12px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          Publier dans <strong style={{ color: 'var(--cyan-light)' }}>{community.name}</strong>
        </div>
        <form onSubmit={handleSubmit} className="modal-body-form">
          <div className="form-group">
            <label className="form-label">Titre de la discussion *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Retour d'expérience sur Django Channels en production..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              maxLength={120}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contenu *</label>
            <textarea
              rows={5}
              className="form-textarea"
              placeholder="Partagez vos connaissances, posez votre question ou lancez le débat..."
              value={body}
              onChange={e => setBody(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (séparés par des virgules)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Python, Django, Performance"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
            />
          </div>
          <div className="modal-footer-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary">
              <Send size={15} />
              <span>Publier la discussion</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ThreadCard({ thread, liked, onLike }) {
  return (
    <div className={`glass-card thread-card ${thread.isPinned ? 'thread-pinned' : ''}`}>
      {thread.isPinned && (
        <div className="thread-pin-indicator">
          <Pin size={12} />
          <span>Épinglé</span>
        </div>
      )}
      <div className="thread-author-row">
        <div className="thread-avatar-wrap">
          <img src={thread.author.avatar} alt={thread.author.name} className="thread-avatar" />
          <span className="avatar-online-dot online" title="En ligne" />
        </div>
        <div className="thread-author-info">
          <span className="thread-author-name">{thread.author.name}</span>
          <span className="thread-author-meta">
            <CountryFlag country={thread.author.country || thread.author.flag} size="xs" />
            <span>·</span>
            <span>{thread.createdAt}</span>
          </span>
        </div>
      </div>
      <h3 className="thread-title">{thread.title}</h3>
      <p className="thread-body">{thread.body}</p>
      <div className="thread-tags-row">
        {thread.tags.map(t => (
          <span key={t} className="badge-tag badge-sm">#{t}</span>
        ))}
      </div>
      <div className="thread-footer-row">
        <button className={`thread-action-btn ${liked ? 'liked' : ''}`} onClick={onLike}>
          <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
          <span>{thread.likes}</span>
        </button>
        <button className="thread-action-btn">
          <Reply size={14} />
          <span>{thread.replies} réponses</span>
        </button>
        <button className="thread-action-btn">
          <ChevronRight size={14} />
          <span>Lire la discussion</span>
        </button>
      </div>
    </div>
  );
}

function CommunityDetailView({
  community,
  currentUser,
  isAdminLoggedIn,
  onBack,
  onToggleMembership,
  onAddThread,
  onUpdateCommunity
}) {
  const { t } = useTranslation();
  const [showNewThread, setShowNewThread] = useState(false);
  const [threads, setThreads] = useState(community.threads || []);
  const [likedThreads, setLikedThreads] = useState({});
  const [activeTab, setActiveTab] = useState('threads'); // 'threads' | 'events' | 'members'

  const isCreatorOrAdmin =
    isAdminLoggedIn ||
    community.creatorId === currentUser?.id ||
    community.creatorName === currentUser?.name ||
    community.isCreator;

  const pendingRequests = community.pendingRequests || [];
  const membersList = community.members || [
    {
      id: community.creatorId || 'usr-me',
      name: community.creatorName || 'Jean Kouassi',
      avatar: community.creatorAvatar || 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?auto=format&fit=crop&w=250&q=80',
      title: 'Fondateur',
      role: 'Fondateur / Admin',
      joinedAt: 'Depuis le lancement'
    }
  ];

  const handleLike = (threadId) => {
    const wasLiked = !!likedThreads[threadId];
    setLikedThreads(prev => ({ ...prev, [threadId]: !wasLiked }));
    setThreads(prev => prev.map(t =>
      t.id === threadId ? { ...t, likes: wasLiked ? t.likes - 1 : t.likes + 1 } : t
    ));
  };

  const handleAddThread = (thread) => {
    setThreads(prev => [thread, ...prev]);
    onAddThread && onAddThread(community.id, thread);
  };

  // Accepter une demande d'adhésion
  const handleAcceptRequest = (req) => {
    const updatedMembers = [
      ...membersList,
      {
        id: req.id,
        name: req.name,
        avatar: req.avatar,
        title: req.title || 'Développeur',
        role: 'Membre',
        joinedAt: "Aujourd'hui"
      }
    ];
    const updatedPending = pendingRequests.filter(r => r.id !== req.id);
    onUpdateCommunity(community.id, {
      members: updatedMembers,
      pendingRequests: updatedPending,
      membersCount: community.membersCount + 1
    });
    alert(`Demande de ${req.name} acceptée avec succès !`);
  };

  // Refuser une demande d'adhésion
  const handleRejectRequest = (reqId) => {
    const updatedPending = pendingRequests.filter(r => r.id !== reqId);
    onUpdateCommunity(community.id, {
      pendingRequests: updatedPending
    });
  };

  // Retirer un membre de la communauté
  const handleRemoveMember = (memberId, memberName) => {
    if (confirm(`Êtes-vous sûr de vouloir retirer ${memberName} de la communauté ?`)) {
      const updatedMembers = membersList.filter(m => m.id !== memberId);
      onUpdateCommunity(community.id, {
        members: updatedMembers,
        membersCount: Math.max(1, community.membersCount - 1)
      });
    }
  };

  const pinnedThreads = threads.filter(t => t.isPinned);
  const regularThreads = threads.filter(t => !t.isPinned);

  return (
    <div className="community-detail-view">
      <button className="btn-back" onClick={onBack}>
        <ArrowLeft size={18} />
        <span>{t('common.back', 'Communautés')}</span>
      </button>

      <div className="glass-card community-detail-hero">
        <div className="community-detail-hero-top">
          <div className="community-detail-identity">
            <CountryFlag country={community.country || community.flag} size="xl" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 className="community-detail-title">{community.name}</h1>
                {isCreatorOrAdmin && (
                  <span className="badge-tag gold text-xs">
                    <Shield size={12} /> {t('communities.creatorBadge', 'Gestion Admin')}
                  </span>
                )}
              </div>
              <span className="community-slug">c/{community.slug}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className={`btn-pill-join ${community.isMember ? 'joined' : ''}`}
              style={{ width: 'auto', padding: '10px 24px' }}
              onClick={() => onToggleMembership(community.id)}
            >
              {community.isMember
                ? <><Check size={15} /><span>{t('common.joined', 'Membre actif')}</span></>
                : <><Plus size={15} /><span>{t('common.join', 'Rejoindre')}</span></>
              }
            </button>
          </div>
        </div>

        <p className="community-desc" style={{ marginBottom: 0 }}>{community.description}</p>

        <div className="community-detail-stats">
          <div className="comm-stat-block">
            <Users size={16} className="text-cyan" />
            <div><span className="comm-stat-num">{community.membersCount.toLocaleString()}</span><span className="comm-stat-label">{t('communities.members', 'membres')}</span></div>
          </div>
          <div className="comm-stat-block">
            <Flame size={16} className="text-amber" />
            <div><span className="comm-stat-num">{community.postsThisWeek}</span><span className="comm-stat-label">{t('communities.postsPerWeek', 'posts/semaine')}</span></div>
          </div>
          <div className="comm-stat-block">
            <CalendarDays size={16} className="text-green" />
            <div><span className="comm-stat-num">{community.upcomingEvents?.length || 0}</span><span className="comm-stat-label">{t('communities.events', 'événements')}</span></div>
          </div>
          <div className="comm-stat-block">
            <MessageSquare size={16} className="text-purple" />
            <div><span className="comm-stat-num">{threads.length}</span><span className="comm-stat-label">{t('communities.discussions', 'discussions')}</span></div>
          </div>
        </div>

        <div className="community-tags" style={{ marginBottom: 0 }}>
          {community.tags.map(t => <span key={t} className="badge-tag">#{t}</span>)}
        </div>
      </div>

      <div className="glass-card toolbar-box">
        <div className="filter-buttons">
          <button className={`filter-pill ${activeTab === 'threads' ? 'active' : ''}`} onClick={() => setActiveTab('threads')}>
            <MessageSquare size={14} /><span>Discussions ({threads.length})</span>
          </button>
          <button className={`filter-pill ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
            <CalendarDays size={14} /><span>Événements ({community.upcomingEvents?.length || 0})</span>
          </button>
          {isCreatorOrAdmin && (
            <button className={`filter-pill ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
              <Users size={14} className="text-amber" />
              <span>Gérer les membres ({membersList.length})</span>
              {pendingRequests.length > 0 && (
                <span className="notification-badge mini-badge">{pendingRequests.length}</span>
              )}
            </button>
          )}
        </div>

        {activeTab === 'threads' && (
          <button className="btn-primary btn-sm" onClick={() => setShowNewThread(true)}>
            <Plus size={15} /><span>{t('communities.newThread', 'Nouvelle discussion')}</span>
          </button>
        )}
      </div>

      {/* DISCUSSIONS TAB */}
      {activeTab === 'threads' && (
        <div className="community-threads-list">
          {pinnedThreads.length > 0 && (
            <>
              <div className="threads-section-label"><Pin size={13} className="text-amber" /><span>Épinglées</span></div>
              {pinnedThreads.map(t => <ThreadCard key={t.id} thread={t} liked={!!likedThreads[t.id]} onLike={() => handleLike(t.id)} />)}
              {regularThreads.length > 0 && <div className="threads-section-label" style={{ marginTop: 8 }}><Zap size={13} className="text-cyan" /><span>Récentes</span></div>}
            </>
          )}
          {regularThreads.map(t => <ThreadCard key={t.id} thread={t} liked={!!likedThreads[t.id]} onLike={() => handleLike(t.id)} />)}
          {threads.length === 0 && (
            <div className="empty-state-box">
              <MessageSquare size={40} style={{ opacity: 0.3 }} />
              <p>Aucune discussion pour l'instant.</p>
              <button className="btn-primary btn-sm" onClick={() => setShowNewThread(true)}><Plus size={14} /><span>Lancer la première discussion</span></button>
            </div>
          )}
        </div>
      )}

      {/* EVENTS TAB */}
      {activeTab === 'events' && (
        <div className="community-events-list">
          {(community.upcomingEvents || []).length === 0 ? (
            <div className="empty-state-box"><CalendarDays size={40} style={{ opacity: 0.3 }} /><p>Aucun événement prévu pour le moment.</p></div>
          ) : (
            community.upcomingEvents.map(event => (
              <div key={event.id} className="glass-card event-card-detail">
                <div className="event-card-header-row">
                  <div className="event-card-type-badge"><EventTypeIcon type={event.type} /><span>{event.type}</span></div>
                </div>
                <h3 className="event-card-title">{event.title}</h3>
                <div className="event-card-meta-row">
                  <span className="event-meta-item"><CalendarDays size={14} className="text-cyan" /><span>{formatEventDate(event.date)}</span></span>
                  <span className="event-meta-item">
                    {event.online ? <><Wifi size={14} className="text-green" /><span>En ligne</span></> : <><MapPin size={14} className="text-amber" /><span>{event.location}</span></>}
                  </span>
                  <span className="event-meta-item"><Users size={14} className="text-purple" /><span>{event.attendees} participants</span></span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MEMBERS & MODERATION TAB (POUR LE FONDATEUR / ADMIN) */}
      {activeTab === 'members' && isCreatorOrAdmin && (
        <div className="community-members-management">
          {/* Section Demandes d'adhésion */}
          <div className="glass-card mb-4" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} className="text-amber" />
              <span>{t('communities.membershipRequests', 'Demandes d\'adhésion en attente')} ({pendingRequests.length})</span>
            </h3>

            {pendingRequests.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                {t('communities.noPendingRequests', 'Aucune demande en attente.')}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingRequests.map(req => (
                  <div key={req.id} className="member-request-row glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={req.avatar} alt={req.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{req.name}</strong>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>{req.title} • {req.requestedAt}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-secondary btn-sm" onClick={() => handleRejectRequest(req.id)}>
                        <UserX size={14} className="text-rose" />
                        <span>{t('communities.rejectJoin', 'Refuser')}</span>
                      </button>
                      <button className="btn-primary btn-sm" onClick={() => handleAcceptRequest(req)}>
                        <UserCheck size={14} />
                        <span>{t('communities.acceptJoin', 'Accepter')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Membres Actuels */}
          <div className="glass-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={16} className="text-cyan" />
              <span>{t('communities.membersList', 'Membres de la communauté')} ({membersList.length})</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {membersList.map(member => (
                <div key={member.id} className="member-item-card glass-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <img src={member.avatar} alt={member.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {member.name}
                      </div>
                      <span className="badge-tag gold text-xs" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        {member.role || 'Membre'}
                      </span>
                    </div>
                  </div>

                  {member.id !== currentUser?.id && member.role !== 'Fondateur / Admin' && (
                    <button
                      className="icon-btn text-rose"
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      title={t('communities.removeMember', 'Retirer de la communauté')}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showNewThread && (
        <NewThreadModal
          community={community}
          currentUser={currentUser}
          onClose={() => setShowNewThread(false)}
          onSubmit={handleAddThread}
        />
      )}
    </div>
  );
}

export function CommunitiesSection({
  communities,
  setCommunities,
  currentUser,
  isAdminLoggedIn
}) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateCommunity = (newComm) => {
    setCommunities(prev => [newComm, ...prev]);
    setSelectedCommunity(newComm);
  };

  const handleUpdateCommunity = (commId, updates) => {
    setCommunities(prev => prev.map(c => (c.id === commId ? { ...c, ...updates } : c)));
    if (selectedCommunity?.id === commId) {
      setSelectedCommunity(prev => ({ ...prev, ...updates }));
    }
  };

  const toggleMembership = (commId) => {
    setCommunities(prev => prev.map(c => {
      if (c.id === commId) {
        const next = !c.isMember;
        return {
          ...c,
          isMember: next,
          membersCount: next ? c.membersCount + 1 : Math.max(1, c.membersCount - 1)
        };
      }
      return c;
    }));
    if (selectedCommunity?.id === commId) {
      setSelectedCommunity(prev => ({
        ...prev,
        isMember: !prev.isMember,
        membersCount: !prev.isMember ? prev.membersCount + 1 : Math.max(1, prev.membersCount - 1)
      }));
    }
  };

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (selectedCommunity) {
    const liveComm = communities.find(c => c.id === selectedCommunity.id) || selectedCommunity;
    return (
      <CommunityDetailView
        community={liveComm}
        currentUser={currentUser}
        isAdminLoggedIn={isAdminLoggedIn}
        onBack={() => setSelectedCommunity(null)}
        onToggleMembership={toggleMembership}
        onUpdateCommunity={handleUpdateCommunity}
        onAddThread={(commId, thread) => {
          setCommunities(prev => prev.map(c =>
            c.id === commId ? { ...c, threads: [thread, ...(c.threads || [])], postsThisWeek: c.postsThisWeek + 1 } : c
          ));
        }}
      />
    );
  }

  return (
    <div className="communities-container">
      <div className="section-head-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="badge-tag mb-2"><Globe size={13} /><span>{t('communities.badge', 'Hubs Nationaux & Thématiques')}</span></div>
          <h1 className="page-heading">{t('communities.title', 'Communautés Panafricaines')}</h1>
          <p className="page-subheading">
            {t('communities.subtitle', 'Connectez-vous aux cercles de développeurs par pays ou technologies pour participer aux meetups, hackathons et projets communs.')}
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
          style={{ whiteSpace: 'nowrap' }}
        >
          <Plus size={16} />
          <span>{t('communities.createBtn', 'Créer une communauté')}</span>
        </button>
      </div>

      <div className="glass-card toolbar-box">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={t('communities.searchPlaceholder', "Rechercher une communauté (ex: Côte d'Ivoire, React, Flutter, AI...)")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="communities-stats-row">
        <div className="comm-global-stat"><Users size={15} className="text-cyan" /><span>{communities.reduce((s, c) => s + c.membersCount, 0).toLocaleString()} {t('communities.activeMembers', 'membres actifs')}</span></div>
        <div className="comm-global-stat"><Flame size={15} className="text-amber" /><span>{communities.reduce((s, c) => s + c.postsThisWeek, 0)} {t('communities.postsThisWeekStat', 'posts cette semaine')}</span></div>
        <div className="comm-global-stat"><Check size={15} className="text-green" /><span>{communities.filter(c => c.isMember).length} {communities.filter(c => c.isMember).length === 1 ? t('communities.joinedCountSingle', 'communauté rejointe') : t('communities.joinedCountPlural', 'communautés rejointes')}</span></div>
      </div>

      <div className="communities-grid">
        {filteredCommunities.map((comm) => (
          <div key={comm.id} className="glass-card community-card">
            <div className="community-card-header">
              <CountryFlag country={comm.country || comm.flag} size="md" />
              <div className="community-names">
                <h3 className="community-title">{comm.name}</h3>
                <span className="community-slug">c/{comm.slug}</span>
              </div>
            </div>
            <p className="community-desc">{comm.description}</p>
            <div className="community-stats-row">
              <div className="stat-pill"><Users size={13} className="text-cyan" /><span>{comm.membersCount.toLocaleString()} {t('communities.members', 'membres')}</span></div>
              <div className="stat-pill"><MessageSquare size={13} className="text-amber" /><span>{comm.postsThisWeek} {t('communities.postsPerWeek', 'posts/sem.')}</span></div>
              {(comm.upcomingEvents?.length > 0) && (
                <div className="stat-pill"><CalendarDays size={13} className="text-green" /><span>{comm.upcomingEvents.length} {comm.upcomingEvents.length > 1 ? t('communities.eventPlural', 'événements') : t('communities.eventSingle', 'événement')}</span></div>
              )}
            </div>
            <div className="community-tags">
              {comm.tags.map(t => <span key={t} className="badge-tag">#{t}</span>)}
            </div>
            <div className="community-footer" style={{ display: 'flex', gap: 8 }}>
              <button className={`btn-pill-join ${comm.isMember ? 'joined' : ''}`} style={{ flex: 1 }} onClick={() => toggleMembership(comm.id)}>
                {comm.isMember ? <><Check size={14} /><span>{t('communities.activeMember', 'Membre actif')}</span></> : <><Plus size={14} /><span>{t('communities.join', 'Rejoindre')}</span></>}
              </button>
              <button className="btn-pill-join" style={{ flex: 1 }} onClick={() => setSelectedCommunity(comm)}>
                <ChevronRight size={14} /><span>{t('communities.explore', 'Explorer')}</span>
              </button>
            </div>
          </div>
        ))}
        {filteredCommunities.length === 0 && (
          <div className="empty-state-box" style={{ gridColumn: '1/-1' }}>
            <Search size={36} style={{ opacity: 0.3 }} />
            <p>{t('communities.noCommunityFound', 'Aucune communauté trouvée pour')} "{searchQuery}"</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateCommunityModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCommunity}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
