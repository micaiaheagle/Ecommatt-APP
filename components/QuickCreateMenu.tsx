
import React, { useState, useRef, useEffect } from 'react';

interface QuickCreateMenuProps {
  onAction: (action: string) => void;
}

const QuickCreateMenu: React.FC<QuickCreateMenuProps> = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only apply click-outside logic on desktop where it's a dropdown.
      // On mobile, the overlay click handles it.
      if (window.innerWidth >= 768) {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (action: string) => {
    onAction(action);
    setIsOpen(false);
  };

  // Helper for Mobile Grid Item
  const MobileGridItem = ({ icon, label, action, colorClass, iconColor }: any) => (
    <button 
      onClick={() => handleItemClick(action)}
      className="flex flex-col items-center gap-2 p-2 active:scale-95 transition-transform"
    >
      <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center shadow-sm border border-white/50`}>
        <i className={`fas ${icon} text-xl ${iconColor}`}></i>
      </div>
      <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">{label}</span>
    </button>
  );

  // Helper for Desktop List Item
  const DesktopListItem = ({ icon, label, action }: any) => (
    <li>
      <button 
        onClick={() => handleItemClick(action)} 
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-left"
      >
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 group-hover:text-ecomattGreen group-hover:border-green-200">
          <i className={`fas ${icon}`}></i>
        </div>
        <span className="text-sm font-bold">{label}</span>
      </button>
    </li>
  );

  return (
    <div className="" ref={menuRef}>
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 relative z-50 ${
          isOpen 
            ? 'bg-gray-200 text-gray-600 rotate-45 md:bg-white md:text-ecomattGreen' 
            : 'bg-ecomattGreen text-white shadow-lg hover:bg-green-600'
        }`}
        title="Quick Create"
      >
        <i className="fas fa-plus text-xl"></i>
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Menu Container */}
      {isOpen && (
        <div className={`
            z-50 bg-white
            
            /* Mobile: Fixed Bottom Sheet with rounded corners */
            fixed bottom-0 left-0 w-full rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)]
            animate-in slide-in-from-bottom duration-300 overflow-hidden
            
            /* Desktop: Absolute Dropdown */
            md:absolute md:top-14 md:right-0 md:bottom-auto md:left-auto md:w-[600px] md:h-auto md:rounded-xl md:shadow-2xl md:border md:border-gray-100
            md:animate-in md:fade-in md:slide-in-from-top-2
        `}>
          
          {/* Mobile Handle */}
          <div className="md:hidden bg-gray-50 pt-3 pb-2 flex justify-center border-b border-gray-100" onClick={() => setIsOpen(false)}>
             <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Content Wrapper */}
          <div className="md:p-6 max-h-[80vh] overflow-y-auto no-scrollbar">
            
            {/* === MOBILE VIEW (Grid Layout) === */}
            <div className="md:hidden p-6 pb-10 space-y-6">
                
                {/* General Section */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">General</h4>
                    <div className="grid grid-cols-4 gap-4">
                        <MobileGridItem icon="fa-user-plus" label="User" action="add_user" colorClass="bg-gray-100" iconColor="text-gray-600" />
                        <MobileGridItem icon="fa-check-circle" label="Task" action="add_task" colorClass="bg-gray-100" iconColor="text-gray-600" />
                        <MobileGridItem icon="fa-cog" label="Settings" action="settings" colorClass="bg-gray-100" iconColor="text-gray-600" />
                    </div>
                </div>

                {/* Livestock Section */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Livestock</h4>
                    <div className="grid grid-cols-4 gap-4">
                        <MobileGridItem icon="fa-piggy-bank" label="Add Pig" action="add_pig" colorClass="bg-green-50" iconColor="text-ecomattGreen" />
                        <MobileGridItem icon="fa-history" label="Event" action="log_event" colorClass="bg-green-50" iconColor="text-ecomattGreen" />
                        <MobileGridItem icon="fa-venus-mars" label="Mating" action="log_mating" colorClass="bg-green-50" iconColor="text-ecomattGreen" />
                        <MobileGridItem icon="fa-baby-carriage" label="Farrow" action="log_farrowing" colorClass="bg-green-50" iconColor="text-ecomattGreen" />
                    </div>
                </div>

                {/* Operations Section */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Operations</h4>
                    <div className="grid grid-cols-4 gap-4">
                        <MobileGridItem icon="fa-utensils" label="Feed" action="log_feed" colorClass="bg-blue-50" iconColor="text-blue-500" />
                        <MobileGridItem icon="fa-syringe" label="Health" action="log_health" colorClass="bg-red-50" iconColor="text-red-500" />
                        <MobileGridItem icon="fa-truck-loading" label="Stock" action="add_feed_stock" colorClass="bg-yellow-50" iconColor="text-yellow-600" />
                        <MobileGridItem icon="fa-broom" label="Clean" action="cleaning_log" colorClass="bg-blue-50" iconColor="text-blue-500" />
                    </div>
                </div>

                 {/* Finance Section */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Finance</h4>
                    <div className="grid grid-cols-4 gap-4">
                        <MobileGridItem icon="fa-arrow-down" label="Income" action="add_income" colorClass="bg-green-100" iconColor="text-green-700" />
                        <MobileGridItem icon="fa-arrow-up" label="Expense" action="add_expense" colorClass="bg-red-100" iconColor="text-red-600" />
                        <MobileGridItem icon="fa-file-invoice" label="Invoice" action="create_invoice" colorClass="bg-gray-100" iconColor="text-gray-600" />
                    </div>
                </div>
            </div>


            {/* === DESKTOP VIEW (Column Layout) === */}
            <div className="hidden md:grid grid-cols-3 gap-8">
              {/* Col 1 */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">General & Stock</h4>
                <ul className="space-y-1">
                  <DesktopListItem icon="fa-user-plus" label="Add User" action="add_user" />
                  <DesktopListItem icon="fa-check-circle" label="New Task" action="add_task" />
                  <DesktopListItem icon="fa-plus-circle" label="New Animal" action="add_pig" />
                  <DesktopListItem icon="fa-history" label="Log Timeline Event" action="log_event" />
                </ul>
              </div>

              {/* Col 2 */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Daily Ops</h4>
                <ul className="space-y-1">
                  <DesktopListItem icon="fa-utensils" label="Log Feed" action="log_feed" />
                  <DesktopListItem icon="fa-syringe" label="Record Health" action="log_health" />
                  <DesktopListItem icon="fa-truck-loading" label="Restock Feed" action="add_feed_stock" />
                  <DesktopListItem icon="fa-broom" label="Log Cleaning" action="cleaning_log" />
                </ul>
              </div>

              {/* Col 3 */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Finance</h4>
                <ul className="space-y-1">
                  <DesktopListItem icon="fa-arrow-down" label="Record Income" action="add_income" />
                  <DesktopListItem icon="fa-arrow-up" label="Record Expense" action="add_expense" />
                  <DesktopListItem icon="fa-file-invoice-dollar" label="Create Invoice" action="create_invoice" />
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default QuickCreateMenu;
