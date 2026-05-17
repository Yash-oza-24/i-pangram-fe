import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { toggleTheme } from '../../store/uiSlice.js';
import { logout } from '../../store/authSlice.js';
import { togglePanel } from '../../store/notificationsSlice.js';
import { Avatar } from '../ui/Avatar.jsx';
import { Button } from '../ui/Button.jsx';
import { NotificationPanel } from '../notifications/NotificationPanel.jsx';

export function AppShell() {
  const user = useSelector((s) => s.auth.user);
  const theme = useSelector((s) => s.ui.theme);
  const unread = useSelector((s) => s.notifications.unreadCount);
  const syncStatus = useSelector((s) => s.tasks.syncStatus);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-surface-border bg-surface-raised/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm text-white">
              CT
            </span>
            <span className="hidden sm:inline">Collab Tasks</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {syncStatus === 'syncing' && (
              <span className="text-xs text-ink-muted">Syncing…</span>
            )}
            {!navigator.onLine && (
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                Offline
              </span>
            )}

            <button
              type="button"
              onClick={() => dispatch(togglePanel())}
              className="relative rounded-lg p-2 hover:bg-surface-border/40"
              aria-label="Notifications"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unread > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => dispatch(toggleTheme())}
              className="rounded-lg p-2 hover:bg-surface-border/40"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <div className="hidden items-center gap-2 sm:flex">
              <Avatar name={user?.name} color={user?.avatarColor} size="sm" />
              <span className="text-sm text-ink-muted">{user?.name}</span>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <AnimatePresence>
        <NotificationPanel />
      </AnimatePresence>
    </div>
  );
}
