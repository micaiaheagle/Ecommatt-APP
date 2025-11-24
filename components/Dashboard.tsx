import React, { useEffect, useState } from 'react';
import { Pig, PigStatus, Task } from '../types';
import { generateSmartAlerts } from '../services/geminiService';

interface DashboardProps {
  pigs: Pig[];
  tasks: Task[];
  onViewChange: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ pigs, tasks, onViewChange }) => {
  const [smartAlerts, setSmartAlerts] = useState<any[]>([]);
  
  // Computed Metrics
  const totalPigs = pigs.length;
  const piglets = pigs.filter(p => p.stage === 'Piglet').length;
  const sows = pigs.filter(p => p.stage === 'Sow').length;
  // Calculate mortality rate (mock data logic)
  const mortalityRate = 0.8; 

  useEffect(() => {
    // Generate AI alerts
    const fetchAlerts = async () => {
        const metrics = { totalPigs, piglets, sows, mortalityRate };
        const alerts = await generateSmartAlerts(metrics);
        setSmartAlerts(alerts);
    };
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Good Morning</p>
                <h2 className="text-2xl font-bold text-gray-900">Farm Manager</h2>
            </div>
            <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center relative cursor-pointer hover:bg-gray-50">
                <i className="fas fa-bell text-gray-400"></i>
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </div>
        </div>

        {/* Weather Widget */}
        <div className="bg-gradient-to-br from-ecomattGreen to-green-600 rounded-2xl p-5 mb-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20 transform translate-x-4 -translate-y-4">
                <i className="fas fa-cloud-sun text-8xl"></i>
            </div>
            <div className="relative z-10">
                <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold backdrop-blur-sm tracking-wider">KWEKWE FARM</span>
                <h1 className="text-5xl font-bold mt-2">24°C</h1>
                <p className="text-sm opacity-90 mt-1 font-medium">Clear Sky • Humidity 45%</p>
            </div>
        </div>

        {/* Key Metrics Grid */}
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Key Metrics</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white p-4 rounded-xl border-l-4 border-green-500 shadow-sm">
                <p className="text-xs text-gray-500 font-bold">Total Herd</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalPigs}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-ecomattYellow shadow-sm">
                <p className="text-xs text-gray-500 font-bold">Piglets</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{piglets}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
                <p className="text-xs text-gray-500 font-bold">Sows</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{sows}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm">
                <p className="text-xs text-gray-500 font-bold">Mortality</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{mortalityRate}%</p>
            </div>
        </div>

        {/* Smart Alerts (Dynamic) */}
        <div className="mb-6">
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Smart Insights</h3>
                <span className="bg-ecomattBlack text-white text-[10px] px-2 py-1 rounded font-bold">AI Powered</span>
             </div>
             
             {smartAlerts.length > 0 ? (
                 <div className="space-y-3">
                     {smartAlerts.map((alert, idx) => (
                         <div key={idx} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${alert.severity === 'High' ? 'border-red-500' : 'border-ecomattYellow'}`}>
                             <div className="flex items-center gap-2 mb-1">
                                 <i className={`fas ${alert.severity === 'High' ? 'fa-exclamation-circle text-red-500' : 'fa-lightbulb text-ecomattYellow'}`}></i>
                                 <h4 className="text-sm font-bold text-gray-900">{alert.title}</h4>
                             </div>
                             <p className="text-xs text-gray-500">{alert.message}</p>
                         </div>
                     ))}
                 </div>
             ) : (
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-gray-300">
                    <p className="text-xs text-gray-500">System analyzing... No critical alerts at this moment.</p>
                </div>
             )}
        </div>

        {/* Analytics Teaser */}
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Quick Analytics</h3>
        <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
            <div className="flex justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase">Herd Growth (6 Mo)</h3>
                <span className="text-ecomattGreen font-bold text-xs">+12%</span>
            </div>
            <div className="h-24 flex items-end justify-between gap-1">
                <div className="w-full bg-green-200 h-[40%] rounded-t-sm"></div>
                <div className="w-full bg-green-300 h-[50%] rounded-t-sm"></div>
                <div className="w-full bg-green-400 h-[45%] rounded-t-sm"></div>
                <div className="w-full bg-green-500 h-[60%] rounded-t-sm"></div>
                <div className="w-full bg-green-600 h-[75%] rounded-t-sm"></div>
                <div className="w-full bg-ecomattGreen h-[85%] rounded-t-sm relative group"></div>
            </div>
             <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                <span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;