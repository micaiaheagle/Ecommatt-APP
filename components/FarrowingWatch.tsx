import React, { useState, useMemo } from 'react';
import { Pig, PigStage, ViewState } from '../types';

interface FarrowingWatchProps {
    pigs: Pig[];
    onBack?: () => void;
}

interface ActiveWatch {
    sowId: string;
    tagId: string;
    farrowingDate: string;
    litterSize: number;
    checks: {
        creepHeat: boolean;
        protectiveRails: boolean;
        sowTemperament: 'Calm' | 'Agitated' | 'Aggressive' | 'None';
    };
}

export const FarrowingWatch: React.FC<FarrowingWatchProps> = ({ pigs, onBack }) => {
    // Mocking some active watches based on recently farrowed sows
    // In a real app, this would come from a 'FarrowingEvents' DB table
    const [watches, setWatches] = useState<ActiveWatch[]>([
        {
            sowId: '1',
            tagId: 'EF-8842',
            farrowingDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12h ago
            litterSize: 17,
            checks: { creepHeat: true, protectiveRails: true, sowTemperament: 'Agitated' }
        },
        {
            sowId: '10',
            tagId: 'EF-1044',
            farrowingDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 48h ago
            litterSize: 12,
            checks: { creepHeat: true, protectiveRails: false, sowTemperament: 'Calm' }
        }
    ]);

    const [activeWatchId, setActiveWatchId] = useState<string | null>(watches[0]?.sowId || null);

    const selectedWatch = watches.find(w => w.sowId === activeWatchId);

    // Fostering logic: Sows with small litters that could take on more
    const fosterCandidates = useMemo(() => {
        return [
            { tagId: 'EF-009', litterSize: 8, motherhood: 'Excellent', room: 4 },
            { tagId: 'EF-015', litterSize: 9, motherhood: 'Good', room: 3 }
        ];
    }, []);

    const calculateHoursLeft = (date: string) => {
        const start = new Date(date).getTime();
        const deadline = start + (72 * 60 * 60 * 1000);
        const now = Date.now();
        const diff = deadline - now;
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
    };

    const getUrgencyColor = (hours: number) => {
        if (hours > 48) return 'text-green-500 bg-green-500/10 border-green-500/20';
        if (hours > 24) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
        return 'text-red-500 bg-red-500/10 border-red-500/20';
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors border border-white/5">
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    )}
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Farrowing Watch</h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">The Critical 72-Hour Survival Zone</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase text-red-500">{watches.length} Active High-Risk</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Active Watches Side List */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest px-2">High-Priority Sows</h3>
                    {watches.map(watch => {
                        const hours = calculateHoursLeft(watch.farrowingDate);
                        return (
                            <button
                                key={watch.sowId}
                                onClick={() => setActiveWatchId(watch.sowId)}
                                className={`w-full p-4 rounded-2xl border transition-all text-left relative overflow-hidden group ${activeWatchId === watch.sowId
                                    ? 'bg-ecomattGreen/5 border-ecomattGreen shadow-lg shadow-green-900/10'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-lg font-black text-slate-900">{watch.tagId}</span>
                                    <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase border ${getUrgencyColor(hours)}`}>
                                        {hours}H LEFT
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Litter</p>
                                        <p className={`font-black ${watch.litterSize >= 15 ? 'text-amber-600' : 'text-slate-900'}`}>{watch.litterSize}</p>
                                    </div>
                                    <div className="h-4 w-[1px] bg-white/10"></div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Safety Score</p>
                                        <div className="flex gap-1 text-[8px] text-ecomattGreen">
                                            <i className="fas fa-shield-alt"></i>
                                            <i className={`fas fa-shield-alt ${watch.checks.protectiveRails ? '' : 'opacity-20'}`}></i>
                                            <i className={`fas fa-shield-alt ${watch.checks.creepHeat ? '' : 'opacity-20'}`}></i>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Right: Detailed Watch Panel */}
                <div className="lg:col-span-8">
                    {selectedWatch ? (
                        <div className="space-y-6">
                            {/* Critical Status Header */}
                            <div className="glass-nav rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <i className="fas fa-clock text-9xl"></i>
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-ecomattGreen rounded-2xl flex items-center justify-center text-black shadow-lg shadow-green-900/40">
                                            <i className="fas fa-piggy-bank text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-900">{selectedWatch.tagId}</h4>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Farrowed {new Date(selectedWatch.farrowingDate).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${selectedWatch.litterSize >= 15 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-4">Litter Management</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-5xl font-black ${selectedWatch.litterSize >= 15 ? 'text-amber-600' : 'text-slate-900'}`}>{selectedWatch.litterSize}</span>
                                                <span className="text-xs font-bold text-slate-500 uppercase">Piglets</span>
                                            </div>
                                            {selectedWatch.litterSize >= 15 && (
                                                <div className="mt-4 flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase">
                                                    <i className="fas fa-exclamation-triangle"></i>
                                                    Large Litter Risk
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 rounded-2xl bg-slate-900/5 border border-slate-900/10 flex flex-col justify-between">
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-4">Critical Period Window</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-black text-slate-900">{calculateHoursLeft(selectedWatch.farrowingDate)}</span>
                                                <span className="text-xs font-bold text-slate-500 uppercase">Hours to 72H Goal</span>
                                            </div>
                                            <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-ecomattGreen shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-1000"
                                                    style={{ width: `${(calculateHoursLeft(selectedWatch.farrowingDate) / 72) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist & Fostering */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Survival Checklist */}
                                <div className="glass-nav rounded-3xl p-6 border border-white/10">
                                    <h5 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <i className="fas fa-tasks text-ecomattGreen"></i>
                                        Survival Checklist
                                    </h5>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'h', label: 'Creep Heat Active', checked: selectedWatch.checks.creepHeat, desc: 'Target 30–32°C' },
                                            { id: 'r', label: 'Protective Rails', checked: selectedWatch.checks.protectiveRails, desc: 'Prevents crushing' },
                                            { id: 't', label: 'Sow Temperament', sub: selectedWatch.checks.sowTemperament, desc: 'Check for agitation' }
                                        ].map(item => (
                                            <div key={item.id} className="p-4 rounded-xl bg-slate-900/5 border border-slate-900/10 flex items-start justify-between group">
                                                <div>
                                                    <p className="font-bold text-sm uppercase text-slate-800">{item.label}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold">{item.desc}</p>
                                                    {item.sub && <span className="inline-block mt-2 px-2 py-0.5 bg-ecomattGreen/20 text-ecomattGreen-900 text-[9px] font-black rounded uppercase">{item.sub}</span>}
                                                </div>
                                                {item.checked ? (
                                                    <i className="fas fa-check-circle text-ecomattGreen mt-1"></i>
                                                ) : item.id !== 't' ? (
                                                    <i className="fas fa-times-circle text-red-500 mt-1"></i>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Fostering Assistant */}
                                <div className="glass-nav rounded-3xl p-6 border border-amber-500/10">
                                    <h5 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-amber-500">
                                        <i className="fas fa-hands-helping"></i>
                                        Fostering Assistant
                                    </h5>
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
                                        <p className="text-[10px] text-amber-600 font-black uppercase mb-1">Recommendation</p>
                                        <p className="text-xs text-slate-700">Large litter detected (15+). Move 2-4 weaker piglets to a foster sow to improve survival.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-1">Candidate Foster Sows</p>
                                        {fosterCandidates.map(foster => (
                                            <div key={foster.tagId} className="p-4 rounded-xl bg-slate-900/5 border border-slate-900/10 flex items-center justify-between hover:bg-slate-900/10 transition-all cursor-pointer">
                                                <div>
                                                    <p className="font-black text-slate-900">{foster.tagId}</p>
                                                    <p className="text-[9px] text-slate-500 font-bold uppercase">Motherhood: {foster.motherhood}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-ecomattGreen font-black">+{foster.room}</p>
                                                    <p className="text-[9px] text-gray-500 font-bold uppercase">Space</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 py-12">
                            <i className="fas fa-clipboard-check text-6xl mb-4 opacity-20"></i>
                            <p className="uppercase font-black tracking-widest">Select a sow to monitor</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarrowingWatch;
