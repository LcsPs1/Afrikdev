import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Send,
  Trophy,
  Briefcase,
  Laptop,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  CalendarClock
} from 'lucide-react';
import { formatDeadline } from '../utils/formatDeadline';
import { useTranslation } from '../i18n/LanguageContext';

const MAX_CV_SIZE = 5 * 1024 * 1024; // 5 Mo

export function ApplicationModal({ opportunity, currentUser, onClose, onSubmit }) {
  const { language } = useTranslation();
  const isEn = language === 'en';

  const AVAILABILITY_OPTIONS = isEn ? [
    'Immediate',
    'Within 2 weeks',
    'Within 1 month',
    'Within 3 months'
  ] : [
    'Immédiate',
    'Sous 2 semaines',
    'Sous 1 mois',
    'Sous 3 mois'
  ];

  const EXPERIENCE_OPTIONS = isEn ? [
    'Student / Beginner',
    'Junior (0-2 yrs)',
    'Mid-level (2-5 yrs)',
    'Senior (5+ yrs)'
  ] : [
    'Étudiant / Débutant',
    'Junior (0-2 ans)',
    'Confirmé (2-5 ans)',
    'Senior (5+ ans)'
  ];

  const isHackathon = opportunity.type.includes('Hackathon');
  const isFreelance = opportunity.type.includes('Freelance');

  // Champs communs
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(currentUser?.country || '');
  const [github, setGithub] = useState(currentUser?.github || '');
  const [linkedin, setLinkedin] = useState(currentUser?.linkedin || '');
  const [motivation, setMotivation] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Emploi / freelance
  const [portfolio, setPortfolio] = useState('');
  const [availability, setAvailability] = useState(AVAILABILITY_OPTIONS[0]);
  const [expectedRate, setExpectedRate] = useState('');
  const [cvFile, setCvFile] = useState(null);

  // Hackathon
  const [participation, setParticipation] = useState('solo');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [track, setTrack] = useState(opportunity.tracks?.[0] || '');
  const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[1]);
  const [projectIdea, setProjectIdea] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fermeture avec Échap + blocage du scroll de la page derrière le modal
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleCvChange = (e) => {
    const file = e.target.files?.[0];
    setError('');
    if (!file) {
      setCvFile(null);
      return;
    }
    if (file.type !== 'application/pdf') {
      setError('Le CV doit être au format PDF.');
      e.target.value = '';
      setCvFile(null);
      return;
    }
    if (file.size > MAX_CV_SIZE) {
      setError('Le CV est trop volumineux (5 Mo maximum).');
      e.target.value = '';
      setCvFile(null);
      return;
    }
    setCvFile({ name: file.name, size: file.size });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError(isHackathon
        ? "Vous devez accepter le règlement du hackathon pour vous inscrire."
        : "Vous devez accepter le partage de votre profil avec le recruteur.");
      return;
    }
    if (isHackathon && participation === 'team' && !teamName.trim()) {
      setError("Indiquez le nom de votre équipe.");
      return;
    }
    if (isHackathon && participation === 'team') {
      const count = teamMembers.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean).length + 1;
      if (opportunity.maxTeamSize && count > opportunity.maxTeamSize) {
        setError(`Une équipe ne peut pas dépasser ${opportunity.maxTeamSize} personnes (vous inclus).`);
        return;
      }
    }

    setIsSubmitting(true);

    const data = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim(),
      github: github.trim(),
      linkedin: linkedin.trim(),
      motivation: motivation.trim(),
      ...(isHackathon
        ? {
            participation,
            teamName: participation === 'team' ? teamName.trim() : '',
            teamMembers: participation === 'team' ? teamMembers.trim() : '',
            track,
            experience,
            projectIdea: projectIdea.trim()
          }
        : {
            portfolio: portfolio.trim(),
            availability,
            expectedRate: expectedRate.trim(),
            cv: cvFile?.name || null
          })
    };

    Promise.resolve(onSubmit(opportunity, data))
      .catch(err => {
        setError(err?.message || "Une erreur est survenue lors de l'enregistrement de votre candidature.");
        setIsSubmitting(false);
      });
  };

  const deadlineLabel = formatDeadline(opportunity.deadline);
  const HeaderIcon = isHackathon ? Trophy : isFreelance ? Laptop : Briefcase;

  const title = isHackathon
    ? (isEn ? `Registration: ${opportunity.title}` : `Inscription : ${opportunity.title}`)
    : isFreelance
      ? (isEn ? `Proposal: ${opportunity.title}` : `Proposition : ${opportunity.title}`)
      : (isEn ? `Application: ${opportunity.title}` : `Candidature : ${opportunity.title}`);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <HeaderIcon size={20} className="text-cyan" />
            <h2 className="modal-title" id="application-modal-title">{title}</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label={isEn ? "Close" : "Fermer"}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-form">
          <div className="application-summary">
            <div className="application-summary-main">
              <strong>{opportunity.company}</strong>
              <span>{opportunity.location}</span>
            </div>
            {deadlineLabel && (
              <span className="application-deadline">
                <CalendarClock size={13} />
                <span>{isEn ? `Deadline: ${deadlineLabel}` : `Clôture le ${deadlineLabel}`}</span>
              </span>
            )}
            {opportunity.description && (
              <p className="application-summary-desc">{opportunity.description}</p>
            )}
          </div>

          {error && (
            <div className="login-error-alert" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="app-fullname">{isEn ? "Full name *" : "Nom complet *"}</label>
              <input
                id="app-fullname"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ex: Aïssatou Diallo"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="app-email">Email *</label>
              <input
                id="app-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="app-phone">{isEn ? "Phone / WhatsApp" : "Téléphone / WhatsApp"}</label>
              <input
                id="app-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+225 07 00 00 00 00"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="app-country">{isEn ? "Country of residence *" : "Pays de résidence *"}</label>
              <input
                id="app-country"
                type="text"
                required
                autoComplete="country-name"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="Ex: Sénégal"
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="app-github">{isEn ? "GitHub Profile" : "Lien GitHub"}</label>
              <input
                id="app-github"
                type="url"
                value={github}
                onChange={e => setGithub(e.target.value)}
                placeholder="https://github.com/votre-profil"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="app-linkedin">{isEn ? "LinkedIn Profile" : "Lien LinkedIn"}</label>
              <input
                id="app-linkedin"
                type="url"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/votre-profil"
              />
            </div>
          </div>

          {isHackathon ? (
            <>
              <div className="form-group">
                <span className="form-label">{isEn ? "Participation mode *" : "Mode de participation *"}</span>
                <div className="radio-card-row">
                  <label className={`radio-card ${participation === 'solo' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="participation"
                      value="solo"
                      checked={participation === 'solo'}
                      onChange={() => setParticipation('solo')}
                    />
                    <span>{isEn ? "Solo participation" : "Participation solo"}</span>
                  </label>
                  <label className={`radio-card ${participation === 'team' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="participation"
                      value="team"
                      checked={participation === 'team'}
                      onChange={() => setParticipation('team')}
                    />
                    <span>{isEn ? "In a team" : "En équipe"}</span>
                  </label>
                </div>
              </div>

              {participation === 'team' && (
                <>
                  <div className="form-group">
                    <label className="form-label" htmlFor="app-teamname">{isEn ? "Team name *" : "Nom de l'équipe *"}</label>
                    <input
                      id="app-teamname"
                      type="text"
                      value={teamName}
                      onChange={e => setTeamName(e.target.value)}
                      placeholder="Ex: Les Griots du Code"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="app-teammembers">
                      {isEn ? "Other members (one per line or comma-separated)" : "Autres membres (un par ligne ou séparés par des virgules)"}
                      {opportunity.maxTeamSize ? ` — ${opportunity.maxTeamSize} max, ${isEn ? "including you" : "vous inclus"}` : ''}
                    </label>
                    <textarea
                      id="app-teammembers"
                      rows={3}
                      className="form-textarea"
                      value={teamMembers}
                      onChange={e => setTeamMembers(e.target.value)}
                      placeholder={"Koffi Mensah, koffi@exemple.com\nAmina Bello, amina@exemple.com"}
                    />
                  </div>
                </>
              )}

              <div className="form-row-2">
                {opportunity.tracks?.length > 0 && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="app-track">{isEn ? "Selected track *" : "Thématique choisie *"}</label>
                    <select id="app-track" value={track} onChange={e => setTrack(e.target.value)}>
                      {opportunity.tracks.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label" htmlFor="app-experience">{isEn ? "Experience level" : "Niveau d'expérience"}</label>
                  <select id="app-experience" value={experience} onChange={e => setExperience(e.target.value)}>
                    {EXPERIENCE_OPTIONS.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="app-idea">{isEn ? "Your project idea (optional)" : "Votre idée de projet (facultatif)"}</label>
                <textarea
                  id="app-idea"
                  rows={3}
                  className="form-textarea"
                  value={projectIdea}
                  onChange={e => setProjectIdea(e.target.value)}
                  placeholder={isEn ? "What problem are you solving? Which technologies?" : "Quel problème souhaitez-vous résoudre ? Avec quelles technologies ?"}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="app-motivation">{isEn ? "Why do you want to participate? *" : "Pourquoi voulez-vous participer ? *"}</label>
                <textarea
                  id="app-motivation"
                  rows={3}
                  required
                  className="form-textarea"
                  value={motivation}
                  onChange={e => setMotivation(e.target.value)}
                  placeholder={isEn ? "Your motivations, what you hope to learn or build..." : "Vos motivations, ce que vous espérez apprendre ou construire..."}
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="app-portfolio">{isEn ? "Portfolio / personal website" : "Portfolio / site personnel"}</label>
                  <input
                    id="app-portfolio"
                    type="url"
                    value={portfolio}
                    onChange={e => setPortfolio(e.target.value)}
                    placeholder="https://mon-portfolio.dev"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="app-availability">{isEn ? "Availability" : "Disponibilité"}</label>
                  <select id="app-availability" value={availability} onChange={e => setAvailability(e.target.value)}>
                    {AVAILABILITY_OPTIONS.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isFreelance && (
                <div className="form-group">
                  <label className="form-label" htmlFor="app-rate">{isEn ? "Desired rate for this project *" : "Tarif souhaité pour la mission *"}</label>
                  <input
                    id="app-rate"
                    type="text"
                    required
                    value={expectedRate}
                    onChange={e => setExpectedRate(e.target.value)}
                    placeholder="Ex: 3 500 $ pour la mission, ou 400 $ / jour"
                  />
                </div>
              )}

              <div className="form-group">
                <span className="form-label">{isEn ? "Resume / CV (PDF, 5 MB max)" : "CV (PDF, 5 Mo max)"}</span>
                <label className="file-drop-zone" htmlFor="app-cv">
                  {cvFile ? (
                    <>
                      <FileText size={18} className="text-cyan" />
                      <span>{cvFile.name} ({Math.max(1, Math.round(cvFile.size / 1024))} Ko)</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} className="text-cyan" />
                      <span>{isEn ? "Click to attach your resume" : "Cliquez pour joindre votre CV"}</span>
                    </>
                  )}
                </label>
                <input
                  id="app-cv"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleCvChange}
                  className="visually-hidden-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="app-motivation">
                  {isFreelance
                    ? (isEn ? "Your approach for this project *" : "Votre approche pour cette mission *")
                    : (isEn ? "Cover letter *" : "Lettre de motivation *")}
                </label>
                <textarea
                  id="app-motivation"
                  rows={5}
                  required
                  className="form-textarea"
                  value={motivation}
                  onChange={e => setMotivation(e.target.value)}
                  placeholder={isFreelance
                    ? (isEn ? "Describe your past experience, methodology, and estimated timeline..." : "Décrivez votre expérience similaire, votre méthode de travail et vos délais estimés...")
                    : (isEn ? "Introduce yourself and explain why you're a great fit for this position..." : "Présentez votre parcours et expliquez pourquoi ce poste vous correspond...")}
                />
              </div>
            </>
          )}

          <label className="terms-check">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={e => setAcceptTerms(e.target.checked)}
            />
            <span>
              {isHackathon
                ? (isEn ? "I have read and accept the hackathon rules and the sharing of my information with the organizers." : "J'ai lu et j'accepte le règlement du hackathon et le partage de mes informations avec les organisateurs.")
                : (isEn ? "I agree that my AFRIKDEV profile and the above information will be shared with the recruiter." : "J'accepte que mon profil AFRIKDEV et les informations ci-dessus soient transmis au recruteur.")}
            </span>
          </label>

          <div className="modal-actions-bar">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {isEn ? "Cancel" : "Annuler"}
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <span>{isEn ? "Submitting..." : "Envoi en cours..."}</span>
              ) : (
                <>
                  {isHackathon ? <Trophy size={15} /> : <Send size={15} />}
                  <span>{isHackathon ? (isEn ? "Confirm registration" : "Confirmer mon inscription") : (isEn ? "Submit application" : "Envoyer ma candidature")}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export function ApplicationSuccessBanner({ message, onClose }) {
  return (
    <div className="company-toast glass-card" role="status">
      <CheckCircle2 size={18} className="text-green" />
      <span>{message}</span>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Fermer">×</button>
    </div>
  );
}
