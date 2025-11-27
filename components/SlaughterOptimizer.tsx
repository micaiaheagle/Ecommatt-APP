
import React, { useState } from 'react';
import { Pig, PigStage } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface SlaughterOptimizerProps {
  pigs: Pig[];
  onCancel: () => void;
  onNavigateToPig: (pig: Pig) => void;
}

const SlaughterOptimizer: React.FC<SlaughterOptimizerProps> = ({ pigs, onCancel, onNavigateToPig }) => {
  const [marketPrice, setMarketPrice] = useState(3.50);
  const [feedCost, setFeedCost] = useState(0.45);

  // Filter Finishers
  const finishers = pigs.filter(p => p.stage === PigStage.Finisher && p.status === 'Active');

  // Logic: Market Ready if Weight >= 90kg
  const readyForMarket = finishers.filter(p => p.weight >= 90);
  const almostReady = finishers.filter(p => p.weight >= 75 && p.weight < 90);

  // Generate Optimization Curve (Weight vs Profit)
  // Profit = (Weight * Price) - (Total Estimated Feed Cost)
  // Assuming basic FCR curve where efficiency drops as weight increases
  const optimizationData = [];
  for (let w = 60; w <= 130; w += 5) {
      const revenue = w * marketPrice;
      // Rough estimation: Cost to reach this weight.
      // Base cost 40, plus progressive feed cost.
      // FCR worsens: 2.5 at 60kg, 3.5 at 120kg
      const fcrAtWeight = 2.5 + ((w - 60) / 70) * 1.0; 
      const totalFeedKg = w * fcrAtWeight; // Very simplified cumulative
      const cost = 40 + (totalFeedKg * feedCost); 
      
      optimizationData.push({
          weight: w,
          profit: revenue - cost,
          revenue: revenue,
          cost: cost
      });
  }

  // Find peak profit weight
  const peak = optimizationData.reduce((prev, current) => (prev.profit > current.profit) ? prev : current);

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
        <h2 className="text-xl font-bold text-gray-900">Slaughter Optimizer</h2>
      </div>

      {/* Hero Insight */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white mb-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-ecomattGreen opacity-10 rounded-full blur-3xl"></div>
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Optimal Sales Weight</p>
          <div className="flex items-end gap-3">
              <h1 className="text-5xl font-bold text-ecomattGreen">{peak.weight}kg</h1>
              <span className="text-sm font-bold text-gray-300 mb-2">Live Wgt</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 max-w-[200px]">
              Based on ${marketPrice.toFixed(2)}/kg market price and current feed costs.
          </p>
      </div>

      {/* Interactive Controls */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-4">
          <div>
              <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-gray-500">Market Price</span>
                  <span className="font-bold text-green-600">${marketPrice.toFixed(2)}/kg</span>
              </div>
              <input 
                  type="range" min="1.5" max="5.0" step="0.1" 
                  value={marketPrice} onChange={(e) => setMarketPrice(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
          </div>
          <div>
              <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-gray-500">Feed Cost</span>
                  <span className="font-bold text-yellow-600">${feedCost.toFixed(2)}/kg</span>
              </div>
              <input 
                  type="range" min="0.2" max="1.0" step="0.05" 
                  value={feedCost} onChange={(e) => setFeedCost(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
          </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Profit Curve</h3>
          <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={optimizationData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="weight" axisLine={false} tickLine={false} tick={{fontSize: 10}} interval={2} />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}} />
                      <ReferenceLine x={peak.weight} stroke="#27cd00" strokeDasharray="3 3" label={{ value: 'Optimal', position: 'top', fill: '#27cd00', fontSize: 10 }} />
                      <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} dot={false} name="Profit ($)" />
                  </LineChart>
              </ResponsiveContainer>
          </div>
      </div>

      {/* Action List */}
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Ready for Market ({readyForMarket.length})</h3>
      <div className="space-y-2 mb-6">
          {readyForMarket.length === 0 && <p className="text-xs text-gray-400 italic">No pigs above 90kg.</p>}
          {readyForMarket.map(pig => (
              <div key={pig.id} onClick={() => onNavigateToPig(pig)} className="bg-green-50 p-3 rounded-xl border border-green-100 flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm font-bold text-xs">
                          <i className="fas fa-check"></i>
                      </div>
                      <div>
                          <p className="text-sm font-bold text-green-900">{pig.tagId}</p>
                          <p className="text-[10px] text-green-700">Est. Profit: ${((pig.weight * marketPrice) - (40 + (pig.weight * 2.8 * feedCost))).toFixed(0)}</p>
                      </div>
                  </div>
                  <span className="text-lg font-bold text-green-800">{pig.weight}kg</span>
              </div>
          ))}
      </div>

      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Approaching ({almostReady.length})</h3>
      <div className="space-y-2">
          {almostReady.map(pig => (
              <div key={pig.id} onClick={() => onNavigateToPig(pig)} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center opacity-75">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                          <i className="fas fa-clock"></i>
                      </div>
                      <p className="text-sm font-bold text-gray-700">{pig.tagId}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-600">{pig.weight}kg</span>
              </div>
          ))}
      </div>

    </div>
  );
};

export default SlaughterOptimizer;
