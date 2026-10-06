import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, FolderGit2, Plus, Sparkles, Layers, Building2, User } from 'lucide-react';
import { AFRICAN_COUNTRIES } from '../data/africanCountries';
import { useTranslation } from '../i18n/LanguageContext';

export function NewProjectModal({ 
  isOpen, 
  onClose, 
  onAddProject, 
  currentUser, 
  currentCompany, 
  isRecruiterLoggedIn 
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('FinTech');
  const [country, setCountry] = useState("Côte d'Ivoire");
  const [flag, setFlag] = useState("🇨🇮");
  const [techs, setTechs] = useState('React, Django, PostgreSQL, Docker');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [status, setStatus] = useState('🚀 En production');
  const [description, setDescription] = useState('');
  const [openRoles, setOpenRoles] = useState('Développeur Flutter, UI/UX Designer');

  if (!isOpen) return null;

  const publisherName = isRecruiterLoggedIn
    ? (currentCompany?.name || t('modals.newProject.recruiterPublisher'))
    : (currentUser?.name || t('modals.newProject.devPublisher'));

  const publisherAvatar = isRecruiterLoggedIn
    ? (currentCompany?.logo || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=250&q=80')
    : (currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');

  const publisherEmail = isRecruiterLoggedIn
    ? (currentCompany?.email || 'contact@afrikdev.ci')
    : (currentUser?.email || '');

  const handleCountryChange = (c) => {
    setCountry(c);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) return;

    const parsedTechs = techs.split(',').map(t => t.trim()).filter(Boolean);
    const parsedRoles = openRoles.split(',').map(r => r.trim()).filter(Boolean);

    const newProject = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      tagline: tagline.trim(),
      category,
      country,
      flag,
      status,
      company: isRecruiterLoggedIn ? publisherName : '',
      companyEmail: publisherEmail,
      author: {
        name: publisherName,
        avatar: publisherAvatar,
        isCompany: !!isRecruiterLoggedIn
      },
      technologies: parsedTechs.length ? parsedTechs : ["React", "Python"],
      stars: 1,
      upvotes: 1,
      githubUrl: githubUrl.trim() || "https://github.com",
      demoUrl: demoUrl.trim() || "",
      openRoles: parsedRoles,
      description: description.trim() || tagline.trim()
    };

    onAddProject(newProject);
    onClose();
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Layers size={18} className="text-cyan" />
            <h2 className="modal-title">{t('modals.newProject.title')}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Current Publisher Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 14px',
          margin: '12px 20px 0',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: 8,
          fontSize: '0.82rem'
        }}>
          {isRecruiterLoggedIn ? (
            <Building2 size={16} className="text-cyan" />
          ) : (
            <User size={16} className="text-cyan" />
          )}
          <span>
            {publisherName}
            {isRecruiterLoggedIn ? ` (${t('modals.newProject.recruiterPublisher')})` : ` (${t('modals.newProject.devPublisher')})`}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-form">
          <div className="form-group">
            <label className="form-label">{t('modals.newProject.titleLabel')}</label>
            <input
              type="text"
              placeholder={t('modals.newProject.titlePlaceholder')}
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('modals.newProject.taglineLabel')}</label>
            <input
              type="text"
              placeholder={t('modals.newProject.taglinePlaceholder')}
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('modals.newProject.descLabel')}</label>
            <input
              type="text"
              placeholder={t('modals.newProject.descPlaceholder')}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">{t('modals.newProject.categoryLabel')}</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="FinTech">FinTech</option>
                <option value="Mobility">Mobilité / Transport</option>
                <option value="AgriTech / IA">AgriTech & IA</option>
                <option value="HealthTech">Santé</option>
                <option value="EdTech">Éducation & Formation</option>
                <option value="GovTech">GovTech / Citoyen</option>
                <option value="Open Source">Outil Open Source</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t('modals.newProject.countryLabel')}</label>
              <select value={country} onChange={e => handleCountryChange(e.target.value)}>
                {AFRICAN_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">{t('modals.newProject.statusLabel')}</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="🚀 En production">🚀 En production</option>
                <option value="🔨 En développement">🔨 En développement</option>
                <option value="💡 Idée">💡 Idée</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t('modals.newProject.techsLabel')}</label>
              <input
                type="text"
                value={techs}
                onChange={e => setTechs(e.target.value)}
                placeholder="React, Django, PostgreSQL, Docker"
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">{t('modals.newProject.githubLabel')}</label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/mon-orga/mon-projet"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('modals.newProject.demoLabel')}</label>
              <input
                type="url"
                value={demoUrl}
                onChange={e => setDemoUrl(e.target.value)}
                placeholder="https://mon-projet.africa"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('modals.newProject.rolesLabel')}</label>
            <input
              type="text"
              value={openRoles}
              onChange={e => setOpenRoles(e.target.value)}
              placeholder={t('modals.newProject.rolesPlaceholder')}
            />
          </div>

          <div className="modal-actions-bar">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t('modals.newProject.cancel')}
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />
              <span>{t('modals.newProject.submit')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
