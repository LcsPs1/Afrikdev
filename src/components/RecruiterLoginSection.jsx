import React, { useState } from 'react';
import {
  Building2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Briefcase,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

// Compte recruteur de test (prototype) — à remplacer par une vraie authentification backend.
export const TEST_RECRUITER_CREDENTIALS = {
  email: 'recruteur@afrikdev.com',
  password: 'Recrute#2026!'
};

export const RECRUITER_SESSION_KEY = 'afrikdev_recruiter_authenticated';

export function RecruiterLoginSection({ onLoginSuccess }) {
  const { language } = useTranslation();
  const isEn = language === 'en';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickFill = () => {
    setEmail(TEST_RECRUITER_CREDENTIALS.email);
    setPassword(TEST_RECRUITER_CREDENTIALS.password);
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (
        email.trim().toLowerCase() === TEST_RECRUITER_CREDENTIALS.email.toLowerCase() &&
        password === TEST_RECRUITER_CREDENTIALS.password
      ) {
        sessionStorage.setItem(RECRUITER_SESSION_KEY, 'true');
        onLoginSuccess();
      } else {
        setErrorMsg(isEn
          ? "Invalid recruiter credentials. This space is reserved for partner companies."
          : "Identifiants recruteur invalides. Cet espace est réservé aux entreprises partenaires.");
      }
    }, 600);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="glass-card admin-login-card">
        <div className="admin-login-top-bar">
          <div className="secret-tag">
            <Lock size={12} className="text-amber" />
            <span>{isEn ? "Recruiter-only portal" : "Espace réservé aux recruteurs"}</span>
          </div>
        </div>

        <div className="admin-login-header">
          <div className="admin-shield-icon">
            <Building2 size={38} className="text-cyan" />
          </div>
          <h1 className="admin-login-title">{isEn ? "Company Portal" : "Espace Entreprises"}</h1>
          <p className="admin-login-desc">
            {isEn
              ? "Publish your job openings and track your applicants. Log in with your company account to access your recruitment dashboard."
              : "Publiez vos offres et suivez vos candidats. Connectez-vous avec votre compte entreprise pour accéder à votre tableau de recrutement."}
          </p>
        </div>

        <ul className="recruiter-perks">
          <li>
            <Briefcase size={14} className="text-cyan" />
            <span>{isEn ? "Post job openings to African developers" : "Publication d'offres auprès des devs africains"}</span>
          </li>
          <li>
            <Users size={14} className="text-cyan" />
            <span>{isEn ? "Private applicant tracking system" : "Suivi privé de vos candidatures"}</span>
          </li>
          <li>
            <ShieldCheck size={14} className="text-cyan" />
            <span>{isEn ? "Candidate data visible only to your team" : "Données candidats visibles uniquement par vous"}</span>
          </li>
        </ul>

        <div className="test-credentials-box">
          <div className="credentials-head">
            <div className="flex items-center gap-1.5">
              <KeyRound size={15} className="text-amber" />
              <span className="font-semibold text-white text-xs">{isEn ? "Test Recruiter Account" : "Compte Recruteur de Test"}</span>
            </div>
            <button type="button" className="quick-fill-btn" onClick={handleQuickFill}>
              <Sparkles size={12} />
              <span>{isEn ? "1-Click Auto-fill" : "Remplir en 1 clic"}</span>
            </button>
          </div>
          <div className="credentials-fields">
            <div className="cred-row">
              <span className="cred-label">{isEn ? "Login ID:" : "Identifiant :"}</span>
              <code className="cred-val">{TEST_RECRUITER_CREDENTIALS.email}</code>
            </div>
            <div className="cred-row">
              <span className="cred-label">{isEn ? "Password:" : "Mot de passe :"}</span>
              <code className="cred-val">{TEST_RECRUITER_CREDENTIALS.password}</code>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="login-error-alert">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="recruiter-email">{isEn ? "Work Email:" : "Email professionnel :"}</label>
            <input
              id="recruiter-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vous@entreprise.com"
              className="admin-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="recruiter-password">{isEn ? "Password:" : "Mot de passe :"}</label>
            <div className="password-input-wrapper">
              <input
                id="recruiter-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="admin-input"
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? (isEn ? 'Hide' : 'Masquer') : (isEn ? 'Show' : 'Afficher')}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="recruiter-login-submit"
            type="submit"
            className="btn-primary admin-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>{isEn ? "Checking credentials..." : "Vérification..."}</span>
            ) : (
              <>
                <Building2 size={18} />
                <span>{isEn ? "Access Recruiter Portal" : "Accéder à mon espace recruteur"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
