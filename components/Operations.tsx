
import React, { useState, useEffect } from 'react';
import { FeedInventory, HealthRecord, Task } from '../types';
import { exportToPDF, exportToExcel } from '../services/exportService';

interface OperationsProps {
    feeds: FeedInventory[];
    healthRecords: HealthRecord[];
    tasks: Task[];
    initialTab?: 'Tasks' | 'Feed' | 'Health';
    pigFilter?: string;
    onOpenFeedLogger: () => void;
    onOpenFeedFormulator: () => void;
}

const Operations: React.FC<OperationsProps> = ({
    feeds,
    healthRecords,
    tasks,
    initialTab,
    pigFilter,
    onOpenFeedLogger,
    onOpenFeedFormulator
}) => {
    const [activeTab, setActiveTab] = useState<'Tasks' | 'Feed' | 'Health'>('Tasks');
    const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    // Sorting Logic
    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortBy === 'dueDate') {
            // Sort by date string (YYYY-MM-DD)
            return a.dueDate.localeCompare(b.dueDate);
        } else {
            // Sort by Priority (High > Medium > Low)
            const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
            const pA = priorityMap[a.priority] || 0;
            const pB = priorityMap[b.priority] || 0;
            return pB - pA;
        }
    });

    // Date Formatter
    const formatDueDate = (dateStr: string) => {
        const today = new Date().toISOString().split('T')[0];
        if (dateStr === today) return "Today";

        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

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
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab
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
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Task List</h3>
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-500 font-bold">Sort By:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-white border border-gray-200 text-xs font-bold text-gray-700 rounded-lg px-2 py-1 focus:outline-none focus:border-ecomattGreen"
                            >
                                <option value="dueDate">Due Date</option>
                                <option value="priority">Priority</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {sortedTasks.length > 0 ? sortedTasks.map(task => (
                            <div key={task.id} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 flex gap-3 ${task.priority === 'High' ? 'border-red-500' : task.priority === 'Medium' ? 'border-yellow-500' : 'border-blue-500'} ${task.status === 'Completed' ? 'opacity-60' : ''}`}>
                                <div className="mt-1">
                                    <i className={`far ${task.status === 'Completed' ? 'fa-check-square text-blue-500' : 'fa-square text-gray-300'} text-lg`}></i>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`text-sm font-bold text-gray-900 ${task.status === 'Completed' ? 'line-through' : ''}`}>{task.title}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${task.dueDate === new Date().toISOString().split('T')[0] ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {formatDueDate(task.dueDate)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{task.type}</p>

                                    {task.priority === 'High' && task.status !== 'Completed' && (
                                        <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded mt-2 inline-block font-bold">High Priority</span>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                No tasks available.
                            </div>
                        )}
                    </div>

                    <button className="w-full mt-6 bg-white border-2 border-dashed border-gray-300 text-gray-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:border-ecomattGreen hover:text-ecomattGreen transition">
                        <i className="fas fa-plus"></i> Add New Task
                    </button>
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

                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Levels</h3>
                        <button onClick={() => {
                            const columns = ['Item', 'Type', 'Quantity (kg)', 'Reorder Level', 'Status'];
                            const data = feeds.map(f => [f.name, f.type, f.quantityKg, f.reorderLevel, f.quantityKg < f.reorderLevel ? 'Low' : 'OK']);
                            exportToPDF('Feed Inventory Report', columns, data, 'feed_inventory.pdf');
                        }} className="text-xs font-bold text-ecomattGreen hover:underline">
                            <i className="fas fa-download mr-1"></i> Export
                        </button>
                    </div>
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

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onOpenFeedLogger}
                            className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition"
                        >
                            <i className="fas fa-pen"></i> Log Daily Feed
                        </button>
                        <button
                            onClick={onOpenFeedFormulator}
                            className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                        >
                            <i className="fas fa-flask"></i> Formulator
                        </button>
                    </div>
                </>
            )}

            {/* Health View (Screen 07) */}
            {activeTab === 'Health' && (
                <>
                    <div className="flex bg-gray-200 p-1 rounded-xl mb-4">
                        <button className="flex-1 bg-white shadow-sm rounded-lg py-1.5 text-xs font-bold text-gray-900">Active Cases</button>
                        <button className="flex-1 text-gray-500 py-1.5 text-xs font-bold">History</button>
                    </div>

                    {pigFilter && (
                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-4 flex justify-between items-center animate-in slide-in-from-top duration-300">
                            <p className="text-xs text-blue-700 font-bold">
                                Filtered for <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200 ml-1">{pigFilter}</span>
                            </p>
                            <i className="fas fa-filter text-blue-400 text-xs"></i>
                        </div>
                    )}

                    {!pigFilter && (
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
                    )}

                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {pigFilter ? 'Pig Health History' : 'Recent Logs'}
                        </h3>
                        <button onClick={() => {
                            const filteredRecords = healthRecords.filter(rec => !pigFilter || rec.pigId === pigFilter);
                            const columns = ['Date', 'Pig ID', 'Type', 'Description', 'Medication', 'Administered By'];
                            const data = filteredRecords.map(r => [r.date, r.pigId, r.type, r.description, r.medication || '-', r.administeredBy || '-']);
                            exportToPDF('Health Records Report', columns, data, 'health_records.pdf');
                        }} className="text-xs font-bold text-ecomattGreen hover:underline">
                            <i className="fas fa-download mr-1"></i> Export
                        </button>
                    </div>

                    <div className="space-y-3">
                        {healthRecords
                            .filter(rec => !pigFilter || rec.pigId === pigFilter)
                            .map(rec => (
                                <div key={rec.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3 items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500">
                                        <i className="fas fa-syringe"></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{rec.type}</p>
                                        <p className="text-xs text-gray-500">{rec.pigId} • {rec.date}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">{rec.description}</p>
                                    </div>
                                </div>
                            ))}

                        {healthRecords.filter(rec => !pigFilter || rec.pigId === pigFilter).length === 0 && (
                            <div className="text-center py-8 bg-white rounded-xl border border-gray-100 border-dashed">
                                <i className="fas fa-notes-medical text-gray-300 text-2xl mb-2"></i>
                                <p className="text-xs text-gray-500">No health records found.</p>
                            </div>
                        )}
                    </div>

                    <button className="w-full mt-6 bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition">
                        <i className="fas fa-plus"></i> Record Treatment
                    </button>
                </>
            )}

        </div>
    );
};

export default Operations;
