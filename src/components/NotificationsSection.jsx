import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  UserPlus, 
  FolderGit2, 
  Heart, 
  Briefcase, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  Filter
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { getNotifications, markNotificationsAsRead } from '../services/followService';

export function NotificationsSection({ onSelectTab, onSelectDeveloper }) {
  const { t, language } = useTranslation();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [notifs, setNotifs] = useState(() => getNotifications());

  const refreshNotifs = () => {
    setNotifs(getNotifications());
  };

  useEffect(() => {
    const handleUpdate = () => refreshNotifs();
    window.addEventListener('afrikdev_notifications_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('afrikdev_notifications_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleMarkAll = () => {
    markNotificationsAsRead();
    refreshNotifs();
  };

  const unreadCount = notifs.filter(n => !n.is_read).length;

  const filteredNotifs = notifs.filter(n => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case 'follow':
        return <UserPlus size={16} className="text-cyan" />;
      case 'project':
        return <FolderGit2 size={16} className="text-amber" />;
      case 'like':
        return <Heart size={16} className="text-rose" />;
      case 'job':
        return <Briefcase size={16} className="text-emerald-400" />;
      case 'message':
        return <MessageSquare size={16} className="text-blue-400" />;
      default:
        return <Sparkles size={16} className="text-cyan" />;
    }
  };

  return (
    <div className="notifications-page-container">
      {/* Top Header */}
      <div className="notifs-page-header glass-card">
        <div className="notifs-header-left">
          <div className="notifs-icon-bubble">
            <Bell size={22} className="text-cyan" />
          </div>
          <div>
            <h1 className="notifs-page-title">
              {language === 'en' ? 'Notifications' : 'Notifications'}
            </h1>
            <p className="notifs-page-subtitle">
              {language === 'en'
                ? `Stay updated on your network and interactions (${unreadCount} unread)`
                : `Restez informé des interactions de votre réseau (${unreadCount} non lue${unreadCount > 1 ? 's' : ''})`}
            </p>
          </div>
        </div>

        <div className="notifs-header-actions">
          {unreadCount > 0 && (
            <button
              type="button"
              className="btn-secondary btn-sm notifs-mark-read-btn"
              onClick={handleMarkAll}
            >
              <CheckCheck size={15} className="text-cyan" />
              <span>{language === 'en' ? 'Mark all as read' : 'Tout marquer lu'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="notifs-filter-bar">
        <button
          type="button"
          className={`notifs-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          <span>{language === 'en' ? 'All' : 'Toutes'}</span>
          <span className="notifs-filter-badge">{notifs.length}</span>
        </button>

        <button
          type="button"
          className={`notifs-filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          <span>{language === 'en' ? 'Unread' : 'Non lues'}</span>
          {unreadCount > 0 && (
            <span className="notifs-filter-badge unread">{unreadCount}</span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifs-items-container">
        {filteredNotifs.length === 0 ? (
          <div className="notifs-empty-card glass-card">
            <Bell size={36} className="text-dim mb-3" />
            <h3 className="text-base font-bold text-[var(--text-main)] mb-1">
              {filter === 'unread'
                ? (language === 'en' ? 'No unread notifications' : 'Aucune notification non lue')
                : (language === 'en' ? 'No notifications yet' : 'Aucune notification pour le moment')}
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm">
              {language === 'en'
                ? 'When someone follows you, comments on your code or posts an opportunity, it will appear here.'
                : 'Lorsque quelqu\'un vous suit, commente votre code ou publie une offre, vous le verrez ici.'}
            </p>
          </div>
        ) : (
          filteredNotifs.map((n) => {
            const isUnread = !n.is_read;
            return (
              <div
                key={n.id}
                className={`notif-card glass-card ${isUnread ? 'unread' : ''}`}
                onClick={() => {
                  if (n.notif_type === 'message' && onSelectTab) onSelectTab('messages');
                  else if (n.notif_type === 'project' && onSelectTab) onSelectTab('projects');
                  else if (n.notif_type === 'job' && onSelectTab) onSelectTab('opportunities');
                  else if (n.notif_type === 'follow' && n.actor_name && onSelectDeveloper) {
                    onSelectDeveloper(n.actor_name);
                  }
                }}
              >
                {/* Left Actor / Icon */}
                <div className="notif-card-avatar-wrap">
                  {n.actor_avatar ? (
                    <img
                      src={n.actor_avatar}
                      alt={n.actor_name || 'Utilisateur'}
                      className="notif-card-avatar"
                    />
                  ) : (
                    <div className="notif-fallback-icon">
                      {getNotifIcon(n.notif_type)}
                    </div>
                  )}
                  <span className="notif-badge-sub-icon">
                    {getNotifIcon(n.notif_type)}
                  </span>
                </div>

                {/* Content */}
                <div className="notif-card-content">
                  <div className="notif-card-title-row">
                    <h4 className="notif-card-title">
                      {n.title || n.message}
                    </h4>
                    <span className="notif-card-time flex items-center gap-1">
                      <Clock size={11} />
                      <span>{n.time || (language === 'en' ? 'Recently' : 'Récemment')}</span>
                    </span>
                  </div>

                  {n.message && n.message !== n.title && (
                    <p className="notif-card-desc">
                      {n.message}
                    </p>
                  )}
                </div>

                {/* Unread dot */}
                {isUnread && <span className="notif-card-unread-dot" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
