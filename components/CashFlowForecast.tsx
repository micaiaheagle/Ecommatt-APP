
import React from 'react';
import { FinanceRecord, Pig, PigStage } from '../types';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend } from 'recharts';

interface CashFlowForecastProps {
  records: FinanceRecord[];
  pigs: Pig[];
  onCancel: () => void;
}

const CashFlowForecast: React.FC<CashFlowForecastProps> = ({ records, pigs, onCancel }) => {
  
  // 1. Calculate Projected Income from Pigs reaching market weight (Finishers)
  // Assuming average market value $250 per finisher, ready in approx 30-60 days if currently 'Finisher'
  const projectedPigSales = pigs
    .filter(p => p.stage === PigStage.Finisher && p.status === 'Active')
    .map((p, idx) => ({
        id: `proj-sale-${p.id}`,
        date: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Mock: ready in 30 days
        type: 'Income' as const,
        category: 'Projected Sales',
        amount: 250, // Est value
        description: `Sale: ${p.tagId}`,
        status: 'Projected' as const
    }));

  // Combine existing scheduled records with projected sales
  const allFutureItems = [
      ...records.filter(r => r.status === 'Scheduled'),
      ...projectedPigSales
  ];

  // 2. Build Timeline Buckets (Next 90 Days)
  const today = new Date();
  const buckets = {
      '30 Days': { income: 0, expense: 0, net: 0, items: [] as any[] },
      '60 Days': { income: 0, expense: 0, net: 0, items: [] as any[] },
      '90 Days': { income: 0, expense: 0, net: 0, items: [] as any[] }
  };

  let runningCash = 5850; // Mock Starting Balance (Current Cash on Hand)
  const chartData = [];

  // Sort by date
  allFutureItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  allFutureItems.forEach(item => {
      const itemDate = new Date(item.date);
      const diffTime = Math.abs(itemDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let bucketKey = '';
      if (diffDays <= 30) bucketKey = '30 Days';
      else if (diffDays <= 60) bucketKey = '60 Days';
      else if (diffDays <= 90) bucketKey = '90 Days';

      if (bucketKey) {
          // @ts-ignore
          buckets[bucketKey].items.push(item);
          if (item.type === 'Income') {
              // @ts-ignore
              buckets[bucketKey].income += item.amount;
              runningCash += item.amount;
          } else {
              // @ts-ignore
              buckets[bucketKey].expense += item.amount;
              runningCash -= item.amount;
          }
      }
  });

  // Prepare Chart Data
  chartData.push(
      { name: 'Now', balance: 5850, income: 0, expense: 0 },
      { name: '+30d', balance: 5850 + buckets['30 Days'].income - buckets['30 Days'].expense, income: buckets['30 Days'].income, expense: buckets['30 Days'].expense },
      { name: '+60d', balance: 5850 + buckets['30 Days'].net + buckets['60 Days'].income - buckets['60 Days'].expense, income: buckets['60 Days'].income, expense: buckets['60 Days'].expense },
      { name: '+90d', balance: 5850 + buckets['30 Days'].net + buckets['60 Days'].net + buckets['90 Days'].income - buckets['90 Days'].expense, income: buckets['90 Days'].income, expense: buckets['90 Days'].expense }
  );

  const lowestPoint = Math.min(...chartData.map(d => d.balance));
  const isDanger = lowestPoint < 1000; // Warning threshold

  return (
    <div className="animate-in slide-in-from-right duration-300 bg-grayBg min-h-full pb-20">
      <div className="flex items-center gap-3 mb-6">
        <button 
            onClick={onCancel}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50"
        >
            <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900">Cash Flow Forecast</h2>
      </div>

      {/* Alert Banner */}
      {isDanger ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl mb-6 shadow-sm animate-pulse">
              <div className="flex items-center gap-3">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                  <div>
                      <h4 className="font-bold text-red-800 text-sm">Potential Shortage Alert</h4>
                      <p className="text-xs text-red-600">Projected cash balance dips below $1,000 within 60 days. Review expenses.</p>
                  </div>
              </div>
          </div>
      ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl mb-6 shadow-sm">
              <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-green-600 text-xl"></i>
                  <div>
                      <h4 className="font-bold text-green-800 text-sm">Healthy Projection</h4>
                      <p className="text-xs text-green-600">Cash flow looks positive for the next quarter.</p>
                  </div>
              </div>
          </div>
      )}

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">90-Day Cash Position</h3>
          <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}}
                        formatter={(val: number) => `$${val.toLocaleString()}`}
                      />
                      <Legend />
                      <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="balance" stroke="#27cd00" strokeWidth={3} dot={{r: 4, fill: '#27cd00'}} name="Cash Balance" />
                  </LineChart>
              </ResponsiveContainer>
          </div>
      </div>

      {/* Breakdown Cards */}
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Forecast Details</h3>
      <div className="space-y-4">
          
          {/* 30 Days */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-gray-900">Next 30 Days</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${buckets['30 Days'].income >= buckets['30 Days'].expense ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      Net: {buckets['30 Days'].income - buckets['30 Days'].expense >= 0 ? '+' : ''}${(buckets['30 Days'].income - buckets['30 Days'].expense).toLocaleString()}
                  </span>
              </div>
              
              {/* Projected Items List */}
              <div className="space-y-2">
                  {buckets['30 Days'].items.length === 0 && <p className="text-xs text-gray-400 italic">No scheduled items.</p>}
                  {buckets['30 Days'].items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                              <i className={`fas fa-circle text-[6px] ${item.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}></i>
                              <span className="text-gray-600">{item.description}</span>
                              {item.status === 'Projected' && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 rounded">Est</span>}
                          </div>
                          <span className={`font-bold ${item.type === 'Income' ? 'text-green-600' : 'text-gray-900'}`}>
                              ${item.amount.toLocaleString()}
                          </span>
                      </div>
                  ))}
              </div>
          </div>

          {/* 60 Days */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 opacity-90">
              <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-gray-900">30 - 60 Days</h4>
                  <span className="text-xs font-bold text-gray-500">
                      Projected
                  </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-50 rounded-lg p-2">
                      <span className="block text-[10px] text-green-600 uppercase">Est. Income</span>
                      <span className="font-bold text-green-700">${buckets['60 Days'].income.toLocaleString()}</span>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2">
                      <span className="block text-[10px] text-red-600 uppercase">Est. Expense</span>
                      <span className="font-bold text-red-700">${buckets['60 Days'].expense.toLocaleString()}</span>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};

export default CashFlowForecast;
