import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, HelpCircle, Send, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export function AskQuestionModal({ isOpen, onClose, onAddQuestion, currentUser }) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [tags, setTags] = useState('PostgreSQL, Django, Performance');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) return;

    const parsedTags = tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);

    const newQuestion = {
      id: `q-${Date.now()}`,
      title: title.trim(),
      author: currentUser.name,
      country: currentUser.country,
      flag: currentUser.flag,
      time: "À l'instant",
      votes: 1,
      answersCount: 0,
      resolved: false,
      tags: parsedTags.length ? parsedTags : ["Général"],
      excerpt: details.trim(),
      bestAnswer: null
    };

    onAddQuestion(newQuestion);
    setTitle('');
    setDetails('');
    onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <HelpCircle size={18} className="text-cyan" />
            <h2 className="modal-title">{t('modals.askQuestion.title')}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-form">
          <div className="form-group">
            <label className="form-label">{t('modals.askQuestion.titleLabel')}</label>
            <input 
              type="text"
              placeholder={t('modals.askQuestion.titlePlaceholder')}
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('modals.askQuestion.detailsLabel')}</label>
            <textarea 
              rows={5}
              placeholder={t('modals.askQuestion.detailsPlaceholder')}
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="modal-textarea"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('modals.askQuestion.tagsLabel')}</label>
            <input 
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder={t('modals.askQuestion.tagsPlaceholder')}
            />
          </div>

          <div className="modal-actions-bar">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t('modals.askQuestion.cancel')}
            </button>
            <button type="submit" className="btn-primary">
              <Send size={16} />
              <span>{t('modals.askQuestion.submit')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
