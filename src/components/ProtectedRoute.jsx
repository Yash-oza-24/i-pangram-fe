import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedRoute({ children }) {
  const token = useSelector((s) => s.auth.token);
  const status = useSelector((s) => s.auth.status);

  if (!token) return <Navigate to="/login" replace />;
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-muted">
        Loading…
      </div>
    );
  }
  return children;
}
