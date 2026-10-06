import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Send, Building2, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { useTranslation } from '../i18n/LanguageContext';

export function ProjectContactModal({
  isOpen,
  onClose,
  project,
  currentUser,
  currentCompany,
  isRecruiterLoggedIn
}) {
  const { language } = useTranslation();
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('partnership');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMsg('');
      setMessage('');
      if (isRecruiterLoggedIn && currentCompany) {
        setSenderName(currentCompany.name || '');
        setSenderEmail(currentCompany.email || 'recrutement@entreprise.ci');
      } else if (currentUser) {
        setSenderName(currentUser.name || '');
        setSenderEmail(currentUser.email || '');
      } else {
        setSenderName('');
        setSenderEmail('');
      }
    }
  }, [isOpen, isRecruiterLoggedIn, currentCompany, currentUser]);

  if (!isOpen || !project) return null;

  const targetEntity = project.company || project.author?.name || 'Entreprise responsable';
  const targetEmail = project.companyEmail || 'contact@afrikdev.ci';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) {
      setErrorMsg(language === 'en' ? 'Please fill in all required fields.' : 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Simulate API call to send message to company/author
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content glass-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 540, width: '92%' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="icon-badge-box text-cyan" style={{ width: 34, height: 34 }}>
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.05rem', margin: 0 }}>
                {language === 'en' ? "Contact Company / Project Team" : "Contacter l'entreprise du projet"}
              </h2>
              <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span>{project.title}</span>
                <span>•</span>
                <span className="text-cyan font-medium">{targetEntity}</span>
                <CountryFlag country={project.country} size="xs" />
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div 
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}
            >
              <CheckCircle2 size={30} className="text-emerald-400" />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 8, color: '#10B981' }}>
              {language === 'en' ? 'Message Sent Successfully!' : 'Message transmis avec succès !'}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
              {language === 'en'
                ? `Your request regarding "${project.title}" has been forwarded to ${targetEntity}. An acknowledgment copy has been sent to ${senderEmail}.`
                : `Votre prise de contact concernant le projet « ${project.title} » a été transmise directement à ${targetEntity}. Un accusé de réception a été envoyé à ${senderEmail}.`}
            </p>

            <button 
              type="button" 
              className="btn-primary" 
              onClick={onClose}
              style={{ minWidth: 140, margin: '0 auto' }}
            >
              {language === 'en' ? 'Close' : 'Fermer'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body-form" style={{ padding: '16px 20px 20px' }}>
            {errorMsg && (
              <div 
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12
                }}
              >
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Target project preview pill */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(6, 182, 212, 0.06)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                marginBottom: 16
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{targetEntity}</span>
                <span className="badge-tag gold text-xs" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
                  {project.category}
                </span>
              </div>
              <span className="text-xs text-muted" style={{ fontFamily: 'monospace' }}>
                {targetEmail}
              </span>
            </div>

            {/* Sender Info Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  {language === 'en' ? 'Your Name / Org *' : 'Votre Nom / Organisation *'}
                </label>
                <input
                  type="text"
                  placeholder="Ex: Koffi Finance, Dr. Amina..."
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {language === 'en' ? 'Your Email *' : 'Votre Email de contact *'}
                </label>
                <input
                  type="email"
                  placeholder="contact@exemple.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Inquiry Subject */}
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Subject of your inquiry *' : 'Objet de la prise de contact *'}
              </label>
              <select 
                value={inquiryType} 
                onChange={(e) => setInquiryType(e.target.value)}
                className="filter-select"
                style={{ width: '100%', height: 40 }}
              >
                <option value="partnership">🤝 {language === 'en' ? 'Commercial or Strategic Partnership' : 'Proposition de partenariat stratégique'}</option>
                <option value="hiring">💼 {language === 'en' ? 'Recruitment / Hire the Team' : "Recrutement / Mission pour l'équipe"}</option>
                <option value="api">🔌 {language === 'en' ? 'API Access & Tech Integration' : 'Intégration technique / Accès API'}</option>
                <option value="demo">💡 {language === 'en' ? 'Private Demo & Investment' : 'Démo privée / Opportunité de financement'}</option>
                <option value="general">💬 {language === 'en' ? 'General Inquiry / Question' : 'Question générale sur le projet'}</option>
              </select>
            </div>

            {/* Message Body */}
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Your Message *' : 'Votre Message *'}
              </label>
              <textarea
                rows={4}
                placeholder={language === 'en'
                  ? `Describe your proposal or question regarding ${project.title}...`
                  : `Présentez votre demande ou proposition de collaboration à l'entreprise pour ${project.title}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  color: 'inherit',
                  fontSize: '0.86rem',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Actions Bar */}
            <div className="modal-actions-bar" style={{ marginTop: 16 }}>
              <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
                {language === 'en' ? 'Cancel' : 'Annuler'}
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span>{language === 'en' ? 'Sending...' : 'Envoi en cours...'}</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>{language === 'en' ? 'Send Message' : 'Envoyer le message'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
