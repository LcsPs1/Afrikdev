import React from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, FileText, CheckCircle2, Lock, Scale, AlertCircle } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export function TermsModal({ isOpen, onClose }) {
  const { language } = useTranslation();
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg legal-modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Scale size={20} className="text-cyan" />
            <h2 className="modal-title">
              {language === 'en' ? 'Terms of Service (ToS)' : "Conditions Générales d'Utilisation (CGU)"}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <div className="legal-modal-body">
          {language === 'en' ? (
            <div className="legal-content">
              <div className="legal-badge-date">Last updated: October 2026 • Platform Version 2.4</div>
              
              <h3>1. Purpose and Scope</h3>
              <p>
                AfrikDev is the premier pan-African digital network connecting software engineers, founders, and tech recruiters across Africa and the diaspora. By registering or browsing AfrikDev, you accept these Terms of Service without reservation.
              </p>

              <h3>2. Code of Conduct and Moderation</h3>
              <p>
                Every member agrees to foster respectful, inclusive, and professional interactions. Spam, fraudulent job advertisements, harassment, hate speech, and intellectual property infringement are strictly prohibited. The platform moderators and administrators reserve the right to suspend any account and remove any content violating these guidelines.
              </p>

              <h3>3. Intellectual Property and Open Source</h3>
              <p>
                Developers retain full ownership of code repositories, articles, and architectures they publish. By sharing content publicly on AfrikDev, you grant the platform a non-exclusive license to showcase and distribute your projects within the community.
              </p>

              <h3>4. Community Creation and Governance</h3>
              <p>
                Members founding local or thematic hubs act as community moderators. They possess the administrative rights to approve, decline, or remove members in good faith to preserve community health.
              </p>

              <h3>5. Security and Two-Factor Authentication</h3>
              <p>
                You are responsible for safeguarding your login credentials. AfrikDev provides two-factor verification (2FA) and email validation to prevent unauthorized account access.
              </p>
            </div>
          ) : (
            <div className="legal-content">
              <div className="legal-badge-date">Dernière mise à jour : Octobre 2026 • Plateforme Panafricaine v2.4</div>
              
              <h3>1. Objet et Présentation de la Plateforme</h3>
              <p>
                AfrikDev est la première plateforme professionnelle et communautaire dédiée à la valorisation, au maillage et au recrutement des talents technologiques en Afrique et dans la diaspora. L'accès aux services implique l'adhésion pleine et entière aux présentes CGU.
              </p>

              <h3>2. Charte Éthique & Pouvoir de Modération</h3>
              <p>
                La communauté repose sur l'entraide, l'excellence technique et le respect mutuel. Sont formellement proscrits : le spam, la diffusion d'offres d'emploi frauduleuses, le plagiat de code, les propos haineux ou diffamatoires. L'équipe d'administration dispose d'un pouvoir discrétionnaire de modération pour avertir, masquer du contenu ou suspendre tout contrevenant.
              </p>

              <h3>3. Propriété Intellectuelle & Projets Open-Source</h3>
              <p>
                Les développeurs conservent l'entière propriété intellectuelle de leurs projets, bibliothèques et publications. En publiant sur AfrikDev, vous accordez à la plateforme le droit non-exclusif de référencer et valoriser vos contributions au profit de l'écosystème.
              </p>

              <h3>4. Création et Responsabilités des Communautés</h3>
              <p>
                Tout membre peut créer un hub ou une communauté thématique/locale. Le créateur en assume la modération quotidienne (droit d'accepter, refuser ou retirer des membres) conformément aux valeurs de bienveillance de la charte AfrikDev.
              </p>

              <h3>5. Sécurité des Comptes & Double Authentification</h3>
              <p>
                L'utilisateur veille à la confidentialité de ses identifiants. AfrikDev intègre la double authentification (2FA) et la validation par email pour garantir l'intégrité et la protection de chaque profil.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            <CheckCircle2 size={16} />
            <span>{language === 'en' ? 'I Understand and Agree' : "J'ai lu et j'accepte"}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function PrivacyModal({ isOpen, onClose }) {
  const { language } = useTranslation();
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg legal-modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Lock size={20} className="text-green" />
            <h2 className="modal-title">
              {language === 'en' ? 'Privacy Policy & GDPR Compliance' : 'Politique de Confidentialité & RGPD'}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <div className="legal-modal-body">
          {language === 'en' ? (
            <div className="legal-content">
              <div className="legal-badge-date">Compliance Standard: GDPR (EU) & African Data Protection Frameworks</div>
              
              <h3>1. Data We Collect</h3>
              <p>
                To provide you with verified matching, collaboration opportunities, and community access, AfrikDev collects: your full name, email address, phone number, technical skills, location/country, and verified GitHub/Google connection data.
              </p>

              <h3>2. Use of Personal Data</h3>
              <p>
                Your data is strictly utilized to:
              </p>
              <ul>
                <li>Enable tech affinity matching and co-founder discovery</li>
                <li>Connect you with verified recruiters and companies upon your consent</li>
                <li>Send two-factor authentication (2FA) codes and essential security alerts</li>
                <li>Prevent spam and maintain a secure community environment</li>
              </ul>

              <h3>3. No Sale of Personal Data</h3>
              <p>
                AfrikDev will never monetize or sell your personal data or source code to third-party advertisers.
              </p>

              <h3>4. Your Rights (Access, Rectification, Portability & Deletion)</h3>
              <p>
                Under GDPR and African national regulatory frameworks, you hold the absolute right to request an export of your data or permanently delete your account and associated profile at any time by contacting <code>privacy@afrikdev.com</code> or from your account settings.
              </p>

              <h3>5. Data Encryption and Retention</h3>
              <p>
                All data transfers are encrypted in-flight via TLS 1.3, and sensitive authentication elements are secured through salted cryptographic hashing.
              </p>
            </div>
          ) : (
            <div className="legal-content">
              <div className="legal-badge-date">Conformité RGPD & Réglementations Panafricaines de Protection des Données</div>
              
              <h3>1. Données Personnelles Collectées</h3>
              <p>
                Pour assurer le bon fonctionnement de la plateforme et le matching des talents, AfrikDev recueille les données suivantes : nom et prénom, adresse e-mail professionnelle, numéro de téléphone, compétences techniques, pays/ville de résidence, et données publiques des comptes tiers synchronisés (GitHub, Google).
              </p>

              <h3>2. Finalité des Traitements</h3>
              <p>
                Vos informations sont exclusivement exploitées pour :
              </p>
              <ul>
                <li>Calculer les affinités tech et favoriser la collaboration entre pairs</li>
                <li>Permettre aux entreprises et recruteurs vérifiés de vous contacter lorsque vous êtes disponible</li>
                <li>Garantir la sécurité des accès via la double authentification (2FA)</li>
                <li>Lutter contre les faux profils et le spam dans les communautés</li>
              </ul>

              <h3>3. Non-Commercialisation des Données</h3>
              <p>
                AfrikDev ne vend, ne loue et ne cède aucune donnée personnelle ou de projet à des tiers publicitaires.
              </p>

              <h3>4. Vos Droits (Accès, Rectification, Effacement)</h3>
              <p>
                Conformément aux normes RGPD et aux législations africaines sur la protection des données à caractère personnel, vous disposez d'un droit permanent d'accès, de modification, d'exportation et de suppression définitive de vos données sur simple demande à <code>privacy@afrikdev.com</code> ou depuis votre espace profil.
              </p>

              <h3>5. Chiffrement et Sécurité</h3>
              <p>
                Toutes les communications sont chiffrées de bout en bout (TLS 1.3), et les mots de passe bénéficient d'un hachage cryptographique robuste avec sel.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            <CheckCircle2 size={16} />
            <span>{language === 'en' ? 'Acknowledge Privacy Policy' : 'Prendre acte et fermer'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
