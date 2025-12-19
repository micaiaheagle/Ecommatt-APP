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
                    <div className="bg-slate-900 rounded-3xl border border-white/5 p-6 border-b-4 border-b-indigo-500/50">
                        <h3 className="font-bold flex items-center gap-2 mb-6 text-indigo-300 uppercase text-xs tracking-widest">
                            <ArrowLeftRight size={16} />
                            Real-Time Cross Rates
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">US</div>
                                    <span className="font-bold">USD / ZiG</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black">{exchangeRates['ZiG']}</div>
                                    <div className="text-[10px] text-red-400 flex items-center gap-1 justify-end">
                                        <TrendingUp size={10} /> +0.2%
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">ZA</div>
                                    <span className="font-bold">USD / ZAR</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black">{exchangeRates['ZAR'] || 19.2}</div>
                                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
                                        <TrendingDown size={10} /> -0.4%
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <div className="flex gap-3">
                                <AlertCircle className="text-indigo-400 shrink-0" size={18} />
                                <p className="text-xs text-indigo-200/70 leading-relaxed">
                                    ZiG volatility is currently <span className="text-indigo-300 font-bold">Moderate</span>. Suggesting settlement in USD for long-term contracts.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl border border-white/5 p-6">
                        <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-400 uppercase text-xs tracking-widest">
                            <LineChart size={16} />
                            Portfolio Stability
                        </h3>
                        <div className="relative h-32 flex items-end gap-2 px-2">
                            <div className="flex-1 bg-emerald-500/20 border-t-2 border-emerald-500 h-[90%] rounded-t-lg relative group">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-emerald-400 hidden group-hover:block uppercase">USD</div>
                            </div>
                            <div className="flex-1 bg-blue-500/20 border-t-2 border-blue-500 h-[65%] rounded-t-lg relative group">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-blue-400 hidden group-hover:block uppercase">ZAR</div>
                            </div>
                            <div className="flex-1 bg-amber-500/20 border-t-2 border-amber-500 h-[30%] rounded-t-lg relative group">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-amber-400 hidden group-hover:block uppercase">ZiG</div>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">Estimated Value Retention (30 Days)</div>
                    </div>
                </div>

                {/* Procurement Comparison Tab */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-slate-900 rounded-3xl border border-white/5 p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black">Settlement Advisor</h2>
                                <p className="text-slate-500 text-xs md:text-sm">Best-in-class price discovery for critical inputs</p>
                            </div>
                            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                {items.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => setSelectedItem(item)}
                                        className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${selectedItem === item
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedItem ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {quotes.filter(q => q.itemName === selectedItem).map(quote => {
                                    const bestDeal = getBestDeal(selectedItem);
                                    const isBest = bestDeal?.id === quote.id;
                                    const usdEq = convertToUSD(quote.price, quote.currency);
                                    const protection = calculateInflationProtection(quote);

                                    return (
                                        <div
                                            key={quote.id}
                                            className={`relative p-6 rounded-3xl border transition-all ${isBest
                                                ? 'bg-emerald-500/5 border-emerald-500/30 scale-[1.02]'
                                                : 'bg-slate-950/50 border-white/5 grayscale-[0.3]'
                                                }`}
                                        >
                                            {isBest && (
                                                <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-lg flex items-center gap-1">
                                                    <CheckCircle2 size={12} /> BEST VALUE
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="text-lg font-bold text-white">{quote.supplierName}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">Valid until {quote.validUntil}</div>
                                                </div>
                                                <div className={`p-2 rounded-xl bg-opacity-10 ${quote.currency === 'USD' ? 'bg-emerald-500 text-emerald-400' : quote.currency === 'ZAR' ? 'bg-blue-500 text-blue-400' : 'bg-amber-500 text-amber-400'}`}>
                                                    <DollarSign size={20} />
                                                </div>
                                            </div>

                                            <div className="flex items-end gap-2 mb-6">
                                                <div className="text-3xl font-black">{quote.price} {quote.currency}</div>
                                                <div className="text-sm text-slate-500 mb-1">≈ ${usdEq.toFixed(2)} USD</div>
                                            </div>

                                            <div className="space-y-4 pt-4 border-t border-white/5">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500 flex items-center gap-1">
                                                        <BadgePercent size={14} className="text-indigo-400" />
                                                        Inflation Protection
                                                    </span>
                                                    <span className={`font-bold ${protection > 80 ? 'text-emerald-400' : protection > 60 ? 'text-blue-400' : 'text-amber-400'}`}>
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

                                            <button className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 transition-colors flex items-center justify-center gap-2">
                                                Lock In This Price <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-slate-950/20">
                                <Calculator className="text-slate-800 mb-4" size={48} />
                                <p className="text-slate-600 font-medium">Select an input material to compare quotes</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900 rounded-3xl border border-white/5 p-4 md:p-8">
                        <h3 className="text-lg md:text-xl font-black mb-6 flex items-center gap-2">
                            <History className="text-indigo-400" />
                            Strategic Savings Log
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] text-slate-500 uppercase tracking-widest">
                                        <th className="pb-4 font-black">Date</th>
                                        <th className="pb-4 font-black">Item</th>
                                        <th className="pb-4 font-black">Selected Supplier</th>
                                        <th className="pb-4 font-black">Currency used</th>
                                        <th className="pb-4 font-black">USD Savings vs Average</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <tr className="text-sm">
                                        <td className="py-4 text-slate-400">Dec 12, 2025</td>
                                        <td className="py-4 font-bold">Grower Pellets</td>
                                        <td className="py-4">AgriSupply S.A.</td>
                                        <td className="py-4"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold">ZAR</span></td>
                                        <td className="py-4 text-emerald-400 font-bold">+$142.50</td>
                                    </tr>
                                    <tr className="text-sm">
                                        <td className="py-4 text-slate-400">Dec 08, 2025</td>
                                        <td className="py-4 font-bold">Vaccine Batch #A04</td>
                                        <td className="py-4">VetDirect Int.</td>
                                        <td className="py-4"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold">USD</span></td>
                                        <td className="py-4 text-emerald-400 font-bold">+$38.20</td>
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
