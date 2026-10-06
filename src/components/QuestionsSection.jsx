import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  MessageSquare,
  Plus,
  Search,
  Tag,
  Sparkles,
  Award,
  Languages
} from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { useTranslation } from '../i18n/LanguageContext';
import { translateText, getTranslationAction } from '../services/translator';
import { SponsoredAdCard } from './SponsoredAdCard';
import { OFFICIAL_ADS } from '../data/officialAdsData';

export function QuestionsSection({ questions, setQuestions, onOpenAskQuestion }) {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [expandedQId, setExpandedQId] = useState(questions[0]?.id || null);

  // Traduction à la demande des questions & réponses
  const [translatedQIds, setTranslatedQIds] = useState(new Set());
  const [loadingQTranslations, setLoadingQTranslations] = useState(new Set());
  const [liveQTranslations, setLiveQTranslations] = useState({});

  // Réinitialiser les questions traduites au changement de langue UI
  useEffect(() => {
    setTranslatedQIds(new Set());
  }, [language]);

  const handleTranslateQuestion = async (q) => {
    const qId = q.id;
    if (translatedQIds.has(qId)) {
      setTranslatedQIds(prev => {
        const next = new Set(prev);
        next.delete(qId);
        return next;
      });
      return;
    }

    const fullText = `${q.excerpt || ''} ${q.bestAnswer?.text || ''}`;
    const action = getTranslationAction(fullText, language);
    if (!action.canTranslate) return;

    const cacheKey = `${action.targetLang}_${qId}`;
    if (liveQTranslations[cacheKey] || liveQTranslations[qId]) {
      setTranslatedQIds(prev => new Set(prev).add(qId));
      return;
    }

    setLoadingQTranslations(prev => new Set(prev).add(qId));
    try {
      const translatedExcerpt = await translateText(q.excerpt, action.targetLang, action.sourceLang);
      let translatedBestAnswer = null;
      if (q.bestAnswer?.text) {
        translatedBestAnswer = await translateText(q.bestAnswer.text, action.targetLang, action.sourceLang);
      }

      setLiveQTranslations(prev => ({
        ...prev,
        [cacheKey]: {
          excerpt: translatedExcerpt,
          bestAnswer: translatedBestAnswer
        },
        [qId]: {
          excerpt: translatedExcerpt,
          bestAnswer: translatedBestAnswer
        }
      }));
      setTranslatedQIds(prev => new Set(prev).add(qId));
    } catch (err) {
      console.warn("Échec traduction question:", err);
    } finally {
      setLoadingQTranslations(prev => {
        const next = new Set(prev);
        next.delete(qId);
        return next;
      });
    }
  };

  const handleVote = (qId, delta) => {
    const current = userVotes[qId] || 0;
    if (current === delta) {
      // Toggle off
      setUserVotes(prev => ({ ...prev, [qId]: 0 }));
      setQuestions(prev => prev.map(q => q.id === qId ? { ...q, votes: q.votes - delta } : q));
    } else {
      setUserVotes(prev => ({ ...prev, [qId]: delta }));
      setQuestions(prev => prev.map(q => q.id === qId ? { ...q, votes: q.votes - current + delta } : q));
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || q.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="questions-container">
      {/* Head */}
      <div className="section-head-bar">
        <div>
          <div className="badge-tag mb-2">
            <HelpCircle size={13} />
            <span>{language === 'en' ? 'Community Q&A' : 'Entraide Communautaire'}</span>
          </div>
          <h1 className="page-heading">{t('questions.title', 'Foire aux Questions Techniques')}</h1>
          <p className="page-subheading">
            {t('questions.subtitle', 'Le Stack Overflow panafricain : résolvez les défis liés aux connexions instables, passerelles de paiement locales, conformité et architectures modernes.')}
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAskQuestion}>
          <Plus size={18} />
          <span>{t('questions.askBtn', 'Poser une question')}</span>
        </button>
      </div>

      {/* Search and tags */}
      <div className="glass-card toolbar-box">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={t('questions.searchPlaceholder', 'Rechercher une question ou un sujet technique...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        {selectedTag && (
          <div className="active-tag-indicator">
            <span>{language === 'en' ? 'Filter' : 'Filtre'} : #{selectedTag}</span>
            <button onClick={() => setSelectedTag(null)}>×</button>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="questions-list">
        {filteredQuestions.map((q, idx) => {
          const voteVal = userVotes[q.id] || 0;
          const isExpanded = expandedQId === q.id;
          const isTranslated = translatedQIds.has(q.id);
          const currentTranslation = liveQTranslations[q.id];

          return (
            <React.Fragment key={q.id}>
              {idx === 2 && (
                <SponsoredAdCard ad={OFFICIAL_ADS[1]} layout="inline" />
              )}
              <div className="glass-card question-card">
                <div className="question-main-row">
                  {/* Vote box */}
                  <div className="vote-box">
                    <button
                      className={`vote-btn ${voteVal === 1 ? 'voted-up' : ''}`}
                      onClick={() => handleVote(q.id, 1)}
                      aria-label="Voter pour"
                    >
                      <ChevronUp size={22} />
                    </button>
                    <span className="vote-count">{q.votes}</span>
                    <button
                      className={`vote-btn ${voteVal === -1 ? 'voted-down' : ''}`}
                      onClick={() => handleVote(q.id, -1)}
                      aria-label="Voter contre"
                    >
                      <ChevronDown size={22} />
                    </button>
                  </div>

                  {/* Question Info */}
                  <div className="question-content-wrap">
                    <div className="question-title-row">
                      <h3
                        className="question-title"
                        onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                      >
                        {q.title}
                      </h3>
                      {q.resolved && (
                        <span className="badge-tag green">
                          <CheckCircle2 size={13} />
                          <span>{t('questions.acceptedAnswer', 'Résolue')}</span>
                        </span>
                      )}
                    </div>

                    <div className="question-excerpt-wrapper" style={{ margin: '6px 0 10px 0' }}>
                      <p className="question-excerpt" style={{ margin: 0, lineHeight: 1.5 }}>
                        {isTranslated ? (currentTranslation?.excerpt || q.excerpt) : q.excerpt}
                      </p>
                      
                      {(() => {
                        const fullText = `${q.excerpt || ''} ${q.bestAnswer?.text || ''}`;
                        const action = getTranslationAction(fullText, language);
                        if (!action.canTranslate && !isTranslated) return null;

                        return (
                          <button
                            type="button"
                            className="translate-btn"
                            onClick={() => handleTranslateQuestion(q)}
                            disabled={loadingQTranslations.has(q.id)}
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
                              {loadingQTranslations.has(q.id)
                                ? action.translatingLabel
                                : isTranslated
                                  ? action.showOriginalLabel
                                  : action.buttonLabel}
                            </span>
                          </button>
                        );
                      })()}
                    </div>

                    <div className="question-meta-row">
                      <div className="question-tags">
                        {q.tags.map(t => (
                          <button
                            key={t}
                            className="badge-tag"
                            onClick={() => setSelectedTag(t)}
                          >
                            #{t}
                          </button>
                        ))}
                      </div>

                      <div className="question-author-meta">
                        <span className="question-author-badge">
                          <span>{language === 'en' ? 'Asked by' : 'Demandé par'} <strong>{q.author}</strong></span>
                          <CountryFlag country={q.flag} size="xs" />
                        </span>
                        <span className="meta-separator">•</span>
                        <span>{q.time}</span>
                        <span className="meta-separator">•</span>
                        <span className="answers-counter">
                          <MessageSquare size={13} />
                          <span>{q.answersCount} {t('questions.answersCount', 'réponses')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Best Answer Box if expanded */}
                {isExpanded && q.bestAnswer && (
                  <div className="best-answer-box">
                    <div className="best-answer-header">
                      <div className="best-badge">
                        <Award size={16} className="text-amber" />
                        <span>{language === 'en' ? `Community validated answer (+${q.bestAnswer.votes} votes)` : `Solution validée par la communauté (+${q.bestAnswer.votes} votes)`}</span>
                      </div>
                      <span className="best-author">{language === 'en' ? 'By' : 'Par'} {q.bestAnswer.author}</span>
                    </div>
                    <p className="best-answer-text">
                      {isTranslated ? (currentTranslation?.bestAnswer || q.bestAnswer.text) : q.bestAnswer.text}
                    </p>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
