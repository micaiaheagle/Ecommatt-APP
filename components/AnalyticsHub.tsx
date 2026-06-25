import React, { useState } from 'react';

const AnalyticsHub: React.FC = () => {
    return (
        <div className="animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
                    <p className="text-sm text-gray-500">Generate insights and farm performance summaries</p>
                </div>
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                    <i className="fas fa-file-download"></i> Export Report
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Herd</p>
                    <p className="text-2xl font-bold text-gray-900">1,245</p>
                    <p className="text-xs text-green-600 mt-2 font-semibold"><i className="fas fa-arrow-up"></i> +5.2% this month</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Avg Mortality Rate</p>
                    <p className="text-2xl font-bold text-gray-900">2.1%</p>
                    <p className="text-xs text-green-600 mt-2 font-semibold"><i className="fas fa-arrow-down"></i> -0.4% this month</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Feed Conversion Ratio</p>
                    <p className="text-2xl font-bold text-gray-900">2.8</p>
                    <p className="text-xs text-gray-400 mt-2 font-semibold">Target: 2.6</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Mtd Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$39,750</p>
                    <p className="text-xs text-green-600 mt-2 font-semibold"><i className="fas fa-arrow-up"></i> +12.5% vs last month</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Simulated Chart 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Herd Growth Trend (Simulated)</h3>
                    <div className="w-full h-64 bg-gray-50 rounded-xl flex items-end p-4 gap-2 relative">
                        {/* Fake bars */}
                        <div className="flex-1 bg-blue-100 rounded-t-sm h-[40%] hover:bg-blue-200 transition"></div>
                        <div className="flex-1 bg-blue-200 rounded-t-sm h-[45%] hover:bg-blue-300 transition"></div>
                        <div className="flex-1 bg-blue-300 rounded-t-sm h-[60%] hover:bg-blue-400 transition"></div>
                        <div className="flex-1 bg-blue-400 rounded-t-sm h-[75%] hover:bg-blue-500 transition"></div>
                        <div className="flex-1 bg-blue-500 rounded-t-sm h-[85%] hover:bg-blue-600 transition"></div>
                        <div className="flex-1 bg-blue-600 rounded-t-sm h-[100%] hover:bg-blue-700 transition"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                    </div>
                </div>

                {/* Simulated Chart 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Expense Breakdown (Simulated)</h3>
                    <div className="w-full h-64 flex items-center justify-center relative">
                        <div className="w-48 h-48 rounded-full border-[20px] border-ecomattGreen relative overflow-hidden">
                            {/* Fake pie slices using borders for visual prototype */}
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500 origin-left" style={{ transform: 'rotate(45deg)' }}></div>
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-400 origin-left" style={{ transform: 'rotate(120deg)' }}></div>
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-500 origin-left" style={{ transform: 'rotate(200deg)' }}></div>
                            
                            <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center z-10 shadow-inner">
                                <span className="text-xs text-gray-500 font-bold uppercase">Total Costs</span>
                                <span className="text-xl font-bold text-gray-900">$18.4K</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 text-xs text-gray-600 mt-4">
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-ecomattGreen rounded-full"></span> Feed</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Meds</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-400 rounded-full"></span> Labor</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded-full"></span> Other</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Recent Automated Reports</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center text-xl">
                                <i className="fas fa-file-pdf"></i>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-900">May 2026 Monthly Performance</p>
                                <p className="text-xs text-gray-500">Generated on June 1, 2026</p>
                            </div>
                        </div>
                        <button className="text-blue-600 font-bold text-xs hover:underline">Download</button>
                    </div>
                    <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xl">
                                <i className="fas fa-file-excel"></i>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-900">Q1 2026 Financial Summary</p>
                                <p className="text-xs text-gray-500">Generated on April 5, 2026</p>
                            </div>
                        </div>
                        <button className="text-blue-600 font-bold text-xs hover:underline">Download</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsHub;
