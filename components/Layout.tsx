
import React from 'react';
import { ViewState, UserRole, User } from '../types';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
  onAddClick: () => void;
  currentUser: User | null;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children, onAddClick, currentUser }) => {
  
  const handleNavClick = (view: ViewState) => {
    setView(view);
  };

  // Define Nav Items with required Roles
  // If roles array is empty, everyone can see it
  const NAV_ITEMS = [
    { id: ViewState.Dashboard, icon: 'fa-tachometer-alt', label: 'Dashboard', roles: [] },
    { id: ViewState.Pigs, icon: 'fa-database', label: 'Pig Database', roles: ['Farm Manager', 'Herdsman', 'Veterinarian'] },
    { id: ViewState.Operations, icon: 'fa-clipboard-list', label: 'Tasks & Ops', roles: ['Farm Manager', 'Herdsman', 'Veterinarian', 'General Worker'] },
    { id: ViewState.Finance, icon: 'fa-chart-pie', label: 'Financials', roles: ['Farm Manager'] },
    { id: ViewState.AI_Tools, icon: 'fa-brain', label: 'Intelligent Core', roles: ['Farm Manager', 'Veterinarian'] },
    { id: ViewState.Settings, icon: 'fa-cog', label: 'Settings', roles: ['Farm Manager'] },
  ];

  const canAccess = (requiredRoles: string[]) => {
    if (!currentUser) return false;
    if (requiredRoles.length === 0) return true;
    return requiredRoles.includes(currentUser.role);
  };

  const visibleNavItems = NAV_ITEMS.filter(item => canAccess(item.roles));

  // Determine if FAB should be shown (Manager/Herdsman only)
  const showFab = currentUser && ['Farm Manager', 'Herdsman'].includes(currentUser.role);

  return (
    <div className="min-h-screen bg-grayBg flex flex-col md:flex-row">
      
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:flex w-64 bg-ecomattBlack text-white flex-col h-screen sticky top-0">
        {/* Brand */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-ecomattGreen">
                <i className="fas fa-leaf text-ecomattGreen text-lg"></i>
            </div>
            <div>
                <h1 className="text-lg font-bold tracking-tight">Ecomatt<span className="text-ecomattGreen">Farm</span></h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">PWA Console</p>
            </div>
        </div>

        {/* Desktop Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
            {visibleNavItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-bold transition-colors ${
                        currentView === item.id 
                        ? 'bg-ecomattGreen text-black' 
                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                    }`}
                >
                    <i className={`fas ${item.icon} w-5 text-center`}></i> {item.label}
                </button>
            ))}
        </nav>

        {/* User Profile Small */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {currentUser ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold truncate">{currentUser?.name}</p>
                    <p className="text-[10px] text-ecomattGreen">● {currentUser?.role}</p>
                </div>
                <i 
                    className="fas fa-sign-out-alt text-gray-500 hover:text-white cursor-pointer"
                    onClick={() => setView(ViewState.Settings)} // Redirect to settings to logout or create handler
                ></i>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen md:p-0 pb-24 md:pb-0 relative">
        <div className="h-full w-full bg-grayBg overflow-y-auto no-scrollbar pt-8 px-4 pb-20 relative max-w-2xl mx-auto md:max-w-none md:p-8">
            {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 width-full w-full bg-white border-t border-gray-200 p-3 pb-6 px-6 flex justify-between items-end z-40 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
        
        {/* Render only first 2 items on left */}
        {visibleNavItems.slice(0, 2).map(item => (
             <button 
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center gap-1 w-16 ${currentView === item.id ? 'text-ecomattGreen' : 'text-gray-400'}`}
            >
                <i className={`fas ${item.icon} text-xl`}></i>
            </button>
        ))}

        {/* FAB (Center) - Conditional */}
        <div className="relative w-14">
            {showFab && (
                <button 
                    onClick={onAddClick}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-14 bg-ecomattGreen rounded-full border-4 border-white flex items-center justify-center shadow-lg text-white text-2xl transform active:scale-95 transition-transform"
                >
                    <i className="fas fa-plus"></i>
                </button>
            )}
        </div>

        {/* Render next 2 items on right */}
        {visibleNavItems.slice(2, 4).map(item => (
             <button 
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center gap-1 w-16 ${currentView === item.id ? 'text-ecomattGreen' : 'text-gray-400'}`}
            >
                <i className={`fas ${item.icon} text-xl`}></i>
            </button>
        ))}

      </div>

    </div>
  );
};

export default Layout;
