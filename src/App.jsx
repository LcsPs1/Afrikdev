import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  INITIAL_USER,
  DEVELOPERS_DATA,
  PROJECTS_DATA,
  POSTS_DATA,
  QUESTIONS_DATA,
  COMMUNITIES_DATA,
  OPPORTUNITIES_DATA,
  MESSAGES_CONVERSATIONS,
  COMPANIES_PORTAL_DATA
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { FeedSection } from './components/FeedSection';
import { ProjectsSection } from './components/ProjectsSection';
import { DevelopersSection } from './components/DevelopersSection';
import { MatchmakerSection } from './components/MatchmakerSection';
import { QuestionsSection } from './components/QuestionsSection';
import { CommunitiesSection } from './components/CommunitiesSection';
import { OpportunitiesSection } from './components/OpportunitiesSection';
import { MessagesSection } from './components/MessagesSection';
import { NotificationsSection } from './components/NotificationsSection';
import { AdminDashboardSection } from './components/AdminDashboardSection';
import { CompanyPortalSection } from './components/CompanyPortalSection';
import { CompanyProfileModal } from './components/CompanyProfileModal';
import { AdminLoginSection, ADMIN_SECRET_URL_PATH } from './components/AdminLoginSection';
import { RecruiterLoginSection, RECRUITER_SESSION_KEY } from './components/RecruiterLoginSection';
import { AuthSection } from './components/AuthSection';

import { NewPostModal } from './components/NewPostModal';
import { NewProjectModal } from './components/NewProjectModal';
import { ProfileModal } from './components/ProfileModal';
import { AskQuestionModal } from './components/AskQuestionModal';
import { TermsModal, PrivacyModal } from './components/LegalModals';
import { Footer } from './components/Footer';
import { useTranslation } from './i18n/LanguageContext';
import { sendHeartbeat } from './services/presenceService';

const TAB_INDEX_MAP = {
  home: 0,
  feed: 1,
  projects: 2,
  developers: 3,
  matchmaker: 4,
  questions: 5,
  communities: 6,
  opportunities: 7,
  company: 8,
  admin: 9,
  'admin-login': 9,
  notifications: 10,
  messages: 11,
  auth: 12
};

