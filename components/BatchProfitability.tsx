
import React, { useState } from 'react';
import { FinanceRecord } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BatchProfitabilityProps {
  records: FinanceRecord[];
  onCancel: () => void;
}

const BatchProfitability: React.FC<BatchProfitabilityProps> = ({ records, onCancel }) => {
  // Extract unique batches from records
  const batches = Array.from(new Set(records.map(r => r.batchId).filter(Boolean))) as string[];
  const [selectedBatch, setSelectedBatch] = useState(batches.length > 0 ? batches[0] : '');

  // Filter Data
  const batchRecords = records.filter(r => r.batchId === selectedBatch);
  
  const revenue = batchRecords
    .filter(r => r.type === 'Income')
    .reduce((sum, r) => sum + r.amount, 0);
    
  const expenses = batchRecords
    .filter(r => r.type === 'Expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const profit = revenue - expenses;
  const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0';

  // Cost Breakdown
  const expenseCategories = batchRecords
    .filter(r => r.type === 'Expense')
    .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {} as Record<string, number>);

  const chartData = [
      { name: 'Revenue', value: revenue, color: '#27cd00' },
      { name: 'Cost', value: expenses, color: '#ef4444' }
  ];

  return (
    <div className="animate-in slide-in-from-right duration-300 bg-grayBg min-h-full pb-20">
        <div className="flex items-center gap-3 mb-6">
            <button 
                onClick={onCancel}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50"
            >
                <i className="fas fa-arrow-left"></i>
            </button>
            <h2 className="text-xl font-bold text-gray-900">Batch P&L Analysis</h2>
        </div>

        {/* Batch Selector */}
        <div className="mb-6">
            <label className="text-xs text-gray-500 font-bold uppercase ml-1">Select Batch</label>
            <div className="relative mt-1">
                <select 
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 focus:border-ecomattGreen outline-none appearance-none"
                >
                    {batches.length === 0 && <option>No batches found</option>}
                    {batches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
        </div>

        {selectedBatch ? (
            <>
                {/* Hero Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-center">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Net Profit</p>
                    <h1 className={`text-4xl font-bold mt-2 mb-2 ${profit >= 0 ? 'text-ecomattGreen' : 'text-red-500'}`}>
                        ${profit.toLocaleString()}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${profit >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {margin}% Margin
                    </span>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-40">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Rev vs Cost</h4>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" hide />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-40 overflow-y-auto no-scrollbar">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Cost Breakdown</h4>
                        <div className="space-y-2">
                            {Object.entries(expenseCategories).map(([cat, amt]) => (
                                <div key={cat} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-600">{cat}</span>
                                    <span className="font-bold text-gray-900">${amt.toLocaleString()}</span>
                                </div>
                            ))}
                            {Object.keys(expenseCategories).length === 0 && <p className="text-xs text-gray-300">No expenses.</p>}
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Batch Transactions</h3>
                <div className="space-y-2">
                    {batchRecords.map(rec => (
                        <div key={rec.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-gray-800">{rec.description}</p>
                                <p className="text-[10px] text-gray-500">{rec.date} • {rec.category}</p>
                            </div>
                            <span className={`text-xs font-bold ${rec.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>
                                {rec.type === 'Income' ? '+' : '-'}${rec.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </>
        ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <i className="fas fa-layer-group text-gray-300 text-4xl mb-4"></i>
                <p className="text-gray-500 font-bold">No Batch Data Found</p>
                <p className="text-xs text-gray-400 mt-2">Log transactions with a "Batch ID" to see them here.</p>
            </div>
        )}
    </div>
  );
};

export default BatchProfitability;
