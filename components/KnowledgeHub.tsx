
import React, { useState } from 'react';

interface KnowledgeHubProps {
  onCancel: () => void;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ onCancel }) => {
  const [activeCat, setActiveCat] = useState('All');

  const resources = [
      { id: 1, title: 'Morning Feeding SOP', category: 'Feeding', type: 'PDF', size: '2.4 MB' },
      { id: 2, title: 'Biosecurity Protocol v2', category: 'Safety', type: 'PDF', size: '1.1 MB' },
      { id: 3, title: 'Piglet Iron Injection Guide', category: 'Health', type: 'Video', size: '15 MB' },
      { id: 4, title: 'Mixer Calibration', category: 'Equipment', type: 'Doc', size: '0.5 MB' },
      { id: 5, title: 'Emergency Contact List', category: 'Safety', type: 'PDF', size: '0.1 MB' },
      { id: 6, title: 'Weaning Transition Steps', category: 'Health', type: 'PDF', size: '3.0 MB' },
  ];

  const categories = ['All', 'Feeding', 'Health', 'Safety', 'Equipment'];
  const filtered = activeCat === 'All' ? resources : resources.filter(r => r.category === activeCat);

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
        <h2 className="text-xl font-bold text-gray-900">Knowledge Hub</h2>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
          {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    activeCat === cat 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                  {cat}
              </button>
          ))}
      </div>

      {/* Featured Card */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white mb-6 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
              <span className="bg-blue-500/50 text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block">MUST READ</span>
              <h3 className="text-lg font-bold mb-2">New Biosecurity Rules</h3>
              <p className="text-xs text-blue-100 mb-4 max-w-[200px]">Updated protocols for visitor entry and vehicle disinfection effective Nov 1st.</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-50">
                  Read Now
              </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
              <i className="fas fa-shield-virus text-9xl"></i>
          </div>
      </div>

      {/* Resources List */}
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Resources ({filtered.length})</h3>
      <div className="space-y-3">
          {filtered.map(res => (
              <div key={res.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-ecomattGreen transition">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl
                    ${res.type === 'PDF' ? 'bg-red-50 text-red-500' : res.type === 'Video' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'}
                  `}>
                      <i className={`fas ${res.type === 'PDF' ? 'fa-file-pdf' : res.type === 'Video' ? 'fa-play-circle' : 'fa-file-alt'}`}></i>
                  </div>
                  <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{res.title}</h4>
                      <div className="flex gap-2 mt-1">
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{res.category}</span>
                          <span className="text-[10px] text-gray-400">{res.size}</span>
                      </div>
                  </div>
                  <i className="fas fa-download text-gray-300 hover:text-gray-600"></i>
              </div>
          ))}
      </div>

    </div>
  );
};

export default KnowledgeHub;
