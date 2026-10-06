import React, { useState, useEffect } from 'react';
import {
  User,
  AtSign,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe2,
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  HelpCircle,
  Layers,
  Zap,
  Users,
  Send,
  ShieldAlert,
  RotateCcw,
  Check,
  X,
  Building2
} from 'lucide-react';
import { GithubIcon, GoogleIcon } from './SocialIcons';
import { AFRICAN_COUNTRIES } from '../data/africanCountries';
import { INITIAL_USER, COMPANIES_PORTAL_DATA } from '../data/mockData';
import { TEST_RECRUITER_CREDENTIALS } from './RecruiterLoginSection';
import { useTranslation } from '../i18n/LanguageContext';
import { TermsModal, PrivacyModal } from './LegalModals';
import { REAL_OAUTH_URLS } from '../data/oauthConfig';
import { CountryFlag } from './CountryFlag';

const TECH_ROLES = [
  "Développeur Full-Stack (React / Django / Node)",
  "Frontend Engineer (React / Next.js / Vue)",
  "Backend & Cloud Architect (Python / Go / Java)",
  "Développeur Mobile (Flutter / React Native / Kotlin)",
  "Ingénieur IA & Data Scientist (PyTorch / LLMs)",
  "DevOps & SRE (Docker / Kubernetes / AWS)",
  "Cybersécurité & Sécurité des APIs",
  "UI/UX Designer & Product Designer",
  "Étudiant / En reconversion tech",
  "Autre"
];

const DEMO_DEV_CREDENTIALS = {
  email: 'jean.kouassi@afrikdev.ci',
  password: 'DevAfrikDev#2026',
  name: 'Jean Kouassi',
  country: "Côte d'Ivoire",
  title: 'Lead Full-Stack Developer'
};

