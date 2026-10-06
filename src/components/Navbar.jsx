import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bell,
  PlusCircle,
  Menu,
  X,
  Globe,
  Code,
  FolderGit2,
  Users,
  Zap,
  HelpCircle,
  Briefcase,
  MessageSquare,
  Building2,
  ShieldCheck,
  ChevronDown,
  Sun,
  Moon,
  KeyRound,
  Languages,
  User,
  Home,
  Search,
  Edit3,
  LogOut
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { CountryFlag } from './CountryFlag';
import { getNotifications, markNotificationsAsRead } from '../services/followService';

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenNewPost,
  onOpenNewProject,
  onOpenProfile,
  onOpenEditProfile,
  currentUser,
  theme = 'dark',
  setTheme,
  isAdminLoggedIn = false,
  isUserLoggedIn = false,
  isRecruiterLoggedIn = false,
  currentCompany = null,
  onOpenCompanyProfile,
  onOpenAuth,
  onLogout,
  onRecruiterLogout
}) {
  const { t, language, setLanguage, toggleLanguage } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRecruiterMenu, setShowRecruiterMenu] = useState(false);

  const [notifications, setNotifications] = useState(() => {
    const list = getNotifications();
    return list.map(n => ({
      id: n.id,
      text: n.title || n.message,
      subtitle: n.message && n.message !== n.title ? n.message : '',
      time: n.time || 'Récemment',
      unread: !n.is_read,
      notif_type: n.notif_type,
      actor_avatar: n.actor_avatar
    }));
  });

  const loadNotifications = () => {
    const list = getNotifications();
    setNotifications(list.map(n => ({
      id: n.id,
      text: n.title || n.message,
      subtitle: n.message && n.message !== n.title ? n.message : '',
      time: n.time || 'Récemment',
      unread: !n.is_read,
      notif_type: n.notif_type,
      actor_avatar: n.actor_avatar
    })));
  };

  useEffect(() => {
    const handleUpdate = () => loadNotifications();
    window.addEventListener('afrikdev_notifications_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('afrikdev_notifications_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const navRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShowPlusMenu(false);
        setShowNotifications(false);
        setShowLangMenu(false);
        setShowUserMenu(false);
        setShowRecruiterMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // 4 Core Main Navigation items
  const mainNav = [
    { id: 'feed', label: t('nav.feed', 'Discussions'), icon: Code, title: "Fil communautaire des développeurs africains" },
    { id: 'projects', label: t('nav.projects', 'Projets'), icon: FolderGit2, title: "Projets et applications Made in Africa" },
    { id: 'developers', label: t('nav.developers', 'Développeurs'), icon: Users, title: "Annuaire des développeurs et ingénieurs" },
    { id: 'company', label: t('nav.companies', 'Entreprises'), icon: Building2, title: "ATS Kanban & vivier tech pour les recruteurs" }
  ];

  // Secondary items cleanly grouped in 'Plus'
  const plusMenuItems = [
    { 
      id: 'matchmaker', 
      label: t('nav.matchmaker', 'Matchmaker IA'), 
      desc: language === 'en' ? 'Profile recommendations & synergies' : "Recommandations de profils & synergies", 
      icon: Zap, 
      isBadge: true 
    },
    { 
      id: 'questions', 
      label: t('nav.questions', 'Q&A Forum'), 
      desc: language === 'en' ? 'Tech assistance & bug fixes' : 'Entraide & résolution de bugs', 
      icon: HelpCircle 
    },
    { 
      id: 'communities', 
      label: t('nav.communities', 'Communautés'), 
      desc: language === 'en' ? 'National & tech hubs' : 'Hubs nationaux & thématiques', 
      icon: Globe 
    },
    { 
      id: 'opportunities', 
      label: t('nav.opportunities', 'Opportunités'), 
      desc: language === 'en' ? 'Jobs, internships & hackathons' : 'Emplois, stages & hackathons', 
      icon: Briefcase 
    },
    ...(isRecruiterLoggedIn ? [
      {
        id: 'company-profile',
        label: language === 'en' ? "Company Profile" : "Profil de l'Entreprise",
        desc: currentCompany?.name || (language === 'en' ? 'Manage company profile' : 'Gérer la fiche entreprise'),
        icon: Building2
      }
    ] : [
      {
        id: 'profile',
        label: t('nav.myProfile', 'Mon Profil'),
        desc: isUserLoggedIn ? `${language === 'en' ? 'Logged in: ' : 'Connecté : '}${currentUser?.name || (language === 'en' ? 'Member' : 'Membre')}` : (language === 'en' ? 'View member profile' : 'Consulter le profil membre'),
        icon: User
      }
    ]),
    ...(isAdminLoggedIn ? [
      { 
        id: 'admin', 
        label: t('nav.admin', 'Modération Admin'), 
        desc: language === 'en' ? 'Super-Admin console active' : 'Console Super-Admin active', 
        icon: ShieldCheck 
      }
    ] : [])
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    markNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const isPlusActive = ['matchmaker', 'questions', 'communities', 'opportunities', ...(isAdminLoggedIn ? ['admin', 'admin-login'] : [])].includes(activeTab);

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <>
      <header className="navbar-wrapper" ref={navRef} role="banner">
        <div className="navbar-container">
        {/* Brand Logo & Title */}
        <a
          href="#home"
          className="navbar-brand"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('home');
          }}
          title="AFRIKDEV — Accueil Plateforme Panafricaine"
        >
          <div className="brand-logo-glow">
            <img
              src="/afrikdev-logo-transparent.png"
              alt="Logo AFRIKDEV"
              className="brand-logo-img"
              width="36"
              height="36"
            />
          </div>
          <span className="brand-title">AFRIK<span className="brand-highlight">DEV</span></span>
        </a>

        {/* Desktop Navigation (4 Clean Tabs + 1 Dropdown) */}
        <nav className="desktop-nav hidden lg:flex items-center gap-1" aria-label="Navigation principale">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowPlusMenu(false);
                }}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                title={item.title}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.isBadge && <span className="nav-ai-dot" title="Propulsé par IA" />}
              </button>
            );
          })}

          {/* Clean 'Plus ▾' Dropdown */}
          <div className="nav-dropdown-wrapper">
            <button
              className={`nav-link-btn ${isPlusActive ? 'active' : ''} ${showPlusMenu ? 'open' : ''}`}
              onClick={() => setShowPlusMenu(!showPlusMenu)}
              aria-expanded={showPlusMenu}
              aria-haspopup="true"
              title="Plus d'espaces de la plateforme"
            >
              <span>Plus</span>
              <ChevronDown size={14} className={`dropdown-chevron ${showPlusMenu ? 'rotated' : ''}`} />
            </button>

            {showPlusMenu && (
              <div className="nav-dropdown-menu glass-card">
                {plusMenuItems.map((sub) => {
                  const SubIcon = sub.icon;
                  const isSubActive = activeTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      className={`dropdown-item ${isSubActive ? 'active' : ''}`}
                      onClick={() => {
                        if (sub.id === 'profile') {
                          if (onOpenProfile) onOpenProfile();
                          setShowPlusMenu(false);
                          return;
                        }
                        if (sub.id === 'company-profile') {
                          if (onOpenCompanyProfile) onOpenCompanyProfile();
                          setShowPlusMenu(false);
                          return;
                        }
                        setActiveTab(sub.id);
                        setShowPlusMenu(false);
                      }}
                    >
                      <div className="dropdown-icon-box">
                        <SubIcon size={16} />
                      </div>
                      <div className="dropdown-text-box">
                        <div className="dropdown-item-label">{sub.label}</div>
                        <div className="dropdown-item-desc">{sub.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Icons & Profile */}
        <div className="navbar-actions">

          {/* Admin Quick Access Badge (Only shown when admin session active) */}
          {isAdminLoggedIn && (
            <button
              className={`admin-active-nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
              title="Session Admin Active — Ouvrir le tableau de bord"
            >
              <ShieldCheck size={15} className="text-amber" />
              <span>Admin</span>
            </button>
          )}

          {/* Direct Messages Link - Accessible on mobile and desktop */}
          <button
            className={`icon-btn nav-messages-btn flex ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
            title={language === 'en' ? "Direct Messages" : "Messagerie directe"}
            aria-label="Messages"
          >
            <MessageSquare size={17} />
            <span className="notification-badge mini-badge">1</span>
          </button>

          {/* Notifications Link / Dropdown - Redirige vers page Notifs sur mobile */}
          <div className="notification-wrapper nav-notifications-wrapper relative flex">
            <button
              className={`icon-btn nav-notifications-btn ${activeTab === 'notifications' || showNotifications ? 'active' : ''}`}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setActiveTab('notifications');
                } else {
                  setShowNotifications(!showNotifications);
                }
              }}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown glass-card">
                <div className="notif-header">
                  <div className="notif-title">{t('nav.notifications', 'Notifications')}</div>
                  {unreadCount > 0 && (
                    <button className="notif-mark-read" onClick={markAllRead}>
                      {t('nav.markAllRead', 'Tout marquer lu')}
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.map(n => (
                    <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                      <div className="notif-dot" />
                      <div className="notif-content">
                        <p className="notif-text">{n.text}</p>
                        <span className="notif-time">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Language Selector Dropdown (🇫🇷 FR ▾ / 🇬🇧 EN ▾) */}
          <div className="lang-dropdown-wrapper nav-lang-desktop hidden md:block">
            <button
              type="button"
              className={`lang-selector-btn min-h-[40px] ${showLangMenu ? 'active' : ''}`}
              onClick={() => setShowLangMenu(!showLangMenu)}
              title={language === 'fr' ? "Langue de l'interface (Français)" : "Interface language (English)"}
              aria-label="Sélecteur de langue"
            >
              <CountryFlag code={language === 'fr' ? 'fr' : 'gb'} size="xs" />
              <span className="lang-code">{language === 'fr' ? 'FR' : 'EN'}</span>
              <ChevronDown size={13} className={`lang-chevron ${showLangMenu ? 'rotated' : ''}`} />
            </button>

            {showLangMenu && (
              <div className="lang-dropdown-menu glass-card">
                <button
                  type="button"
                  className={`lang-dropdown-item ${language === 'fr' ? 'selected' : ''}`}
                  onClick={() => {
                    setLanguage('fr');
                    setShowLangMenu(false);
                  }}
                >
                  <CountryFlag code="fr" size="xs" />
                  <span className="lang-item-name">Français</span>
                  {language === 'fr' && <span className="lang-check-mark">✓</span>}
                </button>

                <button
                  type="button"
                  className={`lang-dropdown-item ${language === 'en' ? 'selected' : ''}`}
                  onClick={() => {
                    setLanguage('en');
                    setShowLangMenu(false);
                  }}
                >
                  <CountryFlag code="gb" size="xs" />
                  <span className="lang-item-name">English</span>
                  {language === 'en' && <span className="lang-check-mark">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle (🌙 / ☀️) */}
          <button
            className="icon-btn theme-toggle-btn min-w-[44px] min-h-[44px] hidden md:flex"
            onClick={toggleTheme}
            title={theme === 'dark' ? t('nav.lightMode', "Passer en mode clair") : t('nav.darkMode', "Passer en mode sombre")}
            aria-label="Changer de thème"
          >
            {theme === 'dark' ? <Sun size={17} className="text-amber" /> : <Moon size={17} className="text-cyan" />}
          </button>

          {/* Session Authentication CTAs (Strictement séparés : Recruteur vs Développeur vs Invité) */}
          {isAdminLoggedIn ? null : isRecruiterLoggedIn ? (
            /* ============================================================== */
            /* 1. SESSION RECRUTEUR / ENTREPRISE (Active sur TOUT le site)   */
            /* ============================================================== */
            <>
              {/* Bouton '+ Publier' pour Entreprise / Recruteur */}
              <button
                type="button"
                className="btn-primary nav-post-btn hidden md:flex"
                onClick={() => {
                  if (onOpenNewProject) onOpenNewProject();
                  else if (onOpenNewPost) onOpenNewPost();
                }}
                title="Publier un projet"
              >
                <PlusCircle size={15} />
                <span className="nav-btn-text">{t('nav.publish', 'Publier')}</span>
              </button>

              <div className="recruiter-nav-wrapper">
                <button
                  type="button"
                  className="recruiter-session-pill-btn"
                  onClick={() => setShowRecruiterMenu(!showRecruiterMenu)}
                  title={language === 'en' ? `Company Session : ${currentCompany?.name || 'Recruiter'}` : `Session Entreprise : ${currentCompany?.name || 'Recruteur'}`}
                >
                  <div className="recruiter-icon-circle">
                    {currentCompany?.logo ? (
                      <img src={currentCompany.logo} alt={currentCompany.name} className="recruiter-pill-logo-img" />
                    ) : (
                      <Building2 size={16} className="text-cyan" />
                    )}
                  </div>
                  <div className="recruiter-pill-text">
                    <span className="recruiter-name-label">{currentCompany?.name || (language === 'en' ? 'Company' : 'Entreprise')}</span>
                    <span className="recruiter-tag-badge">{language === 'en' ? 'Company' : 'Entreprise'}</span>
                  </div>
                  <ChevronDown size={13} className={`chevron-rotate ${showRecruiterMenu ? 'rotated' : ''}`} />
                </button>

                {showRecruiterMenu && (
                  <div className="account-dropdown-menu glass-card">
                    <div className="dropdown-account-header">
                      <div className="flex items-center gap-2">
                        {currentCompany?.logo ? (
                          <img src={currentCompany.logo} alt={currentCompany.name} className="dropdown-company-logo" />
                        ) : (
                          <Building2 size={18} className="text-cyan" />
                        )}
                        <div className="dropdown-account-text">
                          <strong className="dropdown-account-name">{currentCompany?.name || (language === 'en' ? 'Company' : 'Entreprise')}</strong>
                        </div>
                      </div>
                    </div>

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    className="account-dropdown-item"
                    onClick={() => {
                      setShowRecruiterMenu(false);
                      if (onOpenCompanyProfile) onOpenCompanyProfile();
                    }}
                  >
                    <Edit3 size={15} className="text-cyan" />
                    <span>{language === 'en' ? "Edit Company Profile" : "Modifier le profil Entreprise"}</span>
                  </button>

                  <button
                    type="button"
                    className="account-dropdown-item"
                    onClick={() => {
                      setShowRecruiterMenu(false);
                      setActiveTab('company');
                    }}
                  >
                    <Briefcase size={15} className="text-cyan" />
                    <span>{language === 'en' ? "Recruitment Dashboard (ATS)" : "Tableau de bord Recrutement (ATS)"}</span>
                  </button>

                  <button
                    type="button"
                    className="account-dropdown-item"
                    onClick={() => {
                      setShowRecruiterMenu(false);
                      setActiveTab('developers');
                    }}
                  >
                    <Users size={15} className="text-amber" />
                    <span>{language === 'en' ? "Browse Developers" : "Parcourir les Développeurs"}</span>
                  </button>

                  <div className="dropdown-divider" />

                  <button
                    type="button"
                    className="account-dropdown-item text-rose"
                    onClick={() => {
                      setShowRecruiterMenu(false);
                      if (onRecruiterLogout) onRecruiterLogout();
                    }}
                  >
                    <LogOut size={15} />
                    <span>{language === 'en' ? "Company Sign Out" : "Déconnexion Entreprise"}</span>
                  </button>
                </div>
              )}
            </div>
            </>
          ) : isUserLoggedIn ? (
            /* ============================================================== */
            /* 2. SESSION DÉVELOPPEUR (Communauté, Code, Projets, Feed)       */
            /* ============================================================== */
            <>
              {/* Bouton '+ Publier' (ouvert aux projets et posts) */}
              <button
                type="button"
                className="btn-primary nav-post-btn hidden md:flex"
                onClick={() => {
                  if (activeTab === 'projects' && onOpenNewProject) {
                    onOpenNewProject();
                  } else if (onOpenNewPost) {
                    onOpenNewPost();
                  }
                }}
                title={activeTab === 'projects' ? "Publier un projet" : "Publier du code ou un projet"}
              >
                <PlusCircle size={15} />
                <span className="nav-btn-text">{t('nav.publish', 'Publier')}</span>
              </button>

              {/* Avatar Pill Développeur avec Menu Profil & Édition */}
              <div className="developer-nav-wrapper">
                <button
                  type="button"
                  className="user-avatar-trigger-btn"
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      if (onOpenProfile) onOpenProfile();
                      else setActiveTab('profile');
                    } else {
                      setShowUserMenu(!showUserMenu);
                    }
                  }}
                  title={language === 'en' ? `Logged in : ${currentUser?.name || 'Developer'}` : `Connecté : ${currentUser?.name || 'Développeur'}`}
                >
                  <div className="nav-avatar-online-wrap">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                      alt={currentUser?.name || (language === 'en' ? 'My Profile' : 'Mon Profil')}
                      className="pill-avatar"
                    />
                    <span className="avatar-online-dot online" />
                  </div>
                  <ChevronDown size={13} className={`chevron-rotate hidden md:inline-block ${showUserMenu ? 'rotated' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="account-dropdown-menu glass-card">
                    <div className="dropdown-account-header">
                      <div className="flex items-center gap-2">
                        <img
                          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                          alt={currentUser?.name}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div className="dropdown-account-text">
                          <strong className="dropdown-account-name">{currentUser?.name || (language === 'en' ? 'Developer' : 'Développeur')}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="account-dropdown-item"
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                    >
                      <User size={15} className="text-cyan" />
                      <span>{language === 'en' ? "View my profile" : "Voir mon profil"}</span>
                    </button>

                    <button
                      type="button"
                      className="account-dropdown-item"
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onOpenEditProfile) onOpenEditProfile();
                        else if (onOpenProfile) onOpenProfile();
                      }}
                    >
                      <Edit3 size={15} className="text-cyan" />
                      <span>{language === 'en' ? "Edit my profile" : "Modifier mon profil"}</span>
                    </button>

                    <button
                      type="button"
                      className="account-dropdown-item"
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveTab('company');
                      }}
                    >
                      <Building2 size={15} className="text-amber" />
                      <span>{language === 'en' ? "Access Company Portal" : "Accéder à l'Espace Entreprise"}</span>
                    </button>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="account-dropdown-item text-rose"
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onLogout) onLogout();
                      }}
                    >
                      <LogOut size={15} />
                      <span>{language === 'en' ? "Sign out" : "Se déconnecter"}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ============================================================== */
            /* 3. VISITEUR NON CONNECTÉ                                      */
            /* ============================================================== */
            <div className="nav-guest-actions flex items-center gap-1.5">
              <button
                type="button"
                className="icon-btn sm:hidden"
                onClick={() => onOpenAuth ? onOpenAuth('login') : setActiveTab('auth')}
                title={language === 'en' ? "Sign In" : "Connexion"}
              >
                <User size={18} />
              </button>
              <button
                type="button"
                className="btn-secondary nav-auth-btn nav-login-btn min-h-[38px] px-3 hidden sm:flex"
                onClick={() => onOpenAuth ? onOpenAuth('login') : setActiveTab('auth')}
                title="Se connecter à AfrikDev"
              >
                <KeyRound size={14} className="text-cyan" />
                <span className="nav-btn-text">{t('nav.login', 'Connexion')}</span>
              </button>
              <button
                type="button"
                className="btn-primary nav-auth-btn nav-register-btn min-h-[38px] px-3 hidden sm:flex"
                onClick={() => onOpenAuth ? onOpenAuth('register') : setActiveTab('auth')}
                title="Créer un compte et rejoindre la communauté"
              >
                <Sparkles size={14} />
                <span className="nav-btn-text">{t('nav.register', 'Inscription')}</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle button (Visible sur tablet md:flex, sur mobile < 768px le menu est dans la bottom nav) */}
          <button
            type="button"
            className="mobile-menu-toggle hidden md:flex lg:hidden min-w-[40px] min-h-[40px] items-center justify-center p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card)] text-[var(--text-main)] active:scale-95 transition-all shrink-0"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Offcanvas Drawer with Backdrop (En dehors du header pour libérer la superposition plein écran) */}
    {mobileMenuOpen && (
      <div className="mobile-drawer-wrapper lg:hidden">
        {/* Backdrop Blur Overlay */}
        <div
          className="mobile-drawer-backdrop fixed inset-0 bg-black/70 backdrop-blur-sm z-[99998] transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer Aside Panel */}
        <aside
          className="mobile-drawer-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal AFRIKDEV"
        >
            <div className="flex flex-col gap-4">
              {/* Drawer Header: Logo + Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <a
                  href="#home"
                  className="flex items-center gap-2.5"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab('home');
                    setMobileMenuOpen(false);
                  }}
                >
                  <img
                    src="/afrikdev-logo-transparent.png"
                    alt="Logo AFRIKDEV"
                    className="w-8 h-8 object-contain"
                    width="32"
                    height="32"
                  />
                  <span className="brand-title text-lg font-black tracking-wider">
                    AFRIK<span className="brand-highlight">DEV</span>
                  </span>
                </a>
                <button
                  type="button"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] active:scale-95 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fermer le menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Quick Settings: Language & Theme Switcher (Min 44px tap targets) */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                {/* Mobile FR / EN Segmented */}
                <div className="flex rounded-lg bg-[var(--bg-card)] p-1 border border-[var(--border-subtle)] gap-1">
                  <button
                    type="button"
                    className={`flex-1 min-h-[38px] flex items-center justify-center gap-1.5 rounded-md text-xs font-bold transition-all ${
                      language === 'fr'
                        ? 'bg-[var(--cyan-primary)] text-white shadow-sm font-extrabold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                    onClick={() => setLanguage('fr')}
                    title="Français"
                  >
                    <CountryFlag code="fr" size="xs" />
                    <span>FR</span>
                  </button>
                  <button
                    type="button"
                    className={`flex-1 min-h-[38px] flex items-center justify-center gap-1.5 rounded-md text-xs font-bold transition-all ${
                      language === 'en'
                        ? 'bg-[var(--cyan-primary)] text-white shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                    onClick={() => setLanguage('en')}
                    title="English"
                  >
                    <CountryFlag code="gb" size="xs" />
                    <span>EN</span>
                  </button>
                </div>

                {/* Theme Toggle Button */}
                <button
                  type="button"
                  className="min-h-[38px] px-3 flex items-center justify-center gap-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-main)] hover:border-[var(--cyan-border)] transition-all active:scale-95"
                  onClick={toggleTheme}
                  aria-label={language === 'en' ? "Switch theme" : "Changer de thème"}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun size={15} className="text-amber-400" />
                      <span>{language === 'en' ? "Light" : "Clair"}</span>
                    </>
                  ) : (
                    <>
                      <Moon size={15} className="text-[var(--cyan-primary)]" />
                      <span>{language === 'en' ? "Dark" : "Sombre"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Logged User Status Card */}
              {isUserLoggedIn && (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--cyan-border)] cursor-pointer transition-all min-h-[56px]"
                  onClick={() => {
                    if (onOpenProfile) onOpenProfile();
                    setMobileMenuOpen(false);
                  }}
                >
                  <div className="relative">
                    <img
                      src={
                        currentUser?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
                      }
                      alt={currentUser?.name || (language === 'en' ? 'My Profile' : 'Mon Profil')}
                      className="w-10 h-10 rounded-full object-cover border border-[var(--cyan-border)]"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--bg-card)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[var(--text-main)] truncate">
                      {currentUser?.name || (language === 'en' ? 'Developer' : 'Développeur')}
                    </div>
                    <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{language === 'en' ? "Online" : "En ligne"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Categorized Sliding Menu Sections */}
              <nav className="flex flex-col gap-4 pt-1" aria-label="Sections AFRIKDEV">
                {/* Groupe 1: Plateforme & Communauté */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-dim)] px-2.5 py-1">
                    {language === 'en' ? 'Platform & Community' : 'Plateforme & Communauté'}
                  </span>

                  {/* Accueil */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('home');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[46px] w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'home'
                        ? 'bg-[var(--cyan-primary)]/15 text-[var(--cyan-primary)] border border-[var(--cyan-primary)]/35 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'home' ? 'bg-[var(--cyan-primary)]/20 text-[var(--cyan-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-dim)]'
                    }`}>
                      <Home size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-[var(--text-main)]">{t('nav.home', language === 'en' ? 'Home' : 'Accueil')}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {language === 'en' ? "Showcase & official intro" : "Vitrine & présentation officielle"}
                      </div>
                    </div>
                  </button>

                  {/* Fil de discussions */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('feed');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[46px] w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'feed'
                        ? 'bg-[var(--cyan-primary)]/15 text-[var(--cyan-primary)] border border-[var(--cyan-primary)]/35 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'feed' ? 'bg-[var(--cyan-primary)]/20 text-[var(--cyan-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-dim)]'
                    }`}>
                      <Code size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-[var(--text-main)]">{t('nav.feed', language === 'en' ? 'Discussions' : 'Fil de discussions')}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {language === 'en' ? "Code sharing & tech news" : "Partage de code & actualités tech"}
                      </div>
                    </div>
                  </button>

                  {/* Projets Made in Africa */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('projects');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[46px] w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'projects'
                        ? 'bg-[var(--cyan-primary)]/15 text-[var(--cyan-primary)] border border-[var(--cyan-primary)]/35 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'projects' ? 'bg-[var(--cyan-primary)]/20 text-[var(--cyan-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-dim)]'
                    }`}>
                      <FolderGit2 size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-[var(--text-main)]">{t('nav.projects', language === 'en' ? 'Projects' : 'Projets')}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {language === 'en' ? "Made in Africa showcase & SaaS" : "Showcase Made in Africa & SaaS"}
                      </div>
                    </div>
                  </button>

                  {/* Annuaire des Talents */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('developers');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[46px] w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'developers'
                        ? 'bg-[var(--cyan-primary)]/15 text-[var(--cyan-primary)] border border-[var(--cyan-primary)]/35 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'developers' ? 'bg-[var(--cyan-primary)]/20 text-[var(--cyan-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-dim)]'
                    }`}>
                      <Users size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-[var(--text-main)]">{t('nav.developers', language === 'en' ? 'Developers' : 'Développeurs')}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {language === 'en' ? "Talent & engineer directory" : "Annuaire des talents & ingénieurs"}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Groupe 2: Écosystème, Hubs & IA */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-dim)] px-2.5 py-1">
                    {language === 'en' ? 'Ecosystem & AI' : 'Écosystème & IA'}
                  </span>

                  {/* Matchmaker IA */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('matchmaker');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[46px] w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'matchmaker'
                        ? 'bg-[var(--cyan-primary)]/15 text-[var(--cyan-primary)] border border-[var(--cyan-primary)]/35 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'matchmaker' ? 'bg-[var(--cyan-primary)]/20 text-[var(--cyan-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-dim)]'
                    }`}>
                      <Zap size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-[var(--text-main)]">{t('nav.matchmaker', language === 'en' ? 'AI Matchmaker' : 'Matchmaker IA')}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {language === 'en' ? "Skills-based matching engine" : "Moteur d'association par compétences"}
                      </div>
                    </div>
                  </button>

                  {/* Q&A Forum */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('questions');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[46px] w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'questions'
                        ? 'bg-[var(--cyan-primary)]/15 text-[var(--cyan-primary)] border border-[var(--cyan-primary)]/35 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'questions' ? 'bg-[var(--cyan-primary)]/20 text-[var(--cyan-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-dim)]'
                    }`}>
                      <HelpCircle size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-[var(--text-main)]">{t('nav.questions', 'Q&A Forum')}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {language === 'en' ? "Tech assistance & bug fixes" : "Entraide & résolution de bugs"}
                      </div>
                    </div>
                  </button>

                  {/* Hubs Nationaux */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('communities');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[46px] w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'communities'
                        ? 'bg-[var(--cyan-primary)]/15 text-[var(--cyan-primary)] border border-[var(--cyan-primary)]/35 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'communities' ? 'bg-[var(--cyan-primary)]/20 text-[var(--cyan-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-dim)]'
                    }`}>
                      <Globe size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-[var(--text-main)]">{t('nav.communities', language === 'en' ? 'Communities' : 'Communautés')}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {language === 'en' ? "Local hubs: Abidjan, Dakar, Lagos..." : "Hubs locaux Abidjan, Dakar, Lagos..."}
                      </div>
                    </div>
                  </button>

                  {/* Opportunités */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('opportunities');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[46px] w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'opportunities'
                        ? 'bg-[var(--cyan-primary)]/15 text-[var(--cyan-primary)] border border-[var(--cyan-primary)]/35 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'opportunities' ? 'bg-[var(--cyan-primary)]/20 text-[var(--cyan-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-dim)]'
                    }`}>
                      <Briefcase size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-[var(--text-main)]">{t('nav.opportunities', language === 'en' ? 'Opportunities' : 'Opportunités')}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {language === 'en' ? "Jobs, internships & hackathons" : "Offres d'emploi, stages & hackathons"}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Groupe 3: Entreprises & Messagerie */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-dim)] px-2.5 py-1">
                    {language === 'en' ? 'Recruiting & Direct Messages' : 'Recrutement & Messagerie'}
                  </span>

                  {/* Espace Entreprises */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('company');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[46px] w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'company'
                        ? 'bg-[var(--cyan-primary)]/15 text-[var(--cyan-primary)] border border-[var(--cyan-primary)]/35 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'company' ? 'bg-[var(--cyan-primary)]/20 text-[var(--cyan-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-dim)]'
                    }`}>
                      <Building2 size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-[var(--text-main)]">{t('nav.companies', language === 'en' ? 'Companies Portal' : 'Espace Entreprises')}</div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {language === 'en' ? "ATS Kanban & recruiter openings" : "ATS Kanban & offres pour recruteurs"}
                      </div>
                    </div>
                  </button>

                  {/* Messagerie */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('messages');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-h-[46px] w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                      activeTab === 'messages'
                        ? 'bg-[var(--cyan-primary)]/15 text-[var(--cyan-primary)] border border-[var(--cyan-primary)]/35 shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'messages' ? 'bg-[var(--cyan-primary)]/20 text-[var(--cyan-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-dim)]'
                    }`}>
                      <MessageSquare size={17} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-[var(--text-main)]">
                        {language === 'en' ? "Direct Messages" : "Messagerie directe"}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {language === 'en' ? "Private chats & code discussions" : "Échanges privés & discussions de code"}
                      </div>
                    </div>
                  </button>

                  {/* Console Super-Admin si connecté */}
                  {isAdminLoggedIn && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('admin');
                        setMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`min-h-[46px] w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${
                        activeTab === 'admin'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/35 shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-rose-500/20 text-rose-400">
                        <ShieldCheck size={17} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate text-rose-400">{t('nav.admin', 'Modération Admin')}</div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate">
                          {language === 'en' ? "Active security console" : "Console de sécurité active"}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </nav>
            </div>

            {/* Drawer Bottom Actions: CTAs with Min 44-46px touch targets */}
            <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] flex flex-col gap-2.5">
              {isRecruiterLoggedIn ? (
                <>
                  <button
                    type="button"
                    className="btn-primary min-h-[46px] w-full flex items-center justify-center gap-2 rounded-xl text-white font-bold shadow-md active:scale-98 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                      color: '#FFFFFF'
                    }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenNewProject) onOpenNewProject();
                      else if (onOpenNewPost) onOpenNewPost();
                    }}
                  >
                    <PlusCircle size={18} />
                    <span>{language === 'en' ? "Publish" : "Publier"}</span>
                  </button>
                  <button
                    type="button"
                    className="min-h-[44px] w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card)] text-[var(--text-main)] text-sm font-medium transition-all"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenCompanyProfile) onOpenCompanyProfile();
                    }}
                  >
                    <Edit3 size={16} className="text-[var(--cyan-primary)]" />
                    <span>{language === 'en' ? "Edit Company Profile" : "Modifier profil Entreprise"}</span>
                  </button>
                  <button
                    type="button"
                    className="min-h-[44px] w-full flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-sm font-medium transition-all"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onRecruiterLogout) onRecruiterLogout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>{language === 'en' ? "Company Sign Out" : "Déconnexion Entreprise"}</span>
                  </button>
                </>
              ) : isUserLoggedIn ? (
                <>
                  <button
                    type="button"
                    className="btn-primary min-h-[46px] w-full flex items-center justify-center gap-2 rounded-xl text-white font-bold shadow-md active:scale-98 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                      color: '#FFFFFF'
                    }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (activeTab === 'projects' && onOpenNewProject) onOpenNewProject();
                      else if (onOpenNewPost) onOpenNewPost();
                    }}
                  >
                    <PlusCircle size={18} />
                    <span>{language === 'en' ? "Publish" : "Publier"}</span>
                  </button>
                  <button
                    type="button"
                    className="min-h-[44px] w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card)] text-[var(--text-main)] text-sm font-medium transition-all"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenEditProfile) onOpenEditProfile();
                      else if (onOpenProfile) onOpenProfile();
                    }}
                  >
                    <Edit3 size={16} className="text-[var(--cyan-primary)]" />
                    <span>{language === 'en' ? "Edit My Profile" : "Modifier mon profil"}</span>
                  </button>
                  <button
                    type="button"
                    className="min-h-[44px] w-full flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-sm font-medium transition-all"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>{language === 'en' ? "Sign Out" : "Déconnexion"}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-primary min-h-[46px] w-full flex items-center justify-center gap-2 rounded-xl text-white font-bold shadow-md active:scale-98 transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                      color: '#FFFFFF'
                    }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('register');
                      else setActiveTab('auth');
                    }}
                  >
                    <Sparkles size={18} />
                    <span>{language === 'en' ? "Join the Community" : t('nav.register', 'Rejoindre la communauté')}</span>
                  </button>
                  <button
                    type="button"
                    className="min-h-[44px] w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:bg-[var(--bg-card)] text-[var(--text-main)] text-sm font-medium transition-all"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('login');
                      else setActiveTab('auth');
                    }}
                  >
                    <KeyRound size={16} className="text-[var(--cyan-primary)]" />
                    <span>{language === 'en' ? "Sign In" : t('nav.login', 'Connexion')}</span>
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Mobile Bottom Navigation (Visible sur mobile : Notif remplacé par Dev) */}
      {isRecruiterLoggedIn ? (
        <nav className="mobile-bottom-nav" aria-label="Navigation mobile recruteur">
          <button 
            type="button"
            className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Home size={20} />
            <span>{t('nav.home', language === 'en' ? 'Home' : 'Accueil')}</span>
          </button>
          
          <button 
            type="button"
            className={`bottom-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('feed');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Code size={20} />
            <span>Feed</span>
          </button>

          <button 
            type="button"
            className="bottom-nav-item"
            onClick={() => {
              if (onOpenNewProject) onOpenNewProject();
              else if (onOpenNewPost) onOpenNewPost();
            }}
            aria-label="Publier un projet"
          >
            <PlusCircle size={20} />
            <span>{language === 'en' ? "Publish" : "Publier"}</span>
          </button>
          
          <button 
            type="button"
            className={`bottom-nav-item ${activeTab === 'developers' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('developers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label={language === 'en' ? "Developers" : "Développeurs"}
          >
            <Users size={20} />
            <span>{language === 'en' ? "Dev" : "Dev"}</span>
          </button>

          <button 
            type="button"
            className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Ouvrir le menu coulissant"
          >
            <Menu size={20} />
            <span>{language === 'en' ? "Menu" : "Menu"}</span>
          </button>
        </nav>
      ) : isUserLoggedIn ? (
        <nav className="mobile-bottom-nav" aria-label="Navigation mobile membre">
          <button 
            type="button"
            className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Home size={20} />
            <span>{t('nav.home', language === 'en' ? 'Home' : 'Accueil')}</span>
          </button>
          
          <button 
            type="button"
            className={`bottom-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('feed');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Code size={20} />
            <span>Feed</span>
          </button>
          
          <button 
            type="button"
            className="bottom-nav-item"
            onClick={() => {
              if (activeTab === 'projects' && onOpenNewProject) {
                onOpenNewProject();
              } else if (onOpenNewPost) {
                onOpenNewPost();
              }
            }}
            aria-label="Publier un post ou projet"
          >
            <PlusCircle size={20} />
            <span>{language === 'en' ? "Publish" : "Publier"}</span>
          </button>
          
          {/* Remplacement de Notif par Dev */}
          <button 
            type="button"
            className={`bottom-nav-item ${activeTab === 'developers' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('developers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label={language === 'en' ? "Developers" : "Développeurs"}
          >
            <Users size={20} />
            <span>{language === 'en' ? "Dev" : "Dev"}</span>
          </button>
          
          <button 
            type="button"
            className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Ouvrir le menu coulissant"
          >
            <Menu size={20} />
            <span>{language === 'en' ? "Menu" : "Menu"}</span>
          </button>
        </nav>
      ) : (
        <nav className="mobile-bottom-nav" aria-label="Navigation mobile visiteur">
          <button 
            type="button"
            className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Home size={20} />
            <span>{t('nav.home', language === 'en' ? 'Home' : 'Accueil')}</span>
          </button>
          
          <button 
            type="button"
            className={`bottom-nav-item ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('feed');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Code size={20} />
            <span>Feed</span>
          </button>
          
          <button 
            type="button"
            className="bottom-nav-item"
            onClick={() => {
              if (onOpenAuth) onOpenAuth('login');
              else setActiveTab('auth');
            }}
            aria-label="Publier un post"
          >
            <PlusCircle size={20} />
            <span>{language === 'en' ? "Publish" : "Publier"}</span>
          </button>
          
          {/* Remplacement de Notif par Dev */}
          <button 
            type="button"
            className={`bottom-nav-item ${activeTab === 'developers' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('developers');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label={language === 'en' ? "Developers" : "Développeurs"}
          >
            <Users size={20} />
            <span>{language === 'en' ? "Dev" : "Dev"}</span>
          </button>
          
          <button 
            type="button"
            className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Ouvrir toutes les sections"
          >
            <Menu size={20} />
            <span>{language === 'en' ? "Menu" : "Menu"}</span>
          </button>
        </nav>
      )}
    </>
  );
}
