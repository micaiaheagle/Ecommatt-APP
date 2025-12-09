
import React, { useState, useRef, useEffect } from 'react';
import { ViewState, UserRole, User } from '../types';
import QuickCreateMenu from './QuickCreateMenu';
import MobileNav from './MobileNav';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
  onAddClick: () => void; // Fallback for mobile FAB
  onQuickAction: (action: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  currentView,
  setView,
  children,
  onAddClick,
  onQuickAction,
  currentUser,
  onLogout,
  showBack = false,
  onBack
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (view: ViewState) => {
    setView(view);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Define Nav Items with required Roles
  const NAV_ITEMS = [
    { id: ViewState.Dashboard, icon: 'fa-tachometer-alt', label: 'Dashboard', roles: [] },
    { id: ViewState.Pigs, icon: 'fa-database', label: 'Pig Database', roles: ['Farm Manager', 'Herdsman', 'Veterinarian'] },
    { id: ViewState.Crops, icon: 'fa-seedling', label: 'Crops Manager', roles: ['Farm Manager', 'General Worker'] },
    { id: ViewState.Operations, icon: 'fa-clipboard-list', label: 'Tasks & Ops', roles: ['Farm Manager', 'Herdsman', 'Veterinarian', 'General Worker'] },
    { id: ViewState.Calendar, icon: 'fa-calendar-alt', label: 'Calendar', roles: ['Farm Manager', 'Herdsman', 'Veterinarian'] },
    { id: ViewState.POS, icon: 'fa-cash-register', label: 'Farm POS', roles: ['Farm Manager', 'General Worker'] },
    { id: ViewState.Machinery, icon: 'fa-tractor', label: 'Machinery', roles: ['Farm Manager', 'Herdsman'] },
    { id: ViewState.Staff, icon: 'fa-users', label: 'Staff & Labor', roles: ['Farm Manager'] },
    { id: ViewState.Finance, icon: 'fa-chart-pie', label: 'Financials', roles: ['Farm Manager'] },
    { id: ViewState.AI_Tools, icon: 'fa-brain', label: 'Chitsano AI', roles: ['Farm Manager', 'Veterinarian'] },
    { id: ViewState.Biosecurity, icon: 'fa-shield-virus', label: 'Biosecurity', roles: ['Farm Manager', 'Veterinarian', 'General Worker'] },
    { id: ViewState.Automation, icon: 'fa-robot', label: 'Automation', roles: ['Veterinarian'] },
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
            <p className="text-[10px] text-white font-bold uppercase tracking-widest bg-blue-600 px-2 py-0.5 rounded mt-1 inline-block">v11.9 Live</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {visibleNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-bold transition-colors ${currentView === item.id
                ? 'bg-ecomattGreen text-black'
                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i> {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile Small (Sidebar) */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {currentUser ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{currentUser?.name}</p>
              <p className="text-[10px] text-ecomattGreen">● {currentUser?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Global Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-20">
          {/* Mobile Brand / Breadcrumb / Back Button */}
          <div className="flex items-center gap-3 md:hidden">
            {showBack && onBack ? (
              <button
                onClick={onBack}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition"
              >
                <i className="fas fa-arrow-left"></i>
              </button>
            ) : (
              <div className="w-8 h-8 bg-ecomattBlack rounded-full flex items-center justify-center border border-ecomattGreen">
                <i className="fas fa-leaf text-ecomattGreen text-xs"></i>
              </div>
            )}

            <div>
              {showBack ? (
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">Back</h1>
              ) : (
                <>
                  <h1 className="text-lg font-bold text-gray-900 tracking-tight">Ecomatt</h1>
                  <p className="text-[9px] text-blue-600 font-bold">v11.8</p>
                </>
              )}
            </div>
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

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-ecomattGreen relative transition-colors"
              >
                <i className="fas fa-bell"></i>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Notification Panel Popover */}
              {showNotifications && (
                <div className="absolute right-0 top-14 w-[320px] md:w-[400px] bg-white shadow-2xl rounded-xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                      <i className="fas fa-times text-lg"></i>
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-10 text-center min-h-[300px]">
                    <div className="mb-6 text-gray-200">
                      <i className="fas fa-umbrella-beach text-8xl"></i>
                    </div>
                    <h4 className="font-bold text-gray-700 text-lg mb-2">Nothing to see here!</h4>
                    <p className="text-sm text-gray-400">You're all caught up with farm alerts.</p>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 text-gray-500">
                    <button className="hover:text-gray-800"><i className="fas fa-print"></i></button>
                    <button className="hover:text-gray-800"><i className="fas fa-share-square"></i></button>
                    <button className="hover:text-gray-800"><i className="fas fa-cog"></i></button>
                  </div>
                </div>
              )}

              {/* User Settings Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-14 w-[320px] bg-white shadow-2xl rounded-xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden" ref={userMenuRef}>
                  <div className="p-6 bg-gray-900 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ecomattGreen opacity-10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-gray-700 shadow-xl relative z-10 text-2xl font-bold">
                      {currentUser ? currentUser.name.charAt(0) : 'U'}
                    </div>
                    <h3 className="font-bold text-lg relative z-10">{currentUser?.name}</h3>
                    <p className="text-xs text-gray-400 relative z-10">{currentUser?.email}</p>
                    <span className="inline-block bg-ecomattGreen text-black text-[10px] font-bold px-2 py-0.5 rounded mt-2 relative z-10">{currentUser?.role}</span>
                  </div>

                  <div className="p-2">
                    <button onClick={() => setView(ViewState.Settings)} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500"><i className="fas fa-user-cog"></i></div>
                      <div className="text-left">
                        <span className="block text-sm font-bold">Account Settings</span>
                        <span className="block text-[10px] text-gray-400">Manage password & preferences</span>
                      </div>
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg text-red-600 transition-colors mt-1">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500"><i className="fas fa-sign-out-alt"></i></div>
                      <span className="text-sm font-bold">Sign Out</span>
                    </button>
                  </div>

                  <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">Ecomatt Farm Manager v11.8</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 relative">
          {children}
        </main>

      </div>

      {/* Mobile Bottom Nav - ALWAYS VISIBLE */}
      <MobileNav
        currentView={currentView}
        setView={setView}
        visibleItems={visibleNavItems}
      />

    </div>
  );
};

export default Layout;
