
import React from 'react';

interface IntelligentCoreProps {
  onOpenBreeding: () => void;
  onOpenOptimizer: () => void;
  onOpenCritical: () => void;
  onOpenChat: () => void;
}

const IntelligentCore: React.FC<IntelligentCoreProps> = ({ 
    onOpenBreeding, 
    onOpenOptimizer, 
    onOpenCritical,
    onOpenChat
}) => {
  
  const tools = [
      {
          title: "Breeding AI",
          desc: "Heat predictions & genetic pairing",
          icon: "fa-venus-mars",
          color: "text-pink-500",
          bg: "bg-pink-50",
          action: onOpenBreeding
      },
      {
          title: "Slaughter Optimizer",
          desc: "Max profit timing calculator",
          icon: "fa-weight-hanging",
          color: "text-blue-600",
          bg: "bg-blue-50",
          action: onOpenOptimizer
      },
      {
          title: "Critical Watch",
          desc: "Outlier detection & health risks",
          icon: "fa-eye",
          color: "text-red-500",
          bg: "bg-red-50",
          action: onOpenCritical
      },
      {
          title: "Smart Agronomist",
          desc: "Chat with farm AI assistant",
          icon: "fa-robot",
          color: "text-ecomattGreen",
          bg: "bg-green-50",
          action: onOpenChat
      }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Intelligent Core</h2>
        <p className="text-sm text-gray-500">AI-driven insights for precision farming.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
          {tools.map((tool, idx) => (
              <div 
                key={idx} 
                onClick={tool.action}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-ecomattGreen transition-all active:scale-[0.98]"
              >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${tool.bg} ${tool.color}`}>
                      <i className={`fas ${tool.icon}`}></i>
                  </div>
                  <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{tool.title}</h3>
                      <p className="text-sm text-gray-500">{tool.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                      <i className="fas fa-chevron-right"></i>
                  </div>
              </div>
          ))}
      </div>

      <div className="mt-8 bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-ecomattGreen opacity-20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                  <i className="fas fa-brain text-ecomattGreen text-xl"></i>
                  <h3 className="font-bold text-lg">System Status</h3>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                  Predictive models are running. Data is being analyzed every 15 minutes for anomalies.
              </p>
              <div className="flex gap-4 text-xs font-mono text-gray-400">
                  <span><i className="fas fa-check text-green-500 mr-1"></i> Vision AI</span>
                  <span><i className="fas fa-check text-green-500 mr-1"></i> NLP Engine</span>
              </div>
          </div>
      </div>

    </div>
  );
};

export default IntelligentCore;
