import React from 'react';

const MarketInsights: React.FC = () => {
    return (
        <div className="animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Market Insights</h2>
                    <p className="text-sm text-gray-500">Live commodity prices and market trends</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Pork Wholesale Prices (Per Kg)</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="font-bold text-gray-800">Grade A Carcass</span>
                            <div className="text-right">
                                <span className="font-mono font-bold text-lg text-gray-900">$3.80</span>
                                <span className="text-xs text-green-600 block"><i className="fas fa-arrow-up"></i> 0.05 vs last week</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="font-bold text-gray-800">Grade B Carcass</span>
                            <div className="text-right">
                                <span className="font-mono font-bold text-lg text-gray-900">$3.40</span>
                                <span className="text-xs text-red-500 block"><i className="fas fa-arrow-down"></i> 0.02 vs last week</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="font-bold text-gray-800">Weaners (Live)</span>
                            <div className="text-right">
                                <span className="font-mono font-bold text-lg text-gray-900">$45.00</span>
                                <span className="text-xs text-gray-400 block">- No change</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Feed Ingredients (Local Market)</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="font-bold text-gray-800">Maize (Ton)</span>
                            <div className="text-right">
                                <span className="font-mono font-bold text-lg text-gray-900">$280.00</span>
                                <span className="text-xs text-red-500 block"><i className="fas fa-arrow-up"></i> Price surging</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="font-bold text-gray-800">Soya Bean Meal (Ton)</span>
                            <div className="text-right">
                                <span className="font-mono font-bold text-lg text-gray-900">$490.00</span>
                                <span className="text-xs text-green-600 block"><i className="fas fa-arrow-down"></i> Stable</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <span className="font-bold text-gray-800">Wheat Bran (Ton)</span>
                            <div className="text-right">
                                <span className="font-mono font-bold text-lg text-gray-900">$150.00</span>
                                <span className="text-xs text-gray-400 block">- No change</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl shrink-0">
                        <i className="fas fa-brain"></i>
                    </div>
                    <div>
                        <h3 className="font-bold text-indigo-900 mb-1">AI Market Recommendation</h3>
                        <p className="text-sm text-indigo-800 mb-3">Maize prices are predicted to rise by 15% over the next two months due to recent weather patterns in the region. Recommendation: Secure bulk maize contracts now to lock in current prices.</p>
                        <button className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">View Full Analysis</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketInsights;
