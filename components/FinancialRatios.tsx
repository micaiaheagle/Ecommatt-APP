
import React, { useState } from 'react';
import { FinanceRecord, Pig, FeedInventory, LoanRecord, PigStage } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, BarChart, Bar, AreaChart, Area } from 'recharts';

interface FinancialRatiosProps {
  financeRecords: FinanceRecord[];
  pigs: Pig[];
  feeds: FeedInventory[];
  loans: LoanRecord[];
  onCancel: () => void;
}

const FinancialRatios: React.FC<FinancialRatiosProps> = ({ financeRecords, pigs, feeds, loans, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'Liquidity' | 'Profitability' | 'Efficiency'>('Profitability');

  // --- 1. Calculate Current Financial Position ---
  
  // A. Assets
  const cashOnHand = 5850; // Mock current cash (or derived from running balance)
  const feedValue = feeds.reduce((sum, f) => sum + (f.quantityKg * 0.45), 0); // Est $0.45/kg
  
  const getPigValue = (stage: PigStage) => {
      switch(stage) {
          case 'Piglet': return 35;
          case 'Weaner': return 60;
          case 'Grower': return 120;
          case 'Finisher': return 220;
          case 'Sow': return 350;
          case 'Boar': return 400;
          default: return 0;
      }
  };
  const herdValue = pigs.reduce((sum, p) => sum + getPigValue(p.stage), 0);
  
  const totalCurrentAssets = cashOnHand + feedValue + herdValue;

  // B. Liabilities
  const totalCurrentLiabilities = loans.filter(l => l.status === 'Active').reduce((sum, l) => sum + l.balance, 0); // Simplified: Assuming entire loan balance is current for prototype

  // C. Income Statement (YTD or All Time)
  const totalRevenue = financeRecords.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = financeRecords.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  // --- 2. Calculate Ratios ---

  // Current Ratio (Liquidity) = Current Assets / Current Liabilities
  const currentRatio = totalCurrentLiabilities > 0 ? (totalCurrentAssets / totalCurrentLiabilities).toFixed(2) : "High";
  
  // Net Profit Margin (Profitability) = (Net Profit / Revenue) * 100
  const netProfitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0.0";

  // Operating Expense Ratio (Efficiency) = (Operating Expenses / Revenue)
  // Assuming all logged expenses are operating for now
  const operatingExpenseRatio = totalRevenue > 0 ? (totalExpenses / totalRevenue).toFixed(2) : "0.00";


  // --- 3. Mock Trend Data (6 Months) ---
  const trendData = [
      { month: 'Jun', ratio: 1.2, margin: 15, benchmark: 1.5, marginBench: 20 },
      { month: 'Jul', ratio: 1.3, margin: 18, benchmark: 1.5, marginBench: 20 },
      { month: 'Aug', ratio: 1.1, margin: 12, benchmark: 1.5, marginBench: 20 },
      { month: 'Sep', ratio: 1.4, margin: 22, benchmark: 1.5, marginBench: 20 },
      { month: 'Oct', ratio: 1.5, margin: 25, benchmark: 1.5, marginBench: 20 },
      { month: 'Nov', ratio: parseFloat(currentRatio === "High" ? "2.0" : currentRatio), margin: parseFloat(netProfitMargin), benchmark: 1.5, marginBench: 20 },
  ];

  // Helper for status badge
  const getStatus = (val: number, target: number, higherIsBetter: boolean) => {
      const isGood = higherIsBetter ? val >= target : val <= target;
      return isGood ? 
        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold">Healthy</span> : 
        <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded font-bold">Attention</span>;
  };

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
        <h2 className="text-xl font-bold text-gray-900">Financial Health</h2>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
          <button 
            onClick={() => setActiveTab('Profitability')}
            className={`p-3 rounded-2xl border text-left transition-all ${activeTab === 'Profitability' ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105' : 'bg-white border-gray-100 text-gray-500'}`}
          >
              <p className="text-[9px] font-bold uppercase mb-1">Profit Margin</p>
              <p className="text-lg font-bold">{netProfitMargin}%</p>
          </button>
          
          <button 
            onClick={() => setActiveTab('Liquidity')}
            className={`p-3 rounded-2xl border text-left transition-all ${activeTab === 'Liquidity' ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : 'bg-white border-gray-100 text-gray-500'}`}
          >
              <p className="text-[9px] font-bold uppercase mb-1">Current Ratio</p>
              <p className="text-lg font-bold">{currentRatio}</p>
          </button>

          <button 
            onClick={() => setActiveTab('Efficiency')}
            className={`p-3 rounded-2xl border text-left transition-all ${activeTab === 'Efficiency' ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg scale-105' : 'bg-white border-gray-100 text-gray-500'}`}
          >
              <p className="text-[9px] font-bold uppercase mb-1">Op. Exp Ratio</p>
              <p className="text-lg font-bold">{operatingExpenseRatio}</p>
          </button>
      </div>

      {/* Main Analysis Content */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6">
          
          {/* PROFITABILITY VIEW */}
          {activeTab === 'Profitability' && (
              <div className="animate-in fade-in">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900">Net Profit Margin</h3>
                      {getStatus(parseFloat(netProfitMargin), 20, true)}
                  </div>
                  
                  <div className="h-48 w-full mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData}>
                              <defs>
                                <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#27cd00" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#27cd00" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                              <YAxis hide />
                              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}} />
                              <ReferenceLine y={20} stroke="gray" strokeDasharray="3 3" label={{ value: 'Target (20%)', position: 'insideBottomRight', fontSize: 10, fill: 'gray' }} />
                              <Area type="monotone" dataKey="margin" stroke="#27cd00" fillOpacity={1} fill="url(#colorMargin)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                      <h4 className="text-xs font-bold text-green-800 uppercase mb-2">Analysis</h4>
                      <p className="text-sm text-green-700 leading-relaxed mb-3">
                          Your margin is <strong>{netProfitMargin}%</strong>. The industry standard for pig farming is around <strong>20-25%</strong>.
                      </p>
                      <h4 className="text-xs font-bold text-green-800 uppercase mb-1">Improvement Tips:</h4>
                      <ul className="list-disc list-inside text-xs text-green-600 space-y-1">
                          <li>Reduce feed wastage (largest cost driver).</li>
                          <li>Optimize marketing weight to 90-100kg.</li>
                          <li>Negotiate bulk prices for soybean meal.</li>
                      </ul>
                  </div>
              </div>
          )}

          {/* LIQUIDITY VIEW */}
          {activeTab === 'Liquidity' && (
              <div className="animate-in fade-in">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900">Current Ratio</h3>
                      {getStatus(parseFloat(currentRatio === "High" ? "2.0" : currentRatio), 1.5, true)}
                  </div>

                  <div className="h-48 w-full mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                              <YAxis hide domain={[0, 3]} />
                              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}} />
                              <ReferenceLine y={1.5} stroke="gray" strokeDasharray="3 3" label={{ value: 'Safe (1.5)', position: 'insideTopRight', fontSize: 10, fill: 'gray' }} />
                              <Line type="monotone" dataKey="ratio" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                          </LineChart>
                      </ResponsiveContainer>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">Understanding Liquidity</h4>
                      <p className="text-sm text-blue-700 leading-relaxed mb-3">
                          A ratio of <strong>{currentRatio}</strong> means you have ${currentRatio === "High" ? "∞" : currentRatio} in assets for every $1 of debt.
                      </p>
                      <p className="text-xs text-blue-600">
                          Target: <strong>1.5 - 2.0</strong>. Below 1.0 means you cannot pay short-term debts. Too high means you are hoarding cash instead of investing in growth.
                      </p>
                  </div>
              </div>
          )}

          {/* EFFICIENCY VIEW */}
          {activeTab === 'Efficiency' && (
              <div className="animate-in fade-in">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900">Operating Expense Ratio</h3>
                      {getStatus(parseFloat(operatingExpenseRatio), 0.75, false)}
                  </div>

                  <div className="h-48 w-full mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                              { name: 'Your Farm', val: parseFloat(operatingExpenseRatio), fill: '#f1b103' },
                              { name: 'Industry Avg', val: 0.75, fill: '#d1d5db' }
                          ]}>
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                              <Tooltip cursor={{fill: 'transparent'}} />
                              <Bar dataKey="val" radius={[8, 8, 0, 0]} barSize={60} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                      <h4 className="text-xs font-bold text-yellow-800 uppercase mb-2">Cost Efficiency</h4>
                      <p className="text-sm text-yellow-800 leading-relaxed mb-3">
                          You spend <strong>${(parseFloat(operatingExpenseRatio) * 100).toFixed(0)} cents</strong> to generate $1 of revenue.
                      </p>
                      <p className="text-xs text-yellow-700">
                          <strong>Lower is better.</strong> If this is above 0.80 (80%), your profit margins are extremely thin. Review labor and feed efficiency immediately.
                      </p>
                  </div>
              </div>
          )}

      </div>

      {/* Asset Breakdown (Quick View) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Estimated Asset Value</h3>
          <div className="space-y-3">
              <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center"><i className="fas fa-piggy-bank"></i></div>
                      <span className="text-sm font-bold text-gray-700">Herd Value</span>
                  </div>
                  <span className="font-bold text-gray-900">${herdValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center"><i className="fas fa-wheat"></i></div>
                      <span className="text-sm font-bold text-gray-700">Feed Inventory</span>
                  </div>
                  <span className="font-bold text-gray-900">${feedValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><i className="fas fa-wallet"></i></div>
                      <span className="text-sm font-bold text-gray-700">Cash</span>
                  </div>
                  <span className="font-bold text-gray-900">${cashOnHand.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase">Total Assets</span>
                  <span className="font-bold text-ecomattGreen text-lg">${totalCurrentAssets.toLocaleString()}</span>
              </div>
          </div>
      </div>

    </div>
  );
};

export default FinancialRatios;
