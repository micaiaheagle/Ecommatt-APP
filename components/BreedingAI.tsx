
import React from 'react';
import { Pig, PigStage, PigStatus } from '../types';

interface BreedingAIProps {
  pigs: Pig[];
  onCancel: () => void;
  onNavigateToPig: (pig: Pig) => void;
}

const BreedingAI: React.FC<BreedingAIProps> = ({ pigs, onCancel, onNavigateToPig }) => {
  // Logic 1: Predict Heat (Sows weaned recently)
  // In a real app, we'd check `timeline` for "Weaning" events within last 5-7 days.
  // Mock logic: Sows that are Active (not Pregnant)
  const openSows = pigs.filter(p => p.stage === PigStage.Sow && p.status === PigStatus.Active);
  
  // Logic 2: Performance (Cull Watch)
  // Mock: Randomly select a sow to recommend culling for demo
  const cullCandidates = pigs.filter(p => p.stage === PigStage.Sow && (p.tagId.endsWith('3') || p.tagId.endsWith('9')));

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
        <h2 className="text-xl font-bold text-gray-900">Breeding Intelligence</h2>
      </div>

      {/* Heat Prediction */}
      <div className="bg-pink-50 p-5 rounded-2xl border border-pink-100 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-pink-900 flex items-center gap-2">
                  <i className="fas fa-venus text-pink-500"></i> Heat Forecast
              </h3>
              <span className="bg-white text-pink-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">Next 48h</span>
          </div>
          <p className="text-xs text-pink-800 mb-4 leading-relaxed">
              Based on weaning dates, the following sows are likely entering estrus. Check for standing heat.
          </p>
          
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {openSows.length === 0 ? <p className="text-xs text-gray-400 italic">No sows detected.</p> : openSows.map(sow => (
                  <div key={sow.id} onClick={() => onNavigateToPig(sow)} className="bg-white p-3 rounded-xl border border-pink-100 min-w-[120px] cursor-pointer active:scale-95 transition">
                      <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-gray-400">Sow</span>
                          <i className="fas fa-fire text-orange-400 text-xs animate-pulse"></i>
                      </div>
                      <p className="font-bold text-gray-900">{sow.tagId}</p>
                      <p className="text-[10px] text-gray-500">{sow.penLocation}</p>
                  </div>
              ))}
          </div>
      </div>

      {/* Performance / Culling */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-chart-bar text-gray-400"></i> Performance Analysis
          </h3>
          
          <div className="space-y-3">
              {cullCandidates.map(sow => (
                  <div key={sow.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm shrink-0 font-bold text-xs">
                          <i className="fas fa-thumbs-down"></i>
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between">
                              <h4 className="font-bold text-gray-900 text-sm">{sow.tagId}</h4>
                              <span className="text-[9px] bg-red-200 text-red-800 px-2 py-0.5 rounded font-bold">Review</span>
                          </div>
                          <p className="text-xs text-red-700 mt-1">
                              Litter size trend: 10 → 8 → 7. Consistent decline in productivity detected.
                          </p>
                      </div>
                  </div>
              ))}
              
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-green-500 shadow-sm shrink-0 font-bold text-xs">
                      <i className="fas fa-star"></i>
                  </div>
                  <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">Top Genetics</h4>
                      <p className="text-xs text-green-700 mt-1">
                          Sow #EF-8842 has highest weaning weight avg (8.2kg). Recommended for pure breeding.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* Mating Simulator (Placeholder for Inbreeding Check) */}
      <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm text-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-blue-500">
              <i className="fas fa-dna"></i>
          </div>
          <h3 className="font-bold text-blue-900 mb-1">Mating Simulator</h3>
          <p className="text-xs text-blue-700 mb-4">Check compatibility and inbreeding coefficients before service.</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg">
              Start Simulation
          </button>
      </div>

    </div>
  );
};

export default BreedingAI;
