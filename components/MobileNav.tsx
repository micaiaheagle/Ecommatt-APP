
import React from 'react';
import { ViewState } from '../types';

interface MobileNavProps {
    currentView: ViewState;
    setView: (view: ViewState) => void;
    visibleItems: { id: ViewState; icon: string; label: string; }[];
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, setView, visibleItems }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
            <div className="flex justify-around items-center">
                {visibleItems.slice(0, 5).map(item => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id)}
                        className={`flex flex-col items-center justify-center py-2 px-1 w-full transition-colors ${currentView === item.id
                                ? 'text-ecomattGreen'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <i className={`fas ${item.icon} text-lg mb-0.5`}></i>
                        <span className="text-[9px] font-bold truncate max-w-[60px]">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileNav;
