import React, { useState, useMemo } from 'react';
import { WholesaleProduct, Customer, Order } from '../types';
import { ShoppingBag, TrendingUp, Calendar, ShieldCheck, ChevronRight, Filter, Search, Tag, ArrowUpRight, Clock, Star } from 'lucide-react';

interface WholesalePortalProps {
    products: WholesaleProduct[];
    customers: Customer[];
    onPlaceOrder: (order: Partial<Order>) => void;
    onBack?: () => void;
}

const WholesalePortal: React.FC<WholesalePortalProps> = ({
    products,
    customers,
    onPlaceOrder,
    onBack
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'All' | 'Pork' | 'Grain' | 'Vegetables'>('All');

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    return (
        <div className="bg-[#fafafa] min-h-screen animate-in fade-in duration-500">
            <div className="p-8 max-w-[1400px] mx-auto">

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {onBack && (
                                <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                                    <i className="fas fa-arrow-left text-xs"></i>
                                </button>
                            )}
                            <div className="flex items-center gap-2 px-3 py-1 bg-ecomattGreen/10 text-ecomattGreen rounded-lg">
                                <Star size={14} className="fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#4a7c00]">VIP Wholesale Access</span>
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Wholesale Market Portal</h2>
                    </div>

                    <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200 min-w-[320px]">
                        <div className="px-6 py-2 border-r border-slate-100 items-center flex flex-col">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Value</div>
                            <div className="text-xl font-black text-slate-900">$12,450</div>
                        </div>
                        <div className="px-6 py-2 items-center flex flex-col flex-1">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Incoming Yield</div>
                            <div className="text-xl font-black text-ecomattGreen">+2.4 Tons</div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Filter Sidebar */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ecomattGreen transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 py-5 pl-14 pr-6 rounded-3xl font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 ring-ecomattGreen/5 focus:border-ecomattGreen transition-all"
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                <Filter size={14} /> Categories
                            </h3>
                            <div className="flex flex-col gap-2">
                                {['All', 'Pork', 'Grain', 'Vegetables'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat as any)}
                                        className={`w-full px-6 py-4 rounded-2xl text-left font-black transition-all ${selectedCategory === cat ? 'bg-slate-900 text-white shadow-xl translate-x-1' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100 hover:border-slate-200'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-[11px] uppercase tracking-widest">{cat}</span>
                                            {selectedCategory === cat && <div className="w-1.5 h-1.5 bg-ecomattGreen rounded-full animate-pulse"></div>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Order Snapshot */}
                        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShoppingBag size={80} />
                            </div>
                            <h4 className="text-xl font-black mb-2 uppercase tracking-tight relative z-10">Direct Order</h4>
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-8 relative z-10">Priority Dispatch Enabled</p>

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between text-xs font-black border-b border-white/10 pb-4">
                                    <span className="text-white/40">Selected Items</span>
                                    <span>0 Units</span>
                                </div>
                                <div className="flex justify-between text-xl font-black py-4">
                                    <span className="text-white/40">Total Est.</span>
                                    <span className="text-ecomattGreen">$0.00</span>
                                </div>
                                <button className="w-full bg-ecomattGreen text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-ecomattGreen/20">
                                    Draft Contract
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-ecomattGreen/20 transition-all group flex flex-col justify-between h-full">
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 bg-slate-50 group-hover:bg-green-50 rounded-2xl flex items-center justify-center transition-colors">
                                                <ShoppingBag size={24} className="text-slate-400 group-hover:text-ecomattGreen" />
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${product.qualityGrade === 'A' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                                                    Grade {product.qualityGrade}
                                                </span>
                                                <div className="mt-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Available now</div>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{product.name}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">{product.category} • Certified Produce</p>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Price / {product.unit}</div>
                                                <div className="text-lg font-black text-slate-900">${product.pricePerUnit.toFixed(2)}</div>
                                            </div>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Stock</div>
                                                <div className="text-lg font-black text-slate-900">{product.availableQty} <span className="text-[10px] text-slate-400 uppercase">{product.unit}</span></div>
                                            </div>
                                        </div>

                                        {product.expectedHarvestDate && (
                                            <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mb-8">
                                                <Clock size={16} className="text-blue-500" />
                                                <div>
                                                    <div className="text-[9px] font-black text-blue-900 uppercase">Incoming Yield</div>
                                                    <div className="text-[11px] font-bold text-blue-700 uppercase">Forecast: {product.expectedHarvestDate}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button className="w-full py-5 border-2 border-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-2xl">
                                        Add to Contract <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            ))}

                            {/* Empty State */}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 mb-6">
                                        <Search size={40} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase">No Inventory Found</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Try adjusting your filters or search keywords</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WholesalePortal;
