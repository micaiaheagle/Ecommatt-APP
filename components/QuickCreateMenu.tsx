
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Menu Container */}
      {isOpen && (
        <div className={`
            z-50 bg-white
            
            /* Mobile: Fixed Bottom Sheet */
            fixed bottom-0 left-0 w-full h-[85vh] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] overflow-y-auto
            animate-in slide-in-from-bottom duration-300
            
            /* Desktop: Absolute Dropdown */
            md:absolute md:top-14 md:right-0 md:bottom-auto md:left-auto md:w-[600px] md:h-auto md:rounded-xl md:shadow-2xl md:border md:border-gray-100
            md:animate-in md:fade-in md:slide-in-from-top-2
        `}>
          
          {/* Mobile Handle */}
          <div className="md:hidden sticky top-0 bg-white/95 backdrop-blur pt-3 pb-2 flex justify-center border-b border-gray-100 z-10" onClick={() => setIsOpen(false)}>
             <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-2"></div>
          </div>
          
          {/* Menu Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 md:bg-gray-50/50">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Actions</p>
             <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400">
                <i className="fas fa-times text-lg"></i>
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 pb-20 md:pb-6">
            
            {/* Column 1: General & Livestock */}
            <div className="space-y-8 md:space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center gap-2 border-b md:border-0 border-gray-100 pb-2 md:pb-0">
                   <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-gray-500"><i className="fas fa-th-large text-xs"></i></span>
                   General
                </h4>
                <ul className="grid grid-cols-2 md:block gap-3 space-y-0 md:space-y-3">
                  <li>
                    <button onClick={() => handleItemClick('add_user')} className="w-full flex flex-col md:flex-row items-center md:gap-3 p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none hover:bg-green-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-center md:text-left border border-gray-100 md:border-none shadow-sm md:shadow-none">
                      <div className="w-10 h-10 md:w-auto md:h-auto bg-white md:bg-transparent rounded-full flex items-center justify-center shadow-sm md:shadow-none mb-2 md:mb-0 text-gray-400 group-hover:text-ecomattGreen">
                        <i className="fas fa-user-plus text-lg md:text-base"></i>
                      </div>
                      <span className="text-sm font-bold">Add User</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleItemClick('add_task')} className="w-full flex flex-col md:flex-row items-center md:gap-3 p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none hover:bg-green-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-center md:text-left border border-gray-100 md:border-none shadow-sm md:shadow-none">
                      <div className="w-10 h-10 md:w-auto md:h-auto bg-white md:bg-transparent rounded-full flex items-center justify-center shadow-sm md:shadow-none mb-2 md:mb-0 text-gray-400 group-hover:text-ecomattGreen">
                        <i className="fas fa-check-circle text-lg md:text-base"></i>
                      </div>
                      <span className="text-sm font-bold">New Task</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center gap-2 border-b md:border-0 border-gray-100 pb-2 md:pb-0">
                   <span className="w-6 h-6 rounded bg-ecomattGreen/10 flex items-center justify-center text-ecomattGreen"><i className="fas fa-piggy-bank text-xs"></i></span>
                   Livestock
                </h4>
                <ul className="grid grid-cols-2 md:block gap-3 space-y-0 md:space-y-3">
                  <li>
                    <button onClick={() => handleItemClick('add_pig')} className="w-full flex flex-col md:flex-row items-center md:gap-3 p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none hover:bg-green-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-center md:text-left border border-gray-100 md:border-none shadow-sm md:shadow-none">
                       <div className="w-10 h-10 md:w-auto md:h-auto bg-white md:bg-transparent rounded-full flex items-center justify-center shadow-sm md:shadow-none mb-2 md:mb-0 text-gray-400 group-hover:text-ecomattGreen">
                        <i className="fas fa-plus-circle text-lg md:text-base"></i>
                      </div>
                      <span className="text-sm font-bold">New Animal</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleItemClick('log_event')} className="w-full flex flex-col md:flex-row items-center md:gap-3 p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none hover:bg-green-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-center md:text-left border border-gray-100 md:border-none shadow-sm md:shadow-none">
                       <div className="w-10 h-10 md:w-auto md:h-auto bg-white md:bg-transparent rounded-full flex items-center justify-center shadow-sm md:shadow-none mb-2 md:mb-0 text-gray-400 group-hover:text-ecomattGreen">
                        <i className="fas fa-history text-lg md:text-base"></i>
                      </div>
                      <span className="text-sm font-bold">Log Event</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: Operations */}
            <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center gap-2 border-b md:border-0 border-gray-100 pb-2 md:pb-0">
                   <span className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-blue-500"><i className="fas fa-cogs text-xs"></i></span>
                   Operations
                </h4>
                <ul className="grid grid-cols-2 md:block gap-3 space-y-0 md:space-y-3">
                  <li>
                    <button onClick={() => handleItemClick('log_feed')} className="w-full flex flex-col md:flex-row items-center md:gap-3 p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none hover:bg-green-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-center md:text-left border border-gray-100 md:border-none shadow-sm md:shadow-none">
                       <div className="w-10 h-10 md:w-auto md:h-auto bg-white md:bg-transparent rounded-full flex items-center justify-center shadow-sm md:shadow-none mb-2 md:mb-0 text-gray-400 group-hover:text-ecomattGreen">
                        <i className="fas fa-utensils text-lg md:text-base"></i>
                      </div>
                      <span className="text-sm font-bold">Log Feed</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleItemClick('log_health')} className="w-full flex flex-col md:flex-row items-center md:gap-3 p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none hover:bg-green-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-center md:text-left border border-gray-100 md:border-none shadow-sm md:shadow-none">
                       <div className="w-10 h-10 md:w-auto md:h-auto bg-white md:bg-transparent rounded-full flex items-center justify-center shadow-sm md:shadow-none mb-2 md:mb-0 text-gray-400 group-hover:text-ecomattGreen">
                        <i className="fas fa-syringe text-lg md:text-base"></i>
                      </div>
                      <span className="text-sm font-bold">Record Health</span>
                    </button>
                  </li>
                   <li>
                    <button onClick={() => handleItemClick('add_feed_stock')} className="w-full flex flex-col md:flex-row items-center md:gap-3 p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none hover:bg-green-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-center md:text-left border border-gray-100 md:border-none shadow-sm md:shadow-none">
                       <div className="w-10 h-10 md:w-auto md:h-auto bg-white md:bg-transparent rounded-full flex items-center justify-center shadow-sm md:shadow-none mb-2 md:mb-0 text-gray-400 group-hover:text-ecomattGreen">
                        <i className="fas fa-truck-loading text-lg md:text-base"></i>
                      </div>
                      <span className="text-sm font-bold">Restock Feed</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleItemClick('cleaning_log')} className="w-full flex flex-col md:flex-row items-center md:gap-3 p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none hover:bg-green-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-center md:text-left border border-gray-100 md:border-none shadow-sm md:shadow-none">
                       <div className="w-10 h-10 md:w-auto md:h-auto bg-white md:bg-transparent rounded-full flex items-center justify-center shadow-sm md:shadow-none mb-2 md:mb-0 text-gray-400 group-hover:text-ecomattGreen">
                        <i className="fas fa-broom text-lg md:text-base"></i>
                      </div>
                      <span className="text-sm font-bold">Log Cleaning</span>
                    </button>
                  </li>
                </ul>
            </div>

            {/* Column 3: Finance */}
            <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase mb-4 flex items-center gap-2 border-b md:border-0 border-gray-100 pb-2 md:pb-0">
                   <span className="w-6 h-6 rounded bg-yellow-50 flex items-center justify-center text-yellow-600"><i className="fas fa-coins text-xs"></i></span>
                   Finance
                </h4>
                <ul className="grid grid-cols-2 md:block gap-3 space-y-0 md:space-y-3">
                  <li>
                    <button onClick={() => handleItemClick('add_income')} className="w-full flex flex-col md:flex-row items-center md:gap-3 p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none hover:bg-green-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-center md:text-left border border-gray-100 md:border-none shadow-sm md:shadow-none">
                       <div className="w-10 h-10 md:w-auto md:h-auto bg-white md:bg-transparent rounded-full flex items-center justify-center shadow-sm md:shadow-none mb-2 md:mb-0 text-gray-400 group-hover:text-ecomattGreen">
                        <i className="fas fa-arrow-down text-lg md:text-base"></i>
                      </div>
                      <span className="text-sm font-bold">Income</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleItemClick('add_expense')} className="w-full flex flex-col md:flex-row items-center md:gap-3 p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none hover:bg-green-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-center md:text-left border border-gray-100 md:border-none shadow-sm md:shadow-none">
                       <div className="w-10 h-10 md:w-auto md:h-auto bg-white md:bg-transparent rounded-full flex items-center justify-center shadow-sm md:shadow-none mb-2 md:mb-0 text-gray-400 group-hover:text-ecomattGreen">
                        <i className="fas fa-arrow-up text-lg md:text-base"></i>
                      </div>
                      <span className="text-sm font-bold">Expense</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleItemClick('create_invoice')} className="w-full flex flex-col md:flex-row items-center md:gap-3 p-3 md:p-0 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none hover:bg-green-50 text-gray-700 hover:text-ecomattGreen transition-colors group text-center md:text-left border border-gray-100 md:border-none shadow-sm md:shadow-none">
                       <div className="w-10 h-10 md:w-auto md:h-auto bg-white md:bg-transparent rounded-full flex items-center justify-center shadow-sm md:shadow-none mb-2 md:mb-0 text-gray-400 group-hover:text-ecomattGreen">
                        <i className="fas fa-file-invoice-dollar text-lg md:text-base"></i>
                      </div>
                      <span className="text-sm font-bold">Invoice</span>
                    </button>
                  </li>
                </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default QuickCreateMenu;