export default function App() {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('home');
  const [slideDir, setSlideDir] = useState('forward'); // 'forward' (glisse droite -> gauche) ou 'backward' (gauche -> droite)
  const prevTabRef = useRef('home');

  // Auth initial mode for AuthSection ('register' | 'login')
  const [authInitialMode, setAuthInitialMode] = useState('register');

  // General user authentication state (développeurs membres de la communauté)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    const recruiterSaved = sessionStorage.getItem(RECRUITER_SESSION_KEY);
    if (recruiterSaved === 'true') return false; // Isolation absolue : aucun chevauchement !
    const saved = sessionStorage.getItem('afrikdev_user_authenticated');
    return saved !== 'false';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('afrikdev_user_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_USER;
  });

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('afrikdev_admin_authenticated') === 'true';
  });

  // Recruiter / Enterprise authentication state
  const [isRecruiterLoggedIn, setIsRecruiterLoggedIn] = useState(() => {
    return sessionStorage.getItem(RECRUITER_SESSION_KEY) === 'true';
  });

  // Current active company for recruiters
  const [currentCompany, setCurrentCompany] = useState(() => {
    try {
      const saved = sessionStorage.getItem('afrikdev_company_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return COMPANIES_PORTAL_DATA.currentCompany;
  });

  const [isCompanyProfileModalOpen, setIsCompanyProfileModalOpen] = useState(false);
  const [isProfileModalEditing, setIsProfileModalEditing] = useState(false);

  // Core dynamic datasets
  const [posts, setPosts] = useState(POSTS_DATA);
  const [projects, setProjects] = useState(PROJECTS_DATA);
  const [developers, setDevelopers] = useState(DEVELOPERS_DATA);
  const [questions, setQuestions] = useState(QUESTIONS_DATA);
  const [communities, setCommunities] = useState(COMMUNITIES_DATA);
  const [opportunities, setOpportunities] = useState(OPPORTUNITIES_DATA);

  // Modals state
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);
  const [selectedDevForModal, setSelectedDevForModal] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Charger les données fraîches de l'entreprise depuis le backend au montage
  useEffect(() => {
    fetch('http://localhost:8000/api/companies/current/')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.name) {
          setCurrentCompany(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  // Heartbeat de présence périodique (toutes les 60s) pour synchroniser last_seen avec Django
  useEffect(() => {
    if (!isUserLoggedIn || !currentUser) return;
    sendHeartbeat(currentUser);
    const interval = setInterval(() => {
      sendHeartbeat(currentUser);
    }, 60000);
    return () => clearInterval(interval);
  }, [isUserLoggedIn, currentUser]);

  const handleRecruiterLogin = (companyData) => {
    sessionStorage.setItem(RECRUITER_SESSION_KEY, 'true');
    sessionStorage.removeItem('afrikdev_user_authenticated');
    setIsRecruiterLoggedIn(true);
    setIsUserLoggedIn(false);
    if (companyData && companyData.name) {
      setCurrentCompany(prev => ({ ...prev, ...companyData }));
      try {
        sessionStorage.setItem('afrikdev_company_data', JSON.stringify(companyData));
      } catch (e) {}
    }
    setActiveTab('company');
  };

  const handleRecruiterLogout = () => {
    sessionStorage.removeItem(RECRUITER_SESSION_KEY);
    setIsRecruiterLoggedIn(false);
    setActiveTab('home');
  };

  const handleUpdateCompany = async (updatedData) => {
    setCurrentCompany(prev => {
      const updated = { ...prev, ...updatedData };
      try {
        sessionStorage.setItem('afrikdev_company_data', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      await fetch('http://localhost:8000/api/companies/current/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
    } catch (e) {
      console.warn("Échec persistance entreprise:", e);
    }
  };

  // Handler for user login / sign-up success
  const handleUserAuthSuccess = (user, mode) => {
    sessionStorage.removeItem(RECRUITER_SESSION_KEY);
    setIsRecruiterLoggedIn(false);
    if (user) {
      setCurrentUser(user);
      try {
        sessionStorage.setItem('afrikdev_user_data', JSON.stringify(user));
      } catch (e) {}
      if (mode === 'register') {
        setDevelopers(prev => {
          if (!prev.some(d => d.id === user.id || d.email === user.email)) {
            return [user, ...prev];
          }
          return prev;
        });
      }
    }
    setIsUserLoggedIn(true);
    sessionStorage.setItem('afrikdev_user_authenticated', 'true');
    setActiveTab('communities');
  };

  const handleUserLogout = () => {
    sessionStorage.removeItem('afrikdev_user_authenticated');
    sessionStorage.removeItem('afrikdev_user_data');
    localStorage.removeItem('afrikdev_access_token');
    localStorage.removeItem('afrikdev_refresh_token');
    setIsUserLoggedIn(false);
    setCurrentUser(INITIAL_USER);
    setActiveTab('home');
  };

  const handleUpdateProfile = async (updatedData) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updatedData };
      try {
        sessionStorage.setItem('afrikdev_user_data', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setDevelopers(prev => prev.map(d => (
      d.id === updatedData.id || d.username === updatedData.username || d.name === updatedData.name ? { ...d, ...updatedData } : d
    )));
    setSelectedDevForModal(prev => (prev ? { ...prev, ...updatedData } : null));

    // Persistance vers l'API backend Django
    const token = localStorage.getItem('afrikdev_access_token');
    if (token) {
      try {
        await fetch('http://localhost:8000/api/auth/me/', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        });
      } catch (e) {
        console.warn("Échec persistance auth/me:", e);
      }
    }
  };

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('afrikdev-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('afrikdev-theme', theme);
  }, [theme]);

  // Détecter l'accès par URL secrète d'administration
  useEffect(() => {
    const checkAdminUrl = () => {
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;

      if (currentPath.includes(ADMIN_SECRET_URL_PATH) || currentHash.includes(ADMIN_SECRET_URL_PATH)) {
        if (sessionStorage.getItem('afrikdev_admin_authenticated') === 'true') {
          setIsAdminLoggedIn(true);
          setActiveTab('admin');
        } else {
          setActiveTab('admin-login');
        }
      }
    };

    checkAdminUrl();
    window.addEventListener('popstate', checkAdminUrl);
    window.addEventListener('hashchange', checkAdminUrl);
    return () => {
      window.removeEventListener('popstate', checkAdminUrl);
      window.removeEventListener('hashchange', checkAdminUrl);
    };
  }, []);

  // Détection du retour d'authentification OAuth réelle (Google & GitHub)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const authProvider = urlParams.get('auth_provider');
      const accessToken = urlParams.get('access');
      const refreshToken = urlParams.get('refresh');
      const authError = urlParams.get('auth_error');

      if (authError) {
        alert(language === 'en' 
          ? `Authentication error (${authProvider || 'OAuth'}): ${authError}` 
          : `Erreur d'authentification (${authProvider || 'OAuth'}) : ${authError}`);
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      if (accessToken) {
        localStorage.setItem('afrikdev_access_token', accessToken);
        if (refreshToken) localStorage.setItem('afrikdev_refresh_token', refreshToken);

        // Récupérer le profil utilisateur complet depuis le backend Django
        fetch('http://localhost:8000/api/auth/me/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data && data.user) {
              const dev = data.developer || {};
              const loggedUser = {
                id: dev.id || data.user.id,
                name: dev.name || `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.username,
                username: data.user.username,
                email: data.user.email,
                avatar: dev.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.user.username}`,
                country: dev.country || "Côte d'Ivoire",
                flag: dev.flag || "🇨🇮",
                title: dev.title || "Développeur Full-Stack",
                city: dev.city || "Abidjan",
                bio: dev.bio || "",
                skills: dev.skills || ["React", "Django"],
                github: dev.github || (authProvider === 'github' ? data.user.username : ""),
                reputation: dev.reputation || 120,
                available: dev.available !== false,
                badges: dev.badges && dev.badges.length ? dev.badges : ["Membre Vérifié", authProvider === 'github' ? "GitHub Sync" : "Google Sync"],
              };
              handleUserAuthSuccess(loggedUser, 'login');
            }
          })
          .catch(err => {
            console.error("Erreur lors de la récupération du profil utilisateur:", err);
          })
          .finally(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
          });
      }
    } catch (e) {
      console.error("Erreur traitement OAuth params:", e);
    }
  }, []);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setActiveTab('admin');
    try {
      window.history.pushState(null, '', `/${ADMIN_SECRET_URL_PATH}`);
    } catch (e) {}
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('afrikdev_admin_authenticated');
    setIsAdminLoggedIn(false);
    setActiveTab('home');
    try {
      window.history.pushState(null, '', '/');
    } catch (e) {}
  };

  // Déplacement fluide vers le haut et calcul de la direction du slide (gauche <-> droite)
  useEffect(() => {
    const prevIdx = TAB_INDEX_MAP[prevTabRef.current] ?? 0;
    const currIdx = TAB_INDEX_MAP[activeTab] ?? 0;

    if (currIdx > prevIdx) {
      setSlideDir('forward'); // On avance vers la droite dans le navbar : l'écran glisse depuis la droite
    } else if (currIdx < prevIdx) {
      setSlideDir('backward'); // On recule vers la gauche dans le navbar : l'écran glisse depuis la gauche
    }
    prevTabRef.current = activeTab;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeTab]);

  // Handlers for adding new entities
  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
    setActiveTab('feed');
  };

  const handleAddProject = (newProject) => {
    setProjects([newProject, ...projects]);
    setActiveTab('projects');
  };

  const handleAddQuestion = (newQuestion) => {
    setQuestions([newQuestion, ...questions]);
    setActiveTab('questions');
  };

  const handleSelectDeveloperByName = (name) => {
    const found = developers.find(d => d.name === name);
    if (found) {
      setSelectedDevForModal(found);
    } else {
      setSelectedDevForModal(currentUser);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Top sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminLoggedIn={isAdminLoggedIn}
        isUserLoggedIn={isUserLoggedIn}
        isRecruiterLoggedIn={isRecruiterLoggedIn}
        currentCompany={currentCompany}
        onOpenCompanyProfile={() => setIsCompanyProfileModalOpen(true)}
        onOpenAuth={(mode = 'login') => {
          setAuthInitialMode(mode);
          setActiveTab('auth');
        }}
        onLogout={handleUserLogout}
        onRecruiterLogout={handleRecruiterLogout}
        onOpenNewPost={() => {
          if (!isUserLoggedIn && !isRecruiterLoggedIn) {
            setAuthInitialMode('login');
            setActiveTab('auth');
            return;
          }
          if (activeTab === 'projects') {
            setIsNewProjectOpen(true);
          } else {
            setIsNewPostOpen(true);
          }
        }}
        onOpenNewProject={() => {
          if (!isUserLoggedIn && !isRecruiterLoggedIn) {
            setAuthInitialMode('login');
            setActiveTab('auth');
            return;
          }
          setIsNewProjectOpen(true);
        }}
        onOpenProfile={() => {
          setSelectedDevForModal(currentUser);
          setIsProfileModalEditing(false);
        }}
        onOpenEditProfile={() => {
          setSelectedDevForModal(currentUser);
          setIsProfileModalEditing(true);
        }}
        currentUser={currentUser}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Tab View */}
      <main className="main-content">
        <div className="container">
          <div key={activeTab} className={`section-tab-transition slide-${slideDir}`}>
            {activeTab === 'home' && (
              <LandingHero
                isUserLoggedIn={isUserLoggedIn}
                onJoinCommunity={() => {
                  if (isUserLoggedIn) {
                    setActiveTab('feed');
                  } else {
                    setAuthInitialMode('register');
                    setActiveTab('auth');
                  }
                }}
                onExploreFeed={() => setActiveTab('feed')}
                onOpenMatchmaker={() => setActiveTab('matchmaker')}
                onExploreProjects={() => setActiveTab('projects')}
                onExploreDevs={() => setActiveTab('developers')}
              />
            )}

            {activeTab === 'feed' && (
              <FeedSection
                posts={posts}
                setPosts={setPosts}
                currentUser={currentUser}
                projects={projects}
                opportunities={opportunities}
                onOpenNewPost={() => {
                  if (!isUserLoggedIn) {
                    setAuthInitialMode('login');
                    setActiveTab('auth');
                    return;
                  }
                  setIsNewPostOpen(true);
                }}
                onSelectDeveloper={handleSelectDeveloperByName}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsSection
                projects={projects}
                setProjects={setProjects}
                currentUser={currentUser}
                currentCompany={currentCompany}
                isRecruiterLoggedIn={isRecruiterLoggedIn}
                onOpenNewProject={() => {
                  if (!isUserLoggedIn && !isRecruiterLoggedIn) {
                    setAuthInitialMode('login');
                    setActiveTab('auth');
                    return;
                  }
                  setIsNewProjectOpen(true);
                }}
              />
            )}

            {activeTab === 'developers' && (
              <DevelopersSection
                developers={developers}
                onSelectDeveloper={(dev) => setSelectedDevForModal(dev)}
              />
            )}

            {activeTab === 'matchmaker' && (
              <MatchmakerSection
                developers={developers}
                projects={projects}
                onSelectDeveloper={(dev) => setSelectedDevForModal(dev)}
              />
            )}

            {activeTab === 'questions' && (
              <QuestionsSection
                questions={questions}
                setQuestions={setQuestions}
                onOpenAskQuestion={() => setIsAskQuestionOpen(true)}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsSection
                onSelectTab={setActiveTab}
                onSelectDeveloper={handleSelectDeveloperByName}
              />
            )}

            {activeTab === 'messages' && (
              <div className="messages-section-wrapper">
                <MessagesSection
                  conversations={MESSAGES_CONVERSATIONS}
                  currentUser={currentUser}
                />
              </div>
            )}

            {activeTab === 'company' && (
              isRecruiterLoggedIn ? (
                <CompanyPortalSection
                  company={currentCompany}
                  onUpdateCompany={handleUpdateCompany}
                  onOpenCompanyProfile={() => setIsCompanyProfileModalOpen(true)}
                  onSelectDeveloper={(dev) => setSelectedDevForModal(dev)}
                  onLogout={handleRecruiterLogout}
                />
              ) : (
                <RecruiterLoginSection onLoginSuccess={handleRecruiterLogin} />
              )
            )}

            {activeTab === 'admin' && (
              isAdminLoggedIn ? (
                <AdminDashboardSection
                  onLogout={handleAdminLogout}
                  posts={posts}
                  setPosts={setPosts}
                  developers={developers}
                  setDevelopers={setDevelopers}
                  projects={projects}
                  setProjects={setProjects}
                  communities={communities}
                  setCommunities={setCommunities}
                />
              ) : (
                <AdminLoginSection
                  onLoginSuccess={handleAdminLoginSuccess}
                  onCancel={() => setActiveTab('home')}
                />
              )
            )}

            {activeTab === 'admin-login' && (
              <AdminLoginSection
                onLoginSuccess={handleAdminLoginSuccess}
                onCancel={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'communities' && (
              <CommunitiesSection
                communities={communities}
                setCommunities={setCommunities}
                currentUser={currentUser}
                isAdminLoggedIn={isAdminLoggedIn}
              />
            )}


            {activeTab === 'opportunities' && (
              <OpportunitiesSection
                opportunities={opportunities}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'auth' && (
              <AuthSection
                initialMode={authInitialMode}
                onAuthSuccess={handleUserAuthSuccess}
                onEnterpriseAuthSuccess={handleRecruiterLogin}
                onCancel={() => setActiveTab('home')}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <NewPostModal
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        onAddPost={handleAddPost}
        currentUser={currentUser}
      />

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onAddProject={handleAddProject}
        currentUser={currentUser}
        currentCompany={currentCompany}
        isRecruiterLoggedIn={isRecruiterLoggedIn}
      />

      <AskQuestionModal
        isOpen={isAskQuestionOpen}
        onClose={() => setIsAskQuestionOpen(false)}
        onAddQuestion={handleAddQuestion}
        currentUser={currentUser}
      />

      <ProfileModal
        isOpen={!!selectedDevForModal}
        onClose={() => {
          setSelectedDevForModal(null);
          setIsProfileModalEditing(false);
        }}
        developer={selectedDevForModal}
        isCurrentUser={selectedDevForModal?.id === currentUser?.id || selectedDevForModal?.name === currentUser?.name}
        initialEditing={isProfileModalEditing}
        isUserLoggedIn={isUserLoggedIn}
        isRecruiterLoggedIn={isRecruiterLoggedIn}
        onOpenAuth={(mode = 'login') => {
          setSelectedDevForModal(null);
          setIsProfileModalEditing(false);
          setAuthInitialMode(mode);
          setActiveTab('auth');
        }}
        onSendMessage={(dev) => {
          setSelectedDevForModal(null);
          setIsProfileModalEditing(false);
          setActiveTab('messages');
        }}
        onLogout={() => {
          setSelectedDevForModal(null);
          setIsProfileModalEditing(false);
          handleUserLogout();
        }}
        onSwitchAccount={() => {
          setSelectedDevForModal(null);
          setIsProfileModalEditing(false);
          setAuthInitialMode('login');
          setActiveTab('auth');
        }}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Modale d'édition du profil entreprise */}
      <CompanyProfileModal
        isOpen={isCompanyProfileModalOpen}
        onClose={() => setIsCompanyProfileModalOpen(false)}
        company={currentCompany}
        onUpdateCompany={handleUpdateCompany}
      />

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      {/* Pied de page officiel AFRIKDEV (Responsive, Thème & i18n) */}
      <Footer
        setActiveTab={setActiveTab}
        isUserLoggedIn={isUserLoggedIn}
        setAuthInitialMode={setAuthInitialMode}
        setShowTermsModal={setShowTermsModal}
        setShowPrivacyModal={setShowPrivacyModal}
      />
    </div>
  );
}
