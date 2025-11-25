
import React, { useEffect, useState } from 'react';
import { Pig, PigStatus, PigStage, Task, FinanceRecord, ViewState, FeedInventory } from '../types';
import { generateSmartAlerts } from '../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface DashboardProps {
  pigs: Pig[];
  tasks: Task[];
  financeRecords: FinanceRecord[];
  feeds: FeedInventory[];
  onViewChange: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ pigs, tasks, financeRecords, feeds, onViewChange }) => {
  const [smartAlerts, setSmartAlerts] = useState<any[]>([]);
  
  // Computed Metrics
  const totalPigs = pigs.length;
  const piglets = pigs.filter(p => p.stage === PigStage.Piglet).length;
  const weaners = pigs.filter(p => p.stage === PigStage.Weaner).length;
  const growers = pigs.filter(p => p.stage === PigStage.Grower).length;
  const finishers = pigs.filter(p => p.stage === PigStage.Finisher).length;
  const sows = pigs.filter(p => p.stage === PigStage.Sow).length;
  const boars = pigs.filter(p => p.stage === PigStage.Boar).length;
  const pregnant = pigs.filter(p => p.status === PigStatus.Pregnant).length;
  
  // Critical Metrics
  const sickPigs = pigs.filter(p => p.status === PigStatus.Sick).length;
  const urgentTasks = tasks.filter(t => t.priority === 'High' && t.status === 'Pending').length;
  const lowStockFeeds = feeds.filter(f => f.quantityKg < f.reorderLevel).length;

  // Finance Metrics
  const currentYear = new Date().getFullYear();
  const sales = financeRecords
    .filter(r => r.type === 'Income')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const expenses = financeRecords
    .filter(r => r.type === 'Expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const feedCost = financeRecords
    .filter(r => r.type === 'Expense' && r.category.toLowerCase().includes('feed'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Pens count (unique locations)
  const pens = new Set(pigs.map(p => p.penLocation).filter(l => l && l !== 'Unassigned')).size;

  // Calculate mortality rate
  const deceased = pigs.filter(p => p.status === PigStatus.Deceased).length;
  const mortalityRate = totalPigs > 0 ? ((deceased / (totalPigs + deceased)) * 100).toFixed(1) : '0.0';

  // Chart Data Preparation
  const herdData = [
    { name: 'Piglets', value: piglets, color: '#f1b103' },
    { name: 'Weaners', value: weaners, color: '#3b82f6' },
    { name: 'Growers', value: growers, color: '#27cd00' },
    { name: 'Finishers', value: finishers, color: '#a855f7' },
    { name: 'Sows', value: sows, color: '#ec4899' },
    { name: 'Boars', value: boars, color: '#1f2937' },
  ].filter(d => d.value > 0);

  const financeData = [
    { name: 'Revenue', amount: sales, fill: '#27cd00' },
    { name: 'Expense', amount: expenses, fill: '#ef4444' },
    { name: 'Feed', amount: feedCost, fill: '#f1b103' },
  ];

  useEffect(() => {
    // Generate AI alerts
    const fetchAlerts = async () => {
        const metrics = { totalPigs, piglets, sows, mortalityRate, sickPigs };
        const alerts = await generateSmartAlerts(metrics);
        setSmartAlerts(alerts);
    };
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Card = ({ label, value, icon, onClick, subBadge, subBadgeColor }: any) => (
    <div 
        onClick={onClick}
        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-ecomattGreen transition-colors group"
    >
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 text-2xl group-hover:bg-ecomattGreen group-hover:text-white transition-colors">
            <i className={`fas ${icon}`}></i>
        </div>
        <div>
            <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-600">{label}</p>
                {subBadge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold text-white ${subBadgeColor || 'bg-blue-500'}`}>
                        {subBadge}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Farm Overview</p>
            </div>
            <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center relative cursor-pointer hover:bg-gray-50">
                <i className="fas fa-bell text-gray-400"></i>
                {(smartAlerts.length > 0 || urgentTasks > 0) && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                )}
            </div>
        </div>

        {/* Weather Widget */}
        <div className="bg-gradient-to-br from-ecomattGreen to-green-600 rounded-2xl p-5 mb-8 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20 transform translate-x-4 -translate-y-4">
                <i className="fas fa-cloud-sun text-8xl"></i>
            </div>
            <div className="relative z-10">
                <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold backdrop-blur-sm tracking-wider">KWEKWE FARM</span>
                <h1 className="text-5xl font-bold mt-2">24°C</h1>
                <p className="text-sm opacity-90 mt-1 font-medium">Clear Sky • Humidity 45%</p>
            </div>
        </div>

        {/* Critical Attention Section */}
        {(sickPigs > 0 || urgentTasks > 0 || lowStockFeeds > 0) && (
            <div className="mb-8">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle text-red-500"></i> Critical Areas
                 </h3>
                 <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                     {sickPigs > 0 && (
                        <div onClick={() => onViewChange(ViewState.Operations)} className="bg-red-50 border border-red-200 p-4 rounded-xl min-w-[160px] cursor-pointer hover:bg-red-100 transition">
                            <h4 className="font-bold text-red-800 text-sm">Sick Animals</h4>
                            <p className="text-2xl font-bold text-red-600">{sickPigs}</p>
                            <span className="text-[10px] text-red-700">Needs Medication</span>
                        </div>
                     )}
                     {urgentTasks > 0 && (
                        <div onClick={() => onViewChange(ViewState.Operations)} className="bg-orange-50 border border-orange-200 p-4 rounded-xl min-w-[160px] cursor-pointer hover:bg-orange-100 transition">
                            <h4 className="font-bold text-orange-800 text-sm">Urgent Tasks</h4>
                            <p className="text-2xl font-bold text-orange-600">{urgentTasks}</p>
                            <span className="text-[10px] text-orange-700">High Priority</span>
                        </div>
                     )}
                     {lowStockFeeds > 0 && (
                        <div onClick={() => onViewChange(ViewState.Operations)} className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl min-w-[160px] cursor-pointer hover:bg-yellow-100 transition">
                            <h4 className="font-bold text-yellow-800 text-sm">Low Feed</h4>
                            <p className="text-2xl font-bold text-yellow-600">{lowStockFeeds}</p>
                            <span className="text-[10px] text-yellow-700">Restock Soon</span>
                        </div>
                     )}
                 </div>
            </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card label="Total Pigs" value={totalPigs} icon="fa-piggy-bank" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Piglets" value={piglets} icon="fa-paw" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Weaners" value={weaners} icon="fa-bacon" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Growers" value={growers} icon="fa-arrow-up" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Finisher" value={finishers} icon="fa-weight-hanging" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Gilts/Sows" value={sows} icon="fa-venus" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Boar" value={boars} icon="fa-mars" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Pregnant" value={pregnant} icon="fa-baby-carriage" onClick={() => onViewChange(ViewState.Pigs)} />

            <Card label="Sales" value={`$${sales.toLocaleString()}`} icon="fa-chart-line" subBadge={currentYear} subBadgeColor="bg-blue-500" onClick={() => onViewChange(ViewState.Finance)} />
            <Card label="Expenses" value={`$${expenses.toLocaleString()}`} icon="fa-warehouse" subBadge={currentYear} subBadgeColor="bg-blue-500" onClick={() => onViewChange(ViewState.Finance)} />
            <Card label="Feed Cost" value={`$${feedCost.toLocaleString()}`} icon="fa-wheat" subBadge={currentYear} subBadgeColor="bg-blue-500" onClick={() => onViewChange(ViewState.Finance)} />
            <Card label="Pens" value={pens} icon="fa-border-all" onClick={() => onViewChange(ViewState.Pigs)} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Herd Composition Chart */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Herd Composition</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={herdData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {herdData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#374151', fontSize: '12px', fontWeight: 'bold' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Financial Performance Chart */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Financial Overview</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} prefix="$" />
                            <Tooltip 
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
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
    </div>
  );
};

export default Dashboard;
