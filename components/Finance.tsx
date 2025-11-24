import React from 'react';
import { FinanceRecord } from '../types';

interface FinanceProps {
  records: FinanceRecord[];
}

const Finance: React.FC<FinanceProps> = ({ records }) => {
  const totalIncome = records.filter(r => r.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = records.filter(r => r.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Cash Flow</h2>
          <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-gray-100">Nov 2025</span>
      </div>

      {/* Main Stats Card */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-md border border-gray-100 text-center relative overflow-hidden">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Net Profit (Est)</p>
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

      {/* Transactions */}
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Recent Transactions</h3>
      <div className="space-y-2">
        {records.map(rec => (
            <div key={rec.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${rec.type === 'Income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                        <i className={`fas ${rec.type === 'Income' ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{rec.description}</p>
                        <p className="text-[10px] text-gray-500">{rec.category} • {rec.date}</p>
                    </div>
                </div>
                <span className={`font-bold text-sm ${rec.type === 'Income' ? 'text-green-600' : 'text-gray-900'}`}>
                    {rec.type === 'Income' ? '+' : '-'}${rec.amount.toLocaleString()}
                </span>
            </div>
        ))}
      </div>

      {/* Action Button */}
      <button className="w-full mt-6 bg-ecomattGreen text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2">
         <i className="fas fa-plus"></i> New Transaction
      </button>

    </div>
  );
};

export default Finance;