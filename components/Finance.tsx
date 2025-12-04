
import React from 'react';
import { FinanceRecord } from '../types';
import { exportToPDF, exportToExcel, formatCurrency } from '../services/exportService';

interface FinanceProps {
    records: FinanceRecord[];
    onOpenLogger: () => void;
    onOpenBatch: () => void;
    onOpenCalculator: () => void;
    onOpenForecast: () => void;
    onOpenBudget: () => void;
    onOpenLoans: () => void;
    onOpenCostAnalysis: () => void;
    onOpenRatios: () => void; // New prop
}

const Finance: React.FC<FinanceProps> = ({
    records,
    onOpenLogger,
    onOpenBatch,
    onOpenCalculator,
    onOpenForecast,
    onOpenBudget,
    onOpenLoans,
    onOpenCostAnalysis,
    onOpenRatios
}) => {
    // Metrics: Only include 'Paid' (Actual) transactions for the header stats
    const totalIncome = records.filter(r => r.type === 'Income' && (r.status === 'Paid' || !r.status)).reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpense = records.filter(r => r.type === 'Expense' && (r.status === 'Paid' || !r.status)).reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalIncome - totalExpense;

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Projected': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Paid': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Cash Flow</h2>
                <div className="flex gap-2">
                    <button onClick={() => {
                        const columns = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Status'];
                        const data = records.map(r => [r.date, r.type, r.category, r.description, formatCurrency(r.amount), r.status]);
                        exportToPDF('Financial Report', columns, data, 'finance_report.pdf');
                    }} className="bg-white text-gray-600 px-3 py-1 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-50">
                        <i className="fas fa-file-pdf text-red-500 mr-1"></i> PDF
                    </button>
                    <button onClick={() => {
                        exportToExcel('finance_report.xlsx', 'Finance', records);
                    }} className="bg-white text-gray-600 px-3 py-1 rounded-lg text-xs font-bold border border-gray-200 hover:bg-gray-50">
                        <i className="fas fa-file-excel text-green-600 mr-1"></i> Excel
                    </button>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-gray-100">Nov 2025</span>
                </div>
            </div>

            {/* Main Stats Card */}
            <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Net Profit (Actual)</p>
                <h1 className={`text-4xl font-bold mt-2 mb-4 ${netProfit >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                    ${netProfit.toLocaleString()}
                </h1>

                <div className="flex justify-center gap-8 border-t border-gray-100 pt-4">
                    <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Income</span>
                        <span className="text-ecomattGreen font-bold text-sm">+${totalIncome.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Expense</span>
                        <span className="text-red-500 font-bold text-sm">-${totalExpense.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-6">
                <button onClick={onOpenLogger} className="col-span-1 flex flex-col items-center justify-center bg-gray-900 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition">
                    <i className="fas fa-plus mb-1 text-lg"></i>
                    <span className="text-[9px] font-bold text-center leading-tight">Log</span>
                </button>
                <button onClick={onOpenBatch} className="col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-700 p-3 rounded-2xl hover:border-ecomattGreen transition">
                    <i className="fas fa-layer-group mb-1 text-lg text-blue-500"></i>
                    <span className="text-[9px] font-bold text-center leading-tight">Batch P&L</span>
                </button>
                <button onClick={onOpenCalculator} className="col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-700 p-3 rounded-2xl hover:border-ecomattGreen transition">
                    <i className="fas fa-calculator mb-1 text-lg text-ecomattYellow"></i>
                    <span className="text-[9px] font-bold text-center leading-tight">Project</span>
                </button>
                <button onClick={onOpenForecast} className="col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-700 p-3 rounded-2xl hover:border-ecomattGreen transition">
                    <i className="fas fa-chart-line mb-1 text-lg text-purple-500"></i>
                    <span className="text-[9px] font-bold text-center leading-tight">Forecast</span>
                </button>
                <button onClick={onOpenBudget} className="col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-700 p-3 rounded-2xl hover:border-ecomattGreen transition">
                    <i className="fas fa-bullseye mb-1 text-lg text-red-500"></i>
                    <span className="text-[9px] font-bold text-center leading-tight">Budget</span>
                </button>
                <button onClick={onOpenLoans} className="col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-700 p-3 rounded-2xl hover:border-ecomattGreen transition">
                    <i className="fas fa-university mb-1 text-lg text-gray-600"></i>
                    <span className="text-[9px] font-bold text-center leading-tight">Loans</span>
                </button>
                <button onClick={onOpenCostAnalysis} className="col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-700 p-3 rounded-2xl hover:border-ecomattGreen transition">
                    <i className="fas fa-tags mb-1 text-lg text-orange-500"></i>
                    <span className="text-[9px] font-bold text-center leading-tight">Cost/Pig</span>
                </button>
                <button onClick={onOpenRatios} className="col-span-1 flex flex-col items-center justify-center bg-white border border-gray-200 text-gray-700 p-3 rounded-2xl hover:border-ecomattGreen transition">
                    <i className="fas fa-balance-scale mb-1 text-lg text-teal-500"></i>
                    <span className="text-[9px] font-bold text-center leading-tight">Ratios</span>
                </button>
            </div>

            {/* Transactions */}
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">All Transactions</h3>
            <div className="space-y-2 pb-6">
                {records.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-4">No transactions recorded yet.</p>
                ) : (
                    records
                        .slice()
                        .reverse() // Show newest first
                        .map(rec => (
                            <div key={rec.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${rec.type === 'Income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                        <i className={`fas ${rec.type === 'Income' ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{rec.description}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getStatusColor(rec.status)}`}>
                                                {rec.status || 'Paid'}
                                            </span>
                                            <span className="text-[10px] text-gray-400 truncate">{rec.category} • {rec.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`font-bold text-sm whitespace-nowrap ml-2 ${rec.type === 'Income' ? 'text-green-600' : 'text-gray-900'}`}>
                                    {rec.type === 'Income' ? '+' : '-'}${rec.amount.toLocaleString()}
                                </span>
                            </div>
                        ))
                )}
            </div>

        </div>
    );
};

export default Finance;
