import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Building2,
  MapPin,
  Globe,
  Plus,
  Users,
  Briefcase,
  Star,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  FileText,
  Clock,
  Laptop,
  CheckCircle2,
  X,
  LogOut,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CountryFlag } from './CountryFlag';
import { COMPANIES_PORTAL_DATA } from '../data/mockData';
import { CompanyProfileModal } from './CompanyProfileModal';
import { useTranslation } from '../i18n/LanguageContext';

export function CompanyPortalSection({
  company: propCompany,
  onUpdateCompany,
  onOpenCompanyProfile,
  onSelectDeveloper,
  onLogout
}) {
  const { language } = useTranslation();
  const isEn = language === 'en';

  const [company, setCompany] = useState(propCompany || COMPANIES_PORTAL_DATA.currentCompany);
  const [pipeline, setPipeline] = useState(COMPANIES_PORTAL_DATA.applicantsPipeline);
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  useEffect(() => {
    if (propCompany) {
      setCompany(propCompany);
    }
  }, [propCompany]);

  const handleCompanyUpdate = async (updatedData) => {
    setCompany(updatedData);
    if (onUpdateCompany) {
      await onUpdateCompany(updatedData);
    }
  };

  // Charger les données dynamiques de l'entreprise et les candidatures reçues (ATS)
  useEffect(() => {
    // 1. Profil entreprise & statistiques
    fetch('/api/companies/current/')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setCompany(prev => ({
            ...prev,
            ...data,
            stats: data.stats || prev.stats
          }));
        }
      })
      .catch(err => console.warn('Backend /api/companies/current/ non joignable:', err));

    // 2. Candidatures dans le pipeline Kanban
    fetch('/api/opportunity-applications/pipeline/')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPipeline(data);
        }
      })
      .catch(err => console.warn('Backend /api/opportunity-applications/pipeline/ non joignable:', err));
  }, []);

  // Lock body scroll when modal is open to ensure clean overlay experience
  useEffect(() => {
    if (isNewJobOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isNewJobOpen]);

  // Form states for publishing an offer
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobType, setNewJobType] = useState('CDI');
  const [newJobSalary, setNewJobSalary] = useState('2 000 000 FCFA / mois');
  const [newJobLocation, setNewJobLocation] = useState("Abidjan, Côte d'Ivoire");
  const [newJobRemote, setNewJobRemote] = useState('Télétravail 100% possible');
  const [newJobSkills, setNewJobSkills] = useState('Django, PostgreSQL, Docker, Redis');
  const [newJobDescription, setNewJobDescription] = useState('');

  const [publishedJobs, setPublishedJobs] = useState([
    {
      id: 'job-init-1',
      title: 'Senior Backend Architect Python / Django',
      type: 'CDI',
      salary: '2 200 000 FCFA',
      location: 'Abidjan / Remote',
      remote: 'Télétravail 100% possible',
      skills: ['Django', 'Python', 'PostgreSQL', 'Docker'],
      description: 'Responsable de la conception et du dimensionnement des microservices fintech à fort volume.',
      applicantsCount: 22,
      postedDate: 'Il y a 4 jours'
    },
    {
      id: 'job-init-2',
      title: 'Lead Frontend Developer React / Next.js',
      type: 'CDI',
      salary: '1 900 000 FCFA',
      location: 'Dakar / Remote',
      remote: 'Hybride (2j bureau)',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      description: 'Supervision de l’interface web panafricaine avec animations avancées et temps de réponse ultra-rapide.',
      applicantsCount: 16,
      postedDate: 'Il y a 1 semaine'
    }
  ]);

  const stages = [
    { id: "Reçue", title: isEn ? "📥 Received" : "📥 Reçue" },
    { id: "En revue", title: isEn ? "🔍 Under Review" : "🔍 En revue" },
    { id: "Entretien technique", title: isEn ? "🎙️ Tech Interview" : "🎙️ Entretien technique" },
    { id: "Offre formulée", title: isEn ? "🚀 Offer Sent" : "🚀 Offre formulée" }
  ];

  const moveCandidate = async (applicantId, direction) => {
    let targetApp = null;
    let nextStage = null;

    setPipeline(prev => prev.map(app => {
      if (app.id === applicantId) {
        const currentIndex = stages.findIndex(s => s.id === app.stage);
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= 0 && newIndex < stages.length) {
          nextStage = stages[newIndex].id;
          targetApp = app;
          return { ...app, stage: nextStage };
        }
      }
      return app;
    }));

    // Synchronisation avec l'API Django
    if (targetApp && nextStage) {
      try {
        const endpoint = targetApp.type === 'job_application'
          ? `/api/applications/${targetApp.backendId || targetApp.id}/move_stage/`
          : `/api/opportunity-applications/${targetApp.backendId || targetApp.id}/move_stage/`;

        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: nextStage })
        });
      } catch (err) {
        console.warn('Erreur lors de la mise à jour de l’étape candidat:', err);
      }
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobDescription.trim()) return;

    const parsedSkills = newJobSkills.split(',').map(s => s.trim()).filter(Boolean);

    const createdJob = {
      id: `job-${Date.now()}`,
      title: newJobTitle.trim(),
      type: newJobType,
      salary: newJobSalary.trim(),
      location: newJobLocation.trim(),
      remote: newJobRemote,
      skills: parsedSkills.length > 0 ? parsedSkills : ['React', 'Python'],
      description: newJobDescription.trim(),
      applicantsCount: 0,
      postedDate: "À l'instant"
    };

    setPublishedJobs([createdJob, ...publishedJobs]);

    setCompany(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        openJobs: (prev.stats?.openJobs || 0) + 1
      }
    }));

    // Envoi à l'API Django
    try {
      await fetch('/api/opportunities/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: createdJob.title,
          company: company.name,
          location: createdJob.location,
          opp_type: createdJob.type,
          salary: createdJob.salary,
          flag: company.flag || "🇨🇮",
          tags: createdJob.skills,
          posted_time: "À l'instant",
          is_featured: true,
          description: createdJob.description,
          owner_company: company.id || 1
        })
      });
    } catch (err) {
      console.warn('Erreur publication offre backend:', err);
    }

    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0EA5E9', '#F59E0B', '#10B981']
      });
    } catch (err) { }

    setSuccessToast(isEn ? `Opening "${createdJob.title}" was published successfully on AFRIKDEV!` : `L'offre "${createdJob.title}" a été publiée avec succès sur AFRIKDEV !`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);

    // Reset form
    setNewJobTitle('');
    setNewJobDescription('');
    setIsNewJobOpen(false);
  };


  return (
    <div className="company-portal-container">
      {/* Toast Notification */}
      {successToast && (
        <div className="company-toast glass-card">
          <CheckCircle2 size={18} className="text-green" />
          <span>{successToast}</span>
          <button className="toast-close" onClick={() => setSuccessToast(null)}>×</button>
        </div>
      )}

      {/* Company Header Banner */}
      <div className="glass-card company-banner-card">
        <div className="company-banner-header">
          <div className="company-logo-box">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="company-logo-img" />
            ) : (
              <Building2 size={36} className="text-cyan" />
            )}
          </div>

          <div className="company-meta-info">
            <div className="company-title-row">
              <h1 className="company-name">{company.name}</h1>
              <span className="badge-tag green">
                <CheckCircle size={13} />
                <span>{isEn ? "Verified Company" : "Entreprise Vérifiée"}</span>
              </span>
              <CountryFlag
                country={company.country || company.flag || "Côte d'Ivoire"}
                size="sm"
                title={company.country || "Côte d'Ivoire"}
              />
            </div>

            <p className="company-tagline">{company.tagline}</p>

            <div className="company-contact-row">
              <span className="contact-item">
                <MapPin size={14} className="text-cyan" />
                <span>{company.headquarters}</span>
              </span>
              <span className="meta-separator">•</span>
              <a href={company.website} target="_blank" rel="noreferrer" className="contact-item link-hover">
                <Globe size={14} className="text-cyan" />
                <span>{isEn ? "Official website" : "Site web officiel"}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="company-action-buttons">
            <button
              className="btn-secondary"
              onClick={() => onOpenCompanyProfile ? onOpenCompanyProfile() : setIsEditCompanyOpen(true)}
              title={isEn ? "Edit company information" : "Modifier les informations de l'entreprise"}
            >
              <Edit3 size={15} />
              <span>{isEn ? "Edit profile" : "Modifier le profil"}</span>
            </button>
            <button className="btn-primary" onClick={() => setIsNewJobOpen(true)}>
              <Plus size={16} />
              <span>{isEn ? "Post an opening" : "Publier une offre"}</span>
            </button>
            {onLogout && (
              <button id="recruiter-logout-btn" className="btn-secondary" onClick={onLogout}>
                <LogOut size={16} />
                <span>{isEn ? "Log out" : "Déconnexion"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Recruitment Metrics */}
        <div className="company-metrics-bar">
          <div className="comp-metric-item">
            <span className="comp-metric-num text-cyan">{company.stats.openJobs}</span>
            <span className="comp-metric-lbl">{isEn ? "Active openings" : "Offres actives"}</span>
          </div>
          <div className="stat-divider" />
          <div className="comp-metric-item">
            <span className="comp-metric-num text-amber">{company.stats.totalApplicants}</span>
            <span className="comp-metric-lbl">{isEn ? "Applications received" : "Candidatures reçues"}</span>
          </div>
          <div className="stat-divider" />
          <div className="comp-metric-item">
            <span className="comp-metric-num text-green">{company.stats.interviewsScheduled}</span>
            <span className="comp-metric-lbl">{isEn ? "Interviews scheduled" : "Entretiens prévus"}</span>
          </div>
        </div>
      </div>

      {/* Pipeline ATS (Applicant Tracking System) */}
      <div className="pipeline-section">
        <div className="pipeline-header">
          <div>
            <h2 className="pipeline-title">{isEn ? "Developer Recruitment Pipeline (ATS)" : "Pipeline de Recrutement Développeurs (ATS)"}</h2>
            <span className="pipeline-sub">
              {isEn ? "Manage candidate progression from first contact to signed offer." : "Gérez l'avancement des candidats du premier contact jusqu'à la contractualisation."}
            </span>
          </div>
        </div>

        <div className="kanban-board-grid">
          {stages.map((stage, colIndex) => {
            const applicantsInStage = pipeline.filter(app => app.stage === stage.id);

            return (
              <div key={stage.id} className="kanban-column glass-card">
                <div className="kanban-column-header">
                  <span className="stage-title">{stage.title}</span>
                  <span className="stage-count">{applicantsInStage.length}</span>
                </div>

                <div className="kanban-cards-list">
                  {applicantsInStage.map(candidate => (
                    <div key={candidate.id} className="candidate-card glass-card">
                      <div className="candidate-header">
                        <div className="candidate-avatar-wrap">
                          <img src={candidate.avatar} alt={candidate.candidateName} className="candidate-avatar" />
                          <span className="avatar-online-dot online" title={isEn ? "Online" : "En ligne"} />
                        </div>
                        <div>
                          <div className="candidate-name-row">
                            <span
                              className="candidate-name"
                              onClick={() => onSelectDeveloper && onSelectDeveloper(candidate.candidateName)}
                            >
                              {candidate.candidateName}
                            </span>
                            <CountryFlag country={candidate.country || candidate.flag} size="xs" />
                          </div>
                          <span className="candidate-role-target">{candidate.roleApplied}</span>
                        </div>
                      </div>

                      <div className="candidate-skills-chips">
                        {candidate.skills.slice(0, 3).map(s => (
                          <span key={s} className="skill-mini-chip">{s}</span>
                        ))}
                      </div>

                      <div className="candidate-footer">
                        <span className="applied-date">{candidate.appliedDate}</span>
                        <div className="kanban-arrows">
                          {colIndex > 0 && (
                            <button
                              className="kanban-arrow-btn"
                              title={isEn ? "Move to previous stage" : "Déplacer à l'étape précédente"}
                              onClick={() => moveCandidate(candidate.id, 'prev')}
                            >
                              <ChevronLeft size={16} />
                            </button>
                          )}
                          {colIndex < stages.length - 1 && (
                            <button
                              className="kanban-arrow-btn next"
                              title={isEn ? "Advance to next stage" : "Avancer à l'étape suivante"}
                              onClick={() => moveCandidate(candidate.id, 'next')}
                            >
                              <ChevronRight size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {applicantsInStage.length === 0 && (
                    <div className="empty-stage-hint">{isEn ? "No candidates in this stage" : "Aucun candidat à cette étape"}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Published Active Job Offers List */}
      <div className="company-active-jobs-section">
        <div className="section-head-row">
          <div>
            <h3 className="section-subtitle">{isEn ? `Currently active Tech jobs (${publishedJobs.length})` : `Offres Tech actuellement diffusées (${publishedJobs.length})`}</h3>
            <p className="section-subtext">{isEn ? "These opportunities are visible to all African talents across the community." : "Ces opportunités sont visibles par l'ensemble des talents africains de la communauté."}</p>
          </div>
          <button className="btn-secondary btn-sm" onClick={() => setIsNewJobOpen(true)}>
            <Plus size={14} />
            <span>{isEn ? "New opening" : "Nouvelle offre"}</span>
          </button>
        </div>

        <div className="published-jobs-grid">
          {publishedJobs.map(job => (
            <div key={job.id} className="published-job-card glass-card">
              <div className="job-card-top">
                <span className="job-contract-tag">{job.type}</span>
                <span className="job-salary-tag">{job.salary}</span>
                <span className="job-date-text">{job.postedDate}</span>
              </div>
              <h4 className="job-card-title">{job.title}</h4>
              <p className="job-card-desc">{job.description}</p>

              <div className="job-card-meta">
                <span className="job-meta-pill">
                  <MapPin size={12} className="text-cyan" />
                  <span>{job.location}</span>
                </span>
                <span className="job-meta-pill">
                  <Laptop size={12} className="text-amber" />
                  <span>{job.remote}</span>
                </span>
              </div>

              <div className="job-skills-row">
                {job.skills.map(s => (
                  <span key={s} className="skill-mini-chip">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Publish Job Opening (Rendered via React Portal onto document.body for true center viewport positioning) */}
      {isNewJobOpen && createPortal(
        <div className="modal-overlay" onClick={() => setIsNewJobOpen(false)}>
          <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Briefcase size={20} className="text-cyan" />
                <h2 className="modal-title">{isEn ? "Post a tech job opening" : "Publier une offre de recrutement tech"}</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setIsNewJobOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="modal-body-form">
              <div className="form-group">
                <label className="form-label">{isEn ? "Position title *" : "Titre du poste à pourvoir *"}</label>
                <input
                  type="text"
                  placeholder={isEn ? "e.g. Lead Backend Django / FastAPI, Flutter Engineer, Cloud Architect..." : "Ex: Lead Backend Django / FastAPI, Ingénieur Flutter, Architecte Cloud..."}
                  value={newJobTitle}
                  onChange={e => setNewJobTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">{isEn ? "Contract type" : "Type de contrat"}</label>
                  <select value={newJobType} onChange={e => setNewJobType(e.target.value)}>
                    <option value="CDI">{isEn ? "Full-Time (CDI)" : "CDI (Contrat à Durée Indéterminée)"}</option>
                    <option value="CDD">{isEn ? "Fixed-Term (CDD)" : "CDD"}</option>
                    <option value="Freelance">{isEn ? "Freelance Mission / Contractor" : "Mission Freelance / Consultant"}</option>
                    <option value="Stage">{isEn ? "Internship / Apprenticeship" : "Stage Pré-Emploi / Alternance"}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{isEn ? "Indicative compensation" : "Rémunération indicative"}</label>
                  <input
                    type="text"
                    value={newJobSalary}
                    onChange={e => setNewJobSalary(e.target.value)}
                    placeholder={isEn ? "e.g. 1,800,000 - 2,500,000 FCFA / month" : "Ex: 1 800 000 - 2 500 000 FCFA / mois"}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">{isEn ? "Location / Tech Hub" : "Localisation / Hub tech"}</label>
                  <input
                    type="text"
                    value={newJobLocation}
                    onChange={e => setNewJobLocation(e.target.value)}
                    placeholder={isEn ? "e.g. Abidjan, Côte d'Ivoire or Dakar, Senegal" : "Ex: Abidjan, Côte d'Ivoire ou Dakar, Sénégal"}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{isEn ? "Work arrangement (Remote)" : "Mode de travail (Remote)"}</label>
                  <select value={newJobRemote} onChange={e => setNewJobRemote(e.target.value)}>
                    <option value="Télétravail 100% possible">{isEn ? "🌍 100% Remote (Pan-African)" : "🌍 Télétravail 100% (Remote Panafricain)"}</option>
                    <option value="Hybride (2j sur site)">{isEn ? "🏢 Hybrid (2 days on-site / 3 days remote)" : "🏢 Hybride (2j sur site / 3j remote)"}</option>
                    <option value="Sur site">{isEn ? "📍 On-site only" : "📍 Sur site uniquement"}</option>
                  </select>
                </div>
              </div>

              {/* Champ pour pouvoir écrire la description de l'offre */}
              <div className="form-group">
                <label className="form-label">
                  {isEn ? "Detailed Job Description & Responsibilities *" : "Description détaillée du poste & Missions confiées *"}
                </label>
                <textarea
                  rows={5}
                  className="form-textarea"
                  placeholder={isEn ? "Describe daily responsibilities, project goals, tech stack, team expectations, and perks (training, equipment, health insurance)..." : "Décrivez ici les missions quotidiennes, les objectifs du projet, la stack technique, les responsabilités au sein de l'équipe et les avantages offerts (formation, équipements, mutuelle)..."}
                  value={newJobDescription}
                  onChange={e => setNewJobDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{isEn ? "Required Skills & Technologies (comma-separated)" : "Compétences & Technologies requises (séparées par virgules)"}</label>
                <input
                  type="text"
                  value={newJobSkills}
                  onChange={e => setNewJobSkills(e.target.value)}
                  placeholder={isEn ? "e.g. Django, React, PostgreSQL, Docker, Kubernetes" : "Ex: Django, React, PostgreSQL, Docker, Kubernetes"}
                />
              </div>

              <div className="modal-actions-bar">
                <button type="button" className="btn-secondary" onClick={() => setIsNewJobOpen(false)}>
                  {isEn ? "Cancel" : "Annuler"}
                </button>
                <button type="submit" className="btn-primary">
                  <Send size={15} />
                  <span>{isEn ? "Publish opening on AFRIKDEV" : "Diffuser l'offre sur AFRIKDEV"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal d'édition du profil entreprise */}
      <CompanyProfileModal
        isOpen={isEditCompanyOpen}
        onClose={() => setIsEditCompanyOpen(false)}
        company={company}
        onUpdateCompany={handleCompanyUpdate}
      />
    </div>
  );
}
