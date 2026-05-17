import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from './api/auth.js';
import { setUser, setAuthStatus, logout } from './store/authSlice.js';
import { initTheme } from './store/uiSlice.js';
import { AppShell } from './components/layout/AppShell.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';

function AuthBootstrap({ children }) {
  const token = useSelector((s) => s.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initTheme());
  }, [dispatch]);

  useEffect(() => {
    if (!token) {
      dispatch(setAuthStatus('idle'));
      return;
    }

    let cancelled = false;
    dispatch(setAuthStatus('loading'));

    authApi
      .me()
      .then(({ user }) => {
        if (!cancelled) {
          dispatch(setUser(user));
          dispatch(setAuthStatus('authenticated'));
        }
      })
      .catch(() => {
        if (!cancelled) dispatch(logout());
      });

    return () => {
      cancelled = true;
    };
  }, [token, dispatch]);

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthBootstrap>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthBootstrap>
    </BrowserRouter>
  );
}
