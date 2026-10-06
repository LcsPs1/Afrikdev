import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  FolderGit2,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Ban,
  TrendingUp,
  Globe,
  Cpu,
  Settings,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  LogOut,
  Lock,
  Search,
  Check,
  X,
  Eye,
  ShieldAlert,
  UserX,
  UserCheck,
  BadgeCheck
} from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { ADMIN_METRICS, MODERATION_REPORTS } from '../data/mockData';
import { useTranslation } from '../i18n/LanguageContext';

export function AdminDashboardSection({
  onLogout,
  posts = [],
  setPosts = () => {},
  developers = [],
  setDevelopers = () => {},
  projects = [],
  setProjects = () => {},
  communities = [],
  setCommunities = () => {}
}) {
  const { t, language } = useTranslation();
  const [reports, setReports] = useState(MODERATION_REPORTS);
  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview | moderation | posts | users | projects | communities | settings
  const [searchFilter, setSearchFilter] = useState('');
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  // Platform setting switches state
  const [settings, setSettings] = useState({
    allowRegistrations: true,
    requireEmailVerification: true,
    aiSpamFilter: true,
    maintenanceMode: false
  });

  const handleModerationAction = (reportId, action) => {
    const reportItem = reports.find(r => r.id === reportId);
    setReports(prev => prev.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status: action === 'dismiss' ? 'REJETE' : 'RESOLU',
          resolutionNote: action === 'dismiss' ? 'Classé sans suite' : `Action effectuée : ${action}`
        };
      }
      return r;
    }));

    if (action === 'delete') {
      if (reportItem?.targetSummary) {
        setPosts(prev => prev.filter(p => !p.content?.includes(reportItem.targetSummary)));
      }
      showToast("Contenu supprimé avec succès de la plateforme.", 'danger');
    } else if (action === 'ban') {
      if (reportItem?.author) {
        setDevelopers(prev => prev.map(d => (
          d.username === reportItem.author || d.name === reportItem.author ? { ...d, available: false, isSuspended: true } : d
        )));
      }
      showToast("Utilisateur suspendu de la plateforme et sessions invalidées.", 'danger');
    } else if (action === 'warn') {
      showToast("Avertissement officiel notifié au membre concerné.", 'warning');
    } else if (action === 'dismiss') {
      showToast("Signalement classé sans suite.", 'info');
    }
  };

  // Suppression / modération de post
  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    showToast("Publication retirée de la plateforme avec succès.", 'danger');
  };

  // Suspension / réactivation d'un développeur
  const handleToggleSuspendDev = (devId, currentStatus) => {
    const nextStatus = currentStatus === false;
    setDevelopers(prev => prev.map(d => (d.id === devId ? { ...d, available: nextStatus, isSuspended: !nextStatus } : d)));
    showToast(nextStatus ? "Compte développeur réactivé." : "Utilisateur suspendu. Il ne pourra plus interagir ni publier.", nextStatus ? 'success' : 'warning');
  };

  // Suppression / modération d'un projet
  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    showToast("Projet retiré du catalogue public AfrikDev.", 'danger');
  };

  // Modération des communautés
  const handleDeleteCommunity = (commId) => {
    setCommunities(prev => prev.filter(c => c.id !== commId));
    showToast("Communauté retirée de la plateforme avec succès.", 'danger');
  };

  const handleToggleVerifyCommunity = (commId) => {
    setCommunities(prev => prev.map(c => (c.id === commId ? { ...c, isVerifiedHub: !c.isVerifiedHub } : c)));
    showToast("Statut de certification du hub mis à jour.", 'success');
  };

  const pendingReportsCount = reports.filter(r => r.status === 'EN_ATTENTE').length;

  return (
    <div className="admin-container">
      {/* Toast Alert Feedback */}
      {toastMsg && (
        <div className={`admin-toast-banner ${toastMsg.type || 'success'}`} role="status">
          <CheckCircle2 size={16} />
          <span>{toastMsg.text}</span>
          <button className="toast-dismiss-btn" onClick={() => setToastMsg(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Admin Security Session Banner */}
      <div className="admin-session-banner">
        <div className="admin-session-info">
          <span className="session-status-dot" />
          <span className="session-role">{t('admin.sessionTitle', 'Super-Administrateur Authentifié')} :</span>
          <code className="session-email">admin.sec@afrikdev.com</code>
          <span className="session-badge">TLS 1.3 Active</span>
        </div>

        {onLogout && (
          <button
            type="button"
            className="admin-logout-btn"
            onClick={onLogout}
            title={t('admin.logoutSession', 'Fermer la session admin')}
          >
            <LogOut size={15} />
            <span>{t('admin.logoutSession', 'Fermer la session')}</span>
          </button>
        )}
      </div>

      {/* Admin Header */}
      <div className="section-head-bar">
        <div>
          <div className="badge-tag gold mb-2">
            <ShieldCheck size={14} className="text-amber" />
            <span>{t('admin.badgeTitle', 'Console d\'Administration & Modération Panafricaine')}</span>
          </div>
          <h1 className="page-heading">{t('admin.mainTitle', 'Tableau de Bord Super-Admin')}</h1>
          <p className="page-subheading">
            {t('admin.mainSubtitle', 'Supervisez la croissance de la communauté, veillez au respect de la charte éthique et modérez l\'ensemble des sections.')}
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="admin-nav-pills" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <button
            className={`admin-nav-btn ${activeSubTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('overview')}
          >
            <TrendingUp size={15} />
            <span>{t('admin.tabs.overview', 'Vue d\'ensemble')}</span>
          </button>

          <button
            className={`admin-nav-btn ${activeSubTab === 'moderation' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('moderation')}
          >
            <AlertTriangle size={15} />
            <span>{t('admin.tabs.moderation', 'Signalements')}</span>
            {pendingReportsCount > 0 && (
              <span className="admin-alert-badge">{pendingReportsCount}</span>
            )}
          </button>

          <button
            className={`admin-nav-btn ${activeSubTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('posts')}
          >
            <MessageSquare size={15} />
            <span>{t('admin.tabs.posts', 'Publications')} ({posts.length})</span>
          </button>

          <button
            className={`admin-nav-btn ${activeSubTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('users')}
          >
            <Users size={15} />
            <span>{t('admin.tabs.users', 'Utilisateurs')} ({developers.length})</span>
          </button>

          <button
            className={`admin-nav-btn ${activeSubTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('projects')}
          >
            <FolderGit2 size={15} />
            <span>{t('admin.tabs.projects', 'Projets')} ({projects.length})</span>
          </button>

          <button
            className={`admin-nav-btn ${activeSubTab === 'communities' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('communities')}
          >
            <Globe size={15} />
            <span>{t('admin.tabs.communities', 'Communautés')} ({communities.length})</span>
          </button>

          <button
            className={`admin-nav-btn ${activeSubTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('settings')}
          >
            <Settings size={15} />
            <span>{t('admin.tabs.settings', 'Paramètres')}</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="admin-overview-grid">
          <div className="kpi-cards-grid">
            <div className="glass-card kpi-card">
              <div className="kpi-icon-box cyan">
                <Users size={22} />
              </div>
              <div className="kpi-meta">
                <span className="kpi-value">{developers.length || ADMIN_METRICS.totalUsers}</span>
                <span className="kpi-title">Développeurs Actifs</span>
                <span className="kpi-trend text-green">+24% ce mois</span>
              </div>
            </div>

            <div className="glass-card kpi-card">
              <div className="kpi-icon-box gold">
                <FolderGit2 size={22} />
              </div>
              <div className="kpi-meta">
                <span className="kpi-value">{projects.length || ADMIN_METRICS.totalProjects}</span>
                <span className="kpi-title">Projets Répertoriés</span>
                <span className="kpi-trend text-green">+14 vérifiés</span>
              </div>
            </div>

            <div className="glass-card kpi-card">
              <div className="kpi-icon-box purple">
                <MessageSquare size={22} />
              </div>
              <div className="kpi-meta">
                <span className="kpi-value">{posts.length || ADMIN_METRICS.totalPosts}</span>
                <span className="kpi-title">Publications & Débats</span>
                <span className="kpi-trend text-green">Actifs en temps réel</span>
              </div>
            </div>

            <div className="glass-card kpi-card">
              <div className="kpi-icon-box red">
                <AlertTriangle size={22} />
              </div>
              <div className="kpi-meta">
                <span className="kpi-value">{pendingReportsCount}</span>
                <span className="kpi-title">Signalements en attente</span>
                <span className="kpi-trend text-amber">Traitement prioritaire</span>
              </div>
            </div>
          </div>

          <div className="admin-distribution-row">
            <div className="glass-card distribution-panel">
              <div className="panel-header">
                <Globe size={18} className="text-cyan" />
                <h3 className="panel-title">Répartition Géographique des Développeurs</h3>
              </div>
              <div className="distribution-bars">
                {ADMIN_METRICS.countryDistribution.map(cd => (
                  <div key={cd.country} className="dist-row">
                    <div className="dist-label-row">
                      <span className="dist-name">
                        <CountryFlag country={cd.country} size="xs" />
                        <span>{cd.country}</span>
                      </span>
                      <span className="dist-stat">{cd.users} devs ({cd.percentage}%)</span>
                    </div>
                    <div className="dist-bar-bg">
                      <div className="dist-bar-fill" style={{ width: `${cd.percentage * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card distribution-panel">
              <div className="panel-header">
                <Cpu size={18} className="text-purple" />
                <h3 className="panel-title">Technologies les plus demandées</h3>
              </div>
              <div className="distribution-bars">
                {(ADMIN_METRICS.topTechnologies || ADMIN_METRICS.topSkills || []).map(sk => (
                  <div key={sk.name} className="dist-row">
                    <div className="dist-label-row">
                      <span className="dist-name font-mono">{sk.name}</span>
                      <span className="dist-stat text-cyan">{sk.count} talents ({sk.growth || '+20%'})</span>
                    </div>
                    <div className="dist-bar-bg">
                      <div className="dist-bar-fill" style={{ width: `${(sk.count / 5000) * 100}%`, background: 'var(--cyan-primary)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MODERATION REPORTS */}
      {activeSubTab === 'moderation' && (
        <div className="admin-moderation-list">
          <div className="glass-card p-4 mb-4">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>
              File de Modération Active ({reports.length})
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: 0 }}>
              Passez en revue les contenus signalés par les algorithmes anti-spam ou la communauté AfrikDev.
            </p>
          </div>

          {reports.map(report => {
            const targetType = report.targetType || report.type || 'Publication';
            const targetSummary = report.targetSummary || report.target || report.reason;
            const reportedBy = report.reportedBy || 'Membre';
            const author = report.author || 'Inconnu';
            const risk = report.riskLevel || 'MOYEN';

            return (
              <div key={report.id} className={`glass-card report-card ${report.status === 'EN_ATTENTE' ? 'pending' : 'resolved'}`}>
                <div className="report-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  <div className="report-meta" style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className={`status-pill ${report.status === 'EN_ATTENTE' ? 'status-pending' : 'status-resolved'}`}>
                      {report.status === 'EN_ATTENTE' ? 'En Attente' : 'Traité'}
                    </span>
                    <span className={`badge-tag ${risk === 'CRITIQUE' ? 'red' : risk === 'MOYEN' ? 'gold' : 'cyan'} text-xs font-mono`}>
                      Risque {risk}
                    </span>
                    <span className="badge-tag text-xs font-semibold">{targetType}</span>
                    <span className="report-date" style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>• {report.reportedAt}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    <span>Signalé par : <strong style={{ color: 'var(--text-main)' }}>{reportedBy}</strong></span>
                    <span>Auteur ciblé : <strong style={{ color: '#F87171' }}>{author}</strong></span>
                  </div>
                </div>

                <div className="report-body" style={{ marginBottom: 14 }}>
                  <div className="report-reason" style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: 8 }}>
                    <strong>Motif :</strong> {report.reason}
                  </div>
                  <div className="report-snippet glass-card" style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid var(--cyan-primary)', borderRadius: 'var(--radius-sm)' }}>
                    <code style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>"{targetSummary}"</code>
                  </div>
                  {report.resolutionNote && (
                    <div className="report-resolution-note" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: '0.82rem', color: 'var(--green-accent)' }}>
                      <CheckCircle2 size={14} className="text-green" />
                      <span>{report.resolutionNote}</span>
                    </div>
                  )}
                </div>

                {report.status === 'EN_ATTENTE' && (
                  <div className="report-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                    <button className="btn-secondary btn-sm" onClick={() => handleModerationAction(report.id, 'dismiss')}>
                      <Check size={14} />
                      <span>Classer sans suite</span>
                    </button>
                    <button className="btn-secondary btn-sm text-amber" onClick={() => handleModerationAction(report.id, 'warn')}>
                      <AlertTriangle size={14} />
                      <span>Avertir l'auteur</span>
                    </button>
                    <button className="btn-secondary btn-sm text-rose" onClick={() => handleModerationAction(report.id, 'delete')}>
                      <Trash2 size={14} />
                      <span>Supprimer le contenu</span>
                    </button>
                    <button className="btn-danger btn-sm" onClick={() => handleModerationAction(report.id, 'ban')}>
                      <Ban size={14} />
                      <span>Suspendre l'utilisateur</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 3: MODÉRATION DES PUBLICATIONS (ANTI-SPAM) */}
      {activeSubTab === 'posts' && (
        <div className="admin-content-moderation">
          <div className="glass-card p-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Modération du Fil de Discussions</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                Retirez instantanément tout spam, arnaque ou contenu contraire aux CGU.
              </p>
            </div>
            <div className="search-input-wrapper" style={{ maxWidth: 300 }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Filtrer par auteur ou mots-clés..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts
              .filter(p => !searchFilter || p.content?.toLowerCase().includes(searchFilter.toLowerCase()) || p.author?.name?.toLowerCase().includes(searchFilter.toLowerCase()))
              .map(post => (
                <div key={post.id} className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <img src={post.author?.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{post.author?.name}</strong>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>• {post.timestamp || "Récemment"}</span>
                      {post.tags?.map(t => (
                        <span key={t} className="badge-tag text-xs">#{t}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                      {post.content}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      className="btn-secondary btn-sm text-rose"
                      onClick={() => handleDeletePost(post.id)}
                      title="Supprimer définitivement ce post"
                    >
                      <Trash2 size={14} />
                      <span>Retirer pour spam</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MODÉRATION DES UTILISATEURS */}
      {activeSubTab === 'users' && (
        <div className="admin-content-moderation">
          <div className="glass-card p-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Gestion et Modération des Comptes</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                Gérez les droits d'accès, suspendez les profils suspects et préservez l'intégrité de la communauté.
              </p>
            </div>
            <div className="search-input-wrapper" style={{ maxWidth: 300 }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un développeur..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {developers
              .filter(d => !searchFilter || d.name?.toLowerCase().includes(searchFilter.toLowerCase()) || d.title?.toLowerCase().includes(searchFilter.toLowerCase()))
              .map(dev => {
                const isSuspended = dev.isSuspended || dev.available === false && dev.suspensionReason;
                return (
                  <div key={dev.id} className="glass-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={dev.avatar} alt={dev.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <strong style={{ fontSize: '0.94rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {dev.name}
                          </strong>
                          <CountryFlag country={dev.country || dev.flag} size="xs" />
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--cyan-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {dev.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                          {dev.city || 'Abidjan'} • {dev.reputation || 100} pts
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                      <span className={`badge-tag ${isSuspended ? 'red' : 'green'} text-xs`}>
                        {isSuspended ? 'Suspendu' : 'Compte Actif'}
                      </span>

                      <button
                        className={`btn-sm ${isSuspended ? 'btn-primary' : 'btn-secondary text-rose'}`}
                        onClick={() => handleToggleSuspendDev(dev.id, !isSuspended)}
                      >
                        {isSuspended ? (
                          <>
                            <UserCheck size={14} />
                            <span>Réactiver</span>
                          </>
                        ) : (
                          <>
                            <UserX size={14} />
                            <span>Suspendre</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: MODÉRATION DES PROJETS */}
      {activeSubTab === 'projects' && (
        <div className="admin-content-moderation">
          <div className="glass-card p-4 mb-4">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Modération des Projets ({projects.length})</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
              Validez la conformité technique et retirez les projets non-fonctionnels ou frauduleux.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {projects.map(proj => (
              <div key={proj.id} className="glass-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {proj.title}
                    </h4>
                    <span className="badge-tag green text-xs">{proj.status || "En ligne"}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                    {proj.tagline}
                  </p>
                  <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {proj.technologies?.slice(0, 3).map(tech => (
                      <span key={tech} className="badge-tag text-xs">{tech}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                    Par {proj.author?.name || "Équipe"}
                  </span>
                  <button
                    className="btn-secondary btn-sm text-rose"
                    onClick={() => handleDeleteProject(proj.id)}
                    title="Retirer ce projet"
                  >
                    <Trash2 size={14} />
                    <span>Retirer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: MODÉRATION DES COMMUNAUTÉS & HUBS */}
      {activeSubTab === 'communities' && (
        <div className="admin-content-moderation">
          <div className="glass-card p-4 mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                Modération & Certification des Hubs ({communities.length})
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                Gérez les hubs nationaux et communautés thématiques. Retirez les espaces inappropriés ou certifiez les hubs officiels.
              </p>
            </div>
            <div className="search-input-wrapper" style={{ maxWidth: 300 }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un hub ou pays..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {communities
              .filter(c => !searchFilter || c.name?.toLowerCase().includes(searchFilter.toLowerCase()) || c.country?.toLowerCase().includes(searchFilter.toLowerCase()) || c.description?.toLowerCase().includes(searchFilter.toLowerCase()))
              .map(comm => (
                <div key={comm.id} className="glass-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CountryFlag country={comm.country || comm.flag} size="sm" />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{comm.name}</strong>
                            {comm.isVerifiedHub && (
                              <span className="badge-tag cyan text-xs" title="Hub certifié officiel">
                                <BadgeCheck size={12} /> Certifié
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                            {comm.country || 'Panafrique'} • {comm.membersCount || 1} membres
                          </span>
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 10px 0', lineHeight: 1.45 }}>
                      {comm.description}
                    </p>

                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {comm.tags?.map(t => (
                        <span key={t} className="badge-tag text-xs">#{t}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: 8 }}>
                    <button
                      className={`btn-sm ${comm.isVerifiedHub ? 'btn-secondary' : 'btn-secondary text-cyan'}`}
                      onClick={() => handleToggleVerifyCommunity(comm.id)}
                      title={comm.isVerifiedHub ? "Retirer le badge certifié" : "Certifier ce hub"}
                    >
                      <BadgeCheck size={14} />
                      <span>{comm.isVerifiedHub ? "Dé-certifier" : "Certifier Hub"}</span>
                    </button>

                    <button
                      className="btn-secondary btn-sm text-rose"
                      onClick={() => handleDeleteCommunity(comm.id)}
                      title="Supprimer définitivement cette communauté"
                    >
                      <Trash2 size={14} />
                      <span>Retirer Hub</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 7: SETTINGS */}
      {activeSubTab === 'settings' && (
        <div className="admin-settings-panel glass-card p-6">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>
            Contrôles de Sécurité & Paramètres Panafricains
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)' }}>Filtrage Intelligent Anti-Spam par IA</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Analyse automatique des publications et détection des offres suspectes</span>
              </div>
              <button
                className="icon-btn text-cyan"
                onClick={() => {
                  const next = !settings.aiSpamFilter;
                  setSettings(s => ({ ...s, aiSpamFilter: next }));
                  showToast(next ? "Filtrage intelligent IA activé." : "Filtrage intelligent IA suspendu.", 'info');
                }}
              >
                {settings.aiSpamFilter ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)' }}>Double Authentification (2FA) obligatoire</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Imposer la saisie d'un code OTP par email lors de chaque connexion</span>
              </div>
              <button
                className="icon-btn text-cyan"
                onClick={() => {
                  const next = !settings.requireEmailVerification;
                  setSettings(s => ({ ...s, requireEmailVerification: next }));
                  showToast(next ? "2FA par email activé pour tous." : "2FA assoupli.", 'info');
                }}
              >
                {settings.requireEmailVerification ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)' }}>Inscriptions Ouvertes</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Autoriser de nouveaux talents à rejoindre AfrikDev</span>
              </div>
              <button
                className="icon-btn text-cyan"
                onClick={() => {
                  const next = !settings.allowRegistrations;
                  setSettings(s => ({ ...s, allowRegistrations: next }));
                  showToast(next ? "Inscriptions publiques ouvertes." : "Inscriptions publiques fermées temporairement.", 'warning');
                }}
              >
                {settings.allowRegistrations ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
