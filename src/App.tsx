import type {ReactNode} from 'react';
import {BrowserRouter, Navigate, Route, Routes, useParams} from 'react-router-dom';
import {AuthProvider, useAuth} from './auth/AuthContext';
import {LoginPage} from './pages/Login/LoginPage';
import {ResetPasswordPage} from './pages/ResetPassword/ResetPasswordPage';
import {TwoFactorPage} from './pages/TwoFactor/TwoFactorPage';
import {DashboardPage} from './pages/Dashboard/DashboardPage';
import {CallersPage} from './pages/Callers/CallersPage';
import {CallerProfilePage} from './pages/Callers/CallerProfilePage';
import {ReceiversPage} from './pages/Receivers/ReceiversPage';
import {ReceiverProfilePage} from './pages/Receivers/ReceiverProfilePage';
import {ReceiverKycPage} from './pages/Receivers/ReceiverKycPage';
import {AgentsPage} from './pages/Agents/AgentsPage';
import {AgentProfilePage} from './pages/Agents/AgentProfilePage';
import {VerificationPage} from './pages/Verification/VerificationPage';
import {ApprovalSuccessPage} from './pages/Verification/ApprovalSuccessPage';
import {ComingSoonPage} from './pages/ComingSoon/ComingSoonPage';
import {adminNavItems} from './config/nav';

function ProtectedRoute({children}: {children: ReactNode}) {
  const {admin, loading} = useAuth();
  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'grid', placeItems: 'center'}}>
        Loading…
      </div>
    );
  }
  if (!admin) return <Navigate to="/login" replace />;
  return children;
}

function VerificationReviewRedirect() {
  const {receiverId = ''} = useParams();
  return <Navigate to={`/receivers/${receiverId}/kyc`} replace />;
}

export default function App() {
  const upcoming = adminNavItems.filter(item => !item.ready);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/two-factor" element={<TwoFactorPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/callers"
            element={
              <ProtectedRoute>
                <CallersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/callers/:callerId"
            element={
              <ProtectedRoute>
                <CallerProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receivers"
            element={
              <ProtectedRoute>
                <ReceiversPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receivers/:receiverId"
            element={
              <ProtectedRoute>
                <ReceiverProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receivers/:receiverId/kyc"
            element={
              <ProtectedRoute>
                <ReceiverKycPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receivers/:receiverId/approved"
            element={
              <ProtectedRoute>
                <ApprovalSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <AgentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents/:agentId"
            element={
              <ProtectedRoute>
                <AgentProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification"
            element={
              <ProtectedRoute>
                <VerificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification/:receiverId/approved"
            element={
              <ProtectedRoute>
                <ApprovalSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification/:receiverId"
            element={
              <ProtectedRoute>
                <VerificationReviewRedirect />
              </ProtectedRoute>
            }
          />
          {upcoming.map(item => (
            <Route
              key={item.id}
              path={item.to}
              element={
                <ProtectedRoute>
                  <ComingSoonPage title={item.label} />
                </ProtectedRoute>
              }
            />
          ))}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
