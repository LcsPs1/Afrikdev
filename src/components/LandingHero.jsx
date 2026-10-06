import React from 'react';
import {
  ArrowRight,
  FolderGit2,
  Users,
  Layers,
  Zap,
  MessageSquare,
  CheckCircle2,
  Code2,
  Sparkles,
  Globe2,
  ShieldCheck
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export function LandingHero({
  onExploreFeed,
  onOpenMatchmaker,
  onExploreProjects,
  onExploreDevs,
  onJoinCommunity,
  isUserLoggedIn = false
}) {
  const { t, language } = useTranslation();

  // Mots-clés des technologies phares sur la scène tech africaine
  const popularStacks = [
    "Python", "TypeScript", "React", "Flutter", "Django",
    "PostgreSQL", language === 'en' ? "AI & Machine Learning" : "IA & Machine Learning", "Docker", "Go",
    "Kotlin", "Mobile Money API", "Cloud & DevOps"
  ];

  return (
    <div className="landing-container w-full overflow-hidden relative">
      {/* Soft atmospheric ambient glow */}
      <div className="hero-ambient-glow top-glow pointer-events-none" />
      <div className="hero-ambient-glow bottom-glow pointer-events-none" />

      {/* ======================================================================
         HERO SECTION — Épuré, percutant et responsive
         ====================================================================== */}
      <section className="hero-main-section">
        {/* Subtle Official Eyebrow Pill */}
        <div className="hero-badge-pill">
          <span className="live-pulse-dot" />
          <span className="hero-badge-text">
            {t('hero.eyebrow', "Le réseau officiel des développeurs & ingénieurs en Afrique")}
          </span>
        </div>

        <div className="hero-grid">
          {/* Left Column: Heading, Subtitle, Direct CTAs & Metrics */}
          <div className="hero-content">
            <h1 className="hero-title">
              {t('hero.titleMain', "L'écosystème tech panafricain,")} <br />
              <span className="text-gradient">{t('hero.titleSub', "pour les devs, par les devs.")}</span>
            </h1>

            <p className="hero-description">
              {t('hero.description', "La plateforme communautaire de référence pour les développeurs africains, ingénieurs logiciels et créateurs de solutions tech. Partagez vos connaissances, valorisez vos projets « Made in Africa », trouvez vos coéquipiers d'équipe et accédez aux opportunités professionnelles du continent.")}
            </p>

            {/* Clear Dual CTAs */}
            <div className="hero-cta-group">
              <button
                className="btn-primary hero-main-btn min-h-[44px]"
                onClick={() => {
                  if (isUserLoggedIn && onExploreFeed) {
                    onExploreFeed();
                  } else if (onJoinCommunity) {
                    onJoinCommunity();
                  }
                }}
                title={isUserLoggedIn ? t('hero.ctaTitleLoggedIn') : t('hero.ctaTitleGuest')}
              >
                <span>{isUserLoggedIn ? t('hero.goToFeed', "Accéder au fil d'actualité") : t('hero.joinBtn', "Rejoindre la communauté")}</span>
                <ArrowRight size={18} />
              </button>

              <button
                className="btn-secondary hero-sub-btn min-h-[44px]"
                onClick={onExploreProjects}
                title={t('hero.ctaTitleExplore')}
              >
                <FolderGit2 size={18} />
                <span>{t('hero.exploreBtn', "Explorer les projets")}</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Badge Clean Spotlight Stage */}
          <div className="hero-badge-visual">
            <div className="badge-pedestal-stage glass-card">
              {/* Discrete circular orbit */}
              <div className="badge-radar-ring" />

              {/* Official 3D Badge with transparent background */}
              <div className="badge-badge-anchor">
                <img
                  src="/afrikdev-logo-transparent.png"
                  alt="AFRIKDEV — Logo Officiel Panafricain pour les Développeurs"
                  className="badge-main-image"
                  width="294"
                  height="293"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* Continental Trust Ribbon */}
          <div className="hero-stats-bar glass-card">
            <div className="stat-item">
              <span className="stat-number">12.5k+</span>
              <span className="stat-label">{t('hero.statDevs', "Devs")}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">25+</span>
              <span className="stat-label">{t('hero.statCountries', "Pays")}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">850+</span>
              <span className="stat-label">{t('hero.statProjects', "Projets")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
         3 CORE VALUE PILLARS — Clair, aéré & à forte valeur SEO
         ====================================================================== */}
      <section className="pillars-section" aria-label={t('hero.pillarsAriaLabel')}>
        <div className="section-header-centered">
          <h2 className="section-title">{t('hero.pillarsTitle')}</h2>
          <p className="section-subtitle">
            {t('hero.pillarsSubtitle')}
          </p>
        </div>

        <div className="pillars-grid-triplet">
          {/* Pillar 1: Showcase Made in Africa */}
          <article className="pillar-card glass-card" onClick={onExploreProjects} role="button" tabIndex={0}>
            <div className="pillar-icon-box green">
              <Layers size={22} />
            </div>
            <h3 className="pillar-title">{t('hero.pillar1Title')}</h3>
            <p className="pillar-desc">
              {t('hero.pillar1Desc')}
            </p>
            <div className="pillar-action-link">
              <span>{t('hero.pillar1Cta')}</span>
              <ArrowRight size={14} />
            </div>
          </article>

          {/* Pillar 2: Matchmaker & Coéquipiers */}
          <article className="pillar-card glass-card" onClick={onOpenMatchmaker} role="button" tabIndex={0}>
            <div className="pillar-icon-box cyan">
              <Zap size={22} />
            </div>
            <h3 className="pillar-title">{t('hero.pillar2Title')}</h3>
            <p className="pillar-desc">
              {t('hero.pillar2Desc')}
            </p>
            <div className="pillar-action-link">
              <span>{t('hero.pillar2Cta')}</span>
              <ArrowRight size={14} />
            </div>
          </article>

          {/* Pillar 3: Entraide & Opportunités */}
          <article className="pillar-card glass-card" onClick={onExploreFeed} role="button" tabIndex={0}>
            <div className="pillar-icon-box gold">
              <MessageSquare size={22} />
            </div>
            <h3 className="pillar-title">{t('hero.pillar3Title')}</h3>
            <p className="pillar-desc">
              {t('hero.pillar3Desc')}
            </p>
            <div className="pillar-action-link">
              <span>{t('hero.pillar3Cta')}</span>
              <ArrowRight size={14} />
            </div>
          </article>
        </div>
      </section>

      {/* ======================================================================
         SEO TECH CLOUD RIBBON — Mots-clés naturels et discrets
         ====================================================================== */}
      <footer className="tech-cloud-ribbon">
        <span className="tech-cloud-label">{t('hero.trendingTech', "Technologies & Stacks phares sur le continent :")}</span>
        <div className="tech-cloud-tags">
          {popularStacks.map(tech => (
            <span key={tech} className="tech-cloud-pill">{tech}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
