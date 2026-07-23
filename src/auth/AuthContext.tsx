import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  fetchAdminMe,
  loginAdmin,
  resendAdmin2fa,
  verifyAdmin2fa,
  type Admin,
} from '../api/admin';
import {
  ApiError,
  getChallengeSession,
  getRememberPreference,
  getStoredToken,
  setChallengeSession,
  setRememberPreference,
  setStoredToken,
} from '../api/client';

type AuthContextValue = {
  admin: Admin | null;
  loading: boolean;
  startLogin: (
    email: string,
    password: string,
    remember: boolean,
  ) => Promise<{email: string; debugOtp?: string}>;
  completeLogin: (otp: string) => Promise<void>;
  resendLoginOtp: () => Promise<{debugOtp?: string}>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}: {children: ReactNode}) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }
    try {
      const data = await fetchAdminMe();
      setAdmin(data.admin);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setStoredToken(null);
      }
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const startLogin = useCallback(
    async (email: string, password: string, remember: boolean) => {
      const data = await loginAdmin(email, password);
      setRememberPreference(remember);
      setChallengeSession({
        challengeToken: data.challengeToken,
        email: data.email,
        remember,
        debugOtp: data.debugOtp,
      });
      return {email: data.email, debugOtp: data.debugOtp};
    },
    [],
  );

  const completeLogin = useCallback(async (otp: string) => {
    const challenge = getChallengeSession();
    if (!challenge?.challengeToken) {
      throw new ApiError('Login session expired. Please sign in again.', 401);
    }
    const data = await verifyAdmin2fa(challenge.challengeToken, otp);
    const remember =
      challenge.remember ?? getRememberPreference();
    setStoredToken(data.token, remember);
    setChallengeSession(null);
    setAdmin(data.admin);
  }, []);

  const resendLoginOtp = useCallback(async () => {
    const challenge = getChallengeSession();
    if (!challenge?.challengeToken) {
      throw new ApiError('Login session expired. Please sign in again.', 401);
    }
    const data = await resendAdmin2fa(challenge.challengeToken);
    setChallengeSession({
      ...challenge,
      debugOtp: data.debugOtp,
    });
    return {debugOtp: data.debugOtp};
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setChallengeSession(null);
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      loading,
      startLogin,
      completeLogin,
      resendLoginOtp,
      logout,
      refresh,
    }),
    [admin, loading, startLogin, completeLogin, resendLoginOtp, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
