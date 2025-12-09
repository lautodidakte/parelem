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
import { OnboardingWalkthrough } from './components/OnboardingWalkthrough';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Role } from './types';
import { syncTransactions } from './services/offlineService';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactElement, allowedRole: Role }> = ({ children, allowedRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    // Redirect logic if role mismatch
    if (user.role === 'TREASURER') return <Navigate to="/dashboard" replace />;
    if (user.role === 'SUPERVISOR') return <Navigate to="/supervisor" replace />;
    if (user.role === 'MEMBER') return <Navigate to="/member" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route wrapper - FORCE ONBOARDING TO SHOW (ignoring previous state for demo)
const RootRoute: React.FC = () => {
    // Note: Pour la démo, on force l'affichage de l'onboarding à chaque fois
    // Dans une vraie app, on décommenterait la logique de localStorage
    // const hasSeenOnboarding = localStorage.getItem('mon_pare_onboarding_completed');
    // if (hasSeenOnboarding) return <Navigate to="/login" replace />;
    
    return <OnboardingWalkthrough />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root now explicitly renders Onboarding */}
      <Route path="/" element={<RootRoute />} />
      
      {/* Login Page exists but is not the default */}
      <Route path="/login" element={<LoginPage />} />

      {/* Treasurer Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole="TREASURER">
          <AppLayout role="TREASURER" />
        </ProtectedRoute>
      }>
        <Route index element={<OperationalDashboard />} />
        <Route path="members" element={<MembersList />} />
        <Route path="cycles" element={<TontineManager />} />
        <Route path="debts" element={<DebtsManager />} />
      </Route>

      {/* Supervisor Routes */}
      <Route path="/supervisor" element={
        <ProtectedRoute allowedRole="SUPERVISOR">
          <AppLayout role="SUPERVISOR" />
        </ProtectedRoute>
      }>
         <Route index element={<ImpactDashboard />} />
         <Route path="cohorts" element={<CohortsTracker />} />
      </Route>

      {/* Member Routes */}
      <Route path="/member" element={
        <ProtectedRoute allowedRole="MEMBER">
          <AppLayout role="MEMBER" />
        </ProtectedRoute>
      }>
         <Route index element={<MemberDashboard />} />
         <Route path="wallet" element={<WalletPage />} />
         <Route path="tontine" element={<TontineManager />} /> 
         <Route path="notifications" element={<div className="p-4 text-center text-gray-500">Aucune notification</div>} />
         <Route path="profile" element={<div className="p-4 text-center text-gray-500">Profil Utilisateur</div>} />
      </Route>
      
      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline' | 'syncing' | 'synced'>('online');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // For development: clear the onboarding flag so it shows up on reload
    localStorage.removeItem('mon_pare_onboarding_completed');

    if (!navigator.onLine) {
      setSyncStatus('offline');
      setShowToast(true);
    }

    const handleOnline = () => {
      setSyncStatus('syncing');
      setShowToast(true);

      syncTransactions(async (transaction) => {
        console.log(`Syncing transaction ${transaction.id} to backend...`);
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
      <HashRouter>
        <AppRoutes />
        
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0 pointer-events-none'}`}>
          <div className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-xl border font-medium text-sm ${
            syncStatus === 'offline' ? 'bg-gray-900 text-white border-gray-700' :
            syncStatus === 'syncing' ? 'bg-blue-600 text-white border-blue-500' :
            syncStatus === 'synced' ? 'bg-green-600 text-white border-green-500' :
            'bg-white text-gray-800'
          }`}>
            {syncStatus === 'offline' && (
              <>
                <WifiOff size={18} className="text-red-400" />
                <span>Mode Hors-ligne</span>
              </>
            )}
            {syncStatus === 'syncing' && (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Synchronisation...</span>
              </>
            )}
            {syncStatus === 'synced' && (
              <>
                <CheckCircle2 size={18} />
                <span>Données synchronisées</span>
              </>
            )}
             {syncStatus === 'online' && !showToast && (
              <>
                <Wifi size={18} />
                <span>En ligne</span>
              </>
            )}
          </div>
        </div>

      </HashRouter>
    </AuthProvider>
  );
};

export default App;