import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Code2, 
  MoreVertical, 
  ShieldAlert, 
  Paperclip, 
  Check, 
  CheckCheck, 
  Terminal, 
  Copy,
  Sparkles,
  Phone,
  Video,
  Mic,
  Square,
  Trash2,
  FileText,
  FileVideo,
  Image as ImageIcon,
  File as FileIcon,
  Download,
  Play,
  Pause,
  X,
  Volume2,
  Languages,
  ArrowLeft
} from 'lucide-react';
import { CountryFlag } from './CountryFlag';
import { useTranslation } from '../i18n/LanguageContext';
import { translateText, getTranslationAction } from '../services/translator';

export function MessagesSection({ conversations, currentUser }) {
  const { t, language } = useTranslation();
  const [convs, setConvs] = useState(conversations);
  const [activeConvId, setActiveConvId] = useState(conversations[0]?.id || null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [includeCode, setIncludeCode] = useState(false);
  const [codeText, setCodeText] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // File attachment states
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Voice note states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const activeConv = convs.find(c => c.id === activeConvId);

  // Auto-scroll et Auto-expansion refs
  const chatStreamRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = (instant = false) => {
    if (chatStreamRef.current) {
      if (instant) {
        chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
      } else {
        chatStreamRef.current.scrollTo({
          top: chatStreamRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
    if (messagesEndRef.current) {
      try {
        messagesEndRef.current.scrollIntoView({
          behavior: instant ? 'auto' : 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      } catch (e) {}
    }
  };

  // Ramener directement au dernier message à l'ouverture d'une conversation
  useEffect(() => {
    if (activeConvId) {
      scrollToBottom(true);
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        window.requestAnimationFrame(() => scrollToBottom(true));
      }
      const t1 = setTimeout(() => scrollToBottom(true), 40);
      const t2 = setTimeout(() => scrollToBottom(true), 150);
      const t3 = setTimeout(() => scrollToBottom(true), 350);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [activeConvId, mobileShowChat]);

  // Défilement automatique fluide dès qu'un nouveau message est envoyé ou reçu
  useEffect(() => {
    if (activeConv?.messages?.length) {
      const t = setTimeout(() => scrollToBottom(false), 50);
      return () => clearTimeout(t);
    }
  }, [activeConv?.messages?.length]);

  // Ajuster dynamiquement la hauteur du textarea en fonction du texte pour voir l'intégralité
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 38), 160)}px`;
    }
  }, [inputText]);

  // Agrandir la zone de saisie en même temps que la longueur du texte pour voir le texte dans son intégralité
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 38), 160)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Traduction à la demande des messages
  const [translatedMsgIds, setTranslatedMsgIds] = useState(new Set());
  const [loadingMsgTranslations, setLoadingMsgTranslations] = useState(new Set());
  const [liveMsgTranslations, setLiveMsgTranslations] = useState({});

  // Réinitialiser l'état des traductions quand la langue de l'interface change
  useEffect(() => {
    setTranslatedMsgIds(new Set());
  }, [language]);

  const handleTranslateMsg = async (msg) => {
    const msgId = msg.id;
    if (translatedMsgIds.has(msgId)) {
      setTranslatedMsgIds(prev => {
        const next = new Set(prev);
        next.delete(msgId);
        return next;
      });
      return;
    }

    const action = getTranslationAction(msg.text, language);
    if (!action.canTranslate) return;

    const cacheKey = `${action.targetLang}_${msgId}`;
    if (liveMsgTranslations[cacheKey] || liveMsgTranslations[msgId]) {
      setTranslatedMsgIds(prev => new Set(prev).add(msgId));
      return;
    }

    setLoadingMsgTranslations(prev => new Set(prev).add(msgId));
    try {
      const translated = await translateText(msg.text, action.targetLang, action.sourceLang);
      setLiveMsgTranslations(prev => ({ 
        ...prev, 
        [cacheKey]: translated,
        [msgId]: translated 
      }));
      setTranslatedMsgIds(prev => new Set(prev).add(msgId));
    } catch (err) {
      console.warn("Échec traduction message:", err);
    } finally {
      setLoadingMsgTranslations(prev => {
        const next = new Set(prev);
        next.delete(msgId);
        return next;
      });
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Ko';
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle File selection (PDF, Image, Video, Doc...)
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let fileType = 'document';
    if (file.type.startsWith('image/')) fileType = 'image';
    else if (file.type.startsWith('video/')) fileType = 'video';
    else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) fileType = 'pdf';

    setSelectedFile({
      name: file.name,
      size: formatFileSize(file.size),
      type: fileType,
      url: URL.createObjectURL(file),
      raw: file
    });
  };

  // Voice Recording Start
  const startVoiceRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach(track => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          sendAudioMessage(audioUrl, recordingSeconds);
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds(s => s + 1);
        }, 1000);
      } else {
        // Fallback simulation note
        setIsRecording(true);
        setRecordingSeconds(0);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds(s => s + 1);
        }, 1000);
      }
    } catch (err) {
      // Simulation mode if mic is denied or not connected
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    }
  };

  // Voice Recording Cancel
  const cancelVoiceRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  // Voice Recording Finish & Send
  const finishVoiceRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    } else {
      // Send simulated audio note with nice duration
      const simulatedDuration = recordingSeconds || 4;
      sendAudioMessage(null, simulatedDuration);
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const sendAudioMessage = (audioUrl, durationSec) => {
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const durationLabel = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    const newMessage = {
      id: `m-voice-${Date.now()}`,
      senderId: currentUser.id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: null,
      audio: {
        url: audioUrl,
        duration: durationLabel || '0:05',
        bars: [14, 28, 42, 22, 38, 50, 32, 20, 35, 18, 40, 24]
      },
      isRead: false // Envoyé (gris)
    };

    dispatchNewMessage(newMessage);
  };

  const dispatchNewMessage = (newMessage) => {
    setConvs(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          unreadCount: 0,
          isRead: true,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    }));

    setTimeout(() => scrollToBottom(false), 30);

    // Simulated reply after 2.5 seconds
    if (activeConv?.contact?.online) {
      setTimeout(() => {
        const replyMessage = {
          id: `m-reply-${Date.now()}`,
          senderId: activeConv.contact.id,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: "Bien reçu ! Je regarde ça et je te fais un retour dans l'après-midi. 🚀",
          isRead: true
        };
        setConvs(prev => prev.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              unreadCount: 0,
              isRead: true,
              messages: c.messages.map(m => m.senderId === currentUser.id ? { ...m, isRead: true } : m).concat(replyMessage)
            };
          }
          return c;
        }));
        setTimeout(() => scrollToBottom(false), 50);
      }, 2500);
    }
  };

  const handleSendMessage = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputText.trim() && !codeText.trim() && !selectedFile) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim() || null,
      codeSnippet: includeCode && codeText.trim() ? codeText.trim() : null,
      file: selectedFile || null,
      isRead: false // Envoyé (gris)
    };

    dispatchNewMessage(newMessage);

    setInputText('');
    setCodeText('');
    setIncludeCode(false);
    setSelectedFile(null);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setTimeout(() => scrollToBottom(false), 20);
  };

  const audioPlayerRef = useRef(null);

  // Toggle playing voice note audio
  const togglePlayAudio = (msgId, audioUrl) => {
    if (playingAudioId === msgId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPlayingAudioId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if (audioUrl) {
        try {
          const audio = new Audio(audioUrl);
          audioPlayerRef.current = audio;
          audio.play().catch(() => {});
          audio.onended = () => setPlayingAudioId(null);
        } catch (e) {}
      }
      setPlayingAudioId(msgId);
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 5000);
    }
  };

  const filteredConvs = convs.filter(c => 
    c.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`messages-layout-container glass-card ${mobileShowChat ? 'mobile-chat-active' : 'mobile-list-active'}`}>
      {/* Left Sidebar: Conversations list */}
      <aside className="messages-sidebar">
        <div className="conv-sidebar-header">
          <div className="conv-title-row">
            <MessageSquare size={18} className="text-cyan" />
            <h2 className="conv-heading">{t('messages.title', 'Messagerie Dev')}</h2>
          </div>
          <div className="conv-search-box">
            <Search size={15} className="search-icon-sm" />
            <input 
              type="text" 
              placeholder={t('messages.searchPlaceholder', 'Rechercher une conversation...')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="conv-items-list">
          {filteredConvs.map(conv => {
            const isActive = conv.id === activeConvId;
            const lastMsg = conv.messages[conv.messages.length - 1];
            const lastMsgIsMine = lastMsg?.senderId === currentUser.id;

            return (
              <div 
                key={conv.id}
                className={`conv-item-card ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveConvId(conv.id);
                  setMobileShowChat(true);
                  // Mark as read immediately on click
                  setConvs(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0, isRead: true } : c));
                  setTimeout(() => scrollToBottom(true), 40);
                  setTimeout(() => scrollToBottom(true), 160);
                  setTimeout(() => scrollToBottom(true), 320);
                }}
              >
                <div className="conv-avatar-pos">
                  <img src={conv.contact.avatar} alt={conv.contact.name} className="conv-avatar-img" />
                  <span className={`conv-status-indicator ${conv.contact.online ? 'online' : 'offline'}`} />
                </div>

                <div className="conv-card-meta">
                  <div className="conv-name-row">
                    <span className="conv-contact-name">{conv.contact.name}</span>
                    <CountryFlag country={conv.contact.country || conv.contact.flag} size="xs" />
                    <span className="conv-last-time ml-auto">{lastMsg?.time || ''}</span>
                  </div>
                  <div className="conv-contact-role">{conv.contact.role}</div>
                  <div className="conv-preview-text" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {/* Seul celui qui envoie le message voit les traits (gris=envoyé, bleu=lu) */}
                    {lastMsgIsMine && (
                      <CheckCheck 
                        size={13} 
                        style={{ color: lastMsg.isRead ? '#06B6D4' : '#94A3B8', flexShrink: 0 }} 
                        title={lastMsg.isRead ? (language === 'en' ? "Read" : "Lu") : (language === 'en' ? "Sent" : "Envoyé")} 
                      />
                    )}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lastMsg?.audio 
                        ? (language === 'en' ? '🎤 Voice note' : '🎤 Message vocal') 
                        : lastMsg?.file 
                          ? `📎 ${lastMsg.file.name}` 
                          : (lastMsg?.text || (language === 'en' ? 'Code snippet shared...' : 'Snippet de code partagé...'))}
                    </span>
                  </div>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="conv-unread-badge">{conv.unreadCount}</span>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right Column: Chat Window */}
      {activeConv ? (
        <section className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <button 
              type="button"
              className="chat-mobile-back-btn"
              onClick={() => setMobileShowChat(false)}
              title={language === 'en' ? 'Back to discussions' : 'Retour aux discussions'}
              aria-label="Retour aux discussions"
            >
              <ArrowLeft size={18} />
              <span className="chat-back-btn-text">{language === 'en' ? 'Chats' : 'Discussions'}</span>
            </button>

            <div className="chat-contact-info">
              <div className="chat-avatar-pos">
                <img src={activeConv.contact.avatar} alt={activeConv.contact.name} className="chat-avatar-lg" />
                <span className={`conv-status-indicator ${activeConv.contact.online ? 'online' : 'offline'}`} />
              </div>
              <div className="chat-contact-details">
                <div className="chat-title-line">
                  <span className="chat-contact-title">{activeConv.contact.name}</span>
                  <span className="chat-flag">
                    <CountryFlag country={activeConv.contact.country || activeConv.contact.flag} size="xs" />
                    <span className="chat-country-name">{activeConv.contact.country}</span>
                  </span>
                </div>
                <div className="chat-subtitle">
                  <span className={`status-text ${activeConv.contact.online ? 'online' : ''}`}>
                    {activeConv.contact.online 
                      ? (language === 'en' ? 'Online' : 'En ligne') 
                      : (language === 'en' ? 'Offline' : 'Hors-ligne')}
                  </span>
                  <span className="meta-separator">•</span>
                  <span className="chat-role-text">{activeConv.contact.role}</span>
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <button 
                type="button"
                className="chat-icon-btn" 
                title="Appel vocal WebRTC"
                onClick={() => alert("Appel audio WebRTC initié vers " + activeConv.contact.name)}
                aria-label="Appel vocal"
              >
                <Phone size={16} />
              </button>
              <button 
                type="button"
                className="chat-icon-btn" 
                title="Appel vidéo WebRTC"
                onClick={() => alert("Appel visio WebRTC sécurisé initié vers " + activeConv.contact.name)}
                aria-label="Appel vidéo"
              >
                <Video size={16} />
              </button>
              <button 
                type="button"
                className="chat-icon-btn" 
                title="Signaler la conversation"
                onClick={() => alert("Signalement transmis à l'équipe de modération AFRIKDEV.")}
                aria-label="Signaler"
              >
                <ShieldAlert size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="chat-stream" ref={chatStreamRef}>
            {activeConv.messages.map(msg => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div key={msg.id} className={`chat-bubble-row ${isMine ? 'mine' : 'theirs'}`}>
                  <div className={`chat-bubble ${isMine ? 'bubble-mine' : 'bubble-theirs'}`}>
                    {/* Text content */}
                    {msg.text && (
                      <div className="bubble-text-wrap">
                        <p className="bubble-text">
                          {translatedMsgIds.has(msg.id) ? (liveMsgTranslations[msg.id] || msg.text) : msg.text}
                        </p>
                        {translatedMsgIds.has(msg.id) && (
                          <span style={{ fontSize: '0.68rem', color: '#34d399', display: 'block', marginTop: 2 }}>
                            🌐 {language === 'en' ? 'Translated on-demand' : 'Traduit à la demande'}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Fichier joint (PDF, Image, Vidéo, Document, etc.) */}
                    {msg.file && (
                      <div className="chat-attachment-bubble">
                        {msg.file.type === 'image' && (
                          <div className="chat-media-preview-box">
                            <img src={msg.file.url} alt={msg.file.name} className="chat-image-preview" />
                            <div className="chat-media-caption">
                              <span>{msg.file.name}</span>
                              <span className="text-dim">• {msg.file.size}</span>
                            </div>
                          </div>
                        )}

                        {msg.file.type === 'video' && (
                          <div className="chat-media-preview-box">
                            <video src={msg.file.url} controls className="chat-video-preview" />
                            <div className="chat-media-caption">
                              <span>{msg.file.name}</span>
                              <span className="text-dim">• {msg.file.size}</span>
                            </div>
                          </div>
                        )}

                        {(msg.file.type === 'pdf' || msg.file.type === 'document') && (
                          <div className="chat-doc-card glass-card">
                            <div className="doc-icon-box">
                              {msg.file.type === 'pdf' ? (
                                <FileText size={22} className="text-rose" />
                              ) : (
                                <FileIcon size={22} className="text-cyan" />
                              )}
                            </div>
                            <div className="doc-meta">
                              <span className="doc-name">{msg.file.name}</span>
                              <span className="doc-size">{msg.file.size}</span>
                            </div>
                            <a
                              href={msg.file.url}
                              download={msg.file.name}
                              className="doc-download-btn"
                              title="Télécharger / Ouvrir le fichier"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Download size={15} />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Vocal (Audio Note) */}
                    {msg.audio && (
                      <div className="chat-voice-card">
                        <button
                          type="button"
                          className="voice-play-btn"
                          onClick={() => togglePlayAudio(msg.id, msg.audio?.url)}
                          title={language === 'en' ? "Play voice note" : "Écouter le message vocal"}
                        >
                          {playingAudioId === msg.id ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                        </button>

                        <div className="voice-wave-container">
                          {msg.audio.bars?.map((height, bIdx) => (
                            <span 
                              key={bIdx} 
                              className={`voice-wave-bar ${playingAudioId === msg.id ? 'active' : ''}`}
                              style={{ 
                                height: `${height}px`,
                                animationDelay: `${bIdx * 0.08}s`
                              }} 
                            />
                          ))}
                        </div>

                        <span className="voice-duration font-mono">{msg.audio.duration}</span>
                      </div>
                    )}

                    {/* Embedded code snippet */}
                    {msg.codeSnippet && (
                      <div className="chat-code-box">
                        <div className="chat-code-header">
                          <span className="chat-code-title">
                            <Terminal size={12} className="text-cyan" />
                            <span>Code technique</span>
                          </span>
                          <button 
                            className="chat-code-copy"
                            onClick={() => handleCopyCode(msg.codeSnippet, msg.id)}
                          >
                            {copiedId === msg.id ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                          </button>
                        </div>
                        <pre className="chat-code-content font-mono">
                          <code>{msg.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    <div className="bubble-footer" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="bubble-time">{msg.time}</span>
                      
                      {msg.text && (() => {
                        const action = getTranslationAction(msg.text, language);
                        const isTranslated = translatedMsgIds.has(msg.id);
                        const isLoading = loadingMsgTranslations.has(msg.id);

                        if (!action.canTranslate && !isTranslated) return null;

                        return (
                          <button
                            type="button"
                            onClick={() => handleTranslateMsg(msg)}
                            disabled={isLoading}
                            style={{
                              background: isTranslated ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                              border: `1px solid ${isTranslated ? 'rgba(16, 185, 129, 0.35)' : 'var(--border-subtle)'}`,
                              borderRadius: '4px',
                              cursor: 'pointer',
                              padding: '1px 5px',
                              color: isTranslated ? '#34d399' : 'var(--cyan-light)',
                              fontSize: '0.66rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 3,
                              transition: 'all 0.15s ease'
                            }}
                            title={isTranslated ? action.showOriginalLabel : action.buttonLabel}
                          >
                            <Languages size={10} />
                            <span>
                              {isLoading
                                ? '...'
                                : isTranslated
                                  ? (language === 'en' ? 'Orig.' : 'Orig.')
                                  : action.shortLabel}
                            </span>
                          </button>
                        );
                      })()}

                      {/* Trait / checkmark strictement pour l'expéditeur (gris=envoyé, bleu=lu) */}
                      {isMine && (
                        <CheckCheck 
                          size={14} 
                          style={{ color: msg.isRead ? '#06B6D4' : '#94A3B8' }} 
                          className="ml-1 inline-block" 
                          title={msg.isRead ? (language === 'en' ? "Read" : "Lu") : (language === 'en' ? "Sent" : "Envoyé")} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} className="chat-stream-bottom-anchor" style={{ height: 14, minHeight: 14, width: '100%' }} />
          </div>

          {/* Message Composer */}
          <form onSubmit={handleSendMessage} className="chat-composer-box">
            {/* Code Snippet Drawer */}
            {includeCode && (
              <div className="composer-code-input">
                <div className="composer-code-header">
                  <span>{language === 'en' ? 'Share source code snippet:' : 'Partager un snippet de code :'}</span>
                  <button 
                    type="button" 
                    className="text-xs text-dim hover:text-white"
                    onClick={() => setIncludeCode(false)}
                  >
                    {language === 'en' ? 'Cancel' : 'Annuler'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder={language === 'en' ? '// Paste your lines of code, configuration or data schema...' : '// Collez ici vos lignes de code, configuration ou modèle...'}
                  value={codeText}
                  onChange={e => setCodeText(e.target.value)}
                  className="font-mono"
                />
              </div>
            )}

            {/* Selected File Attachment Preview Chip */}
            {selectedFile && (
              <div className="composer-file-preview glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                  {selectedFile.type === 'image' && <ImageIcon size={16} className="text-cyan" />}
                  {selectedFile.type === 'video' && <FileVideo size={16} className="text-purple" />}
                  {selectedFile.type === 'pdf' && <FileText size={16} className="text-rose" />}
                  {selectedFile.type === 'document' && <FileIcon size={16} className="text-cyan" />}
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedFile.name}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                    ({selectedFile.size})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="icon-btn text-xs"
                  title={language === 'en' ? 'Remove attachment' : 'Retirer la pièce jointe'}
                  style={{ width: 22, height: 22 }}
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Voice Recording Live Bar (Compact, 100% responsive, never overflows) */}
            {isRecording ? (
              <div className="composer-voice-bar">
                {/* Cancel / Discard button (red trash) */}
                <button
                  type="button"
                  className="voice-action-btn voice-discard-btn"
                  onClick={cancelVoiceRecording}
                  title={language === 'en' ? "Discard voice recording" : "Annuler l'enregistrement"}
                  aria-label="Discard recording"
                >
                  <Trash2 size={16} />
                </button>

                {/* Live recording status, timer and waves */}
                <div className="voice-recording-info">
                  <span className="voice-record-dot" />
                  <span className="voice-timer font-mono">
                    {Math.floor(recordingSeconds / 60)}:{recordingSeconds % 60 < 10 ? '0' : ''}{recordingSeconds % 60}
                  </span>
                  <div className="voice-live-soundwave">
                    <span className="live-soundwave-bar b1" />
                    <span className="live-soundwave-bar b2" />
                    <span className="live-soundwave-bar b3" />
                    <span className="live-soundwave-bar b4" />
                    <span className="live-soundwave-bar b5" />
                    <span className="live-soundwave-bar b6" />
                  </div>
                </div>

                {/* Send voice button */}
                <button
                  type="button"
                  className="voice-action-btn voice-send-btn"
                  onClick={finishVoiceRecording}
                  title={language === 'en' ? "Send voice message" : "Envoyer le vocal"}
                  aria-label="Send voice message"
                >
                  <Send size={16} />
                </button>
              </div>
            ) : (
              <div className="composer-main-row">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  accept="*/*"
                />

                {/* Left Attachment Tools */}
                <div className="composer-tools-group">
                  <button 
                    type="button" 
                    className={`composer-tool-btn ${selectedFile ? 'active text-cyan' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    title={language === 'en' ? 'Attach file (PDF, image, video, doc)' : 'Joindre un fichier (PDF, image, vidéo, doc)'}
                    aria-label="Attach file"
                  >
                    <Paperclip size={18} />
                  </button>

                  <button 
                    type="button" 
                    className={`composer-tool-btn ${includeCode ? 'active text-cyan' : ''}`}
                    onClick={() => setIncludeCode(!includeCode)}
                    title={language === 'en' ? 'Attach code snippet' : 'Joindre un snippet de code'}
                    aria-label="Attach code snippet"
                  >
                    <Code2 size={18} />
                  </button>
                </div>

                {/* Capsule input auto-expansible pour voir le texte dans son intégralité */}
                <div className="composer-input-wrapper">
                  <textarea 
                    ref={textareaRef}
                    rows={1}
                    placeholder={t('messages.typePlaceholder', language === 'en' ? 'Write a message to your teammate...' : 'Écrire un message technique à votre collègue...')}
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="composer-textarea"
                  />
                </div>

                {/* Dynamic Action: Send if text/attachment present, Mic to record if empty */}
                {inputText.trim() || codeText.trim() || selectedFile ? (
                  <button 
                    type="submit" 
                    className="composer-action-btn composer-send-action-btn"
                    title={language === 'en' ? 'Send' : 'Envoyer'}
                    aria-label="Send"
                  >
                    <Send size={16} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="composer-action-btn composer-mic-action-btn"
                    onClick={startVoiceRecording}
                    title={language === 'en' ? 'Record voice message' : 'Enregistrer un vocal'}
                    aria-label="Record voice note"
                  >
                    <Mic size={18} />
                  </button>
                )}
              </div>
            )}
          </form>
        </section>
      ) : (
        <div className="no-chat-selected">
          <MessageSquare size={36} className="text-dim mb-3" />
          <p>{t('messages.newConv', 'Sélectionnez une conversation pour démarrer vos échanges techniques.')}</p>
        </div>
      )}
    </div>
  );
}
