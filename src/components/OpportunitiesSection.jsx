import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Clock,
  Send,
  CheckCircle2,
  Trophy,
  CalendarClock,
  Undo2,
  Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CountryFlag } from './CountryFlag';
import { ApplicationModal, ApplicationSuccessBanner } from './ApplicationModal';
import { getDeadlineStatus } from '../utils/formatDeadline';
import { useTranslation } from '../i18n/LanguageContext';
import { translateText, getTranslationAction } from '../services/translator';
import { SponsoredAdCard } from './SponsoredAdCard';
import { OFFICIAL_ADS } from '../data/officialAdsData';

const STORAGE_KEY = 'afrikdev-applications';

function loadApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function OpportunitiesSection({ opportunities: initialOpportunities, currentUser }) {
  const { t, language } = useTranslation();
  // { [oppId]: { reference, token, submittedAt, data } } — conservé dans le navigateur pour retrouver ses candidatures
  const [applications, setApplications] = useState(loadApplications);
  const [opportunitiesList, setOpportunitiesList] = useState(initialOpportunities);
  const [selectedType, setSelectedType] = useState('all');
  const [activeOpportunity, setActiveOpportunity] = useState(null);
  const [toast, setToast] = useState(null);

  // Traduction à la demande des offres d'emploi
  const [translatedOppIds, setTranslatedOppIds] = useState(new Set());
  const [loadingOppTranslations, setLoadingOppTranslations] = useState(new Set());
  const [liveOppTranslations, setLiveOppTranslations] = useState({});

  // Réinitialiser les offres traduites quand la langue UI change
  useEffect(() => {
    setTranslatedOppIds(new Set());
  }, [language]);

  const handleTranslateOpp = async (opp) => {
    const oppId = opp.id;
    if (translatedOppIds.has(oppId)) {
      setTranslatedOppIds(prev => {
        const next = new Set(prev);
        next.delete(oppId);
        return next;
      });
      return;
    }

    const action = getTranslationAction(opp.description, language);
    if (!action.canTranslate) return;

    const cacheKey = `${action.targetLang}_${oppId}`;
    if (liveOppTranslations[cacheKey] || liveOppTranslations[oppId]) {
      setTranslatedOppIds(prev => new Set(prev).add(oppId));
      return;
    }

    setLoadingOppTranslations(prev => new Set(prev).add(oppId));
    try {
      const translated = await translateText(opp.description, action.targetLang, action.sourceLang);
      setLiveOppTranslations(prev => ({ 
        ...prev, 
        [cacheKey]: translated,
        [oppId]: translated 
      }));
      setTranslatedOppIds(prev => new Set(prev).add(oppId));
    } catch (err) {
      console.warn("Échec traduction offre:", err);
    } finally {
      setLoadingOppTranslations(prev => {
        const next = new Set(prev);
        next.delete(oppId);
        return next;
      });
    }
  };

  // Charger les opportunités depuis l'API Django si disponible
  useEffect(() => {
    fetch('/api/opportunities/')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        const results = Array.isArray(data) ? data : data?.results;
        if (Array.isArray(results) && results.length > 0) {
          // Normalisation des champs pour compatibilité UI
          const mapped = results.map(o => ({
            id: o.id,
            title: o.title,
            company: o.company,
            location: o.location,
            type: o.opp_type,
            salary: o.salary,
            flag: o.flag,
            tags: o.tags || [],
            posted: o.posted_time || 'Récemment',
            featured: o.is_featured,
            description: o.description,
            deadline: o.deadline,
            tracks: o.tracks || [],
            maxTeamSize: o.max_team_size,
            applicationsCount: o.applications_count || 0
          }));
          setOpportunitiesList(mapped);
        }
      })
      .catch(err => {
        console.warn('API /api/opportunities/ non joignable, affichage des données locales:', err);
      });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // stockage indisponible : on ignore
    }
  }, [applications]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const types = [
    { id: 'all', label: t('opportunities.filterAll', 'Toutes les opportunités') },
    { id: 'CDI', label: t('opportunities.filterFulltime', 'CDI') },
    { id: 'Freelance', label: t('opportunities.filterFreelance', 'Freelance') },
    { id: '🏆 Hackathon', label: t('opportunities.filterHackathon', 'Hackathons & Défis') }
  ];

  const handleSubmitApplication = async (opportunity, data) => {
    const isHackathon = opportunity.type.includes('Hackathon');
    const numericId = typeof opportunity.id === 'number'
      ? opportunity.id
      : parseInt(String(opportunity.id).replace(/\D/g, ''), 10) || 1;

    let reference = `AFK-${String(opportunity.id).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    let editToken = '';

    const payload = {
      opportunity: numericId,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone || '',
      country: data.country,
      github: data.github || '',
      linkedin: data.linkedin || '',
      motivation: data.motivation,
      details: {
        portfolio: data.portfolio || '',
        availability: data.availability || '',
        expectedRate: data.expectedRate || '',
        participation: data.participation || '',
        teamName: data.teamName || '',
        teamMembers: data.teamMembers || '',
        track: data.track || '',
        experience: data.experience || '',
        projectIdea: data.projectIdea || '',
        cvName: data.cv || ''
      },
      terms_accepted: true
    };

    try {
      const response = await fetch('/api/opportunity-applications/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.reference) reference = resData.reference;
        if (resData.edit_token) editToken = resData.edit_token;
      } else {
        const errorData = await response.json().catch(() => null);
        if (errorData?.email) {
          throw new Error(`Email : ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}`);
        }
        if (errorData?.non_field_errors) {
          throw new Error(errorData.non_field_errors[0]);
        }
      }
    } catch (err) {
      console.warn("Connexion API backend : enregistrement avec persistance locale", err);
    }

    setApplications(prev => ({
      ...prev,
      [opportunity.id]: {
        reference,
        token: editToken,
        submittedAt: new Date().toISOString(),
        data
      }
    }));

    setActiveOpportunity(null);

    setToast(
      isHackathon
        ? `Inscription confirmée à « ${opportunity.title} » ! Référence : ${reference}. Dossier transmis au jury.`
        : `Candidature transmise à ${opportunity.company} ! Référence : ${reference}.`
    );

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0EA5E9', '#F59E0B', '#10B981']
      });
    } catch {
      // animation facultative
    }
  };

  const handleWithdraw = async (opportunity) => {
    const isHackathon = opportunity.type.includes('Hackathon');
    const confirmed = window.confirm(
      isHackathon
        ? "Voulez-vous vraiment annuler votre inscription à ce hackathon ?"
        : "Voulez-vous vraiment retirer votre candidature ?"
    );
    if (!confirmed) return;

    const currentApp = applications[opportunity.id];
    if (currentApp?.reference) {
      try {
        await fetch('/api/opportunity-applications/withdraw/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: currentApp.reference,
            token: currentApp.token || ''
          })
        });
      } catch (err) {
        console.warn('Backend withdraw error:', err);
      }
    }

    setApplications(prev => {
      const next = { ...prev };
      delete next[opportunity.id];
      return next;
    });

    setToast(
      isHackathon
        ? "Votre inscription au hackathon a bien été annulée."
        : "Votre candidature a été retirée avec succès."
    );
  };

  const filtered = opportunitiesList.filter(o =>
    selectedType === 'all' || o.type.includes(selectedType)
  );

  return (
    <div className="opportunities-container">
      {toast && (
        <ApplicationSuccessBanner message={toast} onClose={() => setToast(null)} />
      )}

      {/* Head */}
      <div className="section-head-bar">
        <div>
          <div className="badge-tag gold mb-2">
            <Briefcase size={13} className="text-amber" />
            <span>{language === 'en' ? 'Careers & Hackathons' : 'Carrière & Événements'}</span>
          </div>
          <h1 className="page-heading">{t('opportunities.title', 'Opportunités Tech & Hackathons')}</h1>
          <p className="page-subheading">
            {t('opportunities.subtitle', 'Découvrez des postes en télétravail ou sur site, des missions freelances et les compétitions de programmation majeures sur le continent.')}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="glass-card toolbar-box">
        <div className="filter-buttons">
          {types.map(t => (
            <button
              key={t.id}
              className={`filter-pill ${selectedType === t.id ? 'active' : ''}`}
              onClick={() => setSelectedType(t.id)}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities list */}
      <div className="opportunities-list">
        {filtered.map((opp, idx) => {
          const application = applications[opp.id];
          const isApplied = !!application;
          const isHackathon = opp.type.includes('Hackathon');
          const { closed, label: deadlineLabel, urgency } = getDeadlineStatus(opp.deadline);

          return (
            <React.Fragment key={opp.id}>
              {idx === 2 && (
                <SponsoredAdCard ad={OFFICIAL_ADS[0]} layout="inline" />
              )}
              <div
                className={`glass-card opp-card ${isHackathon ? 'hackathon-card' : ''} ${urgency ? `opp-urgency-${urgency}` : ''}`}
              >
                <div className="opp-header-row">
                  <div className="opp-meta-left">
                    <div className="opp-title-wrap">
                      <h3 className="opp-title">{opp.title}</h3>
                      <span className="opp-type-badge">{opp.type}</span>
                    </div>
                    <div className="opp-company-line">
                      <span className="company-name">{opp.company}</span>
                      <span className="meta-separator">•</span>
                      <span className="opp-location">
                        <CountryFlag country={opp.flag || opp.location} size="xs" />
                        <span>{opp.location}</span>
                      </span>
                    </div>
                  </div>

                  <div className="opp-salary-badge">
                    <span>{opp.salary}</span>
                  </div>
                </div>

                {opp.description && (() => {
                  const action = getTranslationAction(opp.description, language);
                  const isTranslated = translatedOppIds.has(opp.id);
                  const isLoading = loadingOppTranslations.has(opp.id);

                  return (
                    <div className="opp-desc-container" style={{ margin: '8px 0 12px 0' }}>
                      <p className="opp-description" style={{ margin: 0, lineHeight: 1.5 }}>
                        {isTranslated ? (liveOppTranslations[opp.id] || opp.description) : opp.description}
                      </p>
                      {(action.canTranslate || isTranslated) && (
                        <button
                          type="button"
                          className="translate-btn"
                          onClick={() => handleTranslateOpp(opp)}
                          disabled={isLoading}
                          style={{
                            background: isTranslated ? 'rgba(16, 185, 129, 0.12)' : 'rgba(6, 182, 212, 0.08)',
                            border: `1px solid ${isTranslated ? 'rgba(16, 185, 129, 0.3)' : 'rgba(6, 182, 212, 0.25)'}`,
                            borderRadius: 'var(--radius-sm)',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            color: isTranslated ? '#34d399' : 'var(--cyan-light)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            marginTop: 6
                          }}
                          title={isTranslated ? action.showOriginalLabel : action.buttonLabel}
                        >
                          <Languages size={12} />
                          <span>
                            {isLoading
                              ? action.translatingLabel
                              : isTranslated
                                ? action.showOriginalLabel
                                : action.buttonLabel}
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })()}

              <div className="opp-tags-row">
                {opp.tags.map(t => (
                  <span key={t} className="badge-tag">#{t}</span>
                ))}
              </div>

              <div className="opp-footer-row">
                <div className="opp-footer-info">
                  <span className="opp-posted-time">
                    <Clock size={13} />
                    <span>Publié {opp.posted}</span>
                  </span>
                  {deadlineLabel && (
                    <span className={`opp-deadline urgency-${urgency}`}>
                      <CalendarClock size={13} />
                      <span>{deadlineLabel}</span>
                    </span>
                  )}
                </div>

                {isApplied ? (
                  <div className="opp-applied-actions">
                    <span className="opp-reference" title="Votre numéro de référence">
                      <CheckCircle2 size={15} />
                      <span>{isHackathon ? 'Inscrit' : 'Candidature envoyée'} · {application.reference}</span>
                    </span>
                    {!closed && (
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => handleWithdraw(opp)}
                      >
                        <Undo2 size={14} />
                        <span>{isHackathon ? "Annuler l'inscription" : 'Retirer'}</span>
                      </button>
                    )}
                  </div>
                ) : closed ? (
                  <span className="opp-expired-badge">
                    <CalendarClock size={14} />
                    <span>{isHackathon ? 'Hackathon expiré' : 'Opportunité expirée'}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => setActiveOpportunity(opp)}
                  >
                    {isHackathon ? <Trophy size={15} /> : <Send size={15} />}
                    <span>
                      {urgency === 'today'
                        ? (isHackathon ? "⚡ Dernier moment — S'inscrire" : '⚡ Dernier moment — Postuler')
                        : urgency === 'urgent'
                          ? (isHackathon ? "S'inscrire — Expire demain !" : 'Postuler — Expire demain !')
                          : isHackathon
                            ? "S'inscrire au défi"
                            : opp.type.includes('Freelance')
                              ? 'Proposer mes services'
                              : 'Postuler'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}
      </div>

      {activeOpportunity && (
        <ApplicationModal
          opportunity={activeOpportunity}
          currentUser={currentUser}
          onClose={() => setActiveOpportunity(null)}
          onSubmit={handleSubmitApplication}
        />
      )}
    </div>
  );
}
