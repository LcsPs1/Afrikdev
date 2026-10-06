import React, { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Star,
  ThumbsUp,
  Plus,
  Search,
  Filter,
  Tag,
  Layers,
  CheckCircle,
  Sparkles,
  Users,
  RotateCcw,
  Languages,
  Mail,
  Building2
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { CountryFlag } from './CountryFlag';
import { AFRICAN_COUNTRIES } from '../data/africanCountries';
import { useTranslation } from '../i18n/LanguageContext';
import { translateText, getTranslationAction } from '../services/translator';
import { SponsoredAdCard } from './SponsoredAdCard';
import { OFFICIAL_ADS } from '../data/officialAdsData';
import { ProjectContactModal } from './ProjectContactModal';

export function ProjectsSection({ 
  projects, 
  setProjects, 
  onOpenNewProject,
  currentUser,
  currentCompany,
  isRecruiterLoggedIn
}) {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [votedProjects, setVotedProjects] = useState({});
  const [starredProjects, setStarredProjects] = useState({});
  const [contactProject, setContactProject] = useState(null);

  // Traduction à la demande des projets
  const [translatedProjectIds, setTranslatedProjectIds] = useState(new Set());
  const [loadingProjectTranslations, setLoadingProjectTranslations] = useState(new Set());
  const [liveProjectTranslations, setLiveProjectTranslations] = useState({});

  // Réinitialiser les projets traduits quand la langue change
  useEffect(() => {
    setTranslatedProjectIds(new Set());
  }, [language]);

  const handleTranslateProject = async (project) => {
    const pId = project.id;
    if (translatedProjectIds.has(pId)) {
      setTranslatedProjectIds(prev => {
        const next = new Set(prev);
        next.delete(pId);
        return next;
      });
      return;
    }

    const action = getTranslationAction(`${project.tagline || ''} ${project.description || ''}`, language);
    if (!action.canTranslate) return;

    const cacheKey = `${action.targetLang}_${pId}`;
    if (liveProjectTranslations[cacheKey] || liveProjectTranslations[pId]) {
      setTranslatedProjectIds(prev => new Set(prev).add(pId));
      return;
    }

    setLoadingProjectTranslations(prev => new Set(prev).add(pId));
    try {
      const translatedTagline = await translateText(project.tagline, action.targetLang, action.sourceLang);
      const translatedDescription = await translateText(project.description, action.targetLang, action.sourceLang);

      setLiveProjectTranslations(prev => ({
        ...prev,
        [cacheKey]: {
          tagline: translatedTagline,
          description: translatedDescription
        },
        [pId]: {
          tagline: translatedTagline,
          description: translatedDescription
        }
      }));
      setTranslatedProjectIds(prev => new Set(prev).add(pId));
    } catch (err) {
      console.warn("Échec traduction projet:", err);
    } finally {
      setLoadingProjectTranslations(prev => {
        const next = new Set(prev);
        next.delete(pId);
        return next;
      });
    }
  };

  const categories = [
    { id: 'all', label: t('projects.filterAll', 'Toutes les catégories') },
    { id: 'Mobility', label: language === 'en' ? 'Mobility & Logistics' : 'Mobilité & Transport' },
    { id: 'FinTech', label: t('projects.filterFintech', 'FinTech & Paiements') },
    { id: 'AgriTech / IA', label: t('projects.filterAgri', 'AgriTech & IA') },
    { id: 'HealthTech', label: t('projects.filterHealth', 'Santé & MedTech') }
  ];

  const handleUpvote = (projectId) => {
    const isVoted = votedProjects[projectId];
    setVotedProjects(prev => ({ ...prev, [projectId]: !isVoted }));
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, upvotes: isVoted ? p.upvotes - 1 : p.upvotes + 1 };
      }
      return p;
    }));
  };

  const handleStar = (projectId) => {
    const isStarred = starredProjects[projectId];
    setStarredProjects(prev => ({ ...prev, [projectId]: !isStarred }));
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, stars: isStarred ? p.stars - 1 : p.stars + 1 };
      }
      return p;
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCountry('all');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || selectedCountry !== 'all';

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || p.category.includes(selectedCategory);
    const matchesCountry = selectedCountry === 'all' || p.country === selectedCountry;

    return matchesSearch && matchesCategory && matchesCountry;
  });

  return (
    <div className="projects-container">
      {/* Header with Title and "Submit Project" */}
      <div className="section-head-bar">
        <div>
          <div className="badge-tag gold mb-2">
            <Sparkles size={13} />
            <span>{language === 'en' ? 'Pan-African Innovation' : 'Innovation Panafricaine'}</span>
          </div>
          <h1 className="page-heading">{t('projects.title', 'Vitrine des Projets « Made in Africa »')}</h1>
          <p className="page-subheading">
            {t('projects.subtitle', 'Découvrez, testez et contribuez aux applications, SaaS et outils open-source conçus par les développeurs du continent.')}
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenNewProject}>
          <Plus size={18} />
          <span>{t('projects.addProjectBtn', 'Soumettre un projet')}</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card toolbar-box">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={t('projects.searchPlaceholder', 'Rechercher par nom de projet, technologie (Django, Flutter, AI...)')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')} title="Effacer la recherche">×</button>
          )}
        </div>

        <div className="toolbar-selects">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
            title="Filtrer par catégorie"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="filter-select"
            title="Filtrer par pays africain"
          >
            <option value="all">🌍 {t('developers.filterAll', 'Tous les pays africains')}</option>
            {AFRICAN_COUNTRIES.map(c => (
              <option key={c.code} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Toolbar status & active filters summary */}
        <div className="toolbar-stats-row">
          <span className="results-badge">
            <strong>{filteredProjects.length}</strong> {filteredProjects.length > 1 ? (language === 'en' ? 'projects found' : 'projets trouvés') : (language === 'en' ? 'project found' : 'projet trouvé')}
          </span>

          {hasActiveFilters && (
            <div className="active-filters-chips">
              {selectedCountry !== 'all' && (
                <span className="active-chip">
                  <CountryFlag country={selectedCountry} size="xs" />
                  <span>{selectedCountry}</span>
                  <button onClick={() => setSelectedCountry('all')}>×</button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="active-chip">
                  <span>{categories.find(c => c.id === selectedCategory)?.label || selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('all')}>×</button>
                </span>
              )}
              {searchQuery && (
                <span className="active-chip">
                  <span>« {searchQuery} »</span>
                  <button onClick={() => setSearchQuery('')}>×</button>
                </span>
              )}
              <button className="reset-filters-btn" onClick={handleResetFilters}>
                <RotateCcw size={12} />
                <span>{language === 'en' ? 'Reset' : 'Réinitialiser'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <div className="glass-card empty-state-box">
            <FolderGit2 size={40} className="text-cyan mb-2" />
            <h3>{language === 'en' ? 'No projects match these criteria' : 'Aucun projet ne correspond à ces critères'}</h3>
            <p>{language === 'en' ? 'Try resetting your country or category filters.' : 'Essayez de réinitialiser vos filtres de pays ou de catégorie.'}</p>
            <button className="btn-primary btn-sm mt-3" onClick={handleResetFilters}>
              {language === 'en' ? 'Reset filters' : 'Réinitialiser les filtres'}
            </button>
          </div>
        ) : (
          filteredProjects.map((project, idx) => {
            const isVoted = votedProjects[project.id];
            const isStarred = starredProjects[project.id];
            const isTranslated = translatedProjectIds.has(project.id);
            const translation = liveProjectTranslations[project.id];

            return (
              <React.Fragment key={project.id}>
                {idx === 2 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <SponsoredAdCard ad={OFFICIAL_ADS[2]} layout="inline" />
                  </div>
                )}
                <div className="glass-card project-card">
                  {/* Card Header */}
                  <div className="project-card-header">
                    <div className="project-title-row">
                      <h3 className="project-title">{project.title}</h3>
                      <div className="project-flag-pill" title={project.country}>
                        <CountryFlag country={project.country} size="sm" />
                        <span className="country-label-sub">{project.country}</span>
                      </div>
                    </div>
                    <div className="project-badges-row">
                      <span className="badge-tag green">{project.status}</span>
                      <span className="badge-tag">{project.category}</span>
                    </div>
                  </div>

                  {/* Tagline & Description */}
                  <p className="project-tagline">
                    {isTranslated ? (translation?.tagline || project.tagline) : project.tagline}
                  </p>
                  <p className="project-description">
                    {isTranslated ? (translation?.description || project.description) : project.description}
                  </p>

                  {/* On-demand translate button */}
                  {(() => {
                    const action = getTranslationAction(`${project.tagline || ''} ${project.description || ''}`, language);
                    if (!action.canTranslate && !isTranslated) return null;

                    return (
                      <div style={{ marginBottom: 12 }}>
                        <button
                          type="button"
                          className="translate-btn"
                          onClick={() => handleTranslateProject(project)}
                          disabled={loadingProjectTranslations.has(project.id)}
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
                            gap: 4
                          }}
                          title={isTranslated ? action.showOriginalLabel : action.buttonLabel}
                        >
                          <Languages size={12} />
                          <span>
                            {loadingProjectTranslations.has(project.id)
                              ? action.translatingLabel
                              : isTranslated
                                ? action.showOriginalLabel
                                : action.buttonLabel}
                          </span>
                        </button>
                      </div>
                    );
                  })()}

                  {/* Technologies stack */}
                  <div className="project-tech-stack">
                    {project.technologies.map(tech => (
                      <span key={tech} className="tech-chip">{tech}</span>
                    ))}
                  </div>

                  {/* Open Roles banner if looking for team */}
                  {project.openRoles && project.openRoles.length > 0 && (
                    <div className="open-roles-box">
                      <div className="open-roles-title">
                        <Users size={14} className="text-amber" />
                        <span>{language === 'en' ? 'Hiring for team:' : "Recrute pour l'équipe :"}</span>
                      </div>
                      <div className="open-roles-list">
                        {project.openRoles.map(role => (
                          <span key={role} className="role-tag">🤝 {role}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Company & Author Banner with Contact Action */}
                  <div className="project-author-strip">
                    <div className="project-author-meta">
                      {project.company ? (
                        <div className="project-company-badge" title="Entreprise conceptrice">
                          <Building2 size={13} className="text-cyan" />
                          <strong className="project-company-name">{project.company}</strong>
                        </div>
                      ) : project.author ? (
                        <div className="project-dev-meta">
                          {project.author.avatar && (
                            <img 
                              src={project.author.avatar} 
                              alt={project.author.name} 
                              className="project-dev-avatar"
                            />
                          )}
                          <span className="project-dev-name">{project.author.name}</span>
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      className="btn-contact-project"
                      onClick={() => setContactProject(project)}
                      title={language === 'en' ? `Contact company regarding ${project.title}` : `Contacter l'entreprise concernant « ${project.title} »`}
                    >
                      <Mail size={13} />
                      <span>{language === 'en' ? 'Contact Company' : "Contacter l'entreprise"}</span>
                    </button>
                  </div>

                  {/* Card Footer: Upvote, Star, Links */}
                  <div className="project-card-footer">
                    <div className="project-actions-left">
                      <button
                        className={`btn-pill-action ${isVoted ? 'active-vote' : ''}`}
                        onClick={() => handleUpvote(project.id)}
                        title={language === 'en' ? 'Upvote this project' : 'Voter pour ce projet'}
                      >
                        <ThumbsUp size={15} />
                        <span>{project.upvotes}</span>
                      </button>

                      <button
                        className={`btn-pill-action ${isStarred ? 'active-star' : ''}`}
                        onClick={() => handleStar(project.id)}
                        title={language === 'en' ? 'Bookmark (Star)' : 'Mettre en favori (Star)'}
                      >
                        <Star size={15} fill={isStarred ? "#F59E0B" : "none"} />
                        <span>{project.stars}</span>
                      </button>
                    </div>

                    <div className="project-links-right">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="link-icon-btn"
                          title={t('projects.sourceCode', 'Code source GitHub')}
                        >
                          <GithubIcon size={18} />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="link-icon-btn highlight"
                          title={t('projects.liveDemo', 'Tester la démo en ligne')}
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Modal de contact entreprise / créateur de projet */}
      <ProjectContactModal
        isOpen={!!contactProject}
        onClose={() => setContactProject(null)}
        project={contactProject}
        currentUser={currentUser}
        currentCompany={currentCompany}
        isRecruiterLoggedIn={isRecruiterLoggedIn}
      />
    </div>
  );
}
