import React, { useState } from 'react';

const Genetics: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Lineage' | 'AI' | 'Semen'>('Lineage');

    return (
        <div className="animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Genetics & Breeding</h2>
                    <p className="text-sm text-gray-500">Advanced lineage tracking and artificial insemination management</p>
                </div>
                <button className="bg-ecomattGreen text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors shadow-sm flex items-center gap-2">
                    <i className="fas fa-plus"></i> New Record
                </button>
            </div>

            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
                {(['Lineage', 'AI', 'Semen'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        {tab === 'Lineage' && <><i className="fas fa-sitemap mr-2"></i> Lineage Viewer</>}
                        {tab === 'AI' && <><i className="fas fa-syringe mr-2"></i> AI Schedule</>}
                        {tab === 'Semen' && <><i className="fas fa-snowflake mr-2"></i> Semen Inventory</>}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl mb-4">
                    <i className="fas fa-dna"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Prototype Module</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">This section is a UI prototype simulating deep genetic tracking, estimated breeding values (EBV), and AI success rates.</p>
                
                <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-100 rounded-xl p-4 text-left">
                        <i className="fas fa-project-diagram text-gray-400 mb-2 text-xl"></i>
                        <h4 className="font-bold text-gray-800 text-sm">Family Trees</h4>
                        <p className="text-xs text-gray-500">Visual mapping of generations</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4 text-left">
                        <i className="fas fa-chart-line text-gray-400 mb-2 text-xl"></i>
                        <h4 className="font-bold text-gray-800 text-sm">EBV Metrics</h4>
                        <p className="text-xs text-gray-500">Growth, litter size predictors</p>
                    </div>
                    <div className="border border-gray-100 rounded-xl p-4 text-left">
                        <i className="fas fa-calendar-check text-gray-400 mb-2 text-xl"></i>
                        <h4 className="font-bold text-gray-800 text-sm">AI Success Rates</h4>
                        <p className="text-xs text-gray-500">Conception rate analytics</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Genetics;
