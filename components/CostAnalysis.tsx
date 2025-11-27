
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface CostAnalysisProps {
  onCancel: () => void;
}

const CostAnalysis: React.FC<CostAnalysisProps> = ({ onCancel }) => {
  // Simulation Variables
  const [feedPrice, setFeedPrice] = useState(0.45); // Avg $/kg
  const [overheadPerDay, setOverheadPerDay] = useState(0.15); // Labor, Water, Housing
  const [pigletPurchaseCost, setPigletPurchaseCost] = useState(35);
  const [medsTotal, setMedsTotal] = useState(15);

  // Generate Lifecycle Data (Simulated Growth Curve)
  const lifecycleData = [];
  let cumulativeFeedCost = 0;
  let cumulativeOverhead = 0;
  let currentWeight = 1.5; // Birth weight

  for (let day = 0; day <= 180; day += 10) {
      // Feed Intake Simulation (kg/day increases with age)
      let dailyIntake = 0;
      if (day > 30) dailyIntake = 0.5 + (day / 180) * 2.5; // Rough curve peaking around 3kg
      
      // Weight Gain Simulation
      let dailyGain = 0;
      if (day > 30) dailyGain = 0.2 + (day / 180) * 0.8;
      
      const daysInStep = 10;
      const stepFeedCost = (dailyIntake * daysInStep) * feedPrice;
      const stepOverhead = overheadPerDay * daysInStep;

      cumulativeFeedCost += day > 30 ? stepFeedCost : 0; // Assume strictly creep feed before 30 covered in Purchase Cost or separate
      cumulativeOverhead += stepOverhead;
      currentWeight += (dailyGain * daysInStep);

      // Meds injected at specific points
      let medsAcc = 0;
      if (day >= 0) medsAcc += 5; // Iron
      if (day >= 40) medsAcc += 5; // Weaning vax
      if (day >= 100) medsAcc += 5; // Dewormer

      lifecycleData.push({
          day: `Day ${day}`,
          feed: cumulativeFeedCost,
          meds: medsAcc + (pigletPurchaseCost), // Include purchase in base base
          overhead: cumulativeOverhead,
          total: cumulativeFeedCost + cumulativeOverhead + medsAcc + pigletPurchaseCost,
          weight: currentWeight
      });
  }

  const currentStats = lifecycleData[lifecycleData.length - 1];
  const breakEvenPrice = currentStats.total / currentStats.weight;

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
        <h2 className="text-xl font-bold text-gray-900">Unit Cost Analysis</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-bold">Total Cost (180d)</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">${currentStats.total.toFixed(2)}</h3>
              <p className="text-[10px] text-gray-500">per pig at sale</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-bold">Break-Even</p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">${breakEvenPrice.toFixed(2)}</h3>
              <p className="text-[10px] text-gray-500">per kg live weight</p>
          </div>
      </div>

      {/* Inputs */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Cost Drivers</h3>
          
          <div>
              <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Feed Price (Avg)</span>
                  <span className="font-bold">${feedPrice.toFixed(2)} / kg</span>
              </div>
              <input 
                  type="range" min="0.2" max="1.0" step="0.05"
                  value={feedPrice} onChange={(e) => setFeedPrice(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-ecomattYellow"
              />
          </div>

          <div>
              <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Daily Overhead</span>
                  <span className="font-bold">${overheadPerDay.toFixed(2)} / day</span>
              </div>
              <input 
                  type="range" min="0.05" max="0.5" step="0.01"
                  value={overheadPerDay} onChange={(e) => setOverheadPerDay(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
          </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Cumulative Cost Curve</h3>
          <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lifecycleData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                          <linearGradient id="colorFeed" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f1b103" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#f1b103" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorOverhead" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} interval={4} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} tickFormatter={(v) => `$${v}`} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}}
                        formatter={(val: number) => [`$${val.toFixed(2)}`, '']}
                      />
                      <Area type="monotone" dataKey="feed" stackId="1" stroke="#f1b103" fill="url(#colorFeed)" name="Feed" />
                      <Area type="monotone" dataKey="overhead" stackId="1" stroke="#3b82f6" fill="url(#colorOverhead)" name="Overhead" />
                      <Area type="monotone" dataKey="meds" stackId="1" stroke="#ef4444" fill="#ef4444" name="Meds/Base" />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-[10px]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Feed</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Overhead</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Base Cost</div>
          </div>
      </div>

    </div>
  );
};

export default CostAnalysis;
