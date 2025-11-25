
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
        className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 cursor-pointer hover:border-ecomattGreen transition-colors group relative overflow-hidden"
    >
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 text-lg md:text-2xl group-hover:bg-ecomattGreen group-hover:text-white transition-colors z-10 relative">
            <i className={`fas ${icon}`}></i>
        </div>
        <div className="z-10 relative w-full">
            <div className="flex items-center justify-between md:justify-start gap-2">
                <p className="text-xs md:text-sm font-bold text-gray-500 md:text-gray-600 truncate">{label}</p>
                {subBadge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold text-white ${subBadgeColor || 'bg-blue-500'}`}>
                        {subBadge}
                    </span>
                )}
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-2 translate-y-2 z-0">
             <i className={`fas ${icon} text-6xl`}></i>
        </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Farm Overview</p>
            </div>
            {/* Weather Widget Small */}
            <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100">
                <i className="fas fa-cloud-sun text-ecomattYellow text-lg md:text-xl"></i>
                <div className="text-right">
                    <p className="text-xs md:text-sm font-bold text-gray-900">24°C</p>
                    <p className="text-[9px] md:text-[10px] text-gray-500 hidden md:block">Kwekwe</p>
                </div>
            </div>
        </div>

        {/* Critical Attention Section (Horizontal Scroll) */}
        {(sickPigs > 0 || urgentTasks > 0 || lowStockFeeds > 0) && (
            <div className="mb-6 md:mb-8">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle text-red-500"></i> Critical Areas
                 </h3>
                 <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x">
                     {sickPigs > 0 && (
                        <div onClick={() => onViewChange(ViewState.Operations)} className="bg-red-50 border border-red-200 p-3 rounded-xl min-w-[160px] md:min-w-[200px] cursor-pointer hover:bg-red-100 transition flex items-center gap-3 snap-center">
                             <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-red-500 text-lg shadow-sm"><i className="fas fa-notes-medical"></i></div>
                             <div>
                                <p className="text-xl md:text-2xl font-bold text-red-700">{sickPigs}</p>
                                <span className="text-[10px] md:text-xs text-red-600 font-bold">Sick Animals</span>
                             </div>
                        </div>
                     )}
                     {urgentTasks > 0 && (
                        <div onClick={() => onViewChange(ViewState.Operations)} className="bg-orange-50 border border-orange-200 p-3 rounded-xl min-w-[160px] md:min-w-[200px] cursor-pointer hover:bg-orange-100 transition flex items-center gap-3 snap-center">
                             <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-orange-500 text-lg shadow-sm"><i className="fas fa-clipboard-check"></i></div>
                             <div>
                                <p className="text-xl md:text-2xl font-bold text-orange-700">{urgentTasks}</p>
                                <span className="text-[10px] md:text-xs text-orange-600 font-bold">Urgent Tasks</span>
                             </div>
                        </div>
                     )}
                     {lowStockFeeds > 0 && (
                        <div onClick={() => onViewChange(ViewState.Operations)} className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl min-w-[160px] md:min-w-[200px] cursor-pointer hover:bg-yellow-100 transition flex items-center gap-3 snap-center">
                             <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-yellow-500 text-lg shadow-sm"><i className="fas fa-cubes"></i></div>
                             <div>
                                <p className="text-xl md:text-2xl font-bold text-yellow-700">{lowStockFeeds}</p>
                                <span className="text-[10px] md:text-xs text-yellow-600 font-bold">Low Feed</span>
                             </div>
                        </div>
                     )}
                 </div>
            </div>
        )}

        {/* Metrics Grid (Optimized: 2 Cols on Mobile, 4 on Desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-8">
            <Card label="Total Pigs" value={totalPigs} icon="fa-piggy-bank" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Piglets" value={piglets} icon="fa-paw" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Weaners" value={weaners} icon="fa-bacon" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Growers" value={growers} icon="fa-arrow-up" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Finishers" value={finishers} icon="fa-weight-hanging" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Sows/Gilts" value={sows} icon="fa-venus" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Boars" value={boars} icon="fa-mars" onClick={() => onViewChange(ViewState.Pigs)} />
            <Card label="Pregnant" value={pregnant} icon="fa-baby-carriage" onClick={() => onViewChange(ViewState.Pigs)} />

            <Card label="Sales" value={`$${sales.toLocaleString()}`} icon="fa-chart-line" subBadge={currentYear} subBadgeColor="bg-blue-500" onClick={() => onViewChange(ViewState.Finance)} />
            <Card label="Expenses" value={`$${expenses.toLocaleString()}`} icon="fa-file-invoice-dollar" subBadge={currentYear} subBadgeColor="bg-red-500" onClick={() => onViewChange(ViewState.Finance)} />
            <Card label="Feed Cost" value={`$${feedCost.toLocaleString()}`} icon="fa-wheat" subBadge={currentYear} subBadgeColor="bg-yellow-500" onClick={() => onViewChange(ViewState.Finance)} />
            <Card label="Pens" value={pens} icon="fa-th" onClick={() => onViewChange(ViewState.Pigs)} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Herd Composition Chart */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">Herd Composition</h3>
                    <button className="text-gray-400 hover:text-gray-600"><i className="fas fa-ellipsis-h"></i></button>
                </div>
                <div className="h-56 md:h-64 w-full">
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
                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Financial Performance Chart */}
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">Financial Overview</h3>
                    <select className="bg-gray-50 border-none text-xs font-bold text-gray-500 rounded-lg py-1">
                        <option>This Year</option>
                        <option>Last Year</option>
                    </select>
                </div>
                <div className="h-56 md:h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={financeData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(value) => `$${value}`} />
                            <Tooltip 
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Smart Alerts (Dynamic) */}
        <div className="mb-6">
             <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Insights</h3>
                <span className="bg-ecomattBlack text-white text-[10px] px-2 py-1 rounded font-bold">Gemini Powered</span>
             </div>
             
             {smartAlerts.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {smartAlerts.map((alert, idx) => (
                         <div key={idx} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${alert.severity === 'High' ? 'border-red-500' : 'border-ecomattYellow'} flex flex-col justify-between`}>
                             <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <i className={`fas ${alert.severity === 'High' ? 'fa-exclamation-circle text-red-500' : 'fa-lightbulb text-ecomattYellow'}`}></i>
                                    <h4 className="text-sm font-bold text-gray-900">{alert.title}</h4>
                                </div>
                                <p className="text-xs text-gray-500">{alert.message}</p>
                             </div>
                             <button className="text-[10px] font-bold text-gray-400 self-end mt-2 hover:text-ecomattGreen">Dismiss</button>
                         </div>
                     ))}
                 </div>
             ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-dashed text-center">
                    <i className="fas fa-robot text-gray-300 text-2xl mb-2"></i>
                    <p className="text-xs text-gray-500">System analyzing... No critical alerts at this moment.</p>
                </div>
             )}
        </div>
    </div>
  );
};

export default Dashboard;
    