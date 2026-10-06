// 54 Sovereign African Countries with ISO 3166-1 alpha-2 codes
export const AFRICAN_COUNTRIES = [
  { code: 'za', name: 'Afrique du Sud', dial: '+27' },
  { code: 'dz', name: 'Algérie', dial: '+213' },
  { code: 'ao', name: 'Angola', dial: '+244' },
  { code: 'bj', name: 'Bénin', dial: '+229' },
  { code: 'bw', name: 'Botswana', dial: '+267' },
  { code: 'bf', name: 'Burkina Faso', dial: '+226' },
  { code: 'bi', name: 'Burundi', dial: '+257' },
  { code: 'cm', name: 'Cameroun', dial: '+237' },
  { code: 'cv', name: 'Cap-Vert', dial: '+238' },
  { code: 'cf', name: 'Centrafrique', dial: '+236' },
  { code: 'km', name: 'Comores', dial: '+269' },
  { code: 'cg', name: 'Congo-Brazzaville', dial: '+242' },
  { code: 'cd', name: 'Congo-Kinshasa (RDC)', dial: '+243' },
  { code: 'ci', name: "Côte d'Ivoire", dial: '+225' },
  { code: 'dj', name: 'Djibouti', dial: '+253' },
  { code: 'eg', name: 'Égypte', dial: '+20' },
  { code: 'er', name: 'Érythrée', dial: '+291' },
  { code: 'sz', name: 'Eswatini', dial: '+268' },
  { code: 'et', name: 'Éthiopie', dial: '+251' },
  { code: 'ga', name: 'Gabon', dial: '+241' },
  { code: 'gm', name: 'Gambie', dial: '+220' },
  { code: 'gh', name: 'Ghana', dial: '+233' },
  { code: 'gn', name: 'Guinée', dial: '+224' },
  { code: 'gw', name: 'Guinée-Bissau', dial: '+245' },
  { code: 'gq', name: 'Guinée équatoriale', dial: '+240' },
  { code: 'ke', name: 'Kenya', dial: '+254' },
  { code: 'ls', name: 'Lesotho', dial: '+266' },
  { code: 'lr', name: 'Libéria', dial: '+231' },
  { code: 'ly', name: 'Libye', dial: '+218' },
  { code: 'mg', name: 'Madagascar', dial: '+261' },
  { code: 'mw', name: 'Malawi', dial: '+265' },
  { code: 'ml', name: 'Mali', dial: '+223' },
  { code: 'ma', name: 'Maroc', dial: '+212' },
  { code: 'mu', name: 'Maurice', dial: '+230' },
  { code: 'mr', name: 'Mauritanie', dial: '+222' },
  { code: 'mz', name: 'Mozambique', dial: '+258' },
  { code: 'na', name: 'Namibie', dial: '+264' },
  { code: 'ne', name: 'Niger', dial: '+227' },
  { code: 'ng', name: 'Nigeria', dial: '+234' },
  { code: 'ug', name: 'Ouganda', dial: '+256' },
  { code: 'rw', name: 'Rwanda', dial: '+250' },
  { code: 'st', name: 'Sao Tomé-et-Principe', dial: '+239' },
  { code: 'sn', name: 'Sénégal', dial: '+221' },
  { code: 'sc', name: 'Seychelles', dial: '+248' },
  { code: 'sl', name: 'Sierra Leone', dial: '+232' },
  { code: 'so', name: 'Somalie', dial: '+252' },
  { code: 'sd', name: 'Soudan', dial: '+249' },
  { code: 'ss', name: 'Soudan du Sud', dial: '+211' },
  { code: 'tz', name: 'Tanzanie', dial: '+255' },
  { code: 'td', name: 'Tchad', dial: '+235' },
  { code: 'tg', name: 'Togo', dial: '+228' },
  { code: 'tn', name: 'Tunisie', dial: '+216' },
  { code: 'zm', name: 'Zambie', dial: '+260' },
  { code: 'zw', name: 'Zimbabwe', dial: '+263' }
];

// Normalize helper (handles accents and lowercase)
const normalize = (str) => 
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

// Map from country names / emojis to ISO-2 codes
const NAME_TO_CODE = {};
AFRICAN_COUNTRIES.forEach(c => {
  NAME_TO_CODE[normalize(c.name)] = c.code;
  NAME_TO_CODE[c.code] = c.code;
});

// Specific aliases
NAME_TO_CODE['cote d\'ivoire'] = 'ci';
NAME_TO_CODE['cote d ivoire'] = 'ci';
NAME_TO_CODE['ivory coast'] = 'ci';
NAME_TO_CODE['rdc'] = 'cd';
NAME_TO_CODE['congo rdc'] = 'cd';
NAME_TO_CODE['drc'] = 'cd';
NAME_TO_CODE['congo'] = 'cg';
NAME_TO_CODE['senegal'] = 'sn';
NAME_TO_CODE['algerie'] = 'dz';
NAME_TO_CODE['benin'] = 'bj';
NAME_TO_CODE['egypte'] = 'eg';
NAME_TO_CODE['erythree'] = 'er';
NAME_TO_CODE['ethiopie'] = 'et';
NAME_TO_CODE['guinee'] = 'gn';
NAME_TO_CODE['guinee equatoriale'] = 'gq';
NAME_TO_CODE['liberia'] = 'lr';
NAME_TO_CODE['libye'] = 'ly';
NAME_TO_CODE['sao tome'] = 'st';
NAME_TO_CODE['panafricain'] = 'un';
NAME_TO_CODE['afrique'] = 'un';
NAME_TO_CODE['africa'] = 'un';

// Emoji to code map
const EMOJI_TO_CODE = {
  '🇨🇮': 'ci',
  '🇸🇳': 'sn',
  '🇳🇬': 'ng',
  '🇲🇦': 'ma',
  '🇷🇼': 'rw',
  '🇰🇪': 'ke',
  '🇲🇱': 'ml',
  '🇨🇲': 'cm',
  '🇧🇯': 'bj',
  '🇧🇫': 'bf',
  '🇹🇬': 'tg',
  '🇬🇭': 'gh',
  '🇩🇿': 'dz',
  '🇹🇳': 'tn',
  '🇪🇬': 'eg',
  '🇿🇦': 'za',
  '🇨🇩': 'cd',
  '🇨🇬': 'cg',
  '🇬🇳': 'gn',
  '🇲🇬': 'mg',
  '🇪🇹': 'et',
  '🇹🇿': 'tz',
  '🇺🇬': 'ug',
  '🌍': 'un'
};

/**
 * Resolves a country name, code or emoji to ISO-2 country code
 */
export function getCountryCode(input) {
  if (!input) return 'un';
  const trimmed = input.trim();
  if (EMOJI_TO_CODE[trimmed]) {
    return EMOJI_TO_CODE[trimmed];
  }
  const norm = normalize(trimmed);
  if (NAME_TO_CODE[norm]) {
    return NAME_TO_CODE[norm];
  }
  // If it's already a 2-letter code
  if (norm.length === 2) {
    return norm;
  }
  return 'un';
}

/**
 * Returns FlagCDN PNG URL for high performance crisp image flags
 */
export function getFlagUrl(countryOrCode, width = 40) {
  const code = getCountryCode(countryOrCode);
  if (code === 'un') {
    return 'https://flagcdn.com/w40/un.png';
  }
  return `https://flagcdn.com/w${width}/${code}.png`;
}
