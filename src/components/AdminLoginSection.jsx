import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Fingerprint,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ADMIN_SECRET_URL_PATH = 'admindesk-k9b3m7v2w8x4/authentification';

export const TEST_ADMIN_CREDENTIALS = {
  email: 'admin.sec@afrikdev.com',
  password: 'AfrikAdmin#2026!'
};

export function AdminLoginSection({ onLoginSuccess, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickFill = () => {
    setEmail(TEST_ADMIN_CREDENTIALS.email);
    setPassword(TEST_ADMIN_CREDENTIALS.password);
    setErrorMsg('');
  };

  const handleImmediateDemoLogin = () => {
    setEmail(TEST_ADMIN_CREDENTIALS.email);
    setPassword(TEST_ADMIN_CREDENTIALS.password);
    setIsLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsLoading(false);
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06B6D4', '#F59E0B', '#10B981']
        });
      } catch (e) {}

      sessionStorage.setItem('afrikdev_admin_authenticated', 'true');
      onLoginSuccess();
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === TEST_ADMIN_CREDENTIALS.email.toLowerCase() &&
        password === TEST_ADMIN_CREDENTIALS.password
      ) {
        setIsLoading(false);
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06B6D4', '#F59E0B', '#10B981']
          });
        } catch (e) {}

        sessionStorage.setItem('afrikdev_admin_authenticated', 'true');
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg("Identifiants d'accès invalides. Veuillez vérifier l'adresse email et le mot de passe.");
      }
    }, 600);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="glass-card admin-login-card">
        {onCancel && (
          <button
            type="button"
            className="auth-back-btn"
            onClick={onCancel}
            title="Retour à l'accueil"
            style={{ marginBottom: 12 }}
          >
            <ArrowLeft size={16} />
            <span>Retour à l'accueil</span>
          </button>
        )}

        {/* Top Restricted Badge */}
        <div className="admin-login-top-bar">
          <div className="secret-tag">
            <Lock size={12} className="text-amber" />
            <span>Passerelle Sécurisée Restreinte</span>
          </div>
          <span className="secret-hash font-mono">TLS 1.3 • AES-256</span>
        </div>

        {/* Card Header */}
        <div className="admin-login-header">
          <div className="admin-shield-icon">
            <ShieldCheck size={38} className="text-cyan" />
          </div>
          <h1 className="admin-login-title">Console d'Administration</h1>
          <p className="admin-login-desc">
            Accès sécurisé réservé aux membres de l'équipe de gouvernance et de modération AFRIKDEV.
          </p>
        </div>

        {/* Test Account Helper Callout */}
        <div className="test-credentials-box">
          <div className="credentials-head">
            <div className="flex items-center gap-1.5">
              <KeyRound size={15} className="text-amber" />
              <span className="font-semibold text-white text-xs">Compte Administrateur de Test</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                className="quick-fill-btn"
                onClick={handleQuickFill}
                title="Remplir les champs"
              >
                <Sparkles size={12} />
                <span>Remplir</span>
              </button>
              <button
                type="button"
                className="quick-fill-btn"
                onClick={handleImmediateDemoLogin}
                style={{ background: 'rgba(6, 182, 212, 0.2)', borderColor: 'var(--cyan-primary)', color: 'var(--cyan-light)' }}
                title="Connexion immédiate sans taper"
              >
                <Zap size={12} />
                <span>Connexion 1-Clic</span>
              </button>
            </div>
          </div>

          <div className="credentials-fields">
            <div className="cred-row">
              <span className="cred-label">Identifiant :</span>
              <code className="cred-val">{TEST_ADMIN_CREDENTIALS.email}</code>
            </div>
            <div className="cred-row">
              <span className="cred-label">Mot de passe :</span>
              <code className="cred-val">{TEST_ADMIN_CREDENTIALS.password}</code>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="login-error-alert">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label className="form-label">Email ou Identifiant Administrateur :</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin.sec@afrikdev.com"
              className="admin-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clé Secrète / Mot de passe :</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="admin-input"
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="terminal-note">
            <Terminal size={13} className="text-dim" />
            <span>Adresse URL dédiée : <code>/{ADMIN_SECRET_URL_PATH}</code></span>
          </div>

          <button
            type="submit"
            className="btn-primary admin-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Vérification des accès...</span>
            ) : (
              <>
                <Fingerprint size={18} />
                <span>Ouvrir la session d'administration</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
