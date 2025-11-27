
import React, { useState } from 'react';

interface FeedFormulatorProps {
  onCancel: () => void;
}

const FeedFormulator: React.FC<FeedFormulatorProps> = ({ onCancel }) => {
  const [mixName, setMixName] = useState('Grower Mix (1 Ton)');
  const [ingredients, setIngredients] = useState([
      { id: 1, name: 'Maize Meal', percent: 60, costPerKg: 0.35, cp: 9, energy: 3300 },
      { id: 2, name: 'Soya Meal', percent: 25, costPerKg: 0.65, cp: 48, energy: 2800 },
      { id: 3, name: 'Wheat Bran', percent: 10, costPerKg: 0.20, cp: 15, energy: 2200 },
      { id: 4, name: 'Premix', percent: 5, costPerKg: 1.50, cp: 0, energy: 0 }
  ]);

  // Calculations
  const totalPercent = ingredients.reduce((acc, curr) => acc + curr.percent, 0);
  const totalCost = ingredients.reduce((acc, curr) => acc + (curr.costPerKg * (curr.percent * 10)), 0); // Cost per ton (1000kg * percent/100)
  const avgCP = ingredients.reduce((acc, curr) => acc + (curr.cp * (curr.percent / 100)), 0);
  const avgEnergy = ingredients.reduce((acc, curr) => acc + (curr.energy * (curr.percent / 100)), 0);

  const handlePercentChange = (id: number, val: number) => {
      setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, percent: val } : ing));
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 bg-gray-900 min-h-full pb-20 text-white p-6 fixed inset-0 overflow-y-auto z-50">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <button 
                onClick={onCancel}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white border border-gray-700"
            >
                <i className="fas fa-times"></i>
            </button>
            <h2 className="text-xl font-bold">Feed Formulator</h2>
            <button className="text-ecomattYellow text-xs font-bold border border-ecomattYellow px-3 py-1 rounded-lg hover:bg-ecomattYellow hover:text-black transition">
                Save Mix
            </button>
        </div>

        {/* Summary Card */}
        <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 mb-8 shadow-xl">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <input 
                        value={mixName}
                        onChange={(e) => setMixName(e.target.value)}
                        className="bg-transparent text-ecomattGreen font-bold text-lg outline-none border-b border-gray-700 focus:border-ecomattGreen w-full"
                    />
                    <p className="text-xs text-gray-400 mt-1">Target: Pig Grower (30-60kg)</p>
                </div>
                <div className="text-right">
                    <span className="block text-2xl font-bold">${totalCost.toFixed(2)}</span>
                    <span className="text-[10px] text-gray-500 uppercase">Cost per Ton</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-700">
                <div className="bg-gray-900 p-2 rounded-lg text-center border border-gray-700">
                    <span className="text-[10px] text-gray-500 block mb-1">Crude Protein</span>
                    <span className={`text-sm font-bold ${avgCP >= 16 && avgCP <= 18 ? 'text-ecomattGreen' : 'text-yellow-500'}`}>
                        {avgCP.toFixed(1)}%
                    </span>
                </div>
                <div className="bg-gray-900 p-2 rounded-lg text-center border border-gray-700">
                    <span className="text-[10px] text-gray-500 block mb-1">Energy (Kcal)</span>
                    <span className="text-sm font-bold text-white">{Math.round(avgEnergy)}</span>
                </div>
                <div className="bg-gray-900 p-2 rounded-lg text-center border border-gray-700">
                    <span className="text-[10px] text-gray-500 block mb-1">Total Mix</span>
                    <span className={`text-sm font-bold ${totalPercent === 100 ? 'text-ecomattGreen' : 'text-red-500'}`}>
                        {totalPercent}%
                    </span>
                </div>
            </div>
        </div>

        {/* Ingredients List */}
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Ingredients Composition</h3>
        <div className="space-y-4">
            {ingredients.map(ing => (
                <div key={ing.id}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold">{ing.name}</span>
                        <span className="font-mono text-ecomattYellow">{ing.percent}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={ing.percent}
                            onChange={(e) => handlePercentChange(ing.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-ecomattGreen"
                        />
                        <span className="text-xs text-gray-500 w-12 text-right">${ing.costPerKg}/kg</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Warnings */}
        {totalPercent !== 100 && (
            <div className="mt-8 bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-center gap-3">
                <i className="fas fa-exclamation-circle text-red-500"></i>
                <p className="text-xs text-red-400">Total percentage must equal 100% (Current: {totalPercent}%)</p>
            </div>
        )}

    </div>
  );
};

export default FeedFormulator;
