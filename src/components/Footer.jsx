import React from 'react';
import {
  Globe,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export function Footer({
  setActiveTab,
  isUserLoggedIn = false,
  setAuthInitialMode,
  setShowTermsModal,
  setShowPrivacyModal
}) {
  const { t } = useTranslation();

  const handleNavClick = (tab, e) => {
    if (e) e.preventDefault();
    if (setActiveTab) {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAuthClick = (mode, e) => {
    if (e) e.preventDefault();
    if (isUserLoggedIn) {
      handleNavClick('feed');
    } else {
      if (setAuthInitialMode) setAuthInitialMode(mode);
      handleNavClick('auth');
    }
  };

  return (
    <footer
      className="app-footer"
      role="contentinfo"
      aria-label="Pied de page AFRIKDEV"
    >
      <div className="container">
        {/* Main Footer Grid: 3 columns (1.4fr 1fr 1fr on desktop, 1fr on mobile) */}
        <div className="footer-top-grid">

          {/* =================================================================
             Col 1: Brand, Mission & Continental Presence
             ================================================================= */}
          <div className="footer-brand-col">
            <a
              href="#home"
              className="footer-logo-row"
              onClick={(e) => handleNavClick('home', e)}
              title="AFRIKDEV — Accueil"
            >
              <img
                src="/afrikdev-logo-transparent.png"
                alt="Logo AFRIKDEV"
                className="footer-logo-img"
                width="36"
                height="36"
                loading="lazy"
              />
              <span className="footer-brand-title">
                AFRIK<span className="brand-highlight">DEV</span>
              </span>
            </a>

            <p className="footer-desc hidden sm:block">
              {t(
                'footer.mission',
                "Le réseau communautaire panafricain dédié aux développeurs africains et ingénieurs logiciels. Partagez du code, propulsez vos projets « Made in Africa » et bâtissez ensemble l'avenir technologique du continent."
              )}
            </p>

            {/* Continental Live Network Badge */}
            <div className="footer-status-tag hidden sm:inline-flex">
              <span className="live-pulse-dot mini" aria-hidden="true" />
              <span>{t('footer.activeNetwork', "Réseau actif dans 54 pays d'Afrique")}</span>
            </div>
          </div>

          {/* =================================================================
             Col 2: Platform Links
             ================================================================= */}
          <nav className="footer-col" aria-label="Plateforme AFRIKDEV">
            <h4 className="footer-col-title flex items-center gap-1.5">
              <Sparkles size={14} className="text-[var(--cyan-primary)]" />
              <span>{t('footer.colPlatform', "Plateforme")}</span>
            </h4>
            <div className="footer-links">
              {/* Fil de discussions - masqué sur mobile pour aérer le footer */}
              <a
                href="#feed"
                className="footer-link hidden-mobile hidden md:flex min-h-[44px] items-center"
                onClick={(e) => handleNavClick('feed', e)}
                title="Fil de code et astuces des développeurs"
              >
                {t('footer.feed', "Fil de discussions")}
              </a>
              <a
                href="#projects"
                className="footer-link min-h-[44px] flex items-center"
                onClick={(e) => handleNavClick('projects', e)}
                title="Showcase des projets et applications Made in Africa"
              >
                {t('footer.projects', "Projets")}
              </a>
              <a
                href="#developers"
                className="footer-link min-h-[44px] flex items-center"
                onClick={(e) => handleNavClick('developers', e)}
                title="Annuaire des développeurs et ingénieurs"
              >
                {t('footer.developers', "Annuaire des Talents")}
              </a>
              {/* Matchmaker IA - masqué sur mobile pour aérer le footer */}
              <a
                href="#matchmaker"
                className="footer-link hidden-mobile hidden md:flex min-h-[44px] items-center"
                onClick={(e) => handleNavClick('matchmaker', e)}
                title="Moteur de matching d'ingénieurs par IA"
              >
                {t('footer.matchmaker', "Matchmaker IA")}
              </a>
              {/* Fil communautaire / Rejoindre - masqué sur mobile pour aérer le footer */}
              <a
                href="#auth"
                className="footer-link hidden-mobile hidden md:flex text-cyan font-semibold min-h-[44px] items-center"
                onClick={(e) => handleAuthClick('register', e)}
                title="Rejoindre la communauté ou se connecter"
              >
                {isUserLoggedIn
                  ? t('footer.communityFeed', "Fil communautaire")
                  : t('footer.joinCommunity', "Rejoindre la communauté")}
              </a>
            </div>
          </nav>

          {/* =================================================================
             Col 3: Ecosystem & Hubs
             ================================================================= */}
          <nav className="footer-col" aria-label="Écosystème tech africain">
            <h4 className="footer-col-title flex items-center gap-1.5">
              <Globe size={14} className="text-[var(--cyan-primary)]" />
              <span>{t('footer.colEcosystem', "Écosystème")}</span>
            </h4>
            <div className="footer-links">
              <a
                href="#questions"
                className="footer-link min-h-[44px] flex items-center"
                onClick={(e) => handleNavClick('questions', e)}
                title="Questions, réponses et entraide technique"
              >
                {t('footer.faq', "FAQ Tech & Entraide")}
              </a>
              {/* Hubs Nationaux - masqué sur mobile pour aérer le footer */}
              <a
                href="#communities"
                className="footer-link hidden-mobile hidden md:flex min-h-[44px] items-center"
                onClick={(e) => handleNavClick('communities', e)}
                title="Hubs nationaux : Abidjan, Dakar, Lagos, Nairobi, Kigali"
              >
                {t('footer.hubs', "Hubs Nationaux & Thématiques")}
              </a>
              {/* Opportunités & Hackathons - masqué sur mobile pour aérer le footer */}
              <a
                href="#opportunities"
                className="footer-link hidden-mobile hidden md:flex min-h-[44px] items-center"
                onClick={(e) => handleNavClick('opportunities', e)}
                title="Offres d'emploi tech, stages et hackathons africains"
              >
                {t('footer.opportunities', "Opportunités & Hackathons")}
              </a>
              {/* Espace Entreprises Recruteurs - masqué sur mobile pour aérer le footer */}
              <a
                href="#company"
                className="footer-link hidden-mobile hidden md:flex min-h-[44px] items-center"
                onClick={(e) => handleNavClick('company', e)}
                title="Portail Recruteurs et ATS Kanban"
              >
                {t('footer.companies', "Espace Entreprises Recruteurs")}
              </a>
            </div>
          </nav>

        </div>

        {/* =====================================================================
           Bottom Bar: Copyright, Legal Links & Pan-African Slogan
           pb-28 on mobile to avoid overlap with fixed mobile bottom navigation
           ===================================================================== */}
        <div className="footer-bottom-bar pb-28 md:pb-6">
          <span>
            {t('footer.copyright', "© 2026 AFRIKDEV — Pour les devs, par les devs. Tous droits réservés.")}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="footer-link underline underline-offset-4 bg-transparent border-none cursor-pointer p-0 min-h-[44px] flex items-center"
              onClick={() => setShowTermsModal && setShowTermsModal(true)}
            >
              {t('footer.terms', "CGU")}
            </button>
            <span className="text-[var(--border-subtle)]">•</span>
            <button
              type="button"
              className="footer-link underline underline-offset-4 bg-transparent border-none cursor-pointer p-0 min-h-[44px] flex items-center"
              onClick={() => setShowPrivacyModal && setShowPrivacyModal(true)}
            >
              {t('footer.privacy', "RGPD & Confidentialité")}
            </button>
          </div>

          <span className="footer-tagline font-semibold flex items-center gap-1.5">
            <span>{t('footer.slogan', "Construire l'Afrique numérique ensemble 🌍⚡")}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
