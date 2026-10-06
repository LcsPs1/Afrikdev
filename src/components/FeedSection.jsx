import { translateText, getTranslationAction } from '../services/translator';
import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Code2, 
  Send, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Filter, 
  Users, 
  Terminal, 
  Copy,
  Clock,
  Flame,
  ShieldCheck,
  Layers,
  ArrowRight,
  ExternalLink,
  Languages,
  Star,
  Building2,
  Briefcase,
  Bell,
  Eye
} from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { useTranslation } from '../i18n/LanguageContext';
import { SponsoredAdCard } from './SponsoredAdCard';
import { OFFICIAL_ADS } from '../data/officialAdsData';
import { getPersonalizedFeed } from '../services/followService';

// Formatted Post Content with rich code & bullet highlights
function FormattedPostText({ content }) {
  if (!content) return null;
  const lines = content.split('\n');

  return (
    <div className="post-text-flow">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="post-spacer" />;
        }

        const isLead = idx === 0 || trimmed.startsWith('🚀') || trimmed.startsWith('🤝') || trimmed.startsWith('💡') || trimmed.startsWith('🔥');
        const isListItem = /^[0-9]+\.\s|^-\s/.test(trimmed);

        // Split on backticks for inline code
        const chunks = line.split(/(`[^`]+`)/g);

        return (
          <p
            key={idx}
            className={`post-paragraph ${isLead ? 'post-lead-line' : ''} ${isListItem ? 'post-list-item' : ''}`}
          >
            {chunks.map((chunk, cIdx) => {
              if (chunk.startsWith('`') && chunk.endsWith('`')) {
                return (
                  <code key={cIdx} className="post-inline-code">
                    {chunk.slice(1, -1)}
                  </code>
                );
              }

              // Highlight hashtags like #Django, #AfricaTech
              const words = chunk.split(/(#[a-zA-Z0-9_]+)/g);
              return words.map((w, wIdx) => {
                if (w.startsWith('#')) {
                  return (
                    <span key={wIdx} className="post-text-hashtag">
                      {w}
                    </span>
                  );
                }
                return w;
              });
            })}
          </p>
        );
      })}
    </div>
  );
}

export function FeedSection({ posts, setPosts, currentUser, onOpenNewPost, onSelectDeveloper, projects = [], opportunities = [] }) {
  const { t, language } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [translatedPostIds, setTranslatedPostIds] = useState(new Set());
  const [loadingPostTranslations, setLoadingPostTranslations] = useState(new Set());
  const [liveTranslations, setLiveTranslations] = useState({});
  const [translatedCommentIds, setTranslatedCommentIds] = useState(new Set());
  const [loadingCommentTranslations, setLoadingCommentTranslations] = useState(new Set());
  const [followingFeedItems, setFollowingFeedItems] = useState([]);

  React.useEffect(() => {
    setFollowingFeedItems(getPersonalizedFeed(posts, projects, opportunities));
  }, [posts, projects, opportunities, activeFilter]);

  // Réinitialiser les états traduits lors d'un basculement de langue UI
  React.useEffect(() => {
    setTranslatedPostIds(new Set());
    setTranslatedCommentIds(new Set());
  }, [language]);

  // Traduction à la demande d'une publication (API appelée UNIQUEMENT lors du clic utilisateur)
  const handleTranslatePost = async (post) => {
    const postId = post.id;
    if (translatedPostIds.has(postId)) {
      // Revenir au texte original de l'auteur
      setTranslatedPostIds(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
      return;
    }

    const action = getTranslationAction(post.content, language);
    if (!action.canTranslate) return;

    const cacheKey = `${action.targetLang}_${postId}`;
    // Déjà traduit en cache mémoire ?
    if (liveTranslations[cacheKey] || (language === 'en' && post.contentEn)) {
      setTranslatedPostIds(prev => new Set(prev).add(postId));
      return;
    }

    // Appel à l'API de traduction uniquement à la demande
    setLoadingPostTranslations(prev => new Set(prev).add(postId));
    try {
      const translated = await translateText(post.content, action.targetLang, action.sourceLang);
      setLiveTranslations(prev => ({ 
        ...prev, 
        [cacheKey]: translated,
        [postId]: translated 
      }));
      setTranslatedPostIds(prev => new Set(prev).add(postId));
    } catch (err) {
      console.warn("Échec de traduction de la publication:", err);
    } finally {
      setLoadingPostTranslations(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };

  // Traduction à la demande d'un commentaire
  const handleTranslateComment = async (comment) => {
    const commentKey = `c_${comment.id}`;
    if (translatedCommentIds.has(commentKey)) {
      setTranslatedCommentIds(prev => {
        const next = new Set(prev);
        next.delete(commentKey);
        return next;
      });
      return;
    }

    const action = getTranslationAction(comment.text, language);
    if (!action.canTranslate) return;

    const cacheKey = `${action.targetLang}_${commentKey}`;
    if (liveTranslations[cacheKey] || liveTranslations[commentKey]) {
      setTranslatedCommentIds(prev => new Set(prev).add(commentKey));
      return;
    }

    setLoadingCommentTranslations(prev => new Set(prev).add(commentKey));
    try {
      const translated = await translateText(comment.text, action.targetLang, action.sourceLang);
      setLiveTranslations(prev => ({ 
        ...prev, 
        [cacheKey]: translated,
        [commentKey]: translated 
      }));
      setTranslatedCommentIds(prev => new Set(prev).add(commentKey));
    } catch (err) {
      console.warn("Échec de traduction du commentaire:", err);
    } finally {
      setLoadingCommentTranslations(prev => {
        const next = new Set(prev);
        next.delete(commentKey);
        return next;
      });
    }
  };

  // Like interaction
  const handleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.likedByUser;
        return {
          ...p,
          likedByUser: nextLiked,
          likes: nextLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  // Copy code snippet to clipboard
  const handleCopyCode = (snippet, id) => {
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Add comment
  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: `c-${Date.now()}`,
          author: currentUser.name,
          time: "À l'instant",
          avatar: currentUser.avatar,
          text
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  // Filter posts
  const filteredPosts = posts.filter(p => {
    if (selectedTag) {
      return p.tags && p.tags.includes(selectedTag);
    }
    if (activeFilter === 'collab') {
      return p.tags && (p.tags.includes('OpenSource') || p.content.toLowerCase().includes('collaborat'));
    }
    if (activeFilter === 'code') {
      return !!p.codeSnippet;
    }
    return true;
  });

  const trendingTopics = [
    { tag: "AfricaTech", count: "240 posts", hot: true },
    { tag: "Django", count: "142 posts", hot: true },
    { tag: "MobileMoney", count: "98 posts", hot: true },
    { tag: "Flutter", count: "85 posts", hot: false },
    { tag: "PostgreSQL", count: "74 posts", hot: false },
    { tag: "FastAPI", count: "62 posts", hot: false },
    { tag: "OpenSource", count: "190 posts", hot: true }
  ];

  return (
    <div className="feed-layout">
      {/* Center Feed Column */}
      <div className="feed-main-col">
        {/* Quick Post Prompt Card */}
        <div className="glass-card quick-post-box">
          <div className="quick-post-header">
            <div className="quick-post-avatar-wrap">
              <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar-sm" />
              <span className="avatar-online-dot online" title="Connecté (En ligne)" />
            </div>
            <button 
              className="quick-post-input-mock" 
              onClick={onOpenNewPost}
            >
              {language === 'en' ? "Share a tech tip, code snippet or collaborate..." : "Partager une astuce tech, un snippet de code ou une collaboration..."}
            </button>
          </div>
          <div className="quick-post-actions">
            <button className="quick-action-btn" onClick={onOpenNewPost}>
              <Code2 size={16} className="text-cyan" />
              <span>{language === 'en' ? "Code snippet" : "Snippet de code"}</span>
            </button>
            <button className="quick-action-btn" onClick={onOpenNewPost}>
              <Users size={16} className="text-amber" />
              <span>{language === 'en' ? "Find teammate" : "Chercher coéquipier"}</span>
            </button>
            <button 
              className="btn-primary btn-sm ml-auto" 
              onClick={onOpenNewPost}
              style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: '#FFFFFF'
              }}
            >
              {language === 'en' ? "+ Publish" : "+ Publier"}
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="feed-filters-bar">
          <div className="filter-buttons">
            <button 
              className={`filter-pill ${activeFilter === 'all' && !selectedTag ? 'active' : ''}`}
              onClick={() => { setActiveFilter('all'); setSelectedTag(null); }}
            >
              <Layers size={14} />
              <span>{language === 'en' ? "All feeds" : "Tous les flux"}</span>
            </button>
            <button 
              className={`filter-pill ${activeFilter === 'following' ? 'active' : ''}`}
              onClick={() => { setActiveFilter('following'); setSelectedTag(null); }}
            >
              <Users size={14} className="text-cyan" />
              <span>{language === 'en' ? "Your Feed (Following)" : "Votre fil (Abonnements)"}</span>
              <span className="pill-badge-highlight">{language === 'en' ? "Network" : "Réseau"}</span>
            </button>
            <button 
              className={`filter-pill ${activeFilter === 'code' ? 'active' : ''}`}
              onClick={() => { setActiveFilter('code'); setSelectedTag(null); }}
            >
              <Terminal size={14} />
              <span>{language === 'en' ? "Tips & Code" : "Astuces & Code"}</span>
            </button>
            <button 
              className={`filter-pill ${activeFilter === 'collab' ? 'active' : ''}`}
              onClick={() => { setActiveFilter('collab'); setSelectedTag(null); }}
            >
              <Users size={14} />
              <span>Collaborations</span>
            </button>
          </div>

          {selectedTag && (
            <div className="active-tag-indicator">
              <span>#{selectedTag}</span>
              <button onClick={() => setSelectedTag(null)} title="Effacer le filtre">×</button>
            </div>
          )}
        </div>

        {/* Mobile Horizontal Trending Topics Chips (Visible uniquement sur mobile/tablette) */}
        <div className="mobile-trending-bar">
          <span className="mobile-trending-label">🔥 {language === 'en' ? 'Trends:' : 'Tendances :'}</span>
          <div className="mobile-trending-scroll">
            {trendingTopics.map(topic => (
              <button
                key={topic.tag}
                type="button"
                className={`mobile-trend-chip ${selectedTag === topic.tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(selectedTag === topic.tag ? null : topic.tag)}
              >
                #{topic.tag}
              </button>
            ))}
          </div>
        </div>

        {activeFilter === 'following' ? (
          <div className="personalized-network-stream">
            {/* Header 'Bonjour Jean 👋 - Votre fil' */}
            <div className="glass-card network-welcome-card">
              <div className="network-welcome-top">
                <div className="network-greeting-badge">
                  <span className="badge-pulse-dot" />
                  FIL DU RÉSEAU AFRIKDEV
                </div>
                <span className="network-refresh-hint">Alimenté par vos abonnements</span>
              </div>
              <div className="network-welcome-content">
                <div className="network-user-avatar-wrap">
                  <img src={currentUser?.avatar} alt={currentUser?.name} className="user-avatar-md" />
                  <span className="avatar-online-dot online" />
                </div>
                <div className="network-user-info">
                  <h3 className="network-user-greeting">Bonjour {currentUser?.name?.split(' ')[0] || 'Jean'} 👋</h3>
                  <p className="network-user-sub">
                    Votre fil d'actualité personnel regroupe les publications des développeurs suivis, les nouveaux projets ajoutés et les offres d'entreprises.
                  </p>
                </div>
              </div>
              <div className="network-feed-stats-bar">
                <div className="network-stat-chip">
                  <Users size={13} className="text-cyan" />
                  <span><strong>Sarah N'Diaye, David Mensah</strong> et vos contacts</span>
                </div>
                <div className="network-stat-chip">
                  <Building2 size={13} className="text-emerald" />
                  <span><strong>Tech CI</strong> et recruteurs suivis</span>
                </div>
                <div className="network-stat-chip">
                  <Star size={13} className="text-amber" />
                  <span>Projets surveillés</span>
                </div>
              </div>
            </div>

            {/* Liste des cartes du fil selon le modèle de l'utilisateur */}
            <div className="network-activities-list">
              {followingFeedItems.map((item) => (
                <article key={item.id} className="glass-card network-activity-card">
                  {/* Badge d'activité spécifique */}
                  <div className="activity-banner-row">
                    <span className={`activity-type-badge badge-${item.type}`}>
                      {item.type === 'post' && '🔔 Sarah & Auteurs suivis'}
                      {item.type === 'project' && '🚀 Nouveau Projet'}
                      {item.type === 'job' && '🏢 Entreprise suivie'}
                    </span>
                    <span className="activity-banner-text">
                      <strong>{item.badgeText}</strong>
                    </span>
                    <span className="activity-time-ago ml-auto">{item.time}</span>
                  </div>

                  {/* Contenu spécifique au type */}
                  {item.type === 'post' && (
                    <div className="activity-post-body">
                      {item.author && (
                        <div className="activity-author-meta">
                          <img 
                            src={item.author.avatar} 
                            alt={item.author.name} 
                            className="user-avatar-sm"
                            onClick={() => onSelectDeveloper && onSelectDeveloper(item.author.name)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div>
                            <span 
                              className="activity-author-name clickable"
                              onClick={() => onSelectDeveloper && onSelectDeveloper(item.author.name)}
                            >
                              {item.author.name}
                            </span>
                            <span className="activity-author-handle">{item.author.handle}</span>
                          </div>
                          {item.author.country && (
                            <span className="post-country-badge ml-auto">
                              <CountryFlag country={item.author.country} size="xs" />
                              <span className="badge-country-name">{item.author.country}</span>
                            </span>
                          )}
                        </div>
                      )}

                      <h4 className="activity-content-title">"{item.title}"</h4>
                      <FormattedPostText content={item.content} />

                      {item.codeSnippet && (
                        <div className="code-snippet-box">
                          <div className="code-snippet-header">
                            <span className="code-lang-label">
                              <Code2 size={12} className="text-cyan" /> Code Snippet
                            </span>
                            <button
                              type="button"
                              className="copy-code-btn"
                              onClick={() => handleCopyCode(item.codeSnippet, item.id)}
                            >
                              {copiedId === item.id ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                              <span>{copiedId === item.id ? "Copié !" : "Copier"}</span>
                            </button>
                          </div>
                          <pre className="code-snippet-content">
                            <code>{item.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      <div className="post-actions-bar mt-3">
                        <button className="post-action-btn like-btn liked">
                          <Heart size={18} fill="currentColor" />
                          <span className="action-count">{item.likes || 24}</span>
                        </button>
                        <button className="post-action-btn comment-btn">
                          <MessageSquare size={18} />
                          <span className="action-count">{item.commentsCount || 8}</span>
                        </button>
                        <button 
                          className="post-action-btn share-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Lien copié dans le presse-papier !");
                          }}
                        >
                          <Share2 size={18} />
                          <span className="action-count">{item.shares || 3}</span>
                        </button>
                        <span className="text-muted text-xs ml-auto">Via votre réseau</span>
                      </div>
                    </div>
                  )}

                  {item.type === 'project' && (
                    <div className="activity-project-body">
                      {item.author && (
                        <div className="activity-author-meta">
                          <img 
                            src={item.author.avatar} 
                            alt={item.author.name} 
                            className="user-avatar-sm"
                            onClick={() => onSelectDeveloper && onSelectDeveloper(item.author.name)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div>
                            <span 
                              className="activity-author-name clickable"
                              onClick={() => onSelectDeveloper && onSelectDeveloper(item.author.name)}
                            >
                              {item.author.name}
                            </span>
                            <span className="activity-author-handle">Auteur du projet</span>
                          </div>
                          {item.author.country && (
                            <span className="post-country-badge ml-auto">
                              <CountryFlag country={item.author.country} size="xs" />
                              <span className="badge-country-name">{item.author.country}</span>
                            </span>
                          )}
                        </div>
                      )}

                      <h4 className="activity-project-title">"{item.title}"</h4>
                      <p className="activity-project-desc">{item.content}</p>

                      {item.technologies && (
                        <div className="project-tags-list">
                          {item.technologies.map(t => (
                            <span key={t} className="project-tag-pill">{t}</span>
                          ))}
                        </div>
                      )}

                      <div className="post-actions-bar mt-3">
                        <button className="post-action-btn star-btn active">
                          <Star size={18} fill="#f59e0b" color="#f59e0b" />
                          <span className="action-count">{item.stars || 12}</span>
                        </button>
                        <span className="text-muted text-xs ml-auto">Projet surveillé ⭐</span>
                      </div>
                    </div>
                  )}

                  {item.type === 'job' && (
                    <div className="activity-job-body">
                      <div className="job-company-row">
                        <div className="job-company-icon">
                          <Building2 size={20} className="text-cyan" />
                        </div>
                        <div>
                          <h4 className="activity-job-title">{item.title}</h4>
                          <span className="job-company-name">{item.company}</span>
                        </div>
                        <span className="badge-tag green ml-auto">{item.opp_type || 'Offre tech'}</span>
                      </div>

                      <div className="job-details-meta">
                        {item.location && <span>📍 {item.location}</span>}
                        {item.salary && <span>💰 {item.salary}</span>}
                      </div>

                      {item.tags && (
                        <div className="project-tags-list mt-2">
                          {item.tags.map(t => (
                            <span key={t} className="project-tag-pill">{t}</span>
                          ))}
                        </div>
                      )}

                      <div className="job-action-footer mt-3">
                        <button 
                          type="button"
                          className="btn-primary btn-sm"
                          onClick={() => alert(`Candidature envoyée avec succès à ${item.company} !`)}
                        >
                          Postuler maintenant
                        </button>
                        <button 
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => alert(`Vous avez pris contact avec ${item.company}.`)}
                        >
                          Contacter l'entreprise
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        ) : (
        /* Posts List */
        <div className="posts-stream">
          {filteredPosts.map((post, index) => {
            const areCommentsOpen = !!expandedComments[post.id];
            return (
              <React.Fragment key={post.id}>
                <article className="glass-card post-card">
                {/* Post Header */}
                <div className="post-header">
                  <div 
                    className="post-avatar-wrapper"
                    onClick={() => onSelectDeveloper && onSelectDeveloper(post.author.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name} 
                      className="user-avatar-md"
                    />
                    <span className="post-online-beacon" title="Membre actif" />
                  </div>

                  <div className="post-author-meta">
                    <div className="post-author-row">
                      <span 
                        className="post-author-name"
                        onClick={() => onSelectDeveloper && onSelectDeveloper(post.author.name)}
                      >
                        {post.author.name}
                      </span>
                      <span className="verified-check" title="Développeur vérifié">
                        <ShieldCheck size={14} className="text-cyan" />
                      </span>
                      <span className="post-country-badge" title={post.author.country}>
                        <CountryFlag country={post.author.country} size="xs" />
                        <span className="badge-country-name">{post.author.country}</span>
                      </span>
                    </div>
                    <div className="post-time-meta">
                      <span className="post-handle">{post.author.handle}</span>
                      <span className="meta-separator">•</span>
                      <span className="post-timestamp">
                        <Clock size={12} className="meta-icon" />
                        {post.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Body with Rich Hierarchy */}
                <div className="post-content">
                  {/* Bouton Traduire à la demande (affiché uniquement si langue différente ou déjà traduit comme FB/IG) */}
                  {(() => {
                    const action = getTranslationAction(post.content, language);
                    const isTranslated = translatedPostIds.has(post.id);
                    if (!action.canTranslate && !isTranslated) return null;

                    return (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
                        <button
                          type="button"
                          className="post-translate-btn"
                          onClick={() => handleTranslatePost(post)}
                          disabled={loadingPostTranslations.has(post.id)}
                          title={isTranslated ? action.showOriginalLabel : action.buttonLabel}
                          style={{
                            background: isTranslated ? 'rgba(16, 185, 129, 0.12)' : 'rgba(6, 182, 212, 0.08)',
                            border: `1px solid ${isTranslated ? 'rgba(16, 185, 129, 0.35)' : 'rgba(6, 182, 212, 0.25)'}`,
                            borderRadius: 'var(--radius-sm)',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            color: isTranslated ? '#34d399' : 'var(--cyan-light)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5
                          }}
                        >
                          <Languages size={12} />
                          <span>
                            {loadingPostTranslations.has(post.id)
                              ? action.translatingLabel
                              : isTranslated
                                ? action.showOriginalLabel
                                : action.buttonLabel}
                          </span>
                        </button>
                      </div>
                    );
                  })()}

                  {translatedPostIds.has(post.id) && (
                    <div style={{ fontSize: '0.72rem', color: '#34d399', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span>🌐</span>
                      <span>{t('feed.translatedNotice', 'Traduit automatiquement (à la demande)')}</span>
                    </div>
                  )}

                  <FormattedPostText content={
                    translatedPostIds.has(post.id)
                      ? (liveTranslations[post.id] || post.contentEn || post.content)
                      : post.content
                  } />

                  {/* Code snippet block if present */}
                  {post.codeSnippet && (
                    <div className="code-snippet-box">
                      <div className="code-header">
                        <div className="terminal-dots">
                          <span className="dot dot-red" />
                          <span className="dot dot-yellow" />
                          <span className="dot dot-green" />
                        </div>
                        <span className="code-lang">
                          <Terminal size={13} />
                          <span>Code snippet</span>
                        </span>
                        <button 
                          className="copy-code-btn"
                          onClick={() => handleCopyCode(post.codeSnippet, post.id)}
                          title="Copier le code"
                        >
                          {copiedId === post.id ? (
                            <>
                              <Check size={14} className="text-green" />
                              <span className="text-green">Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="code-body">
                        <code>{post.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Media attachment (Image or Video) */}
                  {post.mediaUrl && (
                    <div className="post-media-container">
                      {post.mediaType === 'video' ? (
                        <video 
                          src={post.mediaUrl} 
                          controls 
                          className="post-media-video" 
                          preload="metadata"
                        />
                      ) : (
                        <img 
                          src={post.mediaUrl} 
                          alt="Média de publication" 
                          className="post-media-image"
                          loading="lazy"
                        />
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="post-tags-row">
                    {post.tags?.map((tag) => (
                      <button 
                        key={tag} 
                        className="badge-tag"
                        onClick={() => setSelectedTag(tag)}
                        title={`Filtrer par #${tag}`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Post Footer Actions */}
                <div className="post-actions-bar">
                  <button 
                    className={`post-action-btn like-btn ${post.likedByUser ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                    title="Aimer ce post"
                  >
                    <Heart size={18} fill={post.likedByUser ? "#F43F5E" : "none"} />
                    <span className="action-count">{post.likes}</span>
                  </button>

                  <button 
                    className={`post-action-btn comment-btn ${areCommentsOpen ? 'active' : ''}`}
                    onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    title="Commentaires"
                  >
                    <MessageSquare size={18} />
                    <span className="action-count">{post.commentsCount || 0}</span>
                  </button>

                  <button 
                    className="post-action-btn share-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Lien du post copié dans le presse-papier !");
                    }}
                    title="Partager le post"
                  >
                    <Share2 size={18} />
                    <span className="action-count">{post.shares || 0}</span>
                  </button>

                  <button className="post-action-btn bookmark-btn ml-auto" title="Enregistrer ce post">
                    <Bookmark size={18} />
                  </button>
                </div>

                {/* Expandable Comments Drawer */}
                {areCommentsOpen && (
                  <div className="post-comments-section">
                    <div className="comments-list">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map(c => (
                          <div key={c.id} className="comment-item">
                            <img src={c.avatar} alt={c.author} className="user-avatar-xs" />
                            <div className="comment-bubble">
                              <div className="comment-header">
                                <span className="comment-author">{c.author}</span>
                                <span className="comment-time">{c.time}</span>
                                {(() => {
                                  const action = getTranslationAction(c.text, language);
                                  const isTranslated = translatedCommentIds.has(`c_${c.id}`);
                                  if (!action.canTranslate && !isTranslated) return null;

                                  return (
                                    <button
                                      type="button"
                                      className="comment-translate-link"
                                      onClick={() => handleTranslateComment(c)}
                                      disabled={loadingCommentTranslations.has(`c_${c.id}`)}
                                      title={isTranslated ? action.showOriginalLabel : action.buttonLabel}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: isTranslated ? '#34d399' : 'var(--cyan-light)',
                                        cursor: 'pointer',
                                        fontSize: '0.68rem',
                                        marginLeft: 'auto',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 3
                                      }}
                                    >
                                      <Languages size={10} />
                                      <span>
                                        {loadingCommentTranslations.has(`c_${c.id}`)
                                          ? '...'
                                          : isTranslated
                                            ? (language === 'en' ? 'Orig.' : 'Orig.')
                                            : action.shortLabel}
                                      </span>
                                    </button>
                                  );
                                })()}
                              </div>
                              <p className="comment-text">
                                {translatedCommentIds.has(`c_${c.id}`)
                                  ? (liveTranslations[`c_${c.id}`] || c.text)
                                  : c.text}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-comments-hint">Soyez le premier à commenter !</div>
                      )}
                    </div>

                    {/* New Comment Input */}
                    <div className="comment-input-row">
                      <div className="comment-avatar-wrap">
                        <img src={currentUser.avatar} alt="Moi" className="user-avatar-xs" />
                        <span className="avatar-online-dot online" style={{ width: 8, height: 8, bottom: 0, right: 0 }} title="En ligne" />
                      </div>
                      <input 
                        type="text" 
                        placeholder={language === 'en' ? "Write a technical response..." : "Écrire une réponse technique..."}
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                      />
                      <button 
                        className="btn-primary btn-icon"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        title="Envoyer la réponse"
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </article>

              {/* Publicité officielle insérée dans le fil (traductions enregistrées bilingues) */}
              {index === 1 && (
                <SponsoredAdCard ad={OFFICIAL_ADS[0]} layout="inline" />
              )}
            </React.Fragment>
            );
          })}
        </div>
        )}
      </div>

      {/* Right Sidebar: Trends & Tech African Community */}
      <aside className="feed-sidebar">
        {/* Popular Tags / Trending */}
        <div className="glass-card sidebar-widget">
          <div className="widget-header">
            <TrendingUp size={18} className="text-cyan" />
            <h3 className="widget-title">{language === 'en' ? "African Tech Trends" : "Tendances Tech Afrique"}</h3>
          </div>
          <div className="trending-list">
            {trendingTopics.map((topic, index) => (
              <div 
                key={topic.tag} 
                className={`trending-item ${selectedTag === topic.tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(selectedTag === topic.tag ? null : topic.tag)}
                role="button"
                tabIndex={0}
              >
                <div className="trending-rank">#{index + 1}</div>
                <div className="trending-info">
                  <span className="trending-tag">
                    #{topic.tag} {topic.hot && <span className="hot-flame">🔥</span>}
                  </span>
                  <span className="trending-count">{topic.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publicité officielle sponsorisée (Contenu officiel bilingue enregistré) */}
        <SponsoredAdCard ad={OFFICIAL_ADS[1]} layout="sidebar" />

        {/* Community Spotlight / Hackathon */}
        <div className="glass-card sidebar-widget highlight-widget">
          <div className="widget-header">
            <Sparkles size={18} className="text-amber" />
            <h3 className="widget-title">{language === 'en' ? "Featured Challenge" : "Challenge en cours"}</h3>
          </div>
          <div className="spotlight-content">
            <span className="badge-tag gold">Prix : 35 000 $ USD</span>
            <h4 className="spotlight-title">African AI Challenge 2026</h4>
            <p className="spotlight-desc">
              {language === 'en' 
                ? "Develop an AI solution to solve local African challenges (agriculture, health, local dialects)." 
                : "Développer une IA pour résoudre un problème local (agriculture, santé, dialectes)."}
            </p>
            <div className="spotlight-footer">
              <span className="spotlight-date">⏳ {language === 'en' ? "Closes Nov 30" : "Clôture le 30 Novembre"}</span>
              <a href="#projets" className="spotlight-link">
                {language === 'en' ? "Learn more" : "En savoir plus"} <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Pan-African Developer Movement Manifesto */}
        <div className="glass-card sidebar-widget brand-manifesto-card">
          <img src="/afrikdev-logo-transparent.png" alt="AFRIKDEV" className="manifesto-logo" />
          <h4 className="manifesto-title">{language === 'en' ? "Pan-African Open Source Network" : "Réseau Open Source Africain"}</h4>
          <p className="manifesto-text">
            {language === 'en' ? "« For developers, by developers. »" : "« Pour les développeurs, par les développeurs. »"}
          </p>
          <div className="manifesto-stats-row">
            <div className="m-stat">
              <span className="m-stat-val">54</span>
              <span className="m-stat-lbl">{language === 'en' ? "Nations" : "Pays"}</span>
            </div>
            <div className="m-stat-div" />
            <div className="m-stat">
              <span className="m-stat-val">4.8k+</span>
              <span className="m-stat-lbl">Devs</span>
            </div>
            <div className="m-stat-div" />
            <div className="m-stat">
              <span className="m-stat-val">120+</span>
              <span className="m-stat-lbl">{language === 'en' ? "Projects" : "Projets"}</span>
            </div>
          </div>
          <span className="manifesto-sub">{language === 'en' ? "Join the open tech movement." : "Rejoignez le mouvement open tech."}</span>
        </div>
      </aside>
    </div>
  );
}
