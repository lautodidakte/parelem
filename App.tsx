
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/Layouts';
import { OperationalDashboard } from './components/OperationalDashboard';
import { ImpactDashboard } from './components/ImpactDashboard';
import { TontineManager } from './components/TontineManager';
import { MembersList } from './components/MembersList';
import { CohortsTracker } from './components/CohortsTracker';
import { DebtsManager } from './components/DebtsManager';
import { MemberDashboard } from './components/MemberDashboard';
import { WalletPage } from './components/WalletPage';
import { LoginPage } from './components/LoginPage';
import { ForgotPassword } from './components/ForgotPassword';
import { ProfilePage } from './components/ProfilePage';
import { OnboardingWalkthrough } from './components/OnboardingWalkthrough';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TontinesProvider } from './contexts/TontinesContext';
import { Role } from './types';
import { syncTransactions } from './services/offlineService';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactElement, allowedRole: Role }> = ({ children, allowedRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    if (user.role === 'TREASURER') return <Navigate to="/dashboard" replace />;
    if (user.role === 'SUPERVISOR') return <Navigate to="/supervisor" replace />;
    if (user.role === 'MEMBER') return <Navigate to="/member" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RootRoute: React.FC = () => {
    const { user, isLoading } = useAuth();
    const hasSeenOnboarding = localStorage.getItem('monpare_onboarding_completed');

    if (isLoading) return null;

    if (user) {
        if (user.role === 'TREASURER') return <Navigate to="/dashboard" replace />;
        if (user.role === 'SUPERVISOR') return <Navigate to="/supervisor" replace />;
        if (user.role === 'MEMBER') return <Navigate to="/member" replace />;
    }

    if (hasSeenOnboarding === 'true') {
        return <Navigate to="/login" replace />;
    }
    
    return <OnboardingWalkthrough />;
};

const App: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing' | 'synced'>('online');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!navigator.onLine) {
      setSyncStatus('offline');
      setShowToast(true);
    }

    const handleOnline = () => {
      setSyncStatus('syncing');
      setShowToast(true);
      syncTransactions(async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
      }).then(() => {
        setSyncStatus('synced');
        setTimeout(() => {
          setShowToast(false);
          setTimeout(() => setSyncStatus('online'), 500); 
        }, 3000);
      });
    };

    const handleOffline = () => {
      setSyncStatus('offline');
      setShowToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AuthProvider>
      <TontinesProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/login" element={<LoginPage initialView="LOGIN_EMAIL" />} />
            <Route path="/signup" element={<LoginPage initialView="REGISTER" registrationLevel="A" />} />
            <Route path="/signup-parrainage" element={<LoginPage initialView="REGISTER" registrationLevel="B" />} />
            <Route path="/otp-verification" element={<LoginPage initialView="OTP" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/dashboard" element={<ProtectedRoute allowedRole="TREASURER"><AppLayout role="TREASURER" /></ProtectedRoute>}>
              <Route index element={<OperationalDashboard />} />
              <Route path="members" element={<MembersList />} />
              <Route path="cycles" element={<TontineManager />} />
              <Route path="debts" element={<DebtsManager />} />
            </Route>

            <Route path="/supervisor" element={<ProtectedRoute allowedRole="SUPERVISOR"><AppLayout role="SUPERVISOR" /></ProtectedRoute>}>
              <Route index element={<ImpactDashboard />} />
              <Route path="cohorts" element={<CohortsTracker />} />
            </Route>

            <Route path="/member" element={<ProtectedRoute allowedRole="MEMBER"><AppLayout role="MEMBER" /></ProtectedRoute>}>
              <Route index element={<MemberDashboard />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="tontine/:tontineId" element={<TontineManager />} /> 
              <Route path="notifications" element={<div className="p-4 text-center text-gray-500 pt-20">Aucune notification</div>} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0 pointer-events-none'}`}>
            <div className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-xl border font-medium text-sm ${
              syncStatus === 'offline' ? 'bg-gray-900 text-white border-gray-700' :
              syncStatus === 'syncing' ? 'bg-primary text-white border-primaryDark' :
              syncStatus === 'synced' ? 'bg-green-600 text-white border-green-500' :
              'bg-white text-gray-800'
            }`}>
              {syncStatus === 'offline' && <><WifiOff size={18} className="text-red-400" /><span>Mode Hors-ligne</span></>}
              {syncStatus === 'syncing' && <><RefreshCw size={18} className="animate-spin" /><span>Synchronisation...</span></>}
              {syncStatus === 'synced' && <><CheckCircle2 size={18} /><span>Données synchronisées</span></>}
            </div>
          </div>
        </HashRouter>
      </TontinesProvider>
    </AuthProvider>
  );
};

export default App;
