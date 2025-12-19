import React, { useState, useMemo } from 'react';
import {
    ShieldCheck,
    ArrowLeftRight,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    ArrowRight,
    Calculator,
    History,
    Info,
    BadgePercent,
    LineChart
} from 'lucide-react';
import { SupplierQuote, Currency, ExchangeRate } from '../types';

interface ProcurementAdvisorProps {
    quotes: SupplierQuote[];
    exchangeRates: Record<string, number>; // USD as base, e.g., { 'ZiG': 28.5, 'ZAR': 19.2 }
    onBack: () => void;
    onAddQuote?: (quote: SupplierQuote) => void;
}

const ProcurementAdvisor: React.FC<ProcurementAdvisorProps> = ({
    quotes,
    exchangeRates,
    onBack
}) => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const items = useMemo(() => {
        const set = new Set(quotes.map(q => q.itemName));
        return Array.from(set);
    }, [quotes]);

    const convertToUSD = (amount: number, currency: Currency) => {
        if (currency === 'USD') return amount;
        return amount / (exchangeRates[currency] || 1);
    };

    const getBestDeal = (itemName: string) => {
        const itemQuotes = quotes.filter(q => q.itemName === itemName);
        if (!itemQuotes.length) return null;

        return itemQuotes.reduce((prev, curr) => {
            const prevUSD = convertToUSD(prev.price, prev.currency);
            const currUSD = convertToUSD(curr.price, curr.currency);
            return currUSD < prevUSD ? curr : prev;
        });
    };

    const calculateInflationProtection = (quote: SupplierQuote) => {
        // Mock logic for inflation risk
        if (quote.currency === 'USD') return 95; // 95% protection
        if (quote.currency === 'ZAR') return 70;
        return 40; // ZiG high volatility risk
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-200 overflow-y-auto">
            {/* Header */}
            <div className="p-4 md:p-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl shrink-0">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 md:p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30 text-blue-400">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                                Inflation Shield
                            </h1>
                            <p className="text-slate-500 text-[10px] md:text-sm font-medium italic">Powered by ZimIntelligence 엔진</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-8 grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">

                {/* Market Rates Card */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-slate-900 rounded-3xl border border-white/5 p-5 md:p-6 border-b-4 border-b-indigo-500/50">
                        <h3 className="font-bold flex items-center gap-2 mb-6 text-indigo-300 uppercase text-[10px] md:text-xs tracking-widest">
                            <ArrowLeftRight size={16} />
                            Real-Time Cross Rates
                        </h3>
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center justify-between p-3 md:p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs uppercase">US</div>
                                    <span className="font-bold text-slate-200">USD / ZiG</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-white">{exchangeRates['ZiG']}</div>
                                    <div className="text-[10px] text-red-400 flex items-center gap-1 justify-end font-bold">
                                        <TrendingUp size={10} /> +0.2%
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 md:p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs uppercase">ZA</div>
                                    <span className="font-bold text-slate-200">USD / ZAR</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-white">{exchangeRates['ZAR'] || 19.2}</div>
                                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end font-bold">
                                        <TrendingDown size={10} /> -0.4%
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <div className="flex gap-3">
                                <AlertCircle className="text-indigo-400 shrink-0" size={18} />
                                <p className="text-xs text-indigo-200/80 leading-relaxed font-medium">
                                    ZiG volatility is currently <span className="text-indigo-300 font-black">Moderate</span>. Suggesting settlement in USD for long-term contracts.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl border border-white/5 p-6">
                        <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-400 uppercase text-[10px] md:text-xs tracking-widest">
                            <LineChart size={16} />
                            Portfolio Stability
                        </h3>
                        <div className="relative h-24 md:h-32 flex items-end gap-2 px-2">
                            <div className="flex-1 bg-emerald-500/20 border-t-2 border-emerald-500 h-[90%] rounded-t-lg relative group">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-emerald-400 hidden group-hover:block uppercase font-black">USD</div>
                            </div>
                            <div className="flex-1 bg-blue-500/20 border-t-2 border-blue-500 h-[65%] rounded-t-lg relative group">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-blue-400 hidden group-hover:block uppercase font-black">ZAR</div>
                            </div>
                            <div className="flex-1 bg-amber-500/20 border-t-2 border-amber-500 h-[30%] rounded-t-lg relative group">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-amber-400 hidden group-hover:block uppercase font-black">ZiG</div>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-[9px] text-slate-400 font-black uppercase tracking-widest">Value Retention (30D)</div>
                    </div>
                </div>

                {/* Procurement Comparison Tab */}
                <div className="xl:col-span-2 space-y-6 md:space-y-8">
                    <div className="bg-slate-900 rounded-3xl border border-white/5 p-5 md:p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 mb-8">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-white">Settlement Advisor</h2>
                                <p className="text-slate-400 text-[11px] md:text-sm font-medium">Best-in-class price discovery for inputs</p>
                            </div>
                            <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                {items.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => setSelectedItem(item)}
                                        className={`px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedItem === item
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedItem ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {quotes.filter(q => q.itemName === selectedItem).map(quote => {
                                    const bestDeal = getBestDeal(selectedItem);
                                    const isBest = bestDeal?.id === quote.id;
                                    const usdEq = convertToUSD(quote.price, quote.currency);
                                    const protection = calculateInflationProtection(quote);

                                    return (
                                        <div
                                            key={quote.id}
                                            className={`relative p-5 md:p-6 rounded-3xl border transition-all ${isBest
                                                ? 'bg-emerald-500/5 border-emerald-500/30 scale-[1.01]'
                                                : 'bg-slate-950/50 border-white/5 opacity-70'
                                                }`}
                                        >
                                            {isBest && (
                                                <div className="absolute -top-3 left-5 px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-full shadow-lg flex items-center gap-1 uppercase tracking-tighter">
                                                    <CheckCircle2 size={12} /> BEST VALUE
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="text-base md:text-lg font-black text-white">{quote.supplierName}</div>
                                                    <div className="text-[10px] text-slate-400 mt-1 font-bold">Ends {quote.validUntil}</div>
                                                </div>
                                                <div className={`p-2 rounded-xl flex items-center justify-center ${quote.currency === 'USD' ? 'bg-emerald-500/10 text-emerald-400' : quote.currency === 'ZAR' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                    <DollarSign size={18} />
                                                </div>
                                            </div>

                                            <div className="flex items-baseline gap-2 mb-6">
                                                <div className="text-2xl md:text-3xl font-black text-white">{quote.price} {quote.currency}</div>
                                                <div className="text-xs text-slate-400 font-bold">≈ ${usdEq.toFixed(2)}</div>
                                            </div>

                                            <div className="space-y-3 pt-4 border-t border-white/5">
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="text-slate-400 flex items-center gap-1 font-bold">
                                                        <BadgePercent size={14} className="text-indigo-400" />
                                                        Stability
                                                    </span>
                                                    <span className={`font-black ${protection > 80 ? 'text-emerald-400' : protection > 60 ? 'text-blue-400' : 'text-amber-400'}`}>
                                                        {protection}%
                                                    </span>
                                                </div>
                                                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${protection > 80 ? 'bg-emerald-500' : protection > 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                                        style={{ width: `${protection}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <button className="w-full mt-6 py-3 bg-slate-800 hover:bg-ecomattBlack rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-200 transition-colors flex items-center justify-center gap-2 border border-white/5 active:scale-95">
                                                Lock In Price <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-48 md:h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-slate-950/20">
                                <Calculator className="text-slate-800 mb-4" size={40} />
                                <p className="text-slate-500 text-xs md:text-sm font-black uppercase tracking-widest px-4 text-center">Select item to compare quotes</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900 rounded-3xl border border-white/5 p-5 md:p-8">
                        <h3 className="text-lg md:text-xl font-black mb-6 flex items-center gap-2 text-white">
                            <History className="text-indigo-400" />
                            Savings Log
                        </h3>

                        {/* Mobile Optimized Cards for Log */}
                        <div className="md:hidden space-y-4">
                            {[
                                { date: 'Dec 12, 2025', item: 'Grower Pellets', supplier: 'AgriSupply S.A.', cur: 'ZAR', save: '+$142.50' },
                                { date: 'Dec 08, 2025', item: 'Vaccine Batch #A04', supplier: 'VetDirect Int.', cur: 'USD', save: '+$38.20' }
                            ].map((log, i) => (
                                <div key={i} className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase mb-1">{log.date}</div>
                                            <div className="text-sm font-black text-white">{log.item}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-black text-emerald-400">{log.save}</div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase">Total Saved</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <div className="text-[11px] font-bold text-slate-300">{log.supplier}</div>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${log.cur === 'USD' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>{log.cur}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] text-slate-500 uppercase tracking-widest">
                                        <th className="pb-4 font-black">Date</th>
                                        <th className="pb-4 font-black">Item</th>
                                        <th className="pb-4 font-black">Supplier</th>
                                        <th className="pb-4 font-black">Currency</th>
                                        <th className="pb-4 font-black">Savings (USD)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr className="text-sm">
                                        <td className="py-4 text-slate-400">Dec 12, 2025</td>
                                        <td className="py-4 font-black text-white">Grower Pellets</td>
                                        <td className="py-4 text-slate-200">AgriSupply S.A.</td>
                                        <td className="py-4"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-black">ZAR</span></td>
                                        <td className="py-4 text-emerald-400 font-black">+$142.50</td>
                                    </tr>
                                    <tr className="text-sm">
                                        <td className="py-4 text-slate-400">Dec 08, 2025</td>
                                        <td className="py-4 font-black text-white">Vaccine Batch #A04</td>
                                        <td className="py-4 text-slate-200">VetDirect Int.</td>
                                        <td className="py-4"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-black">USD</span></td>
                                        <td className="py-4 text-emerald-400 font-black">+$38.20</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProcurementAdvisor;
