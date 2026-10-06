/**
 * AFRIKDEV Translation Service
 * Traduction automatique et dynamique bidirectionnelle (Français <-> Anglais)
 * Détection automatique de la langue source, Google Translate GTX API + MyMemory fallback,
 * et cache persistant en localStorage.
 */

const CACHE_STORAGE_KEY = 'afrikdev_translation_cache_v2';

// Cache en mémoire pour un accès ultra-rapide sans latence
const memoryCache = new Map();

// Charger le cache depuis localStorage au démarrage
try {
  const stored = localStorage.getItem(CACHE_STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    Object.entries(parsed).forEach(([k, v]) => memoryCache.set(k, v));
  }
} catch (e) {
  // Ignorer les erreurs d'accès à localStorage (ex: mode incognito strict)
}

function persistCache() {
  try {
    // Garder les 500 dernières traductions pour limiter l'utilisation du stockage
    const entries = Array.from(memoryCache.entries()).slice(-500);
    const obj = Object.fromEntries(entries);
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {}
}

/**
 * Détecte si un texte est principalement en français ou en anglais
 * @param {string} text 
 * @returns {'fr' | 'en'}
 */
export function detectLanguage(text, defaultLang = 'fr') {
  if (!text || typeof text !== 'string') return defaultLang;
  const clean = text.trim().toLowerCase();
  if (!clean) return defaultLang;

  // 1. Accents spécifiques au français (très forts indicateurs de français)
  const frenchAccentsMatches = clean.match(/[éèêëàâäôöûüùîïçœæ]/gi);
  let frScore = frenchAccentsMatches ? frenchAccentsMatches.length * 3 : 0;
  let enScore = 0;

  // 2. Mots fréquents en français (avec et sans accents)
  const frenchWords = new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'en', 'est',
    'dans', 'pour', 'qui', 'que', 'avec', 'ce', 'cet', 'cette', 'ces', 'sur', 'au',
    'aux', 'par', 'nous', 'vous', 'ils', 'elles', 'notre', 'nos', 'votre', 'vos', 'leur', 'leurs',
    'je', 'tu', 'il', 'elle', 'on', 'me', 'te', 'se', 'lui', 'y', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses',
    'faire', 'fait', 'plus', 'tout', 'tous', 'toute', 'toutes', 'mais', 'sont', 'ont', 'pas', 'très', 'tres',
    'donc', 'car', 'comme', 'aussi', 'bien', 'ici', 'oui', 'non', 'suis', 'es', 'sommes', 'etes', 'êtes',
    'bonjour', 'bonsoir', 'salut', 'merci', 'svp', 'stp', 'bravo', 'super', 'projet', 'équipe', 'equipe',
    'défi', 'defi', 'candidature', 'poste', 'offre', 'cherche', 'recherche', 'travail', 'partager', 'plateforme',
    'maintenant', 'toujours', 'jamais', 'encore', 'déjà', 'deja', 'pourquoi', 'comment', 'quand', 'combien', 'si'
  ]);

  // 3. Mots fréquents en anglais
  const englishWords = new Set([
    'the', 'is', 'are', 'was', 'were', 'am', 'be', 'been', 'being', 'and', 'in', 'of', 'to', 'for', 'with',
    'that', 'this', 'these', 'those', 'from', 'have', 'has', 'had', 'having', 'not', 'no', 'yes', 'you', 'your', 'yours',
    'we', 'us', 'our', 'ours', 'they', 'them', 'their', 'theirs', 'he', 'him', 'his', 'she', 'her', 'hers', 'it', 'its', 'my',
    'will', 'would', 'can', 'could', 'should', 'about', 'which', 'who', 'what', 'why', 'how', 'when', 'where', 'there',
    'great', 'opportunity', 'looking', 'project', 'team', 'remote', 'developer', 'frontend', 'backend', 'full', 'time',
    'hello', 'hi', 'hey', 'thanks', 'good', 'well', 'also', 'like', 'here', 'need', 'want', 'help', 'please', 'just',
    'lead', 'engineer', 'awesome', 'shipped', 'new', 'version', 'work', 'working', 'build', 'built', 'shared', 'post'
  ]);

  const tokens = clean.replace(/['’.,!?:;()"/\\-]/g, ' ').split(/\s+/).filter(Boolean);

  for (const token of tokens) {
    if (frenchWords.has(token)) frScore += 2;
    if (englishWords.has(token)) enScore += 2;
  }

  if (frScore > enScore) return 'fr';
  if (enScore > frScore) return 'en';
  return defaultLang;
}

/**
 * Fournit les métadonnées et libellés d'action pour le bouton de traduction selon la langue du texte et de l'UI
 * Comme Facebook et Instagram : si le texte est déjà dans la langue comprise par l'utilisateur,
 * aucune traduction n'est nécessaire (canTranslate = false).
 * 
 * @param {string} text - Contenu du texte
 * @param {string} currentUiLang - Langue actuelle de l'interface ('fr' ou 'en')
 */
export function getTranslationAction(text, currentUiLang = 'fr') {
  if (!text || typeof text !== 'string') {
    return {
      canTranslate: false,
      needsTranslation: false,
      detectedLang: currentUiLang,
      targetLang: currentUiLang === 'fr' ? 'en' : 'fr',
      sourceLang: currentUiLang,
      buttonLabel: '',
      shortLabel: '',
      showOriginalLabel: currentUiLang === 'en' ? 'See original' : "Voir l'original",
      translatingLabel: currentUiLang === 'en' ? 'Translating...' : 'Traduction...'
    };
  }

  const detectedLang = detectLanguage(text, currentUiLang);

  // Comme Facebook / Instagram : on ne propose la traduction que si le texte est dans une langue différente
  const canTranslate = detectedLang !== currentUiLang;
  const targetLang = currentUiLang;
  const sourceLang = detectedLang;

  let buttonLabel = '';
  let shortLabel = '';

  if (currentUiLang === 'en') {
    buttonLabel = '🌐 See translation';
    shortLabel = 'EN';
  } else {
    buttonLabel = '🌐 Voir la traduction';
    shortLabel = 'FR';
  }

  return {
    canTranslate,
    needsTranslation: canTranslate,
    detectedLang,
    targetLang,
    sourceLang,
    buttonLabel,
    shortLabel,
    showOriginalLabel: currentUiLang === 'en' ? 'See original' : "Voir l'original",
    translatingLabel: currentUiLang === 'en' ? 'Translating...' : 'Traduction...'
  };
}

/**
 * Traduit un texte de façon bidirectionnelle (fr -> en ou en -> fr)
 * @param {string} text - Texte à traduire
 * @param {string} targetLang - Langue cible ('en' ou 'fr')
 * @param {string} sourceLang - Langue source ('fr', 'en' ou 'auto')
 * @returns {Promise<string>}
 */
export async function translateText(text, targetLang = 'en', sourceLang = 'auto') {
  if (!text || typeof text !== 'string') return text || '';
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Si sourceLang non fournie ou 'auto', on la détecte
  const detected = (!sourceLang || sourceLang === 'auto') ? detectLanguage(trimmed) : sourceLang;
  const actualTarget = targetLang || (detected === 'fr' ? 'en' : 'fr');

  // Si même langue, pas de traduction nécessaire
  if (detected === actualTarget) {
    return text;
  }

  const cacheKey = `${detected}_${actualTarget}_${trimmed}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  // 1. Google Translate GTX API (ultra-rapide, sans clé requise)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${detected}&tl=${actualTarget}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map(segment => segment[0]).join('');
        if (translated && translated.trim()) {
          memoryCache.set(cacheKey, translated);
          persistCache();
          return translated;
        }
      }
    }
  } catch (err) {
    // Échec silencieux, tenter les modèles alternatifs
  }

  // 2. Modèle Meta NLLB-200 (No Language Left Behind - français <-> anglais)
  try {
    const nllbSrc = detected === 'fr' ? 'fra_Latn' : 'eng_Latn';
    const nllbTgt = actualTarget === 'fr' ? 'fra_Latn' : 'eng_Latn';
    const nllbRes = await fetch('https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: trimmed,
        parameters: { src_lang: nllbSrc, tgt_lang: nllbTgt }
      })
    });
    if (nllbRes.ok) {
      const nllbData = await nllbRes.json();
      const nllbText = Array.isArray(nllbData) ? nllbData[0]?.translation_text : nllbData?.translation_text;
      if (nllbText && nllbText.trim()) {
        memoryCache.set(cacheKey, nllbText);
        persistCache();
        return nllbText;
      }
    }
  } catch (nllbErr) {
    // Poursuivre vers MyMemory
  }

  // 3. Fallback MyMemory API
  try {
    const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${detected}|${actualTarget}`;
    const fallbackRes = await fetch(fallbackUrl);
    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      if (fallbackData?.responseData?.translatedText) {
        const translated = fallbackData.responseData.translatedText;
        memoryCache.set(cacheKey, translated);
        persistCache();
        return translated;
      }
    }
  } catch (fallbackErr) {}

  return text;
}

/**
 * Traduction de plusieurs textes en parallèle
 */
export async function translateBatch(texts = [], targetLang = 'en', sourceLang = 'auto') {
  if (!Array.isArray(texts) || texts.length === 0) return [];
  return Promise.all(texts.map(t => translateText(t, targetLang, sourceLang)));
}
