import React from 'react';
import { ExternalLink, Sparkles, Megaphone, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { OFFICIAL_ADS, getLocalizedAd } from '../data/officialAdsData';

export function SponsoredAdCard({ ad = OFFICIAL_ADS[0], layout = 'sidebar' }) {
  const { language, t } = useTranslation();
  const localized = getLocalizedAd(ad, language);

  if (!localized) return null;

  if (layout === 'inline') {
    return (
      <aside 
        className="glass-card sponsored-ad-card inline-ad" 
        style={{ 
          borderLeft: `4px solid ${localized.highlightColor || 'var(--cyan-primary)'}`
        }}
        aria-label={language === 'en' ? "Sponsored advertisement" : "Publicité sponsorisée"}
      >
        <div className="sponsored-ad-header">
          <div className="sponsored-tag-pill">
            <Megaphone size={13} className="sponsored-tag-icon" />
            <span>{localized.tag}</span>
          </div>
          <span className="sponsored-partner-label">
            <ShieldCheck size={13} />
            <span>{t('ads.officialPartner', 'Partenaire Officiel AFRIKDEV')}</span>
          </span>
        </div>

        <div className="sponsored-ad-content">
          {localized.badge && (
            <div 
              className="sponsored-badge-pill" 
              style={{ 
                color: localized.highlightColor || 'var(--cyan-light)', 
                borderColor: `${localized.highlightColor || '#0ea5e9'}40`,
                background: `${localized.highlightColor || '#0ea5e9'}15` 
              }}
            >
              <Sparkles size={12} />
              <span>{localized.badge}</span>
            </div>
          )}
          <h4 className="sponsored-ad-title">{localized.title}</h4>
          <p className="sponsored-ad-desc">{localized.desc}</p>
        </div>

        <div className="sponsored-ad-footer">
          <span className="sponsored-by">
            <span>{language === 'en' ? "Sponsored by" : "Proposé par"}</span>
            <strong>{localized.sponsor}</strong>
          </span>
          <a 
            href={localized.link} 
            className="sponsored-cta-btn"
            style={{ 
              background: localized.highlightColor 
                ? `linear-gradient(135deg, ${localized.highlightColor}, #0284C7)` 
                : undefined 
            }}
            onClick={(e) => {
              e.preventDefault();
              alert(language === 'en' 
                ? `Redirecting to partner: ${localized.title}` 
                : `Redirection vers l'offre partenaire : ${localized.title}`);
            }}
          >
            <span>{localized.cta}</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </aside>
    );
  }

  // Default: Sidebar layout
  return (
    <aside 
      className="glass-card sidebar-widget sponsored-ad-card sidebar-ad" 
      style={{ borderTop: `3px solid ${localized.highlightColor || 'var(--cyan-primary)'}` }}
      aria-label={language === 'en' ? "Sponsored advertisement" : "Publicité sponsorisée"}
    >
      <div className="widget-header" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="flex items-center gap-2">
          <Megaphone size={15} className="text-amber" />
          <span className="sponsored-widget-tag">{localized.tag}</span>
        </div>
        <span className="sponsored-badge-micro" style={{ background: `${localized.highlightColor}20`, color: localized.highlightColor, border: `1px solid ${localized.highlightColor}40` }}>
          {localized.badge}
        </span>
      </div>

      <div className="sponsored-body">
        <h4 className="sponsored-ad-title">{localized.title}</h4>
        <p className="sponsored-ad-desc">{localized.desc}</p>
      </div>

      <div className="sponsored-ad-footer">
        <span className="sponsored-by text-xs">
          {language === 'en' ? "Offered by" : "Proposé par"} <strong>{localized.sponsor}</strong>
        </span>
        <a 
          href={localized.link} 
          className="sponsored-cta-link"
          style={{ color: localized.highlightColor }}
          onClick={(e) => {
            e.preventDefault();
            alert(language === 'en' 
              ? `Redirecting to partner: ${localized.title}` 
              : `Redirection vers l'offre partenaire : ${localized.title}`);
          }}
        >
          <span>{localized.cta}</span>
        </a>
      </div>
    </aside>
  );
}
