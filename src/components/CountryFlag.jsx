import React, { useState } from 'react';
import { getCountryCode, getFlagUrl } from '../data/africanCountries';

const SIZES = {
  xs: { width: 18, height: 12 },
  sm: { width: 22, height: 15 },
  md: { width: 28, height: 19 },
  lg: { width: 36, height: 24 }
};

// High-precision vector SVG flags for African nations ensuring instant 100% offline rendering
const SVG_FLAGS = {
  ci: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Côte d'Ivoire">
      <rect width="150" height="300" fill="#FF8200" />
      <rect x="150" width="150" height="300" fill="#FFFFFF" />
      <rect x="300" width="150" height="300" fill="#009A44" />
    </svg>
  ),
  sn: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Sénégal">
      <rect width="150" height="300" fill="#00853F" />
      <rect x="150" width="150" height="300" fill="#FDEF42" />
      <rect x="300" width="150" height="300" fill="#E31B23" />
      <polygon points="225,115 233,142 261,142 238,158 247,185 225,168 203,185 212,158 189,142 217,142" fill="#00853F" />
    </svg>
  ),
  ng: (w, h) => (
    <svg viewBox="0 0 600 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Nigeria">
      <rect width="200" height="300" fill="#008751" />
      <rect x="200" width="200" height="300" fill="#FFFFFF" />
      <rect x="400" width="200" height="300" fill="#008751" />
    </svg>
  ),
  ma: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Maroc">
      <rect width="450" height="300" fill="#C1272D" />
      <polygon points="225,95 236,132 275,132 243,155 255,192 225,169 195,192 207,155 175,132 214,132" fill="none" stroke="#006233" strokeWidth="11" />
    </svg>
  ),
  cm: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Cameroun">
      <rect width="150" height="300" fill="#007A3D" />
      <rect x="150" width="150" height="300" fill="#CE1126" />
      <rect x="300" width="150" height="300" fill="#FCD116" />
      <polygon points="225,120 233,145 260,145 238,160 247,185 225,170 203,185 212,160 190,145 217,145" fill="#FCD116" />
    </svg>
  ),
  ml: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Mali">
      <rect width="150" height="300" fill="#14B53A" />
      <rect x="150" width="150" height="300" fill="#FCD116" />
      <rect x="300" width="150" height="300" fill="#CE1126" />
    </svg>
  ),
  bj: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Bénin">
      <rect width="180" height="300" fill="#008751" />
      <rect x="180" y="0" width="270" height="150" fill="#FCD116" />
      <rect x="180" y="150" width="270" height="150" fill="#E8112D" />
    </svg>
  ),
  bf: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Burkina Faso">
      <rect y="0" width="450" height="150" fill="#EF2B2D" />
      <rect y="150" width="450" height="150" fill="#009E49" />
      <polygon points="225,115 233,142 261,142 238,158 247,185 225,168 203,185 212,158 189,142 217,142" fill="#FCD116" />
    </svg>
  ),
  gh: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Ghana">
      <rect y="0" width="450" height="100" fill="#CE1126" />
      <rect y="100" width="450" height="100" fill="#FCD116" />
      <rect y="200" width="450" height="100" fill="#006B3F" />
      <polygon points="225,120 231,138 250,138 234,150 241,168 225,156 209,168 216,150 200,138 219,138" fill="#000000" />
    </svg>
  ),
  tg: (w, h) => (
    <svg viewBox="0 0 500 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Togo">
      <rect y="0" width="500" height="60" fill="#006A4E" />
      <rect y="60" width="500" height="60" fill="#FFCE00" />
      <rect y="120" width="500" height="60" fill="#006A4E" />
      <rect y="180" width="500" height="60" fill="#FFCE00" />
      <rect y="240" width="500" height="60" fill="#006A4E" />
      <rect width="180" height="180" fill="#D21034" />
      <polygon points="90,55 96,73 115,73 99,85 106,103 90,91 74,103 81,85 65,73 84,73" fill="#FFFFFF" />
    </svg>
  ),
  rw: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Rwanda">
      <rect y="0" width="450" height="150" fill="#00A1DE" />
      <rect y="150" width="450" height="75" fill="#FAD201" />
      <rect y="225" width="450" height="75" fill="#20603D" />
      <circle cx="370" cy="75" r="28" fill="#E5A823" />
    </svg>
  ),
  ke: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Kenya">
      <rect y="0" width="450" height="85" fill="#000000" />
      <rect y="85" width="450" height="15" fill="#FFFFFF" />
      <rect y="100" width="450" height="100" fill="#BB0000" />
      <rect y="200" width="450" height="15" fill="#FFFFFF" />
      <rect y="215" width="450" height="85" fill="#006600" />
      <ellipse cx="225" cy="150" rx="36" ry="65" fill="#BB0000" stroke="#000000" strokeWidth="5" />
    </svg>
  ),
  za: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Afrique du Sud">
      <rect width="450" height="150" fill="#E03C31" />
      <rect y="150" width="450" height="150" fill="#001489" />
      <path d="M 0,0 L 180,150 L 0,300 Z" fill="#000000" />
      <path d="M 0,0 L 220,150 L 0,300 L 0,250 L 150,150 L 0,50 Z" fill="#FFB612" />
      <path d="M 0,50 L 150,150 L 450,150 L 450,110 L 200,110 L 70,0 L 0,0 Z" fill="#FFFFFF" />
      <path d="M 0,250 L 150,150 L 450,150 L 450,190 L 200,190 L 70,300 L 0,300 Z" fill="#FFFFFF" />
      <path d="M 0,30 L 160,150 L 450,150 L 450,130 L 180,130 L 50,0 L 0,0 Z" fill="#007749" />
      <path d="M 0,270 L 160,150 L 450,150 L 450,170 L 180,170 L 50,300 L 0,300 Z" fill="#007749" />
    </svg>
  ),
  cd: (w, h) => (
    <svg viewBox="0 0 400 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="RDC Congo">
      <rect width="400" height="300" fill="#007FFF" />
      <polygon points="0,260 0,300 40,300 400,40 400,0 360,0" fill="#FCD116" />
      <polygon points="0,275 0,300 25,300 400,25 400,0 375,0" fill="#CE1126" />
      <polygon points="60,35 66,54 85,54 69,66 76,84 60,72 44,84 51,66 35,54 54,54" fill="#FCD116" />
    </svg>
  ),
  dz: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Algérie">
      <rect width="225" height="300" fill="#006233" />
      <rect x="225" width="225" height="300" fill="#FFFFFF" />
      <circle cx="225" cy="150" r="60" fill="#D21034" />
      <circle cx="240" cy="150" r="48" fill="#FFFFFF" />
      <polygon points="245,135 249,147 261,147 251,155 255,167 245,159 235,167 239,155 229,147 241,147" fill="#D21034" />
    </svg>
  ),
  tn: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Tunisie">
      <rect width="450" height="300" fill="#E70013" />
      <circle cx="225" cy="150" r="65" fill="#FFFFFF" />
      <circle cx="225" cy="150" r="45" fill="#E70013" />
      <circle cx="236" cy="150" r="36" fill="#FFFFFF" />
      <polygon points="242,138 245,148 255,148 247,154 250,164 242,158 234,164 237,154 229,148 239,148" fill="#E70013" />
    </svg>
  ),
  eg: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Égypte">
      <rect y="0" width="450" height="100" fill="#CE1126" />
      <rect y="100" width="450" height="100" fill="#FFFFFF" />
      <rect y="200" width="450" height="100" fill="#000000" />
      <ellipse cx="225" cy="150" rx="20" ry="16" fill="#C09300" />
    </svg>
  ),
  gn: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Guinée">
      <rect width="150" height="300" fill="#CE1126" />
      <rect x="150" width="150" height="300" fill="#FCD116" />
      <rect x="300" width="150" height="300" fill="#009A44" />
    </svg>
  ),
  mg: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="Madagascar">
      <rect width="150" height="300" fill="#FFFFFF" />
      <rect x="150" y="0" width="300" height="150" fill="#FC3D32" />
      <rect x="150" y="150" width="300" height="150" fill="#007E3A" />
    </svg>
  ),
  /* ── Drapeaux non-africains pour le sélecteur de langue ── */
  fr: (w, h) => (
    <svg viewBox="0 0 450 300" width={w} height={h} className="country-flag-svg" role="img" aria-label="France">
      <rect width="150" height="300" fill="#002395" />
      <rect x="150" width="150" height="300" fill="#FFFFFF" />
      <rect x="300" width="150" height="300" fill="#ED2939" />
    </svg>
  ),
  gb: (w, h) => (
    <svg viewBox="0 0 60 30" width={w} height={h} className="country-flag-svg" role="img" aria-label="United Kingdom">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
};

