import React, { useState } from 'react';

const Biosecurity: React.FC = () => {
    return (
        <div className="animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Biosecurity & Health</h2>
                    <p className="text-sm text-gray-500">Sanitation protocols, disease tracking, and visitor logging</p>
                </div>
                <button className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle"></i> Log Incident
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Active Protocols</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl border border-green-100 bg-green-50 flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><i className="fas fa-shower"></i></div>
                            <span className="font-bold text-sm text-green-900">Shower-In / Shower-Out</span>
                            <span className="text-xs text-green-700">Enforced for all staff</span>
                        </div>
                        <div className="p-4 rounded-xl border border-yellow-100 bg-yellow-50 flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center"><i className="fas fa-truck"></i></div>
                            <span className="font-bold text-sm text-yellow-900">Vehicle Disinfection</span>
                            <span className="text-xs text-yellow-700">Required at Main Gate</span>
                        </div>
                        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><i className="fas fa-shoe-prints"></i></div>
                            <span className="font-bold text-sm text-blue-900">Footbaths</span>
                            <span className="text-xs text-blue-700">Active at all house entrances</span>
                        </div>
                        <div className="p-4 rounded-xl border border-purple-100 bg-purple-50 flex flex-col gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><i className="fas fa-bug"></i></div>
                            <span className="font-bold text-sm text-purple-900">Pest Control</span>
                            <span className="text-xs text-purple-700">Last treated: 2 days ago</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 text-2xl mb-4 mx-auto">
                        <i className="fas fa-clipboard-list"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Sanitation Logs</h3>
                    <p className="text-sm max-w-sm mx-auto mb-6">A detailed history of all cleaning and disinfection activities will be shown here.</p>
                </div>
            </div>
        </div>
    );
};

export default Biosecurity;
