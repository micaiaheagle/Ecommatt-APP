import React, { useState } from 'react';
import { ViewState } from '../types';

interface PrecisionFeedingProps {
    onBack?: () => void;
}

const FORMULATIONS = [
    {
        name: 'Creep & Weaner Feed (0–10 wks)',
        ingredients: [
            { name: 'Maize', amount: '540 kg' },
            { name: 'Wheat bran', amount: '130 kg' },
            { name: 'Soybean meal', amount: '298 kg' },
            { name: 'Premix', amount: '32 kg' }
        ],
        target: '400g/day (split into 4 meals)'
    },
    {
        name: 'Grower Feed (10–16 wks)',
        ingredients: [
            { name: 'Maize', amount: '470 kg' },
            { name: 'Wheat bran', amount: '270 kg' },
            { name: 'Soybean meal', amount: '228 kg' },
            { name: 'Premix', amount: '32 kg' }
        ],
        target: '1.5kg - 2.2kg/day'
    },
    {
        name: 'Lactating Sow Meal',
        ingredients: [
            { name: 'Maize', amount: '520 kg' },
            { name: 'Wheat bran', amount: '250 kg' },
            { name: 'Soybean meal', amount: '198 kg' },
            { name: 'Premix', amount: '32 kg' }
        ],
        target: '2.0kg + 0.45kg per piglet'
    }
];

export const PrecisionFeeding: React.FC<PrecisionFeedingProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'lactation' | 'weaner' | 'library'>('lactation');
    const [pigletCount, setPigletCount] = useState<number>(10);
    const [meals, setMeals] = useState({
        m8am: false,
        m11am: false,
        m2pm: false,
        m4pm: false
    });

    const ration = (2.0 + (pigletCount * 0.45)).toFixed(2);

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
                {onBack && (
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <i className="fas fa-arrow-left"></i>
                    </button>
                )}
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-slate-900">Smart Feeding Calculator</h2>
                    <p className="text-slate-500 text-sm uppercase font-bold tracking-widest">Vet-Approved Nutrition (Dr. Gusha)</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-slate-900/5 p-1 rounded-xl border border-slate-900/10">
                {[
                    { id: 'lactation', label: 'Lactation', icon: 'fa-baby' },
                    { id: 'weaner', label: 'Weaner Schedule', icon: 'fa-stopwatch' },
                    { id: 'library', label: 'Ration Library', icon: 'fa-book-medical' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold uppercase text-xs transition-all flex items-center justify-center gap-2 ${activeTab === tab.id
                            ? 'bg-ecomattGreen text-black shadow-lg shadow-green-900/20'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-900/5'
                            }`}
                    >
                        <i className={`fas ${tab.icon}`}></i>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {activeTab === 'lactation' && (
                    <div className="glass-nav rounded-3xl p-8 border border-ecomattGreen/20 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-green-500/20 transition-all"></div>

                        <label className="block text-slate-500 font-bold uppercase text-xs tracking-widest mb-4">Number of Nursing Piglets</label>
                        <div className="flex items-center gap-6 mb-8">
                            <input
                                type="number"
                                value={pigletCount}
                                onChange={(e) => setPigletCount(Math.max(0, parseInt(e.target.value) || 0))}
                                className="bg-slate-900/5 border border-slate-900/10 rounded-2xl px-6 py-4 text-3xl font-bold w-32 focus:outline-none focus:border-ecomattGreen text-slate-900 transition-all shadow-inner"
                            />
                            <div className="h-12 w-[1px] bg-slate-900/10"></div>
                            <div>
                                <p className="text-sm font-bold uppercase text-slate-400 mb-1">Formula</p>
                                <p className="text-xs font-mono text-ecomattGreen font-bold">2.0 kg + (n × 0.45 kg)</p>
                            </div>
                        </div>

                        <div className="p-8 bg-ecomattGreen/5 rounded-2xl border border-ecomattGreen/20 relative">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-2">Total Daily Ration</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-ecomattGreen">{ration}</span>
                                        <span className="text-2xl font-bold text-ecomattGreen/40">KG</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="w-16 h-16 bg-ecomattGreen/10 rounded-full flex items-center justify-center mb-2">
                                        <i className="fas fa-seedling text-2xl text-ecomattGreen"></i>
                                    </div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Distribute in 2-3 meals</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-900/5 rounded-xl border border-slate-900/10">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Benefits</p>
                                <p className="text-xs text-slate-700 font-medium">Reduces sow aggression and crushing losses. Ensures adequate milk supply.</p>
                            </div>
                            <div className="p-4 bg-slate-900/5 rounded-xl border border-slate-900/10">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Target</p>
                                <p className="text-xs text-slate-700 font-medium">Maintain Sow BCS at 3.0 during lactation for fast post-weaning service.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'weaner' && (
                    <div className="space-y-4">
                        <div className="glass-nav rounded-3xl p-8 border border-blue-500/20 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1 text-slate-900">Weaner Feeding Log</h3>
                                    <p className="text-xs font-bold text-blue-600 uppercase">Target: 400g Total (100g / meal)</p>
                                </div>
                                <i className="fas fa-stopwatch text-3xl text-blue-500/40"></i>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { id: 'm8am', time: '08:00 AM', label: 'Breakfast' },
                                    { id: 'm11am', time: '11:00 AM', label: 'Brunch' },
                                    { id: 'm2pm', time: '02:00 PM', label: 'Lunch' },
                                    { id: 'm4pm', time: '04:00 PM', label: 'Dinner' }
                                ].map((meal) => (
                                    <button
                                        key={meal.id}
                                        onClick={() => setMeals(prev => ({ ...prev, [meal.id]: !prev[meal.id as keyof typeof meals] }))}
                                        className={`p-6 rounded-2xl flex items-center justify-between transition-all border-2 ${meals[meal.id as keyof typeof meals]
                                            ? 'bg-blue-500/10 border-blue-500 text-blue-900'
                                            : 'bg-slate-900/5 border-slate-900/10 text-slate-500 hover:bg-slate-900/10'
                                            }`}
                                    >
                                        <div className="text-left">
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{meal.time}</p>
                                            <p className="font-bold uppercase">{meal.label}</p>
                                        </div>
                                        {meals[meal.id as keyof typeof meals] ? (
                                            <i className="fas fa-check-circle text-blue-500 text-xl"></i>
                                        ) : (
                                            <i className="far fa-circle text-xl opacity-30"></i>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20 flex gap-4 items-center">
                                <i className="fas fa-info-circle text-blue-600"></i>
                                <p className="text-xs text-blue-900">"This regimen protects the developing gut and prevents scouring." — Dr. Gusha</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'library' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {FORMULATIONS.map((f, i) => (
                            <div key={i} className="bg-slate-900/5 rounded-2xl p-6 border border-slate-900/10 hover:border-ecomattGreen/40 transition-all group">
                                <h4 className="font-bold uppercase text-sm mb-4 text-slate-900 group-hover:text-ecomattGreen transition-colors">{f.name}</h4>
                                <div className="space-y-2 mb-6">
                                    {f.ingredients.map((ing, j) => (
                                        <div key={j} className="flex justify-between text-xs py-1 border-b border-slate-900/5">
                                            <span className="text-slate-500 uppercase font-bold">{ing.name}</span>
                                            <span className="font-mono font-bold text-slate-900">{ing.amount}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 bg-slate-900/5 rounded-lg flex items-center gap-3">
                                    <i className="fas fa-bullseye text-ecomattGreen text-xs"></i>
                                    <span className="text-[10px] font-bold uppercase text-slate-500 italic">{f.target}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrecisionFeeding;
