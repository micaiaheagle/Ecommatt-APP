import React, { useState } from 'react';
import { FinanceRecord, Field, Asset } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface CostCentersProps {
    financeRecords: FinanceRecord[];
    fields: Field[];
    assets: Asset[];
    onCancel: () => void;
}

const CostCenters: React.FC<CostCentersProps> = ({ financeRecords, fields, assets, onCancel }) => {
    const [activeTab, setActiveTab] = useState<'All' | 'Piggery' | 'Crops' | 'Machinery' | 'Poultry'>('All');

    // 1. Calculate Aggregates per Enterprise
    const enterprises = ['Piggery', 'Crops', 'Machinery', 'Poultry', 'General'];
    const pnlData = enterprises.map(ent => {
        const entRecords = financeRecords.filter(r => (r.enterprise || 'General') === ent && r.status === 'Paid');
        const income = entRecords.filter(r => r.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
        const expense = entRecords.filter(r => r.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
        return {
            name: ent,
            Income: income,
            Expense: expense,
            Profit: income - expense
        };
    });

    const activeRecords = activeTab === 'All'
        ? financeRecords
        : financeRecords.filter(r => (r.enterprise || 'General') === activeTab);


    return (
        <div className="animate-in slide-in-from-right duration-300 bg-grayBg min-h-full pb-20">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onCancel}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50"
                >
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900">Cost Centers (P&L)</h2>
            </div>

            {/* Overall Chart */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Enterprise Performance</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pnlData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                            <Tooltip
                                cursor={{ fill: '#f3f4f6' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                                formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                            <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-4 pb-2 no-scrollbar">
                {['All', 'Piggery', 'Crops', 'Machinery', 'Poultry'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${activeTab === tab ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Breakdown List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50">
                    <h3 className="text-sm font-bold text-gray-900">Breakdown: {activeTab}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                    {activeRecords.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-xs">No records found for {activeTab}.</div>
                    ) : (
                        activeRecords.slice().reverse().map(rec => {
                            // Find allocation name
                            let allocationName = '';
                            if (rec.enterprise === 'Crops' && rec.allocationId) allocationName = fields.find(f => f.id === rec.allocationId)?.name || '';
                            if (rec.enterprise === 'Machinery' && rec.allocationId) allocationName = assets.find(a => a.id === rec.allocationId)?.name || '';

                            return (
                                <div key={rec.id} className="p-4 flex justify-between items-center hover:bg-gray-50 bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${rec.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                            <i className={`fas ${rec.type === 'Income' ? 'fa-arrow-down' : 'fa-arrow-up'} text-xs`}></i>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">{rec.description}</p>
                                            <p className="text-[10px] text-gray-400">
                                                {rec.category} • {rec.date}
                                                {allocationName && <span className="ml-1 bg-gray-100 px-1 rounded text-gray-600">{allocationName}</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold ${rec.type === 'Income' ? 'text-green-600' : 'text-gray-900'}`}>
                                        {rec.type === 'Income' ? '+' : '-'}${rec.amount.toLocaleString()}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default CostCenters;
