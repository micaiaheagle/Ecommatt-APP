import React from 'react';
import { ViewState } from '../types';
import {
    LineChart,
    LayoutDashboard,
    ClipboardList,
    ShieldCheck,
    Settings,
    MoreHorizontal,
    Zap,
    DollarSign
} from 'lucide-react';

interface MobileNavProps {
    currentView: ViewState;
    currentSubView?: string | null;
    setView: (view: ViewState, subView?: string) => void;
    onOpenMore: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, currentSubView, setView, onOpenMore }) => {
    const navItems = [
        { id: ViewState.Dashboard, icon: <LayoutDashboard size={20} />, label: 'Home' },
        { id: ViewState.Operations, subView: 'Tasks', icon: <ClipboardList size={20} />, label: 'Ops' },
        { id: ViewState.Procurement, icon: <DollarSign size={20} />, label: 'Finance' },
        { id: ViewState.Biosecurity, icon: <ShieldCheck size={20} />, label: 'Defense' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item, idx) => {
                    const isActive = currentView === item.id && (item.subView === (currentSubView || undefined));
                    return (
                        <button
                            key={idx}
                            onClick={() => setView(item.id, item.subView)}
                            className={`flex flex-col items-center justify-center p-1 w-full transition-all active:scale-95 ${isActive
                                ? 'text-ecomattGreen scale-105'
                                : 'text-gray-400'
                                }`}
                        >
                            <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-ecomattGreen/10' : ''}`}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] font-black mt-1 uppercase tracking-tighter ${isActive ? 'text-ecomattGreen' : 'text-gray-400'}`}>{item.label}</span>
                        </button>
                    );
                })}
                <button
                    onClick={onOpenMore}
                    className="flex flex-col items-center justify-center p-1 w-full text-gray-400 active:scale-95 transition-all"
                >
                    <div className="p-1">
                        <MoreHorizontal size={20} />
                    </div>
                    <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">More</span>
                </button>
            </div>
        </nav>
    );
};

export default MobileNav;
