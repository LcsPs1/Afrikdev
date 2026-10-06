import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Building2,
  MapPin,
  Globe,
  FileText,
  X,
  Check,
  Camera,
  Upload,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { AFRICAN_COUNTRIES } from '../data/africanCountries';
import { useTranslation } from '../i18n/LanguageContext';

export function CompanyProfileModal({
  isOpen,
  onClose,
  company,
  onUpdateCompany
}) {
  const { t, language } = useTranslation();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [country, setCountry] = useState("Côte d'Ivoire");
  const [website, setWebsite] = useState('');
  const [logo, setLogo] = useState('');
  const [logoInput, setLogoInput] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setTagline(company.tagline || '');
      setHeadquarters(company.headquarters || '');
      setCountry(company.country || "Côte d'Ivoire");
      setWebsite(company.website || '');
      setLogo(company.logo || '');
      setDescription(company.description || '');
    }
  }, [company, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert(language === 'en' ? "Please select a logo smaller than 2 MB." : "Veuillez sélectionner un logo de moins de 2 Mo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogo(event.target.result);
        setLogoInput('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyLogoUrl = (e) => {
    if (e) e.preventDefault();
    if (logoInput.trim()) {
      setLogo(logoInput.trim());
      setLogoInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert(language === 'en' ? "Company name is required." : "Le nom de l'entreprise est obligatoire.");
      return;
    }

    setIsSaving(true);
    const updated = {
      ...company,
      name: name.trim(),
      tagline: tagline.trim(),
      headquarters: headquarters.trim(),
      country: country,
      website: website.trim(),
      logo: logo.trim(),
      description: description.trim()
    };

    // 1. Sauvegarde dans le state et storage
    if (onUpdateCompany) {
      await onUpdateCompany(updated);
    }

    // 2. Persistance backend API
    try {
      await fetch('/api/companies/current/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updated.name,
          tagline: updated.tagline,
          headquarters: updated.headquarters,
          country: updated.country,
          website: updated.website,
          logo: updated.logo,
          description: updated.description
        })
      });
    } catch (err) {
      console.warn("Échec persistance backend entreprise (mode démo local conservé):", err);
    }

    setIsSaving(false);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 900);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal-card" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        {/* Banner Header */}
        <div className="profile-modal-banner edit-banner">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-cyan" />
            <h3 className="modal-title" style={{ fontSize: '1.05rem', margin: 0 }}>
              {language === 'en' ? "Edit Company Profile" : "Modifier le profil de l'Entreprise"}
            </h3>
          </div>
          <button
            type="button"
            className="modal-close-btn banner-close"
            onClick={onClose}
            title={language === 'en' ? "Close" : "Fermer"}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-modal-body profile-edit-scrollable">
          {successToast && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.86rem',
              fontWeight: 600
            }}>
              <Check size={16} />
              <span>{language === 'en' ? "Company profile saved successfully!" : "Profil entreprise mis à jour avec succès !"}</span>
            </div>
          )}

          {/* Logo Section */}
          <div className="profile-section glass-card" style={{ padding: 14, marginBottom: 16 }}>
            <label className="form-label" style={{ marginBottom: 8, display: 'block', fontWeight: 600 }}>
              {language === 'en' ? "Company logo :" : "Logo de l'entreprise :"}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {logo ? (
                  <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Building2 size={30} className="text-cyan" />
                )}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="url"
                    className="form-input text-xs"
                    placeholder={language === 'en' ? "Direct logo URL (png, svg, jpg)..." : "URL directe du logo (png, svg, jpg)..."}
                    value={logoInput}
                    onChange={e => setLogoInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-primary text-xs"
                    onClick={handleApplyLogoUrl}
                    style={{ padding: '6px 12px' }}
                  >
                    OK
                  </button>
                  <label className="btn-secondary text-xs" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px' }}>
                    <Upload size={13} />
                    <span>{language === 'en' ? "File" : "Fichier"}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {logo && (
                  <button
                    type="button"
                    onClick={() => setLogo('')}
                    style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.74rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    {language === 'en' ? "Remove logo" : "Supprimer le logo"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">{language === 'en' ? "Company Name * :" : "Nom de l'entreprise * :"}</label>
            <input
              type="text"
              required
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={language === 'en' ? "e.g., Baobab Tech Labs, Wave, Paystack" : "ex: Baobab Tech Labs, Wave, Orange CI"}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">{language === 'en' ? "Tagline or Tech Mission :" : "Slogan ou mission tech :"}</label>
            <input
              type="text"
              className="form-input"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder={language === 'en' ? "e.g., Software engineering studio in Abidjan & Dakar" : "ex: Le studio d'ingénierie logicielle d'Abidjan & Dakar"}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div className="form-group">
              <label className="form-label">{language === 'en' ? "Country :" : "Pays :"}</label>
              <select
                className="form-input"
                value={country}
                onChange={e => setCountry(e.target.value)}
              >
                {AFRICAN_COUNTRIES.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{language === 'en' ? "Headquarters / City :" : "Siège social / Ville :"}</label>
              <input
                type="text"
                className="form-input"
                value={headquarters}
                onChange={e => setHeadquarters(e.target.value)}
                placeholder={language === 'en' ? "e.g., Abidjan, Plateau" : "ex: Abidjan, Plateau"}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">{language === 'en' ? "Official Website :" : "Site web officiel :"}</label>
            <div className="input-with-icon-wrapper">
              <Globe size={15} className="input-leading-icon" />
              <input
                type="url"
                className="form-input has-leading-icon"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://votre-entreprise.africa"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">{language === 'en' ? "Description & Engineering Culture :" : "Description & Culture d'ingénierie :"}</label>
            <textarea
              className="form-input"
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={language === 'en' ? "Present your projects, technology stacks, and what you offer to developers..." : "Présentez vos projets, stacks technologiques et ce que vous offrez aux développeurs..."}
            />
          </div>

          <div className="profile-edit-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>
              {language === 'en' ? "Cancel" : "Annuler"}
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              <Check size={16} />
              <span>{isSaving ? (language === 'en' ? "Saving..." : "Enregistrement...") : (language === 'en' ? "Save Changes" : "Enregistrer les modifications")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
