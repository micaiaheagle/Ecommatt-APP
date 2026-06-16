
import React, { useState } from 'react';
import { FinanceRecord } from '../types';

interface FinanceLoggerProps {
  onSave: (record: Omit<FinanceRecord, 'id'>) => void;
  onCancel: () => void;
}

const FinanceLogger: React.FC<FinanceLoggerProps> = ({ onSave, onCancel }) => {
  const [type, setType] = useState<'Income' | 'Expense'>('Expense');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Feed',
    amount: '',
    description: '',
    batchId: ''
  });

  const incomeCategories = ['Pork Sales', 'Weaner Sales', 'Cull Sales', 'Manure/Compost', 'Other Income'];
  const expenseCategories = ['Feed', 'Medication', 'Labor', 'Transport', 'Utilities', 'Maintenance', 'Equipment', 'Other Expense'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    onSave({
      date: formData.date,
      type: type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      batchId: formData.batchId
    });
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-300 bg-grayBg min-h-full pb-20">
      <div className="flex items-center gap-3 mb-6">
        <button 
            onClick={onCancel}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50"
        >
            <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900">Log Transaction</h2>
      </div>

      <div className="bg-white p-1 rounded-xl mb-6 shadow-sm border border-gray-100 flex">
        <button 
            onClick={() => { setType('Income'); setFormData({...formData, category: 'Pork Sales'}); }}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${type === 'Income' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-500'}`}
        >
            <i className="fas fa-arrow-down"></i> Income
        </button>
        <button 
            onClick={() => { setType('Expense'); setFormData({...formData, category: 'Feed'}); }}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${type === 'Expense' ? 'bg-red-100 text-red-600 shadow-sm' : 'text-gray-500'}`}
        >
            <i className="fas fa-arrow-up"></i> Expense
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            
            <div>
                <label className="text-xs text-gray-500 font-bold uppercase ml-1">Date</label>
                <input 
                    type="date" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
            </div>

            <div>
                <label className="text-xs text-gray-500 font-bold uppercase ml-1">Category</label>
                <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm text-gray-700 focus:border-ecomattGreen outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                    {(type === 'Income' ? incomeCategories : expenseCategories).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="text-xs text-gray-500 font-bold uppercase ml-1">Amount ($)</label>
                <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    required
                    className={`w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-2xl font-bold focus:border-ecomattGreen outline-none ${type === 'Income' ? 'text-green-600' : 'text-red-500'}`}
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
            </div>

            <div>
                <label className="text-xs text-gray-500 font-bold uppercase ml-1">Description</label>
                <input 
                    type="text" 
                    placeholder={type === 'Income' ? "e.g. Sold 5 porkers to butchery" : "e.g. Bought 20 bags sow meal"}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>

            <div>
                <label className="text-xs text-gray-500 font-bold uppercase ml-1">Assign to Batch (Optional)</label>
                <input 
                    type="text" 
                    placeholder="e.g. Batch-22"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                    value={formData.batchId}
                    onChange={(e) => setFormData({...formData, batchId: e.target.value})}
                />
                <p className="text-[10px] text-gray-400 mt-1 ml-1">Used for calculating Batch Profitability</p>
            </div>

        </div>

        <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            <i className="fas fa-save"></i> Save Transaction
        </button>
      </form>
    </div>
  );
};

export default FinanceLogger;
