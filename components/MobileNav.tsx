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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item, idx) => {
                    const isActive = currentView === item.id && (item.subView === (currentSubView || undefined));
                    return (
                        <button
                            key={idx}
                            onClick={() => setView(item.id, item.subView)}
                            className={`flex flex-col items-center justify-center p-1 w-full transition-all ${isActive
                                ? 'text-ecomattGreen scale-110'
                                : 'text-gray-400'
                                }`}
                        >
                            {item.icon}
                            <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">{item.label}</span>
                        </button>
                    );
                })}
                <button
                    onClick={onOpenMore}
                    className="flex flex-col items-center justify-center p-1 w-full text-gray-400"
                >
                    <MoreHorizontal size={20} />
                    <span className="text-[9px] font-black mt-1 uppercase tracking-tighter">More</span>
                </button>
            </div>
        </nav>
    );
};

export default MobileNav;
