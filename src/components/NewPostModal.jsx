import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Code2, 
  Send, 
  Terminal, 
  Sparkles, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Trash2,
  Paperclip
} from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { useTranslation } from '../i18n/LanguageContext';

export function NewPostModal({ isOpen, onClose, onAddPost, currentUser }) {
  const { t, language } = useTranslation();
  const [content, setContent] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [tagsInput, setTagsInput] = useState('Django, React, AfricaTech');
  
  // Media upload state (image or video)
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' | 'video'
  const [mediaName, setMediaName] = useState('');

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 50MB for video, 10MB for image)
    const maxMb = type === 'video' ? 50 : 10;
    if (file.size > maxMb * 1024 * 1024) {
      alert(`Le fichier est trop volumineux. Taille maximale : ${maxMb} Mo.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaUrl(event.target.result);
      setMediaType(type);
      setMediaFile(file);
      setMediaName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaUrl(null);
    setMediaType(null);
    setMediaName('');
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        name: currentUser.name,
        country: currentUser.country,
        flag: currentUser.flag,
        avatar: currentUser.avatar,
        handle: `@${currentUser.name.toLowerCase().replace(/\s+/g, '')}`
      },
      time: language === 'en' ? "Just now" : "À l'instant",
      content,
      codeSnippet: showCodeInput && codeSnippet.trim() ? codeSnippet.trim() : null,
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || null,
      likes: 1,
      likedByUser: true,
      commentsCount: 0,
      shares: 0,
      tags: parsedTags.length > 0 ? parsedTags : ["AfricaTech"],
      comments: []
    };

    onAddPost(newPost);
    
    // Reset form
    setContent('');
    setCodeSnippet('');
    setShowCodeInput(false);
    handleRemoveMedia();
    onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content new-post-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Sparkles size={18} className="text-cyan" />
            <h2 className="modal-title">{t('modals.newPost.title', language === 'en' ? 'Create a post' : 'Créer une publication')}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-form">
          {/* Author preview with real CountryFlag */}
          <div className="modal-author-preview">
            <div className="modal-avatar-wrap">
              <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar-sm" />
              <span className="avatar-online-dot online" title={t('developers.onlineStatus')} />
            </div>
            <div className="modal-author-info">
              <div className="modal-author-name-row">
                <span className="font-semibold text-[var(--text-main)]">{currentUser.name}</span>
                <span className="modal-author-flag">
                  <CountryFlag country={currentUser.country || currentUser.flag} size="xs" />
                </span>
                <span className="modal-country-name">{currentUser.country}</span>
              </div>
              <span className="text-dim text-xs block">{t('modals.newPost.publicNotice', language === 'en' ? 'Public post • AfrikDev Community' : 'Publication publique • Communauté AfrikDev')}</span>
            </div>
          </div>

          {/* Text content area */}
          <textarea
            placeholder={t('modals.newPost.placeholder')}
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            className="modal-textarea"
            required={!mediaUrl}
          />

          {/* Media preview (Image or Video) */}
          {mediaUrl && (
            <div className="modal-media-preview-box">
              <div className="media-preview-header">
                <span className="media-preview-badge">
                  {mediaType === 'video' ? t('modals.newPost.attachedVideo') : t('modals.newPost.attachedImage')}
                </span>
                <span className="media-preview-name">{mediaName}</span>
                <button 
                  type="button" 
                  className="media-remove-btn"
                  onClick={handleRemoveMedia}
                  title={t('modals.newPost.removeMedia')}
                >
                  <Trash2 size={14} />
                  <span>{t('modals.newPost.removeMedia')}</span>
                </button>
              </div>

              {mediaType === 'image' && (
                <div className="media-preview-display">
                  <img src={mediaUrl} alt="Aperçu upload" className="uploaded-media-img" />
                </div>
              )}

              {mediaType === 'video' && (
                <div className="media-preview-display">
                  <video src={mediaUrl} controls className="uploaded-media-video" />
                </div>
              )}
            </div>
          )}

          {/* Code snippet block if toggled */}
          {showCodeInput ? (
            <div className="code-input-wrapper">
              <div className="code-input-header">
                <span className="code-label">
                  <Terminal size={14} className="text-cyan" />
                  <span>{t('modals.newPost.codeSnippetTitle')}</span>
                </span>
                <button 
                  type="button" 
                  className="text-xs text-dim hover:text-white"
                  onClick={() => setShowCodeInput(false)}
                >
                  {t('modals.newPost.hideCode')}
                </button>
              </div>
              <textarea
                placeholder={t('modals.newPost.codePlaceholder')}
                value={codeSnippet}
                onChange={e => setCodeSnippet(e.target.value)}
                rows={4}
                className="code-textarea font-mono"
              />
            </div>
          ) : null}

          {/* Media & code toolbar */}
          <div className="post-attachments-toolbar">
            <span className="toolbar-label">{t('modals.newPost.addMediaLabel')}</span>
            
            <div className="toolbar-buttons-group">
              {/* Image upload button */}
              <input 
                type="file" 
                ref={imageInputRef} 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={e => handleFileUpload(e, 'image')}
              />
              <button 
                type="button" 
                className={`attachment-btn ${mediaType === 'image' ? 'active' : ''}`}
                onClick={() => imageInputRef.current?.click()}
                title="PNG, JPG, WebP, GIF"
              >
                <ImageIcon size={16} className="text-emerald" />
                <span>{t('modals.newPost.imageBtn')}</span>
              </button>

              {/* Video upload button */}
              <input 
                type="file" 
                ref={videoInputRef} 
                accept="video/*" 
                style={{ display: 'none' }}
                onChange={e => handleFileUpload(e, 'video')}
              />
              <button 
                type="button" 
                className={`attachment-btn ${mediaType === 'video' ? 'active' : ''}`}
                onClick={() => videoInputRef.current?.click()}
                title="MP4, WebM"
              >
                <VideoIcon size={16} className="text-cyan" />
                <span>{t('modals.newPost.videoBtn')}</span>
              </button>

              {/* Code snippet button */}
              <button 
                type="button" 
                className={`attachment-btn ${showCodeInput ? 'active' : ''}`}
                onClick={() => setShowCodeInput(!showCodeInput)}
                title="Code"
              >
                <Code2 size={16} className="text-amber" />
                <span>{t('modals.newPost.codeBtn')}</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">{t('modals.newPost.tagsLabel')}</label>
            <input 
              type="text" 
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="Django, PostgreSQL, Mobile, FinTech"
            />
          </div>

          <div className="modal-actions-bar">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t('modals.newPost.cancel', language === 'en' ? 'Cancel' : 'Annuler')}
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: '#FFFFFF'
              }}
            >
              <Send size={16} />
              <span>{t('modals.newPost.submit', language === 'en' ? 'Publish on AFRIKDEV' : 'Publier sur AFRIKDEV')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

