import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function DrawerOverlay({ onClose }) {
  return (
    <motion.div
      className="drawer-overlay fixed inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      aria-hidden
    />
  );
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'md',
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const widthClass = width === 'lg' ? 'max-w-lg' : 'max-w-md';

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <DrawerOverlay onClose={onClose} />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 380 }}
            className={`drawer-panel fixed inset-y-0 right-0 flex w-full ${widthClass} flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="drawer-header flex shrink-0 items-center justify-between gap-4 px-6 py-5">
              <div>
                {subtitle && (
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
                    {subtitle}
                  </p>
                )}
                <h2 id="drawer-title" className="text-xl font-semibold tracking-tight text-ink">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="drawer-close-btn"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>

            {footer && <footer className="drawer-footer shrink-0 px-6 py-4">{footer}</footer>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
