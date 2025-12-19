
import React, { useState } from 'react';
import { FinanceRecord, Field, Asset, Currency } from '../types';

interface FinanceLoggerProps {
  onSave: (record: Omit<FinanceRecord, 'id'>) => void;
  onCancel: () => void;
  fields?: Field[];
  assets?: Asset[];
  batches?: string[]; // IDs or Names
}

const FinanceLogger: React.FC<FinanceLoggerProps> = ({ onSave, onCancel, fields = [], assets = [], batches = [] }) => {
  const [type, setType] = useState<'Income' | 'Expense'>('Expense');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'Feed',
    amount: '',
    description: '',
    batchId: '',
    enterprise: 'General' as 'General' | 'Piggery' | 'Poultry' | 'Crops' | 'Machinery',
    allocationId: ''
  });

  const incomeCategories = ['Sales', 'Service', 'Grant', 'Other Income'];
  const expenseCategories = ['Feed', 'Medication', 'Labor', 'Transport', 'Utilities', 'Maintenance', 'Equipment', 'Inputs', 'Other Expense'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    onSave({
      date: formData.date,
      type: type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      batchId: formData.enterprise === 'Piggery' ? formData.allocationId : undefined,
      enterprise: formData.enterprise,
      allocationId: formData.allocationId,
      currency: currency
    });
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-500 bg-grayBg min-h-full pb-20 p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 transition-all border border-gray-100"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Log Transaction</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Financial Entry</p>
          </div>
        </div>

        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex gap-1">
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${currency === 'USD' ? 'bg-gray-900 text-white' : 'text-gray-400'}`}
          >USD</button>
          <button
            type="button"
            onClick={() => setCurrency('ZiG')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${currency === 'ZiG' ? 'bg-ecomattGreen text-white' : 'text-gray-400'}`}
          >ZiG</button>
        </div>
      </div>

      <div className="bg-white p-1 rounded-2xl mb-6 shadow-sm border border-gray-100 flex overflow-hidden">
        <button
          type="button"
          onClick={() => { setType('Income'); setFormData({ ...formData, category: 'Sales' }); }}
          className={`flex-1 py-4 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-3 ${type === 'Income' ? 'bg-green-50 text-green-700 shadow-inner' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${type === 'Income' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
            <i className="fas fa-arrow-down text-[10px]"></i>
          </div>
          INCOME
        </button>
        <button
          type="button"
          onClick={() => { setType('Expense'); setFormData({ ...formData, category: 'Feed' }); }}
          className={`flex-1 py-4 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-3 ${type === 'Expense' ? 'bg-red-50 text-red-600 shadow-inner' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${type === 'Expense' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
            <i className="fas fa-arrow-up text-[10px]"></i>
          </div>
          EXPENSE
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1 mb-2 block">Transaction Date</label>
              <input
                type="date"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:border-ecomattGreen outline-none transition-all focus:bg-white focus:ring-4 focus:ring-ecomattGreen/5"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1 mb-2 block">Enterprise</label>
              <select
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 focus:border-ecomattGreen outline-none transition-all focus:bg-white focus:ring-4 focus:ring-ecomattGreen/5"
                value={formData.enterprise}
                onChange={(e) => setFormData({ ...formData, enterprise: e.target.value as any, allocationId: '' })}
              >
                <option value="General">General Farm</option>
                <option value="Piggery">Piggery</option>
                <option value="Poultry">Poultry</option>
                <option value="Crops">Crops</option>
                <option value="Machinery">Machinery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1 mb-2 block">Amount ({currency})</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-gray-300">{currency === 'USD' ? '$' : 'ZiG'}</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                className={`w-full bg-gray-50 border border-gray-100 rounded-2xl py-6 pl-12 pr-4 text-4xl font-black focus:border-ecomattGreen outline-none transition-all focus:bg-white focus:ring-4 focus:ring-ecomattGreen/5 ${type === 'Income' ? 'text-green-600' : 'text-gray-900'}`}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1 mb-2 block">Category</label>
              <select
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 focus:border-ecomattGreen outline-none transition-all focus:bg-white focus:ring-4 focus:ring-ecomattGreen/5"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {(type === 'Income' ? incomeCategories : expenseCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {formData.enterprise !== 'General' && (
              <div>
                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1 mb-2 block">Specific Allocation</label>
                <select
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 focus:border-ecomattGreen outline-none transition-all focus:bg-white focus:ring-4 focus:ring-ecomattGreen/5"
                  value={formData.allocationId}
                  onChange={(e) => setFormData({ ...formData, allocationId: e.target.value })}
                >
                  <option value="">-- No Specific Target --</option>
                  {formData.enterprise === 'Crops' && fields.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                  {formData.enterprise === 'Machinery' && assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1 mb-2 block">Description</label>
            <input
              type="text"
              placeholder={type === 'Income' ? "e.g. Sold 5 porkers to Machipisa Butchery" : "e.g. 50kg Sow Meal from National Foods"}
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:border-ecomattGreen outline-none transition-all focus:bg-white focus:ring-4 focus:ring-ecomattGreen/5"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

        </div>

        <button className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl shadow-gray-200 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
          <i className="fas fa-save"></i> Confirmed & Save
        </button>
      </form>
    </div>
  );
};

export default FinanceLogger;
