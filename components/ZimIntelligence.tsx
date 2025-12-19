import React, { useState } from 'react';
import { ExchangeRate } from '../types';

interface ZimIntelligenceProps {
    exchangeRate: ExchangeRate;
    onUpdateRate: (newRate: number) => void;
    onBack?: () => void;
}

const ZimIntelligence: React.FC<ZimIntelligenceProps> = ({ exchangeRate, onUpdateRate, onBack }) => {
    const [tempRate, setTempRate] = useState(exchangeRate.rate);

    // Mock Market Data (Zim Context)
    const marketPulse = [
        { hub: 'Mbare Musika (Hre)', product: 'Pork Carcass', price: '$4.20/kg', trend: 'up', color: 'text-red-500' },
        { hub: 'Mbare Musika (Hre)', product: 'Live Pig', price: '$2.80/kg', trend: 'stable', color: 'text-slate-400' },
        { hub: 'Bulawayo (Renkini)', product: 'Maize (50kg)', price: '$18.00', trend: 'down', color: 'text-green-500' },
        { hub: 'Mutare (Sakubva)', product: 'Manure (bag)', price: '$3.50', trend: 'up', color: 'text-red-500' },
    ];

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-700 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                {onBack && (
                    <button onClick={onBack} className="p-2 hover:bg-slate-900/5 rounded-full text-slate-900 transition-colors border border-slate-900/10">
                        <i className="fas fa-arrow-left"></i>
                    </button>
                )}
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Zim Intelligence Hub</h2>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Regional Market & Currency Dynamics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Currency Engine */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-ecomattGreen opacity-10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-6">Global Exchange Engine</h3>

                        <div className="flex items-end gap-2 mb-8">
                            <span className="text-5xl font-black tracking-tighter uppercase text-white">1.00</span>
                            <span className="text-sm font-black text-white/40 uppercase mb-2">USD</span>
                            <span className="text-2xl font-black text-ecomattGreen mb-1 mx-2">=</span>
                            <input
                                type="number"
                                value={tempRate}
                                onChange={e => setTempRate(parseFloat(e.target.value))}
                                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 w-32 text-4xl font-black text-ecomattGreen focus:outline-none focus:border-ecomattGreen transition-all"
                            />
                            <span className="text-sm font-black text-white/40 uppercase mb-2">ZiG</span>
                        </div>

                        <p className="text-[10px] font-bold text-white/40 uppercase mb-6">Last Updated: {exchangeRate.lastUpdated}</p>

                        <button
                            onClick={() => onUpdateRate(tempRate)}
                            className="w-full bg-ecomattGreen text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green-900/20"
                        >
                            Update System Rate Global
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-900/10 shadow-sm">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Payment Stability Tips</h4>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><i className="fas fa-shield-alt"></i></div>
                                <p className="text-xs text-slate-600 leading-relaxed font-bold italic">"Always verify Innbucks/EcoCash transaction IDs manually for order values above $50 to mitigate reversal fraud."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Market Pulse */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-900/10 p-8 shadow-sm h-full">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Regional Market Pulse (Mbare Musika)</h3>
                            <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Live Feed</span>
                        </div>

                        <div className="space-y-4">
                            {marketPulse.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-5 bg-slate-900/5 rounded-3xl border border-slate-900/5 hover:border-slate-300 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-ecomattGreen transition-colors">
                                            <i className="fas fa-store"></i>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.hub}</p>
                                            <h5 className="text-sm font-black text-slate-900 uppercase">{item.product}</h5>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-4 shrink-0">
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900 uppercase whitespace-nowrap">{item.price}</p>
                                            <p className={`text-[9px] font-black uppercase whitespace-nowrap ${item.color}`}>{item.trend === 'up' ? '↗ Climbing' : item.trend === 'down' ? '↘ Falling' : '→ Stable'}</p>
                                        </div>
                                        <i className="fas fa-chevron-right text-slate-200 text-xs"></i>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-900/10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed text-center px-12 italic">
                                Smart Hint: When Maize prices climb at Renkini, prioritize selling weaners rather than fattening them to protect your margin.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZimIntelligence;
