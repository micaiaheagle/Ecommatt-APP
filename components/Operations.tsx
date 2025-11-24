import React, { useState } from 'react';
import { FeedInventory, HealthRecord, Task } from '../types';

interface OperationsProps {
  feeds: FeedInventory[];
  healthRecords: HealthRecord[];
  tasks: Task[];
}

const Operations: React.FC<OperationsProps> = ({ feeds, healthRecords, tasks }) => {
  const [activeTab, setActiveTab] = useState<'Tasks' | 'Feed' | 'Health'>('Tasks');

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header & Tabs */}
      <div className="flex justify-between items-center mb-4">
         <h2 className="text-2xl font-bold text-gray-900">Operations</h2>
         <button className="text-ecomattGreen text-sm font-bold bg-green-50 px-3 py-1 rounded-lg">Calendar</button>
      </div>

      <div className="flex bg-white p-1 rounded-xl mb-6 shadow-sm border border-gray-100">
        {['Tasks', 'Feed', 'Health'].map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeTab === tab 
                    ? 'bg-ecomattBlack text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      {/* Tasks View (Screen 04) */}
      {activeTab === 'Tasks' && (
        <>
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex justify-between items-center border border-gray-100">
                <div className="text-center">
                    <span className="text-[10px] text-gray-400 block font-bold">MON</span>
                    <span className="font-bold text-gray-900">20</span>
                </div>
                <div className="text-center bg-ecomattGreen text-white px-4 py-2 rounded-xl shadow-lg transform scale-110">
                    <span className="text-[10px] block opacity-80 font-bold">TUE</span>
                    <span className="font-bold text-lg">21</span>
                </div>
                <div className="text-center">
                    <span className="text-[10px] text-gray-400 block font-bold">WED</span>
                    <span className="font-bold text-gray-900">22</span>
                </div>
                <div className="text-center">
                    <span className="text-[10px] text-gray-400 block font-bold">THU</span>
                    <span className="font-bold text-gray-900">23</span>
                </div>
            </div>

            <div className="space-y-3">
                {tasks.map(task => (
                    <div key={task.id} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 flex gap-3 ${task.priority === 'High' ? 'border-red-500' : 'border-blue-500'} ${task.status === 'Completed' ? 'opacity-60' : ''}`}>
                        <div className="mt-1">
                            <i className={`far ${task.status === 'Completed' ? 'fa-check-square text-blue-500' : 'fa-square text-gray-300'} text-lg`}></i>
                        </div>
                        <div>
                            <h4 className={`text-sm font-bold text-gray-900 ${task.status === 'Completed' ? 'line-through' : ''}`}>{task.title}</h4>
                            <p className="text-xs text-gray-500">{task.type} • Due {task.dueDate}</p>
                            {task.priority === 'High' && task.status !== 'Completed' && (
                                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded mt-1 inline-block font-bold">High Priority</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
      )}

      {/* Feed View (Screen 05) */}
      {activeTab === 'Feed' && (
        <>
            <div className="card !bg-gray-900 text-white p-5 rounded-2xl mb-6 relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current FCR</h3>
                    <div className="flex items-end gap-2 mt-1">
                        <h1 className="text-4xl font-bold text-ecomattGreen">2.4</h1>
                        <span className="text-sm text-gray-400 mb-1">Ratio</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Optimal range. Lower is better.</p>
                </div>
                <div className="absolute -right-4 -bottom-4 text-7xl text-white/5">
                    <i className="fas fa-chart-line"></i>
                </div>
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Stock Levels</h3>
            <div className="space-y-3">
                {feeds.map(feed => (
                    <div key={feed.id} className={`bg-white p-4 rounded-xl shadow-sm border flex items-center gap-3 ${feed.quantityKg < feed.reorderLevel ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
                         <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${feed.quantityKg < feed.reorderLevel ? 'bg-white text-red-500' : 'bg-ecomattYellow/20 text-yellow-700'}`}>
                            {feed.quantityKg < feed.reorderLevel ? <i className="fas fa-exclamation-triangle"></i> : <i className="fas fa-wheat"></i>}
                         </div>
                         <div className="flex-1">
                             <div className="flex justify-between text-sm font-bold mb-1">
                                 <span className="text-gray-900">{feed.name}</span>
                                 <span className={feed.quantityKg < feed.reorderLevel ? 'text-red-600' : 'text-gray-900'}>{feed.quantityKg}kg</span>
                             </div>
                             <div className="w-full bg-gray-200 h-1.5 rounded-full">
                                 <div 
                                    className={`h-1.5 rounded-full ${feed.quantityKg < feed.reorderLevel ? 'bg-red-500' : 'bg-ecomattGreen'}`}
                                    style={{ width: `${Math.min(100, (feed.quantityKg / 500) * 100)}%` }}
                                 ></div>
                             </div>
                         </div>
                    </div>
                ))}
            </div>
            
            <button className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
                 <i className="fas fa-plus"></i> Log Feed Consumption
            </button>
        </>
      )}

      {/* Health View (Screen 07) */}
      {activeTab === 'Health' && (
        <>
            <div className="flex bg-gray-200 p-1 rounded-xl mb-4">
                <button className="flex-1 bg-white shadow-sm rounded-lg py-1.5 text-xs font-bold text-gray-900">Active Cases</button>
                <button className="flex-1 text-gray-500 py-1.5 text-xs font-bold">History</button>
            </div>

            <div className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm mb-6">
                <div className="flex justify-between mb-1">
                    <h4 className="text-sm font-bold text-gray-900">Pig #EF-003</h4>
                    <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Respiratory Issue • Isolation Pen</p>
                <div className="bg-gray-50 p-2 rounded text-[10px] text-gray-600 border border-gray-100">
                    <span className="font-bold">Rx:</span> Antibiotics (Daily)
                </div>
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Recent Logs</h3>
            <div className="space-y-3">
                {healthRecords.map(rec => (
                    <div key={rec.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500">
                            <i className="fas fa-syringe"></i>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{rec.type}</p>
                            <p className="text-xs text-gray-500">{rec.pigId} • {rec.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
      )}

    </div>
  );
};

export default Operations;