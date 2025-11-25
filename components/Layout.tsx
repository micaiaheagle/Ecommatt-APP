
import React from 'react';
import { ViewState, UserRole, User } from '../types';
import QuickCreateMenu from './QuickCreateMenu';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
  onAddClick: () => void; // Fallback for mobile FAB
  onQuickAction: (action: string) => void;
  currentUser: User | null;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children, onAddClick, onQuickAction, currentUser }) => {
  
  const handleNavClick = (view: ViewState) => {
    setView(view);
  };

  // Define Nav Items with required Roles
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

  return (
    <div className="min-h-screen bg-grayBg flex flex-col md:flex-row">
      
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden md:flex w-64 bg-ecomattBlack text-white flex-col h-screen sticky top-0 z-30">
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
                    onClick={() => setView(ViewState.Settings)} 
                ></i>
            </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Global Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-20">
           {/* Mobile Brand / Breadcrumb */}
           <div className="flex items-center gap-3 md:hidden">
              <div className="w-8 h-8 bg-ecomattBlack rounded-full flex items-center justify-center border border-ecomattGreen">
                  <i className="fas fa-leaf text-ecomattGreen text-xs"></i>
              </div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">Ecomatt</h1>
           </div>

           {/* Desktop Breadcrumb */}
           <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span className="text-gray-400">{currentUser?.role || 'User'}</span>
              <span>/</span>
              <span className="text-gray-900 font-bold">{currentView}</span>
           </div>

           {/* Right Actions */}
           <div className="flex items-center gap-4">
              {/* Quick Create Menu */}
              <QuickCreateMenu onAction={onQuickAction} />

              <button className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-ecomattGreen relative">
                  <i className="fas fa-bell"></i>
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {/* Mobile User Avatar */}
              <div className="md:hidden w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {currentUser ? currentUser.name.charAt(0) : 'U'}
              </div>
           </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto relative bg-grayBg">
          <div className="h-full w-full pt-8 px-4 pb-24 md:pb-8 md:px-8 max-w-7xl mx-auto">
              {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 width-full w-full bg-white border-t border-gray-200 p-3 pb-6 px-6 flex justify-between items-end z-40 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
        
        {visibleNavItems.slice(0, 2).map(item => (
             <button 
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center gap-1 w-16 ${currentView === item.id ? 'text-ecomattGreen' : 'text-gray-400'}`}
            >
                <i className={`fas ${item.icon} text-xl`}></i>
            </button>
        ))}

        {/* Replaced FAB with spacer since we have header button now, or keep as shortcut to main action */}
        <div className="relative w-14 h-14 flex items-center justify-center -mb-4">
            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
        </div>

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