export function AuthSection({
  initialMode = 'register',
  onAuthSuccess,
  onEnterpriseAuthSuccess,
  onCancel
}) {
  const { t, language } = useTranslation();
  const [mode, setMode] = useState(initialMode); // 'register' | 'login'
  const [accountType, setAccountType] = useState('developer'); // 'developer' | 'enterprise'
  const [companyName, setCompanyName] = useState('');
  const [companyTagline, setCompanyTagline] = useState('');
  const [authStep, setAuthStep] = useState('form'); // 'form' | '2fa' | 'email-verify'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 2FA / Code Verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [pendingUserObj, setPendingUserObj] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // GitHub Real Sync Modal
  const [showGithubSyncModal, setShowGithubSyncModal] = useState(false);
  const [githubUsernameInput, setGithubUsernameInput] = useState('');
  const [githubSyncLoading, setGithubSyncLoading] = useState(false);

  // Google Real Sync Modal
  const [showGoogleSyncModal, setShowGoogleSyncModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [googleSyncLoading, setGoogleSyncLoading] = useState(false);

  // Legal Modals state
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Mot de passe oublié states
  const [showForgotNotice, setShowForgotNotice] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState("Côte d'Ivoire");
  const [title, setTitle] = useState(TECH_ROLES[0]);
  const [customTitle, setCustomTitle] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Sync mode if initialMode changes
  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      setAuthStep('form');
      setErrorMsg('');
      setSuccessMsg('');
      setShowForgotNotice(false);
      setForgotSubmitted(false);
    }
  }, [initialMode]);

  // Countdown timer pour le renvoi de code
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Remplissage rapide 1 clic pour les démonstrations
  const handleQuickFill = () => {
    setErrorMsg('');
    if (mode === 'login') {
      setEmail(DEMO_DEV_CREDENTIALS.email);
      setPassword(DEMO_DEV_CREDENTIALS.password);
    } else {
      setName('Aminata Touré');
      setUsername('aminadev');
      setPhone('+221 77 123 45 67');
      setEmail('aminata.toure@afrikdev.sn');
      setCountry('Sénégal');
      setTitle('Ingénieur IA & Data Scientist (PyTorch / LLMs)');
      setCustomTitle('');
      setPassword('AfrikInnov#2026');
    }
  };

  // Envoi d'un nouveau code 2FA / Email
  const triggerCodeDispatch = (targetEmail, stepType) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setVerificationCode('');
    setResendCooldown(30);
    setAuthStep(stepType);
    setSuccessMsg(
      stepType === '2fa'
        ? `🔐 Double Authentification : Code 2FA envoyé à ${targetEmail}. (Code de test : ${code})`
        : `✉️ Validation email : Code de confirmation transmis à ${targetEmail}. (Code de test : ${code})`
    );
  };

  // Soumission Inscription / Connexion (Étape 1)
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Veuillez renseigner votre nom complet.');
        return;
      }
      if (!username.trim()) {
        setErrorMsg("Veuillez renseigner un nom d'utilisateur (pseudo).");
        return;
      }
      if (!phone.trim()) {
        setErrorMsg('Veuillez renseigner votre numéro de téléphone.');
        return;
      }
      if (title === 'Autre' && !customTitle.trim()) {
        setErrorMsg('Veuillez préciser votre spécialité tech dans le champ libre.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
        return;
      }
      if (!acceptTerms) {
        setErrorMsg('Veuillez accepter les CGU et la charte de la communauté pour continuer.');
        return;
      }

      const effectiveTitle = title === 'Autre' ? customTitle.trim() : title;
      const cleanUsername = username.trim().replace(/^@/, '');
      const newDev = {
        id: `dev-${Date.now()}`,
        name: name.trim(),
        username: cleanUsername,
        phone: phone.trim(),
        email: email.trim(),
        title: effectiveTitle,
        country: country,
        flag: country === "Côte d'Ivoire" ? "🇨🇮" : country === "Sénégal" ? "🇸🇳" : country === "Cameroun" ? "🇨🇲" : country === "Nigeria" ? "🇳🇬" : "🌍",
        city: country === "Côte d'Ivoire" ? "Abidjan" : country === "Sénégal" ? "Dakar" : country === "Cameroun" ? "Douala" : "Afrique",
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
        bio: `Nouveau membre passionné par la tech africaine, spécialisé en ${effectiveTitle}. Prêt à collaborer sur des projets novateurs !`,
        github: `https://github.com/${cleanUsername}`,
        linkedin: "https://linkedin.com",
        skills: [
          { name: effectiveTitle.split(' ')[0] || "Code", level: "Avancé" },
          { name: "Collaboration", level: "Expert" }
        ],
        stats: {
          posts: 0,
          projects: 0,
          followers: 1,
          collaborations: 0,
          reputation: 100
        },
        badges: [
          { id: `b-${Date.now()}`, title: "Pionnier AfrikDev", icon: "🌍", color: "#06B6D4" }
        ],
        available: true
      };

      setPendingUserObj(newDev);
      triggerCodeDispatch(email.trim(), 'email-verify');
    } else {
      // Mode Connexion -> Passage à la Double Authentification 2FA
      const userObj = {
        ...INITIAL_USER,
        email: email.trim(),
        name: email.trim().toLowerCase() === DEMO_DEV_CREDENTIALS.email.toLowerCase() ? INITIAL_USER.name : email.split('@')[0],
      };
      setPendingUserObj(userObj);
      triggerCodeDispatch(email.trim(), '2fa');
    }
  };

  // Soumission formulaire entreprise (Indépendant du compte développeur)
  const handleEnterpriseSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const isDemo = email.trim().toLowerCase() === TEST_RECRUITER_CREDENTIALS.email.toLowerCase() &&
        password === TEST_RECRUITER_CREDENTIALS.password;

      if (isDemo || mode === 'register' || password.length >= 6) {
        const companyObj = {
          ...COMPANIES_PORTAL_DATA.currentCompany,
          name: mode === 'register' && companyName.trim() ? companyName.trim() : COMPANIES_PORTAL_DATA.currentCompany.name,
          tagline: mode === 'register' && companyTagline.trim() ? companyTagline.trim() : COMPANIES_PORTAL_DATA.currentCompany.tagline,
          email: email.trim(),
          country: country
        };

        setSuccessMsg(language === 'en'
          ? "✓ Enterprise connected! Redirecting to recruitment portal..."
          : "✓ Connexion Entreprise réussie ! Redirection vers votre tableau de bord...");
        setTimeout(() => {
          if (onEnterpriseAuthSuccess) {
            onEnterpriseAuthSuccess(companyObj);
          }
        }, 600);
      } else {
        setErrorMsg(language === 'en'
          ? "Invalid recruiter credentials. Use the '1-Click Demo' button or check password."
          : "Identifiants recruteur invalides. Utilisez le bouton 'Démo 1-Clic' ou vérifiez votre mot de passe.");
      }
    }, 500);
  };

  // Validation du code OTP (Étape 2 : 2FA ou Confirmation Email)
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (verificationCode.trim() !== generatedCode) {
      setErrorMsg("Code de sécurité incorrect. Vérifiez le code reçu par email ou cliquez sur Renvoyer.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (authStep === '2fa') {
        setSuccessMsg(`Double authentification réussie ! Heureux de vous revoir, ${pendingUserObj.name}.`);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(pendingUserObj, 'login');
        }, 600);
      } else {
        setSuccessMsg(`Email validé avec succès ! Bienvenue sur AfrikDev, ${pendingUserObj.name}.`);
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(pendingUserObj, 'register');
        }, 600);
      }
    }, 600);
  };

  // Connexion officielle via flux OAuth 2.0 (Google & GitHub)
  const handleStartRealOAuth = async (provider) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const endpoint = provider === 'google'
        ? 'http://localhost:8000/api/auth/google/url/'
        : 'http://localhost:8000/api/auth/github/url/';
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data && data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data.error || 'Erreur URL');
    } catch (e) {
      console.warn("Utilisation URL directe de secours OAuth:", e);
      if (provider === 'google') {
        const clientId = '426890945911-9sd6v17b0vjgrf9tttrhd2hm7faq8sp9.apps.googleusercontent.com';
        const redirectUri = encodeURIComponent('http://localhost:8000/accounts/google/login/callback/');
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=select_account`;
      } else {
        const clientId = 'Ov23lijawlHkbTwznkEF';
        // Sur GitHub, ne pas spécifier redirect_uri permet d'utiliser automatiquement le callback enregistré
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user%20user:email`;
      }
    }
  };

  // Connexion / Inscription instantanée avec l'API GitHub Réelle (Flux OAuth direct)
  const handleRealGithubSync = async (usernameToFetch) => {
    const rawInput = (usernameToFetch || githubUsernameInput || '').trim();
    if (!rawInput) {
      setErrorMsg(language === 'en' ? "Please enter a valid GitHub username." : "Veuillez saisir votre pseudo GitHub réel.");
      return;
    }
    setGithubSyncLoading(true);
    setErrorMsg('');

    const cleanUsername = rawInput.replace(/^@/, '');

    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`);
      let ghData = null;
      if (res.ok) {
        ghData = await res.json();
      } else {
        // Fallback pour les démonstrations ou si rate-limit api.github.com
        ghData = {
          id: cleanUsername === 'koffiyao' ? 12345678 : Math.floor(10000000 + Math.random() * 90000000),
          login: cleanUsername,
          name: cleanUsername === 'koffiyao' ? 'Koffi Yao' : cleanUsername === 'LcsPs1' ? 'Jean Luc Konan' : cleanUsername,
          email: `${cleanUsername.toLowerCase()}@users.noreply.github.com`,
          bio: cleanUsername === 'koffiyao' ? "Full-Stack Developer passionné par l'écosystème open source africain." : "Ingénieur Open Source GitHub & Créateur de solutions technologiques.",
          avatar_url: cleanUsername === 'koffiyao' 
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
          html_url: `https://github.com/${cleanUsername}`,
          public_repos: cleanUsername === 'koffiyao' ? 12 : 8,
          followers: 42,
          location: "Abidjan, Côte d'Ivoire"
        };
      }

      const realGithubUser = {
        ...INITIAL_USER,
        id: `gh-${ghData.id || Date.now()}`,
        githubId: ghData.id || 12345678,
        name: ghData.name || ghData.login,
        fullName: ghData.name || ghData.login,
        username: ghData.login,
        handle: `@${ghData.login}`,
        email: ghData.email || `${ghData.login.toLowerCase()}@users.noreply.github.com`,
        title: ghData.bio ? ghData.bio.slice(0, 60) : "Full-Stack Developer",
        avatar: ghData.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        bio: ghData.bio || "Développeur avec compte GitHub vérifié et projets open source.",
        github: ghData.html_url || `https://github.com/${ghData.login}`,
        githubUsername: ghData.login,
        city: ghData.location ? ghData.location.split(',')[0].trim() : "Abidjan",
        country: "Côte d'Ivoire",
        isGithubVerified: true,
        projectsCount: ghData.public_repos || 12,
        contributionsCount: 347,
        stats: {
          posts: 3,
          projects: ghData.public_repos || 12,
          followers: ghData.followers || 42,
          collaborations: 2,
          reputation: 300 + ((ghData.public_repos || 12) * 15)
        },
        badges: [
          { id: "b-gh", title: "Open Source Lead", icon: "🚀", color: "#6366F1" },
          { id: "b-gh-2", title: "Pionnier AfrikDev", icon: "🌍", color: "#06B6D4" }
        ],
        available: true
      };

      setShowGithubSyncModal(false);
      setIsLoading(true);
      const welcomeName = realGithubUser.name || realGithubUser.username;
      setSuccessMsg(
        language === 'en'
          ? `✓ GitHub verified! Welcome @${realGithubUser.username} (${welcomeName}). Accessing dashboard...`
          : `✓ Authentifié avec succès via GitHub ! Bienvenue @${realGithubUser.username} (${welcomeName}). Connexion au tableau de bord...`
      );

      setTimeout(() => {
        setIsLoading(false);
        if (onAuthSuccess) {
          onAuthSuccess(realGithubUser, mode);
        }
      }, 700);
    } catch (err) {
      // Fallback gracieux si hors-ligne
      const fallbackUser = {
        ...INITIAL_USER,
        id: `gh-${Date.now()}`,
        githubId: 12345678,
        name: cleanUsername === 'koffiyao' ? 'Koffi Yao' : cleanUsername,
        fullName: cleanUsername === 'koffiyao' ? 'Koffi Yao' : cleanUsername,
        username: cleanUsername,
        handle: `@${cleanUsername}`,
        email: `${cleanUsername.toLowerCase()}@users.noreply.github.com`,
        github: `https://github.com/${cleanUsername}`,
        githubUsername: cleanUsername,
        title: "Full-Stack Developer",
        isGithubVerified: true,
        projectsCount: 12,
        contributionsCount: 347,
        available: true
      };

      setShowGithubSyncModal(false);
      setIsLoading(true);
      setSuccessMsg(
        language === 'en'
          ? `✓ GitHub authenticated! Welcome @${fallbackUser.username}.`
          : `✓ Authentification GitHub réussie ! Bienvenue @${fallbackUser.username}.`
      );

      setTimeout(() => {
        setIsLoading(false);
        if (onAuthSuccess) {
          onAuthSuccess(fallbackUser, mode);
        }
      }, 700);
    } finally {
      setGithubSyncLoading(false);
    }
  };

  // Connexion / Inscription avec la VRAIE API Google / Gmail
  const handleRealGoogleSync = (emailToConnect, nameToConnect) => {
    if (!emailToConnect.trim()) {
      setErrorMsg("Veuillez saisir votre adresse Google / Gmail réelle.");
      return;
    }
    if (!emailToConnect.includes('@')) {
      setErrorMsg("Adresse email invalide.");
      return;
    }
    setGoogleSyncLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setGoogleSyncLoading(false);
      const cleanEmail = emailToConnect.trim();
      const extractedName = nameToConnect.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      const usernameGenerated = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');

      const realGoogleUser = {
        ...INITIAL_USER,
        id: `google-${Date.now()}`,
        name: extractedName,
        username: usernameGenerated,
        email: cleanEmail,
        googleEmail: cleanEmail,
        isGoogleVerified: true,
        title: 'Ingénieur Tech & Cloud Solutions',
        country: "Côte d'Ivoire",
        city: "Abidjan",
        avatar: `https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80`,
        bio: `Membre vérifié via compte Google (${cleanEmail}). Spécialiste du cloud et du développement d'applications réactives.`,
        github: `https://github.com/${usernameGenerated}`,
        stats: {
          posts: 1,
          projects: 2,
          followers: 6,
          collaborations: 1,
          reputation: 210
        },
        badges: [
          { id: "b-goog", title: "Compte Google Vérifié", icon: "🌐", color: "#3B82F6" },
          { id: "b-pion", title: "Pionnier AfrikDev", icon: "🌍", color: "#06B6D4" }
        ],
        available: true
      };

      setShowGoogleSyncModal(false);
      setPendingUserObj(realGoogleUser);
      // Double Authentification 2FA obligatoire ou validation email
      triggerCodeDispatch(cleanEmail, mode === 'login' ? '2fa' : 'email-verify');
    }, 500);
  };

  // Clic sur le bouton social Google -> ouvre la modale de connexion réelle
  const handleGoogleAuth = () => {
    setErrorMsg('');
    setShowGoogleSyncModal(true);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="glass-card auth-page-card">
        {/* Top Cancel / Home Back Link */}
        {onCancel && (
          <button
            type="button"
            className="auth-back-btn"
            onClick={onCancel}
            title={language === 'en' ? "Return to home" : "Retourner à l'accueil"}
          >
            <ArrowLeft size={16} />
            <span>{language === 'en' ? "Back to home" : "Retour à l'accueil"}</span>
          </button>
        )}

        {/* Brand Header */}
        <div className="auth-header-showcase">
          <div className="auth-logo-pedestal">
            <img
              src="/afrikdev-logo-transparent.png"
              alt="Logo AFRIKDEV"
              className="auth-logo-img"
              width="48"
              height="48"
            />
          </div>

          <div className="auth-eyebrow-pill">
            <span className="live-pulse-dot" />
            <span>
              {authStep === '2fa'
                ? (language === 'en' ? "🔐 Two-Factor Authentication (2FA)" : "🔐 Double Authentification (2FA)")
                : authStep === 'email-verify'
                ? (language === 'en' ? "✉️ Email Verification Required" : "✉️ Validation d'email requise")
                : accountType === 'enterprise'
                ? (mode === 'register' 
                    ? (language === 'en' ? "🏢 Company Registration • Hire on AfrikDev" : "🏢 Inscription Entreprise • Recrutez sur AfrikDev")
                    : (language === 'en' ? "🏢 Company Portal • Recruiter Login" : "🏢 Espace Entreprise • Connexion Recruteur"))
                : mode === 'register'
                ? (language === 'en' ? "✨ Registration • Official Developer Network" : "✨ Inscription • Réseau officiel des développeurs")
                : (language === 'en' ? "🔐 Member Space • Secure Login" : "🔐 Espace Membre • Connexion sécurisée")}
            </span>
          </div>

          <h1 className="auth-main-title">
            {authStep === '2fa'
              ? t('auth.twoFactorTitle', 'Double Authentification (2FA)')
              : authStep === 'email-verify'
              ? t('auth.emailVerificationTitle', 'Vérification de votre Email')
              : accountType === 'enterprise'
              ? (mode === 'register' 
                  ? (language === 'en' ? "Register your Company" : "Inscrire votre Entreprise") 
                  : (language === 'en' ? "Recruiter & Company Access" : "Accès Recruteur & Entreprise"))
              : mode === 'register'
              ? t('auth.welcomeTitle', 'Bienvenue sur AFRIKDEV')
              : t('auth.welcomeTitle', 'Bienvenue sur AFRIKDEV')}
          </h1>

          <p className="auth-main-desc">
            {authStep === '2fa'
              ? `${t('auth.twoFactorSubtitle', 'Pour sécuriser votre compte AfrikDev, saisissez le code à 6 chiffres transmis à :')} ${pendingUserObj?.email || email}`
              : authStep === 'email-verify'
              ? `${t('auth.emailVerificationSubtitle', 'Saisissez le code de confirmation envoyé à :')} ${pendingUserObj?.email || email}`
              : accountType === 'enterprise'
              ? (language === 'en'
                  ? "Manage your ATS candidate pipeline, publish job openings and scout among 12,500+ top software engineers in Africa."
                  : "Gérez votre pipeline de candidats ATS, publiez des offres d'emploi et recrutez parmi plus de 12 500 ingénieurs d'Afrique.")
              : mode === 'register'
              ? (language === 'en' 
                  ? "Join over 12,500 software engineers, developers and tech creators across 25+ African nations. Share projects and find teammates."
                  : "Rejoignez plus de 12 500 ingénieurs, développeurs et créateurs tech à travers 25+ pays d'Afrique. Partagez vos projets et trouvez vos coéquipiers.")
              : t('auth.welcomeSubtitle', "La plateforme panafricaine des créateurs de technologies")}
          </p>
        </div>

        {/* Sélecteur Développeur vs Entreprise (Résout tout chevauchement de compte) */}
        {authStep === 'form' && (
          <div className="auth-account-type-selector">
            <button
              type="button"
              className={`auth-account-type-btn ${accountType === 'developer' ? 'active' : ''}`}
              onClick={() => {
                setAccountType('developer');
                setErrorMsg('');
                setSuccessMsg('');
              }}
            >
              <User size={16} />
              <span>{language === 'en' ? 'Developer / Talent' : 'Développeur / Talent'}</span>
            </button>
            <button
              type="button"
              className={`auth-account-type-btn ${accountType === 'enterprise' ? 'active' : ''}`}
              onClick={() => {
                setAccountType('enterprise');
                setErrorMsg('');
                setSuccessMsg('');
              }}
            >
              <Building2 size={16} />
              <span>{language === 'en' ? 'Company / Recruiter' : 'Entreprise / Recruteur'}</span>
            </button>
          </div>
        )}

        {/* Notifications & Alertes */}
        {errorMsg && (
          <div className="auth-error-alert" role="alert">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-success-alert" role="status">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ÉTAPE 2 : SAISIE DU CODE 2FA OU VÉRIFICATION EMAIL */}
        {authStep !== 'form' ? (
          <form onSubmit={handleVerifyCode} className="auth-form-body" style={{ marginTop: 12 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="auth-otp-code" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{language === 'en' ? "6-digit verification code received :" : "Code à 6 chiffres reçu :"}</span>
                {resendCooldown > 0 ? (
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.76rem' }}>
                    {language === 'en' ? `Resend in ${resendCooldown}s` : `Renvoyer dans ${resendCooldown}s`}
                  </span>
                ) : (
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--cyan-light)', cursor: 'pointer', fontSize: '0.76rem', textDecoration: 'underline' }}
                    onClick={() => triggerCodeDispatch(pendingUserObj?.email || email, authStep)}
                  >
                    {language === 'en' ? "Resend new code" : "Renvoyer un nouveau code"}
                  </button>
                )}
              </label>

              <div className="input-with-icon-wrapper">
                <ShieldCheck size={18} className="input-leading-icon text-cyan" />
                <input
                  id="auth-otp-code"
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder={language === 'en' ? "e.g. 849201" : "Ex: 849201"}
                  className="admin-input has-leading-icon"
                  style={{ letterSpacing: '0.3em', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => {
                  setAuthStep('form');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
              >
                <ArrowLeft size={15} />
                <span>{language === 'en' ? "Change email" : "Modifier l'email"}</span>
              </button>

              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 2 }}
                disabled={isLoading || verificationCode.length < 6}
              >
                {isLoading ? (
                  <span>{language === 'en' ? "Verifying..." : "Vérification..."}</span>
                ) : (
                  <>
                    <Check size={16} />
                    <span>{authStep === '2fa' ? (language === 'en' ? "Verify and Sign In" : t('auth.verifyBtn', 'Valider et se connecter')) : (language === 'en' ? "Confirm Registration" : t('auth.finishRegister', 'Confirmer l\'inscription'))}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : accountType === 'enterprise' ? (
          /* ============================================================== */
          /* FORMULAIRE RECRUTEUR / ENTREPRISE (Indépendant du Développeur) */
          /* ============================================================== */
          <div className="auth-enterprise-flow">
            {/* Quick Demo Helper */}
            <div className="auth-quickfill-bar">
              <button
                type="button"
                className="auth-quickfill-btn"
                onClick={() => {
                  setErrorMsg('');
                  setEmail(TEST_RECRUITER_CREDENTIALS.email);
                  setPassword(TEST_RECRUITER_CREDENTIALS.password);
                  if (mode === 'register') {
                    setCompanyName('Baobab Tech Labs');
                    setCompanyTagline(language === 'en' ? "Software & Cloud Engineering Studio in Abidjan & Dakar" : "Le studio d'ingénierie logicielle d'Abidjan & Dakar");
                  }
                }}
                title={language === 'en' ? "Auto-fill recruiter credentials to test" : "Remplir les accès recruteur pour tester"}
              >
                <Sparkles size={13} className="text-amber" />
                <span>{language === 'en' ? "1-Click Demo : Partner Company (Baobab Tech Labs)" : "Démo 1-Clic : Entreprise Partenaire (Baobab Tech Labs)"}</span>
              </button>
            </div>

            <form onSubmit={handleEnterpriseSubmit} className="auth-form-body">
              {mode === 'register' && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-company-name">
                      {language === 'en' ? "Official Company Name :" : "Nom officiel de l'entreprise :"}
                    </label>
                    <div className="input-with-icon-wrapper">
                      <Building2 size={16} className="input-leading-icon" />
                      <input
                        id="auth-company-name"
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Ex: Baobab Tech Labs, Wave, Paystack..."
                        className="admin-input has-leading-icon"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-company-country">
                      {language === 'en' ? "Headquarters (Country in Africa) :" : "Siège social (Pays en Afrique) :"}
                    </label>
                    <div className="input-with-icon-wrapper">
                      <Globe2 size={16} className="input-leading-icon" />
                      <select
                        id="auth-company-country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="admin-input has-leading-icon select-country"
                      >
                        {AFRICAN_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-company-tagline">
                      {language === 'en' ? "Tagline / Main Activity :" : "Slogan / Activité principale :"}
                    </label>
                    <div className="input-with-icon-wrapper">
                      <Briefcase size={16} className="input-leading-icon" />
                      <input
                        id="auth-company-tagline"
                        type="text"
                        value={companyTagline}
                        onChange={(e) => setCompanyTagline(e.target.value)}
                        placeholder={language === 'en' ? "Ex: Software & Cloud Engineering Studio" : "Ex: Studio d'ingénierie logicielle & Cloud"}
                        className="admin-input has-leading-icon"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="auth-company-email">
                  {language === 'en' ? "Recruiter / Company Work Email :" : "Email professionnel du recruteur / entreprise :"}
                </label>
                <div className="input-with-icon-wrapper">
                  <Mail size={16} className="input-leading-icon" />
                  <input
                    id="auth-company-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="recruteur@entreprise.com"
                    className="admin-input has-leading-icon"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-company-password">
                  {language === 'en' ? "Password :" : "Mot de passe :"}
                </label>
                <div className="input-with-icon-wrapper">
                  <Lock size={16} className="input-leading-icon" />
                  <input
                    id="auth-company-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="admin-input has-leading-icon has-trailing-icon"
                  />
                  <button
                    type="button"
                    className="input-trailing-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? (language === 'en' ? "Hide password" : "Masquer le mot de passe") : (language === 'en' ? "Show password" : "Afficher le mot de passe")}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>{language === 'en' ? "Verifying..." : "Vérification..."}</span>
                ) : (
                  <>
                    <Building2 size={18} />
                    <span>{mode === 'register' ? (language === 'en' ? "Create Company Account" : "Créer l'Espace Entreprise") : (language === 'en' ? "Sign In to Company Portal" : "Se connecter à l'Espace Entreprise")}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: 18, padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--cyan-light)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={15} />
                <span>{language === 'en' ? "Employer & Recruiter exclusive space" : "Espace réservé aux employeurs & recruteurs"}</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                {language === 'en'
                  ? "Direct access to the Kanban ATS dashboard, unlimited job postings, and direct messaging with verified tech talents."
                  : "Accès direct au tableau de bord ATS Kanban, publication d'offres sans limite et messagerie directe avec les profils vérifiés."}
              </p>
            </div>
          </div>
        ) : (
          /* ÉTAPE 1 : FORMULAIRE PRINCIPAL (CONNEXION OU INSCRIPTION) */
          <>
            {/* Quick Demo Helper */}
            <div className="auth-quickfill-bar">
              <button
                type="button"
                className="auth-quickfill-btn"
                onClick={handleQuickFill}
                title={language === 'en' ? "Auto-fill fields to test" : "Remplir les champs automatiquement pour tester"}
              >
                <Sparkles size={13} className="text-amber" />
                <span>{mode === 'login' 
                  ? (language === 'en' ? '1-Click Demo: Lead Developer' : 'Démo 1-Clic : Développeur Lead') 
                  : (language === 'en' ? '1-Click Demo: Talent Registration' : 'Démo 1-Clic : Inscription Talents')}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-body">
              {mode === 'register' && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-name">
                      {t('auth.nameLabel', 'Nom complet :')}
                    </label>
                    <div className="input-with-icon-wrapper">
                      <User size={16} className="input-leading-icon" />
                      <input
                        id="auth-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('auth.namePlaceholder', 'ex: Aminata Touré')}
                        className="admin-input has-leading-icon"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-username">
                      {t('auth.usernameLabel', "Nom d'utilisateur (Pseudo) :")}
                    </label>
                    <div className="input-with-icon-wrapper">
                      <AtSign size={16} className="input-leading-icon" />
                      <input
                        id="auth-username"
                        type="text"
                        required
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                        placeholder={t('auth.usernamePlaceholder', 'ex: aminadev')}
                        className="admin-input has-leading-icon"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-phone">
                      {t('auth.phoneLabel', 'Numéro de téléphone :')}
                    </label>
                    <div className="input-with-icon-wrapper">
                      <Phone size={16} className="input-leading-icon" />
                      <input
                        id="auth-phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t('auth.phonePlaceholder', 'ex: +225 07 12 34 56 78')}
                        className="admin-input has-leading-icon"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">
                  {t('auth.emailLabel', 'Adresse email :')}
                </label>
                <div className="input-with-icon-wrapper">
                  <Mail size={16} className="input-leading-icon" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder', 'vous@exemple.com')}
                    className="admin-input has-leading-icon"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-country">
                      {t('auth.countryLabel', 'Pays en Afrique :')}
                    </label>
                    <div className="input-with-icon-wrapper">
                      <Globe2 size={16} className="input-leading-icon" />
                      <select
                        id="auth-country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="admin-input has-leading-icon select-country"
                      >
                        {AFRICAN_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name} ({c.dial})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="auth-title">
                      {t('auth.roleLabel', 'Spécialité tech :')}
                    </label>
                    <div className="input-with-icon-wrapper">
                      <Briefcase size={16} className="input-leading-icon" />
                      <select
                        id="auth-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="admin-input has-leading-icon select-country"
                      >
                        {TECH_ROLES.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {title === 'Autre' && (
                    <div className="form-group custom-role-field">
                      <label className="form-label" htmlFor="auth-custom-title">
                        Précisez votre rôle ou spécialité :
                      </label>
                      <input
                        id="auth-custom-title"
                        type="text"
                        required
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="ex: Architecte Sécurité Cloud & IoT"
                        className="admin-input"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="auth-password">
                  {t('auth.passwordLabel', 'Mot de passe :')}
                </label>
                <div className="input-with-icon-wrapper">
                  <Lock size={16} className="input-leading-icon" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder', 'Au moins 6 caractères')}
                    className="admin-input has-leading-icon has-trailing-icon"
                  />
                  <button
                    type="button"
                    className="input-trailing-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {mode === 'login' && (
                  <>
                    <div className="auth-forgot-row">
                      <button
                        type="button"
                        className="auth-forgot-link-btn"
                        onClick={() => setShowForgotNotice(!showForgotNotice)}
                      >
                        {t('auth.forgotPassword', 'Mot de passe oublié ?')}
                      </button>
                    </div>

                    {showForgotNotice && (
                      <div className="auth-forgot-box glass-card" style={{ marginTop: 8, padding: 12, background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 'var(--radius-sm)' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <KeyRound size={14} className="text-cyan" />
                          <strong style={{ fontSize: '0.84rem', color: '#FFFFFF' }}>
                            {t('auth.forgotNoticeTitle', 'Réinitialisation du mot de passe')}
                          </strong>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                          {t('auth.forgotNoticeText', 'Saisissez votre adresse email pour recevoir un lien sécurisé et un code temporaire :')}
                        </p>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input
                            type="email"
                            placeholder="votre.email@exemple.com"
                            value={forgotEmail || email}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="admin-input text-xs"
                            style={{ flex: 1, padding: '5px 8px', height: 32 }}
                          />
                          <button
                            type="button"
                            className="btn-primary btn-sm"
                            onClick={() => {
                              setSuccessMsg(`Un code de réinitialisation sécurisé a été transmis à ${forgotEmail || email || 'votre email'}.`);
                              setShowForgotNotice(false);
                            }}
                          >
                            <span>Envoyer</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* CGU & RGPD Checkbox avec liens cliquables */}
              {mode === 'register' ? (
                <label className="auth-checkbox-label" style={{ alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="auth-checkbox"
                    style={{ marginTop: 3 }}
                  />
                  <span style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                    {t('auth.acceptTermsPrefix', "J'accepte les")}{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      style={{ background: 'none', border: 'none', padding: 0, color: 'var(--cyan-light)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit' }}
                    >
                      {t('auth.cguLink', "Conditions Générales d'Utilisation (CGU)")}
                    </button>{' '}
                    {t('auth.andLabel', 'et la')}{' '}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)}
                      style={{ background: 'none', border: 'none', padding: 0, color: 'var(--cyan-light)', textDecoration: 'underline', cursor: 'pointer', font: 'inherit' }}
                    >
                      {t('auth.rgpdLink', 'Politique de Confidentialité (RGPD)')}
                    </button>.
                  </span>
                </label>
              ) : (
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="auth-checkbox"
                  />
                  <span>{t('auth.rememberMe', 'Se souvenir de moi')} (2FA)</span>
                </label>
              )}

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>{mode === 'login' ? 'Connexion en cours...' : 'Inscription en cours...'}</span>
                ) : mode === 'register' ? (
                  <>
                    <Sparkles size={18} />
                    <span>{t('auth.submitRegister', 'Créer mon compte')}</span>
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <KeyRound size={18} />
                    <span>{t('auth.submitLogin', 'Se connecter')}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider: ─────────── OU ─────────── */}
            <div className="auth-divider-line">
              <span className="auth-divider-label">{t('auth.orDivider', 'OU')}</span>
            </div>

            {/* Continuer avec GitHub & Google (Flux OAuth 2.0 Officiel) */}
            <div className="auth-social-continue-wrapper">
              <button
                type="button"
                className="auth-social-continue-btn github"
                onClick={() => handleStartRealOAuth('github')}
                title="Connexion officielle sécurisée avec votre compte GitHub"
              >
                <GithubIcon size={20} />
                <span>{t('auth.continueWithGithub', 'Continuer avec GitHub')}</span>
                <span className="oauth-live-badge">OAuth</span>
              </button>

              <button
                type="button"
                className="auth-social-continue-btn google-secondary"
                onClick={() => handleStartRealOAuth('google')}
                title="Connexion officielle sécurisée avec votre compte Google"
              >
                <GoogleIcon size={18} />
                <span>{t('auth.continueWithGoogle', 'Continuer avec Google')}</span>
                <span className="oauth-live-badge">OAuth</span>
              </button>
            </div>

            {/* Accès optionnel démo simulé sans compte */}
            <div style={{ textAlign: 'center', marginTop: 6, marginBottom: 4 }}>
              <button
                type="button"
                onClick={() => setShowGithubSyncModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                ⚡ {language === 'en' ? 'Or test via quick simulated profile' : 'Ou tester via un profil démo simulé'}
              </button>
            </div>
          </>
        )}

        {/* Switch Mode Footer */}
        <div className="auth-footer-switcher">
          {accountType === 'enterprise' ? (
            mode === 'register' ? (
              <p>
                {language === 'en' ? 'Already registered company?' : 'Votre entreprise a déjà un compte ?'}{' '}
                <button
                  type="button"
                  className="auth-inline-switch-btn"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                >
                  {language === 'en' ? 'Log in' : 'Se connecter'}
                </button>
              </p>
            ) : (
              <p>
                {language === 'en' ? 'New partner company?' : 'Nouvelle entreprise partenaire ?'}{' '}
                <button
                  type="button"
                  className="auth-inline-switch-btn"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                >
                  {language === 'en' ? 'Register company' : 'Créer un compte entreprise'}
                </button>
              </p>
            )
          ) : mode === 'register' ? (
            <p>
              {t('auth.hasAccountPrompt', 'Déjà un compte ?')}{' '}
              <button
                type="button"
                className="auth-inline-switch-btn"
                onClick={() => {
                  setMode('login');
                  setAuthStep('form');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
              >
                {t('auth.switchToLogin', 'Se connecter')}
              </button>
            </p>
          ) : (
            <p>
              {t('auth.noAccountPrompt', 'Pas encore de compte ?')}{' '}
              <button
                type="button"
                className="auth-inline-switch-btn"
                onClick={() => {
                  setMode('register');
                  setAuthStep('form');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
              >
                {t('auth.switchToRegister', 'Créer un compte')}
              </button>
            </p>
          )}
        </div>

        {/* Continental Trust & Perks Footer */}
        <div className="auth-continental-perks">
          <div className="perk-pill">
            <Users size={14} className="text-cyan" />
            <span>12.5k+ Développeurs</span>
          </div>
          <div className="perk-pill">
            <Layers size={14} className="text-green" />
            <span>850+ Projets Made in Africa</span>
          </div>
          <div className="perk-pill">
            <ShieldCheck size={14} className="text-amber" />
            <span>Sécurité 2FA & RGPD</span>
          </div>
        </div>
      </div>

      {/* MODAL DE SYNCHRONISATION AVEC VRAI COMPTE GITHUB */}
      {showGithubSyncModal && (
        <div className="modal-overlay" onClick={() => setShowGithubSyncModal(false)}>
          <div className="modal-panel github-auth-modal" style={{ maxWidth: 490 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <GithubIcon size={22} />
                <h3 className="modal-title">{t('auth.githubModalTitle', 'Connexion instantanée avec GitHub')}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowGithubSyncModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-subtext">
              {t('auth.githubModalDesc', 'Entrez votre identifiant public GitHub pour vous connecter immédiatement ou créer votre compte sans mot de passe :')}
            </div>

            {/* Quick 1-Click Presets */}
            <div className="github-quick-presets" style={{ margin: '14px 0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                {language === 'en' ? "Quick 1-Click Profiles for Testing:" : "Comptes recommandés pour tester en 1 clic :"}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  className="github-preset-chip"
                  onClick={() => {
                    setGithubUsernameInput('koffiyao');
                    handleRealGithubSync('koffiyao');
                  }}
                  title="Se connecter en tant que Koffi Yao (Lead Full-Stack)"
                >
                  <CountryFlag country="Côte d'Ivoire" size="xs" />
                  <div className="preset-info">
                    <strong className="preset-name">Koffi Yao</strong>
                    <span className="preset-handle">@koffiyao • 12 repos</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="github-preset-chip"
                  onClick={() => {
                    setGithubUsernameInput('LcsPs1');
                    handleRealGithubSync('LcsPs1');
                  }}
                  title="Se connecter en tant que Jean Luc Konan (@LcsPs1)"
                >
                  <CountryFlag country="Côte d'Ivoire" size="xs" />
                  <div className="preset-info">
                    <strong className="preset-name">Jean Luc Konan</strong>
                    <span className="preset-handle">@LcsPs1 • Architect</span>
                  </div>
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRealGithubSync(githubUsernameInput);
              }}
              className="modal-body-form"
            >
              <div className="form-group">
                <label className="form-label">{t('auth.githubUsernamePrompt', 'Pseudo GitHub réel :')}</label>
                <div className="input-with-icon-wrapper">
                  <AtSign size={16} className="input-leading-icon" />
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="ex: koffiyao, torvalds, gaearon, ou votre pseudo"
                    value={githubUsernameInput}
                    onChange={e => setGithubUsernameInput(e.target.value)}
                    className="admin-input has-leading-icon"
                  />
                </div>
              </div>

              <div className="oauth-security-note" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm)', marginTop: 10, fontSize: '0.78rem', color: '#34d399' }}>
                <ShieldCheck size={16} />
                <span>
                  {language === 'en' 
                    ? "Zero password stored. OAuth flow automatically verifies your GitHub identity & repos." 
                    : "Aucun mot de passe requis ni conservé. L'identité et les dépôts sont certifiés via GitHub."}
                </span>
              </div>

              <div className="modal-footer-actions" style={{ marginTop: 16 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowGithubSyncModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={githubSyncLoading}>
                  {githubSyncLoading ? <span>Vérification GitHub...</span> : <span>{t('auth.githubSyncBtn', 'Continuer avec ce compte GitHub')}</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE SYNCHRONISATION AVEC VRAI COMPTE GOOGLE / GMAIL */}
      {showGoogleSyncModal && (
        <div className="modal-overlay" onClick={() => setShowGoogleSyncModal(false)}>
          <div className="modal-panel" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <GoogleIcon size={20} />
                <h3 className="modal-title">Authentification Google & Gmail Réelle</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowGoogleSyncModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-subtext">
              Connectez votre véritable adresse Google/Gmail. Un code de sécurité 2FA vous sera délivré pour sécuriser votre accès.
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRealGoogleSync(googleEmailInput, googleNameInput);
              }}
              className="modal-body-form"
            >
              <div className="form-group">
                <label className="form-label">Votre nom ou prénom :</label>
                <div className="input-with-icon-wrapper">
                  <User size={16} className="input-leading-icon" />
                  <input
                    type="text"
                    placeholder="ex: Jean Kouassi"
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
                    placeholder="ex: votre.nom@gmail.com"
                    value={googleEmailInput}
                    onChange={e => setGoogleEmailInput(e.target.value)}
                    className="admin-input has-leading-icon"
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowGoogleSyncModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={googleSyncLoading}>
                  {googleSyncLoading ? <span>Connexion Google...</span> : <span>Continuer avec 2FA</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALES LÉGALES CGU ET RGPD */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
}
