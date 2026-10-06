import React, { useState } from 'react';
import {
  Users,
  Search,
  MapPin,
  Briefcase,
  Star,
  CheckCircle,
  ShieldCheck,
  Award,
  Filter,
  MessageSquare,
  Sparkles,
  RotateCcw,
  Languages,
  Clock
} from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { AFRICAN_COUNTRIES } from '../data/africanCountries';
import { getBadgeDetails } from '../data/badgesData';
import { useTranslation } from '../i18n/LanguageContext';
import { translateText, getTranslationAction } from '../services/translator';
import { SponsoredAdCard } from './SponsoredAdCard';
import { OFFICIAL_ADS } from '../data/officialAdsData';
import { getPresenceStatus } from '../services/presenceService';

export function DevelopersSection({ developers, onSelectDeveloper }) {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Traduction à la demande des bios développeurs
  const [translatedDevIds, setTranslatedDevIds] = useState(new Set());
  const [loadingDevTranslations, setLoadingDevTranslations] = useState(new Set());
  const [liveDevTranslations, setLiveDevTranslations] = useState({});

  // Réinitialiser les bios traduites quand la langue UI change
  useEffect(() => {
    setTranslatedDevIds(new Set());
  }, [language]);

  const handleTranslateBio = async (dev) => {
    const devId = dev.id;
    if (translatedDevIds.has(devId)) {
      setTranslatedDevIds(prev => {
        const next = new Set(prev);
        next.delete(devId);
        return next;
      });
      return;
    }

    const action = getTranslationAction(dev.bio, language);
    if (!action.canTranslate) return;

    const cacheKey = `${action.targetLang}_${devId}`;
    if (liveDevTranslations[cacheKey] || liveDevTranslations[devId]) {
      setTranslatedDevIds(prev => new Set(prev).add(devId));
      return;
    }

    setLoadingDevTranslations(prev => new Set(prev).add(devId));
    try {
      const translated = await translateText(dev.bio, action.targetLang, action.sourceLang);
      setLiveDevTranslations(prev => ({ 
        ...prev, 
        [cacheKey]: translated,
        [devId]: translated 
      }));
      setTranslatedDevIds(prev => new Set(prev).add(devId));
    } catch (err) {
      console.warn("Échec traduction bio:", err);
    } finally {
      setLoadingDevTranslations(prev => {
        const next = new Set(prev);
        next.delete(devId);
        return next;
      });
    }
  };

  const popularSkills = [
    "all", "React", "Django", "Python", "Flutter", "PostgreSQL", "Docker", "Go", "TypeScript", "FastAPI"
  ];

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedSkill('all');
    setOnlyAvailable(false);
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCountry !== 'all' || selectedSkill !== 'all' || onlyAvailable;

  const filteredDevs = developers.filter(dev => {
    const matchesSearch =
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCountry = selectedCountry === 'all' || dev.country === selectedCountry;
    const matchesSkill = selectedSkill === 'all' || dev.skills.includes(selectedSkill);
    const matchesAvail = !onlyAvailable || dev.available;

    return matchesSearch && matchesCountry && matchesSkill && matchesAvail;
  });

  return (
    <div className="developers-container">
      {/* Head banner */}
      <div className="section-head-bar">
        <div>
          <div className="badge-tag mb-2">
            <Users size={13} />
            <span>{language === 'en' ? 'Pan-African Network' : 'Réseau Panafricain'}</span>
          </div>
          <h1 className="page-heading">{t('developers.title', 'Annuaire des Développeurs & Talents')}</h1>
          <p className="page-subheading">
            {t('developers.subtitle', 'Découvrez les ingénieurs, mentors, freelances et bâtisseurs tech à travers le continent. Filtrez par expertise et disponibilité.')}
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="glass-card toolbar-box">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={t('developers.searchPlaceholder', 'Rechercher par nom, rôle ou compétence...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')} title="Effacer">×</button>
          )}
        </div>

        <div className="toolbar-selects">
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

          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="filter-select"
            title="Filtrer par technologie clé"
          >
            <option value="all">⚡ {language === 'en' ? 'All Tech Stacks' : 'Toutes les compétences'}</option>
            {popularSkills.filter(s => s !== 'all').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <label className="filter-checkbox-label">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            <span>{t('developers.filterAvailable', 'Disponibles maintenant')}</span>
          </label>
        </div>

        {/* Toolbar status & active filters summary */}
        <div className="toolbar-stats-row">
          <span className="results-badge">
            <strong>{filteredDevs.length}</strong> {filteredDevs.length > 1 ? (language === 'en' ? 'talents found' : 'talents trouvés') : (language === 'en' ? 'talent found' : 'talent trouvé')}
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
              {selectedSkill !== 'all' && (
                <span className="active-chip">
                  <span>{selectedSkill}</span>
                  <button onClick={() => setSelectedSkill('all')}>×</button>
                </span>
              )}
              {onlyAvailable && (
                <span className="active-chip">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span>{language === 'en' ? 'Available' : 'Disponible'}</span>
                  </span>
                  <button onClick={() => setOnlyAvailable(false)}>×</button>
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

      {/* Developers Grid */}
      <div className="developers-grid">
        {filteredDevs.length === 0 ? (
          <div className="glass-card empty-state-box">
            <Users size={40} className="text-cyan mb-2" />
            <h3>{language === 'en' ? 'No profiles match your filters' : 'Aucun profil ne correspond à vos filtres'}</h3>
            <p>{language === 'en' ? 'Try broadening your search or resetting country and skills.' : "Essayez d'élargir votre recherche ou de réinitialiser le pays et les compétences."}</p>
            <button className="btn-primary btn-sm mt-3" onClick={handleResetFilters}>
              {language === 'en' ? 'Reset filters' : 'Réinitialiser les filtres'}
            </button>
          </div>
        ) : (
          filteredDevs.map((dev, idx) => {
            const isTranslated = translatedDevIds.has(dev.id);
            const translatedBio = liveDevTranslations[dev.id];
            const presence = getPresenceStatus(dev, language);

            return (
              <React.Fragment key={dev.id}>
                {idx === 2 && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <SponsoredAdCard ad={OFFICIAL_ADS[0]} layout="inline" />
                  </div>
                )}
                <div className="glass-card dev-card">
                  {/* Top row with avatar and availability */}
                  <div className="dev-card-top">
                    <div className="avatar-wrapper">
                      <img src={dev.avatar} alt={dev.name} className="dev-avatar" />
                      {presence.canShowStatus && (
                        <span 
                          className={`status-dot ${presence.dotClass} ${presence.isOnline ? 'online' : 'busy'}`} 
                          title={presence.label}
                        />
                      )}
                    </div>

                    <div className="dev-meta">
                      <div className="dev-name-row">
                        <h3 className="dev-name">{dev.name}</h3>
                        <div className="dev-flag-pill" title={dev.country}>
                          <CountryFlag country={dev.country} size="xs" />
                        </div>
                      </div>
                      <div className="dev-title">{dev.title}</div>
                      <div className="dev-location">
                        <MapPin size={13} className="text-cyan" />
                        <span>{dev.city}, {dev.country}</span>
                      </div>

                      {presence.canShowStatus && (
                        <div className="dev-presence-line" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <span className={`dev-presence-pill ${presence.dotClass}`}>
                            <span className={`presence-mini-dot ${presence.dotClass}`} />
                            <span>{presence.label}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio excerpt with on-demand translate button */}
                  <div className="dev-bio-wrap" style={{ margin: '8px 0 10px 0' }}>
                    <p className="dev-bio" style={{ margin: 0 }}>
                      {isTranslated ? (translatedBio || dev.bio) : dev.bio}
                    </p>
                    {dev.bio && (() => {
                      const action = getTranslationAction(dev.bio, language);
                      if (!action.canTranslate && !isTranslated) return null;

                      return (
                        <button
                          type="button"
                          className="translate-btn"
                          onClick={() => handleTranslateBio(dev)}
                          disabled={loadingDevTranslations.has(dev.id)}
                          style={{
                            background: isTranslated ? 'rgba(16, 185, 129, 0.12)' : 'rgba(6, 182, 212, 0.08)',
                            border: `1px solid ${isTranslated ? 'rgba(16, 185, 129, 0.3)' : 'rgba(6, 182, 212, 0.25)'}`,
                            borderRadius: 'var(--radius-sm)',
                            padding: '2px 7px',
                            fontSize: '0.7rem',
                            color: isTranslated ? '#34d399' : 'var(--cyan-light)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            marginTop: 5
                          }}
                          title={isTranslated ? action.showOriginalLabel : action.buttonLabel}
                        >
                          <Languages size={11} />
                          <span>
                            {loadingDevTranslations.has(dev.id)
                              ? action.translatingLabel
                              : isTranslated
                                ? action.showOriginalLabel
                                : action.buttonLabel}
                          </span>
                        </button>
                      );
                    })()}
                  </div>

                  {/* Skills chips */}
                  <div className="dev-skills-row">
                    {dev.skills.slice(0, 5).map(skill => (
                      <span key={skill} className="skill-pill">{skill}</span>
                    ))}
                    {dev.skills.length > 5 && (
                      <span className="skill-pill more">+{dev.skills.length - 5}</span>
                    )}
                  </div>

                  {/* Badges / Stats */}
                  <div className="dev-stats-row">
                    <div className="stat-pill">
                      <Star size={13} className="text-amber" />
                      <span>{dev.reputation} {t('developers.pointsReputation', 'pts')}</span>
                    </div>
                    <div className="stat-pill">
                      <Briefcase size={13} className="text-cyan" />
                      <span>{dev.projectsCount} {language === 'en' ? 'projects' : 'projets'}</span>
                    </div>
                    {dev.badges?.[0] && (() => {
                      const b = getBadgeDetails(dev.badges[0], language);
                      return (
                        <span 
                          className="badge-tag gold text-xs" 
                          title={`${b.title} - ${b.howToEarn}`}
                          style={{ cursor: 'pointer' }}
                        >
                          {b.icon} {b.title}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Actions */}
                  <div className="dev-card-actions">
                    <button
                      className="btn-outline-cyan w-full"
                      onClick={() => onSelectDeveloper(dev)}
                    >
                      <span>{t('developers.viewProfile', 'Voir le profil complet')}</span>
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}
