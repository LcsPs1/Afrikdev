import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  ArrowRight, 
  Layers, 
  Send, 
  Filter, 
  Flame, 
  Award,
  ShieldCheck,
  Rocket,
  Cpu,
  Smartphone,
  Check,
  FolderGit2,
  Sliders,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CountryFlag } from './CountryFlag';
import { useTranslation } from '../i18n/LanguageContext';

// Préconfigurations intelligentes des duos et équipes tech
export const SQUAD_COMBOS = [
  {
    id: 'mvp-duo',
    icon: Rocket,
    title: 'Duo Lancement MVP',
    badge: 'Idéal Début de Projet',
    badgeColor: 'emerald',
    tagline: 'Full-Stack Developer + UI/UX & Frontend Lead',
    description: 'Concevoir et lancer un prototype fonctionnel, rapide et soigné pour valider une idée de marché ou séduire des investisseurs.',
    roles: [
      {
        id: 'role-1',
        title: 'Lead Full-Stack / Logiciel',
        skillsNeeded: ['React', 'Django', 'PostgreSQL', 'Docker', 'Python'],
        focus: 'Architecture base de données, APIs REST, authentification'
      },
      {
        id: 'role-2',
        title: 'UI/UX & Frontend Lead',
        skillsNeeded: ['React', 'Next.js', 'Figma', 'TypeScript', 'Tailwind CSS'],
        focus: 'Design d’interface, ergonomie utilisateur, intégration pixel-perfect'
      }
    ],
    combinedStack: ['React', 'Django', 'PostgreSQL', 'TypeScript', 'Figma', 'Docker']
  },
  {
    id: 'scale-duo',
    icon: Zap,
    title: 'Duo Scale & Performance',
    badge: 'Forte Croissance',
    badgeColor: 'amber',
    tagline: 'Senior Backend & Cloud SRE + Frontend Architect',
    description: 'Faire passer votre plateforme à l’échelle : encaisser des milliers de requêtes par seconde sans ralentissement réseau.',
    roles: [
      {
        id: 'role-1',
        title: 'Senior Backend & Cloud Architect',
        skillsNeeded: ['Django', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
        focus: 'Micro-services, caches Redis, réplication DB, haute disponibilité'
      },
      {
        id: 'role-2',
        title: 'Frontend Performance Lead',
        skillsNeeded: ['React', 'TypeScript', 'Next.js', 'Redux'],
        focus: 'Core Web Vitals, gestion d’état temps réel, fluidité UI'
      }
    ],
    combinedStack: ['Django', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'React', 'TypeScript']
  },
  {
    id: 'security-duo',
    icon: ShieldCheck,
    title: 'Duo FinTech & Sécurité',
    badge: 'Haute Confiance',
    badgeColor: 'purple',
    tagline: 'Core Backend / FinTech + Auditeur Cybersécurité',
    description: 'Indispensable pour les applications manipulant de l’argent (Mobile Money, passerelles, cryptos) ou données de santé confidentielles.',
    roles: [
      {
        id: 'role-1',
        title: 'FinTech / Core Backend Engineer',
        skillsNeeded: ['Django', 'Go', 'Python', 'PostgreSQL', 'FastAPI'],
        focus: 'Passerelles de paiement, webhooks opérateurs, conformité ACID'
      },
      {
        id: 'role-2',
        title: 'Auditeur Cybersécurité & Web3',
        skillsNeeded: ['Solidity', 'Rust', 'PenTesting', 'Security', 'Linux'],
        focus: 'Audit de failles, chiffrement de bout en bout, smart contracts'
      }
    ],
    combinedStack: ['Django', 'Python', 'PostgreSQL', 'Solidity', 'Rust', 'PenTesting']
  },
  {
    id: 'mobile-duo',
    icon: Smartphone,
    title: 'Duo Mobile-First Panafricain',
    badge: '100% Smartphone',
    badgeColor: 'cyan',
    tagline: 'Lead Mobile Flutter + Backend API / Micro-services',
    description: 'Développer une application mobile ultra-rapide avec support hors-ligne (offline-first) adaptée à la connectivité africaine.',
    roles: [
      {
        id: 'role-1',
        title: 'Lead Mobile Engineer (Flutter)',
        skillsNeeded: ['Flutter', 'Dart', 'SQLite', 'Firebase'],
        focus: 'Interface tactile fluide, synchronisation locale offline-first'
      },
      {
        id: 'role-2',
        title: 'Backend API & Sync Engineer',
        skillsNeeded: ['Go', 'FastAPI', 'Python', 'PostgreSQL', 'Redis'],
        focus: 'Endpoints légers optimisés faible bande-passante, synchronisation delta'
      }
    ],
    combinedStack: ['Flutter', 'Dart', 'Go', 'FastAPI', 'SQLite', 'PostgreSQL']
  },
  {
    id: 'ai-duo',
    icon: Cpu,
    title: 'Duo DeepTech & IA Locale',
    badge: 'Innovation Panafricaine',
    badgeColor: 'rose',
    tagline: 'AI & Data Specialist + Product / Full-Stack Integrator',
    description: 'Entraîner des modèles d’IA adaptés aux réalités locales (langues nationales, vision par ordinateur, agriculture) et les intégrer en production.',
    roles: [
      {
        id: 'role-1',
        title: 'AI & Data Science Specialist',
        skillsNeeded: ['Python', 'PyTorch', 'FastAPI', 'LangChain', 'Whisper'],
        focus: 'Modèles NLP locaux, pipelines d’inférence, quantification Edge AI'
      },
      {
        id: 'role-2',
        title: 'Full-Stack / Product Integrator',
        skillsNeeded: ['React', 'Flutter', 'Docker', 'PostgreSQL'],
        focus: 'Interface utilisateur vocale/visuelle, intégration API et packaging'
      }
    ],
    combinedStack: ['Python', 'PyTorch', 'FastAPI', 'React', 'Docker', 'PostgreSQL']
  }
];

export function MatchmakerSection({ developers, projects, onSelectDeveloper }) {
  const { t, language } = useTranslation();

  // Mode selection: 'squad' (Combos d'équipe), 'project' (Par projet existant), 'custom' (Stack sur-mesure)
  const [matchMode, setMatchMode] = useState('squad');

  // Selected squad combo
  const [selectedSquadId, setSelectedSquadId] = useState(SQUAD_COMBOS[0].id);

  // Selected project
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'proj-1');

  // Custom stack
  const [customStack, setCustomStack] = useState(["Django", "React", "PostgreSQL", "Docker"]);
  
  // Track invited devs
  const [invitedDevs, setInvitedDevs] = useState({});

  const availableSkillsList = [
    "React", "Django", "PostgreSQL", "Docker", "Python", "Flutter", "Go", 
    "TypeScript", "FastAPI", "Redis", "Kubernetes", "PyTorch", "Solidity", "Tailwind CSS", "Figma"
  ];

  // Combos d'équipes localisés dynamiquement en FR / EN
  const localizedSquadCombos = useMemo(() => {
    return SQUAD_COMBOS.map(combo => {
      const comboTrans = t(`matchmaker.combos.${combo.id}`);
      if (!comboTrans || typeof comboTrans !== 'object') return combo;
      return {
        ...combo,
        title: comboTrans.title || combo.title,
        badge: comboTrans.badge || combo.badge,
        tagline: comboTrans.tagline || combo.tagline,
        description: comboTrans.description || combo.description,
        roles: combo.roles.map((r, idx) => ({
          ...r,
          title: idx === 0 ? (comboTrans.role1Title || r.title) : (comboTrans.role2Title || r.title),
          focus: idx === 0 ? (comboTrans.role1Focus || r.focus) : (comboTrans.role2Focus || r.focus)
        }))
      };
    });
  }, [language, t]);

  const currentSquad = useMemo(() => {
    return localizedSquadCombos.find(s => s.id === selectedSquadId) || localizedSquadCombos[0];
  }, [localizedSquadCombos, selectedSquadId]);

  const currentProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  const toggleSkill = (skill) => {
    if (customStack.includes(skill)) {
      if (customStack.length > 1) {
        setCustomStack(customStack.filter(s => s !== skill));
      }
    } else {
      setCustomStack([...customStack, skill]);
    }
  };

  // Determine active target stack based on mode
  const activeStack = useMemo(() => {
    if (matchMode === 'squad') {
      return currentSquad.combinedStack;
    }
    if (matchMode === 'project') {
      return currentProject ? currentProject.technologies : ["React", "Django"];
    }
    return customStack;
  }, [matchMode, currentSquad, currentProject, customStack]);

  // Compute matching percentage for each developer against the active stack
  const matchedDevs = useMemo(() => {
    if (!activeStack.length) return [];

    const scored = developers.map(dev => {
      const devSkillsLower = dev.skills.map(s => s.toLowerCase());
      const matched = [];
      const missing = [];

      activeStack.forEach(req => {
        if (devSkillsLower.includes(req.toLowerCase())) {
          matched.push(req);
        } else {
          missing.push(req);
        }
      });

      const matchRatio = matched.length / activeStack.length;
      let score = Math.round(matchRatio * 100);
      if (dev.available && score > 0) {
        score = Math.min(100, score + 5);
      }

      // If in squad mode, also evaluate affinity per role
      let bestRoleLabel = null;
      if (matchMode === 'squad' && currentSquad) {
        let bestRoleScore = -1;
        currentSquad.roles.forEach(role => {
          const roleMatched = role.skillsNeeded.filter(req => 
            devSkillsLower.includes(req.toLowerCase())
          ).length;
          const roleScore = roleMatched / role.skillsNeeded.length;
          if (roleScore > bestRoleScore) {
            bestRoleScore = roleScore;
            bestRoleLabel = role.title;
          }
        });
      }

      return {
        ...dev,
        matchScore: score,
        matchedSkills: matched,
        missingSkills: missing,
        bestRoleLabel
      };
    });

    return scored.sort((a, b) => b.matchScore - a.matchScore);
  }, [developers, activeStack, matchMode, currentSquad]);

  // Compute recommended Duo (Pair) when in Squad Mode
  const squadDuoRecommendations = useMemo(() => {
    if (matchMode !== 'squad' || !currentSquad) return null;

    const [roleA, roleB] = currentSquad.roles;

    const scoreDevForRole = (dev, role) => {
      const devSkillsLower = dev.skills.map(s => s.toLowerCase());
      const matched = role.skillsNeeded.filter(req => 
        devSkillsLower.includes(req.toLowerCase())
      );
      const ratio = matched.length / role.skillsNeeded.length;
      let score = Math.round(ratio * 100);
      if (dev.available) score = Math.min(100, score + 5);
      return { dev, score, matched };
    };

    // Rank devs for Role A
    const candidatesA = developers
      .map(d => scoreDevForRole(d, roleA))
      .sort((x, y) => y.score - x.score);

    // Rank devs for Role B
    const candidatesB = developers
      .map(d => scoreDevForRole(d, roleB))
      .sort((x, y) => y.score - x.score);

    const devA = candidatesA[0];
    // Find best for Role B that is distinct from Dev A if possible
    const devB = candidatesB.find(c => c.dev.id !== devA?.dev.id) || candidatesB[0];

    const teamSynergy = Math.round(((devA?.score || 70) + (devB?.score || 70)) / 2);

    return {
      roleA: {
        role: roleA,
        candidate: devA?.dev,
        score: devA?.score || 85,
        matchedSkills: devA?.matched || []
      },
      roleB: {
        role: roleB,
        candidate: devB?.dev,
        score: devB?.score || 80,
        matchedSkills: devB?.matched || []
      },
      teamSynergy
    };
  }, [matchMode, currentSquad, developers]);

  const handleInvite = (dev) => {
    setInvitedDevs(prev => ({ ...prev, [dev.id]: true }));
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#06B6D4', '#38BDF8', '#F59E0B', '#10B981']
      });
    } catch (e) {
      // fallback
    }
  };

  const handleInviteSquad = () => {
    if (!squadDuoRecommendations) return;
    const { roleA, roleB } = squadDuoRecommendations;
    setInvitedDevs(prev => ({
      ...prev,
      [roleA.candidate.id]: true,
      [roleB.candidate.id]: true
    }));
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#10B981', '#F59E0B', '#A855F7']
      });
    } catch (e) {}
  };

  const isSquadInvited = squadDuoRecommendations && 
    invitedDevs[squadDuoRecommendations.roleA.candidate?.id] && 
    invitedDevs[squadDuoRecommendations.roleB.candidate?.id];

  return (
    <div className="matchmaker-container">
      {/* Title banner */}
      <div className="section-head-bar">
        <div>
          <div className="badge-tag gold mb-2">
            <Zap size={14} className="text-amber" />
            <span>{t('matchmaker.badge')}</span>
          </div>
          <h1 className="page-heading">{t('matchmaker.pageHeading')}</h1>
          <p className="page-subheading">
            {t('matchmaker.pageSubheading')}
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="matchmaker-mode-nav">
        <button
          className={`mode-nav-btn ${matchMode === 'squad' ? 'active' : ''}`}
          onClick={() => setMatchMode('squad')}
        >
          <Users size={17} />
          <span>{t('matchmaker.tabSquad')}</span>
        </button>

        <button
          className={`mode-nav-btn ${matchMode === 'project' ? 'active' : ''}`}
          onClick={() => setMatchMode('project')}
        >
          <FolderGit2 size={17} />
          <span>{t('matchmaker.tabProject')}</span>
        </button>

        <button
          className={`mode-nav-btn ${matchMode === 'custom' ? 'active' : ''}`}
          onClick={() => setMatchMode('custom')}
        >
          <Sliders size={17} />
          <span>{t('matchmaker.tabCustom')}</span>
        </button>
      </div>

      {/* Mode 1: Squad Combos Configuration */}
      {matchMode === 'squad' && (
        <div className="glass-card match-config-box">
          <div className="config-header">
            <div className="config-title">
              <Users size={18} className="text-cyan" />
              <span>{t('matchmaker.squadConfigTitle')}</span>
            </div>
            <span className="config-subtitle">
              {t('matchmaker.squadConfigSubtitle')}
            </span>
          </div>

          <div className="squad-combos-grid">
            {localizedSquadCombos.map(combo => {
              const IconComp = combo.icon;
              const isSelected = selectedSquadId === combo.id;
              return (
                <div
                  key={combo.id}
                  className={`squad-combo-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedSquadId(combo.id)}
                >
                  <div className="combo-card-top">
                    <span className="combo-icon-wrap">
                      <IconComp size={20} />
                    </span>
                    <span className={`combo-badge badge-${combo.badgeColor}`}>
                      {combo.badge}
                    </span>
                  </div>
                  <h3 className="combo-title">{combo.title}</h3>
                  <div className="combo-tagline">{combo.tagline}</div>
                  <p className="combo-desc">{combo.description}</p>

                  <div className="combo-roles-preview">
                    {combo.roles.map((r, i) => (
                      <span key={r.id} className="combo-role-pill">
                        {i === 0 ? '①' : '②'} {r.title}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommended Duo Spotlight */}
          {squadDuoRecommendations && (
            <div className="squad-spotlight-box">
              <div className="spotlight-header">
                <div>
                  <div className="badge-tag cyan mb-1">
                    <Sparkles size={13} className="text-cyan" />
                    <span>{t('matchmaker.recommendedDuoBadge')}</span>
                  </div>
                  <h3 className="spotlight-title">
                    {t('matchmaker.suggestedTeamFor')} <strong>{currentSquad.title}</strong>
                  </h3>
                </div>

                <button
                  className={`btn-primary btn-sm ${isSquadInvited ? 'btn-invited' : ''}`}
                  onClick={handleInviteSquad}
                  disabled={isSquadInvited}
                >
                  {isSquadInvited ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>{t('matchmaker.squadInvitedSuccess')}</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake size={16} />
                      <span>{t('matchmaker.inviteFullSquad')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Side by side Duo visualization */}
              <div className="duo-pair-grid">
                {/* Role 1 Card */}
                <div className="duo-member-card">
                  <div className="duo-member-header">
                    <span className="duo-role-badge">{t('matchmaker.role1Badge')} {squadDuoRecommendations.roleA.role.title}</span>
                    <span className="duo-score-pill">
                      {squadDuoRecommendations.roleA.score}% {t('matchmaker.matchPct')}
                    </span>
                  </div>
                  <div className="duo-member-body">
                    <div className="avatar-pos-wrap">
                      <img 
                        src={squadDuoRecommendations.roleA.candidate.avatar} 
                        alt={squadDuoRecommendations.roleA.candidate.name} 
                        className="user-avatar-md"
                      />
                      <span className="status-dot online" title={t('matchmaker.availableOnline')} />
                    </div>
                    <div>
                      <div className="dev-name-flag">
                        <span className="name-bold">{squadDuoRecommendations.roleA.candidate.name}</span>
                        <CountryFlag country={squadDuoRecommendations.roleA.candidate.country} size="xs" />
                      </div>
                      <div className="dev-headline">
                        {squadDuoRecommendations.roleA.candidate.city}, {squadDuoRecommendations.roleA.candidate.country}
                      </div>
                    </div>
                  </div>
                  <div className="duo-focus-note">
                    <strong>{t('matchmaker.focusLabel')}</strong> {squadDuoRecommendations.roleA.role.focus}
                  </div>
                  <div className="chips-mini mt-2">
                    {squadDuoRecommendations.roleA.matchedSkills.map(s => (
                      <span key={s} className="chip-match">{s}</span>
                    ))}
                  </div>
                  <div className="mt-3 text-right">
                    <button 
                      className="btn-secondary btn-xs"
                      onClick={() => onSelectDeveloper(squadDuoRecommendations.roleA.candidate)}
                    >
                      {t('matchmaker.viewProfile')}
                    </button>
                  </div>
                </div>

                {/* Synergy Center Connector */}
                <div className="duo-synergy-bridge">
                  <div className="synergy-pulse">
                    <Zap size={22} className="text-amber" />
                  </div>
                  <span className="synergy-pct">{squadDuoRecommendations.teamSynergy}%</span>
                  <span className="synergy-label">{t('matchmaker.techSynergy')}</span>
                </div>

                {/* Role 2 Card */}
                <div className="duo-member-card">
                  <div className="duo-member-header">
                    <span className="duo-role-badge">{t('matchmaker.role2Badge')} {squadDuoRecommendations.roleB.role.title}</span>
                    <span className="duo-score-pill">
                      {squadDuoRecommendations.roleB.score}% {t('matchmaker.matchPct')}
                    </span>
                  </div>
                  <div className="duo-member-body">
                    <div className="avatar-pos-wrap">
                      <img 
                        src={squadDuoRecommendations.roleB.candidate.avatar} 
                        alt={squadDuoRecommendations.roleB.candidate.name} 
                        className="user-avatar-md"
                      />
                      <span className="status-dot online" title={t('matchmaker.availableOnline')} />
                    </div>
                    <div>
                      <div className="dev-name-flag">
                        <span className="name-bold">{squadDuoRecommendations.roleB.candidate.name}</span>
                        <CountryFlag country={squadDuoRecommendations.roleB.candidate.country} size="xs" />
                      </div>
                      <div className="dev-headline">
                        {squadDuoRecommendations.roleB.candidate.city}, {squadDuoRecommendations.roleB.candidate.country}
                      </div>
                    </div>
                  </div>
                  <div className="duo-focus-note">
                    <strong>{t('matchmaker.focusLabel')}</strong> {squadDuoRecommendations.roleB.role.focus}
                  </div>
                  <div className="chips-mini mt-2">
                    {squadDuoRecommendations.roleB.matchedSkills.map(s => (
                      <span key={s} className="chip-match">{s}</span>
                    ))}
                  </div>
                  <div className="mt-3 text-right">
                    <button 
                      className="btn-secondary btn-xs"
                      onClick={() => onSelectDeveloper(squadDuoRecommendations.roleB.candidate)}
                    >
                      {t('matchmaker.viewProfile')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Project Based Configuration */}
      {matchMode === 'project' && (
        <div className="glass-card match-config-box">
          <div className="config-header">
            <div className="config-title">
              <FolderGit2 size={18} className="text-cyan" />
              <span>{t('matchmaker.projectConfigTitle')}</span>
            </div>
          </div>

          <div className="project-select-row">
            {projects.map(proj => (
              <button
                key={proj.id}
                className={`project-choice-btn ${selectedProjectId === proj.id ? 'active' : ''}`}
                onClick={() => setSelectedProjectId(proj.id)}
              >
                <CountryFlag country={proj.country || proj.flag} size="xs" />
                <span className="font-semibold">{proj.title}</span>
                <span className="choice-badge">{proj.category}</span>
              </button>
            ))}
          </div>

          <div className="stack-picker-section">
            <div className="stack-picker-label">
              {t('matchmaker.requiredStackPrefix')} <strong>{currentProject?.title}</strong> ({activeStack.length} {t('matchmaker.techsCount')}) :
            </div>
            <div className="stack-chips-row">
              {activeStack.map(skill => (
                <span key={skill} className="stack-chip-toggle selected">
                  <CheckCircle2 size={13} className="text-cyan" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Custom Stack Configuration */}
      {matchMode === 'custom' && (
        <div className="glass-card match-config-box">
          <div className="config-header">
            <div className="config-title">
              <Sliders size={18} className="text-cyan" />
              <span>{t('matchmaker.customConfigTitle')}</span>
            </div>
          </div>

          <div className="stack-picker-section" style={{ borderTop: 'none', paddingTop: 0 }}>
            <div className="stack-picker-label">
              {t('matchmaker.toggleTechsHint')} ({customStack.length} {t('matchmaker.selectedCount')}) :
            </div>
            <div className="stack-chips-row">
              {availableSkillsList.map(skill => {
                const isSelected = customStack.some(s => s.toLowerCase() === skill.toLowerCase());
                return (
                  <button
                    key={skill}
                    className={`stack-chip-toggle ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {isSelected && <CheckCircle2 size={13} className="text-cyan" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Results Leaderboard */}
      <div className="match-results-section">
        <div className="results-header">
          <h2 className="results-title">
            <span>
              {matchMode === 'squad' 
                ? t('matchmaker.allRankedSquad') 
                : t('matchmaker.recommendedProfiles')}
            </span>
            <span className="results-count">({matchedDevs.length} {t('matchmaker.devsAnalyzed')})</span>
          </h2>
          <span className="match-hint">
            {t('matchmaker.calcHint')}
          </span>
        </div>

        <div className="matched-devs-list">
          {matchedDevs.map((dev, index) => {
            const isInvited = invitedDevs[dev.id];
            const isTopMatch = index === 0 && dev.matchScore >= 70;

            return (
              <div 
                key={dev.id} 
                className={`glass-card matched-dev-row ${isTopMatch ? 'top-match-card' : ''}`}
              >
                {/* Score gauge */}
                <div className="match-score-badge">
                  <span className="score-percentage">{dev.matchScore}%</span>
                  <span className="score-label">{t('matchmaker.affinity')}</span>
                  <div className="score-progress-bar">
                    <div 
                      className="score-fill" 
                      style={{ 
                        width: `${dev.matchScore}%`,
                        backgroundColor: dev.matchScore >= 80 ? '#10B981' : dev.matchScore >= 60 ? '#06B6D4' : '#F59E0B'
                      }}
                    />
                  </div>
                </div>

                {/* Developer Info */}
                <div className="matched-dev-avatar-info">
                  <div className="avatar-pos-wrap">
                    <img src={dev.avatar} alt={dev.name} className="user-avatar-md" />
                    <span className={`status-dot ${dev.available ? 'online' : 'busy'}`} title={dev.available ? t('matchmaker.availableOnline') : t('matchmaker.onMission')} />
                    {isTopMatch && (
                      <span className="top-star-badge" title={t('matchmaker.topTechMatch')}>
                        <Flame size={12} fill="#F59E0B" />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="dev-name-flag">
                      <span className="name-bold">{dev.name}</span>
                      <CountryFlag country={dev.country || dev.flag} size="xs" />
                      {dev.available ? (
                        <span className="available-tag">{t('matchmaker.available')}</span>
                      ) : (
                        <span className="busy-tag">{t('matchmaker.busy')}</span>
                      )}
                    </div>
                    <div className="dev-headline">{dev.title} — {dev.city}, {dev.country}</div>
                    
                    {/* Role fit badge if squad mode */}
                    {matchMode === 'squad' && dev.bestRoleLabel && (
                      <div className="mt-1">
                        <span className="role-fit-tag">
                          {t('matchmaker.closestProfilePrefix')} <strong>{dev.bestRoleLabel}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Matched skills breakdown */}
                <div className="matched-breakdown">
                  <div className="breakdown-group">
                    <span className="breakdown-label text-green">{t('matchmaker.matchesCount')} ({dev.matchedSkills.length}) :</span>
                    <div className="chips-mini">
                      {dev.matchedSkills.map(s => (
                        <span key={s} className="chip-match">{s}</span>
                      ))}
                    </div>
                  </div>
                  {dev.missingSkills.length > 0 && (
                    <div className="breakdown-group">
                      <span className="breakdown-label text-dim">{t('matchmaker.toLearnCount')} ({dev.missingSkills.length}) :</span>
                      <div className="chips-mini">
                        {dev.missingSkills.map(s => (
                          <span key={s} className="chip-missing">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div className="matched-actions">
                  <button 
                    className="btn-secondary btn-sm"
                    onClick={() => onSelectDeveloper(dev)}
                  >
                    {t('matchmaker.profileBtn')}
                  </button>
                  <button 
                    className={`btn-primary btn-sm ${isInvited ? 'btn-invited' : ''}`}
                    onClick={() => handleInvite(dev)}
                    disabled={isInvited}
                  >
                    {isInvited ? (
                      <>
                        <CheckCircle2 size={15} />
                        <span>{t('matchmaker.invitedBtn')}</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>{t('matchmaker.connectBtn')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

