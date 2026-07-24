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
import {FranchisesPage} from './pages/Franchise/FranchisesPage';
import {CreateFranchisePage} from './pages/Franchise/CreateFranchisePage';
import {FranchiseDetailPage} from './pages/Franchise/FranchiseDetailPage';
import {TicketsPage} from './pages/Tickets/TicketsPage';
import {TransactionsPage} from './pages/Transactions/TransactionsPage';
import {TransactionDetailPage} from './pages/Transactions/TransactionDetailPage';
import {WithdrawalsPage} from './pages/Withdrawals/WithdrawalsPage';
import {WithdrawalDetailPage} from './pages/Withdrawals/WithdrawalDetailPage';
import {VipAnalyticsPage} from './pages/Vip/VipAnalyticsPage';
import {VipPlansPage} from './pages/Vip/VipPlansPage';
import {VipUsersPage} from './pages/Vip/VipUsersPage';
import {VipUserDetailPage} from './pages/Vip/VipUserDetailPage';
import {AnalyticsRoute} from './pages/Analytics/AnalyticsRoute';
import {SettingsOverviewPage} from './pages/Settings/SettingsOverviewPage';
import {SettingsWalletPage} from './pages/Settings/SettingsWalletPage';
import {SettingsProfilePage} from './pages/Settings/SettingsProfilePage';
import {SettingsSecurityPage} from './pages/Settings/SettingsSecurityPage';
import {SettingsHelpPage} from './pages/Settings/SettingsHelpPage';
import {BankDetailsPage} from './pages/Settings/BankDetailsPage';
import {BankVerifyPage} from './pages/Settings/BankVerifyPage';
import {BankOtpPage} from './pages/Settings/BankOtpPage';
import {BankUpdatePage} from './pages/Settings/BankUpdatePage';
import {BankReviewPage} from './pages/Settings/BankReviewPage';
import {BankSuccessPage} from './pages/Settings/BankSuccessPage';
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
  return <Navigate to={`/receivers/${receiverId}/kyc?from=verification`} replace />;
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
            path="/franchise"
            element={
              <ProtectedRoute>
                <FranchisesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/franchise/create"
            element={
              <ProtectedRoute>
                <CreateFranchisePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/franchise/:franchiseId"
            element={
              <ProtectedRoute>
                <FranchiseDetailPage />
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
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/:transactionId"
            element={
              <ProtectedRoute>
                <TransactionDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/withdrawals"
            element={
              <ProtectedRoute>
                <WithdrawalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/withdrawals/:withdrawalId"
            element={
              <ProtectedRoute>
                <WithdrawalDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vip"
            element={
              <ProtectedRoute>
                <VipAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vip/plans"
            element={
              <ProtectedRoute>
                <VipPlansPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vip/users"
            element={
              <ProtectedRoute>
                <VipUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vip/users/:userId"
            element={
              <ProtectedRoute>
                <VipUserDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics/:tab"
            element={
              <ProtectedRoute>
                <AnalyticsRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/wallet"
            element={
              <ProtectedRoute>
                <SettingsWalletPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/profile"
            element={
              <ProtectedRoute>
                <SettingsProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/security"
            element={
              <ProtectedRoute>
                <SettingsSecurityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/help"
            element={
              <ProtectedRoute>
                <SettingsHelpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/bank"
            element={
              <ProtectedRoute>
                <BankDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/bank/verify"
            element={
              <ProtectedRoute>
                <BankVerifyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/bank/otp"
            element={
              <ProtectedRoute>
                <BankOtpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/bank/update"
            element={
              <ProtectedRoute>
                <BankUpdatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/bank/review"
            element={
              <ProtectedRoute>
                <BankReviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/bank/success"
            element={
              <ProtectedRoute>
                <BankSuccessPage />
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
