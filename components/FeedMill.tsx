import React, { useState } from 'react';

const FeedMill: React.FC = () => {
    return (
        <div className="animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Feed Mill & Formulator</h2>
                    <p className="text-sm text-gray-500">Manage on-farm feed production, raw materials, and custom formulas</p>
                </div>
                <button className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2">
                    <i className="fas fa-blender"></i> New Batch
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><i className="fas fa-list-ol text-orange-500"></i> Active Formulas</h3>
                        <div className="space-y-3">
                            <div className="p-4 rounded-xl border border-gray-100 hover:border-orange-500 transition cursor-pointer flex justify-between items-center group">
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition">Weaner Starter Premium</h4>
                                    <p className="text-xs text-gray-500">Maize 60%, Soya 25%, Fishmeal 10%, Premix 5%</p>
                                </div>
                                <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">Active</span>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-100 hover:border-orange-500 transition cursor-pointer flex justify-between items-center group">
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition">Grower Standard</h4>
                                    <p className="text-xs text-gray-500">Maize 65%, Soya 20%, Wheat Bran 10%, Premix 5%</p>
                                </div>
                                <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">Active</span>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-100 hover:border-orange-500 transition cursor-pointer flex justify-between items-center group">
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition">Sow Lactation</h4>
                                    <p className="text-xs text-gray-500">High energy, high protein formulation</p>
                                </div>
                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Archived</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Raw Material Stock</h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">Maize</span>
                                <span className="font-mono text-sm text-gray-900">4,500 kg</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">Soya Bean Meal</span>
                                <span className="font-mono text-sm text-red-500">120 kg <i className="fas fa-exclamation-circle ml-1"></i></span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">Wheat Bran</span>
                                <span className="font-mono text-sm text-gray-900">800 kg</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">Vitamin Premix</span>
                                <span className="font-mono text-sm text-gray-900">50 kg</span>
                            </li>
                        </ul>
                        <button className="w-full mt-6 bg-gray-100 text-gray-700 text-xs font-bold py-2 rounded-lg hover:bg-gray-200 transition">Update Inventory</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedMill;