export function CountryFlag({ 
  country, 
  code: directCode, 
  size = 'md', 
  className = '', 
  showName = false,
  title
}) {
  const [useFallback, setUseFallback] = useState(false);
  const code = (directCode || getCountryCode(country) || 'un').toLowerCase();
  const dimensions = SIZES[size] || SIZES.md;
  const flagTitle = title || country || code.toUpperCase();

  // If Pan-African / World flag or code 'un'
  const isPanAfrican = code === 'un';

  // Check if we have an ultra-crisp vector SVG representation
  const SvgRenderer = SVG_FLAGS[code];

  return (
    <span className={`country-flag-badge size-${size} ${className}`} title={flagTitle}>
      {isPanAfrican ? (
        <span className="panafrican-globe-icon" aria-label="Afrique Panafricain">
          🌍
        </span>
      ) : SvgRenderer ? (
        SvgRenderer(dimensions.width, dimensions.height)
      ) : useFallback ? (
        <span className="country-flag-fallback">
          {code.toUpperCase()}
        </span>
      ) : (
        <img
          src={getFlagUrl(code, 40)}
          srcSet={`${getFlagUrl(code, 80)} 2x`}
          alt={`Drapeau ${country || code}`}
          width={dimensions.width}
          height={dimensions.height}
          className="country-flag-img"
          loading="lazy"
          onError={() => setUseFallback(true)}
        />
      )}
      {showName && country && (
        <span className="country-flag-name">{country}</span>
      )}
    </span>
  );
}
