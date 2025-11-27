
import React, { useState } from 'react';

interface ProfitCalculatorProps {
  onCancel: () => void;
}

const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ onCancel }) => {
  // Scenario Variables
  const [feedCostPerKg, setFeedCostPerKg] = useState(0.45);
  const [marketPricePerKg, setMarketPricePerKg] = useState(3.50);
  const [targetWeight, setTargetWeight] = useState(90);
  const [fcr, setFcr] = useState(2.8); // Feed Conversion Ratio
  const [pigletCost, setPigletCost] = useState(30);
  const [medsCost, setMedsCost] = useState(15);

  // Calculations
  const totalFeedNeeded = targetWeight * fcr;
  const totalFeedCost = totalFeedNeeded * feedCostPerKg;
  const totalCost = totalFeedCost + pigletCost + medsCost;
  const revenue = targetWeight * marketPricePerKg;
  const profitPerPig = revenue - totalCost;
  const margin = (profitPerPig / revenue) * 100;

  return (
    <div className="animate-in slide-in-from-right duration-300 bg-gray-900 min-h-full pb-20 text-white fixed inset-0 overflow-y-auto z-50">
       <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <button 
                    onClick={onCancel}
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white border border-gray-700"
                >
                    <i className="fas fa-times"></i>
                </button>
                <h2 className="text-xl font-bold">Scenario Planner</h2>
                <div className="w-8"></div>
            </div>

            {/* Result Card */}
            <div className="bg-gray-800 p-6 rounded-3xl border border-gray-700 mb-8 shadow-2xl relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${profitPerPig > 0 ? 'from-green-500 to-emerald-300' : 'from-red-500 to-orange-500'}`}></div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Projected Profit / Pig</p>
                <h1 className={`text-5xl font-bold mb-2 ${profitPerPig > 0 ? 'text-ecomattGreen' : 'text-red-400'}`}>
                    ${profitPerPig.toFixed(2)}
                </h1>
                <div className="flex gap-4 text-xs">
                    <span className="text-gray-400">Rev: <span className="text-white font-bold">${revenue.toFixed(0)}</span></span>
                    <span className="text-gray-400">Cost: <span className="text-white font-bold">${totalCost.toFixed(0)}</span></span>
                    <span className={`font-bold ${margin > 0 ? 'text-green-400' : 'text-red-400'}`}>{margin.toFixed(1)}% Margin</span>
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
                
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-gray-300">Market Price ($/kg)</span>
                        <span className="font-mono text-ecomattGreen">${marketPricePerKg.toFixed(2)}</span>
                    </div>
                    <input 
                        type="range" min="1" max="6" step="0.1" 
                        value={marketPricePerKg} onChange={(e) => setMarketPricePerKg(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-ecomattGreen"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-gray-300">Feed Cost ($/kg)</span>
                        <span className="font-mono text-yellow-500">${feedCostPerKg.toFixed(2)}</span>
                    </div>
                    <input 
                        type="range" min="0.1" max="2.0" step="0.05" 
                        value={feedCostPerKg} onChange={(e) => setFeedCostPerKg(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="font-bold text-gray-400">Target Wgt</span>
                            <span className="font-mono text-white">{targetWeight}kg</span>
                        </div>
                        <input 
                            type="range" min="60" max="120" step="1" 
                            value={targetWeight} onChange={(e) => setTargetWeight(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="font-bold text-gray-400">FCR</span>
                            <span className="font-mono text-white">{fcr}</span>
                        </div>
                        <input 
                            type="range" min="2.0" max="4.5" step="0.1" 
                            value={fcr} onChange={(e) => setFcr(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Fixed Costs Estimate</h4>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs text-gray-300">Piglet/Weaner Cost</label>
                        <input 
                            type="number" className="w-16 bg-gray-900 border border-gray-600 rounded text-right text-xs p-1 text-white"
                            value={pigletCost} onChange={(e) => setPigletCost(parseFloat(e.target.value))}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-xs text-gray-300">Meds & Overheads</label>
                        <input 
                            type="number" className="w-16 bg-gray-900 border border-gray-600 rounded text-right text-xs p-1 text-white"
                            value={medsCost} onChange={(e) => setMedsCost(parseFloat(e.target.value))}
                        />
                    </div>
                </div>

            </div>
       </div>
    </div>
  );
};

export default ProfitCalculator;
