import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../../api/notifications.js';
import { markAllRead, markRead, setPanelOpen } from '../../store/notificationsSlice.js';
import { Button } from '../ui/Button.jsx';
import { DrawerOverlay } from '../ui/Drawer.jsx';

export function NotificationPanel() {
  const open = useSelector((s) => s.notifications.open);
  const items = useSelector((s) => s.notifications.items);
  const dispatch = useDispatch();
  const qc = useQueryClient();

  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      dispatch(markAllRead());
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const close = () => dispatch(setPanelOpen(false));

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <DrawerOverlay onClose={close} />
      <motion.aside
        className="drawer-panel fixed right-0 top-0 z-[101] flex h-full w-full max-w-md flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      >
        <header className="drawer-header flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="flex gap-2">
            {items.some((n) => !n.read) && (
              <Button variant="ghost" size="sm" onClick={() => markAll.mutate()}>
                Mark all read
              </Button>
            )}
            <button type="button" className="drawer-close-btn" onClick={close} aria-label="Close">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <ul className="flex-1 overflow-y-auto p-3">
          {items.length === 0 ? (
            <li className="p-6 text-center text-sm text-ink-muted">Nothing new yet</li>
          ) : (
            items.map((n) => (
              <li
                key={n.id}
                className={`mb-2 cursor-pointer rounded-lg border border-surface-border p-3 transition-colors hover:bg-surface ${!n.read ? 'bg-accent/5' : 'bg-surface-raised'}`}
                onClick={() => {
                  if (!n.read) {
                    notificationsApi.markRead(n.id);
                    dispatch(markRead(n.id));
                  }
                }}
              >
                <p className="text-sm font-medium">{n.title}</p>
                {n.body && <p className="mt-1 text-xs text-ink-muted">{n.body}</p>}
                <time className="mt-2 block text-[10px] text-ink-muted">
                  {new Date(n.createdAt).toLocaleString()}
                </time>
              </li>
            ))
          )}
        </ul>
      </motion.aside>
    </AnimatePresence>,
    document.body
  );
}
