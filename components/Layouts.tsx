
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, PieChart, LogOut, FileText, UserCircle, Home, Wallet, Bell, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTontines } from '../contexts/TontinesContext';
import { Role } from '../types';
import { CreateTontineDialog } from './CreateTontineDialog';

interface LayoutProps {
  role: Role;
}

export const AppLayout: React.FC<LayoutProps> = ({ role }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { tontines, addTontine } = useTontines();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Desktop Sidebar Items
  let desktopNavItems = [];
  if (role === 'TREASURER') {
    desktopNavItems = [
      { icon: LayoutDashboard, label: 'Tableau de Bord', to: '/dashboard' },
      { icon: FileText, label: 'Cycle Tontine', to: '/dashboard/cycles' },
      { icon: Users, label: 'Membres', to: '/dashboard/members' },
    ];
  } else if (role === 'SUPERVISOR') {
    desktopNavItems = [
      { icon: PieChart, label: 'Impact', to: '/supervisor' },
      { icon: Users, label: 'Cohortes', to: '/supervisor/cohorts' },
    ];
  } else {
    desktopNavItems = [
      { icon: Home, label: 'Accueil', to: '/member' },
      { icon: Wallet, label: 'Mon Wallet', to: '/member/wallet' },
      { icon: UserCircle, label: 'Mon Profil', to: '/member/profile' },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* Sidebar - Desktop Only */}
      <aside className={`
        hidden md:flex flex-col w-72 h-screen sticky top-0
        bg-white border-r border-gray-100 z-50
      `}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">P</div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading tracking-tight">Parelem</h1>
        </div>

        <div className="px-8 mb-4">
             <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                     {user?.displayName.charAt(0)}
                 </div>
                 <div className="overflow-hidden">
                     <p className="text-sm font-bold truncate">{user?.displayName}</p>
                     <p className="text-xs text-gray-500 truncate capitalize">
                       {role === 'MEMBER' ? 'Membre' : role === 'TREASURER' ? 'Trésorier' : 'Superviseur'}
                     </p>
                 </div>
             </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/member' || item.to === '/dashboard' || item.to === '/supervisor'} 
              className={({ isActive }) => `
                flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group font-medium
                ${isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={22} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-gray-50">
            <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 w-full text-left group">
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium text-sm">Déconnexion</span>
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative bg-[#F8FAFC] pb-24 md:pb-0">
         <div className="p-4 md:p-8 max-w-md mx-auto md:max-w-6xl w-full">
            <Outlet />
         </div>
      </main>

      {/* Mobile Bottom Navigation - Only for MEMBERS */}
      {role === 'MEMBER' && (
        <>
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-6 z-50 flex justify-between items-end safe-bottom">
              {/* Left Items */}
              <div className="flex gap-8">
                 <NavLink to="/member" end className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {({ isActive }) => (
                      <>
                        <Home size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">Accueil</span>
                      </>
                    )}
                 </NavLink>
                 <NavLink to="/member/wallet" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {({ isActive }) => (
                      <>
                        <Wallet size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">Wallet</span>
                      </>
                    )}
                 </NavLink>
              </div>

              {/* Floating Action Button */}
              <div className="relative -top-8">
                  <button 
                    onClick={() => setIsCreateOpen(true)}
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 active:scale-95 transition-transform"
                  >
                      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primaryDark transition-colors">
                          <Plus size={24} />
                      </div>
                  </button>
              </div>

              {/* Right Items */}
              <div className="flex gap-8">
                 <NavLink to="/member/notifications" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {({ isActive }) => (
                      <>
                        <div className="relative">
                          <Bell size={24} strokeWidth={isActive ? 2.5 : 2} />
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white text-[9px] flex items-center justify-center rounded-full font-bold">1</span>
                        </div>
                        <span className="text-[10px] font-medium">Notific...</span>
                      </>
                    )}
                 </NavLink>
                 <NavLink to="/member/profile" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                    {({ isActive }) => (
                      <>
                        <UserCircle size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">Compte</span>
                      </>
                    )}
                 </NavLink>
              </div>
          </div>
          <CreateTontineDialog 
            isOpen={isCreateOpen} 
            onClose={() => setIsCreateOpen(false)} 
            onTontineCreated={addTontine}
          />
        </>
      )}
    </div>
  );
};
