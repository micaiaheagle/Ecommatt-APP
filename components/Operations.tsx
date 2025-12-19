
import React, { useState, useEffect } from 'react';
import { FeedInventory, HealthRecord, Task, MedicalItem, Pig } from '../types';
import { exportToPDF, exportToExcel } from '../services/exportService';
import MedicalInventoryManager from './MedicalInventoryManager';
import JobCardExecution from './JobCardExecution';

interface OperationsProps {
    pigs: Pig[];
    feeds: FeedInventory[];
    healthRecords: HealthRecord[];
    tasks: Task[];
    initialTab?: 'Tasks' | 'Feed' | 'Pharmacy';
    pigFilter?: string;
    onOpenFeedLogger: () => void;
    onOpenFeedFormulator: () => void;
    onOpenVetSuite: () => void; // Added for redirection
    medicalItems: MedicalItem[];
    onSaveMedicalItem: (item: MedicalItem) => void;
    onDeleteMedicalItem: (id: string) => void;
    onSaveHealthRecord: (record: HealthRecord) => void;
    onLogManure?: (amount: number, date: string) => void;
    onUpdateTask?: (task: Task) => void;
    onOpenScanner?: () => void;
}

const Operations: React.FC<OperationsProps> = ({
    pigs,
    feeds,
    healthRecords,
    tasks,
    initialTab,
    pigFilter,
    onOpenFeedLogger,
    onOpenFeedFormulator,
    medicalItems,
    onSaveMedicalItem,
    onDeleteMedicalItem,
    onSaveHealthRecord,
    onLogManure,
    onUpdateTask,
    onOpenScanner,
    onOpenVetSuite
}) => {
    const [activeTab, setActiveTab] = useState<'Tasks' | 'Feed' | 'Pharmacy' | 'Manure'>('Tasks');
    const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');

    // Manure State
    const [showManureForm, setShowManureForm] = useState(false);
    const [manureLog, setManureLog] = useState({ date: new Date().toISOString().split('T')[0], amount: 0, pen: '' });

    // Health Form State
    const [showHealthForm, setShowHealthForm] = useState(false);
    const [newHealthRecord, setNewHealthRecord] = useState<Partial<HealthRecord>>({
        date: new Date().toISOString().split('T')[0],
        type: 'Treatment'
    });

    const [executingTask, setExecutingTask] = useState<Task | null>(null);

    // Task Execution Logic
    const handleTaskClick = (task: Task) => {
        // If task has checklist or verification, open Job Card
        if ((task.checklist && task.checklist.length > 0) || (task.verificationMethod && task.verificationMethod !== 'None')) {
            setExecutingTask(task);
        } else {
            // Simple tasks can be toggled (Optional: Implement simple toggle logic here if needed, currently just opens detailed if exists)
            // For now, let's treat all clicks as "Open Details" if we want, or just simple complete.
            // Assumption: Smart SOP tasks always have checklist/verification.
        }
    };

    const handleTaskComplete = (completedTask: Task) => {
        if (onUpdateTask) onUpdateTask(completedTask);
        setExecutingTask(null);
    };


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

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Operations</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => onOpenScanner?.()}
                        className="text-white text-sm font-bold bg-blue-600 px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                        <i className="fas fa-qrcode"></i> Scan
                    </button>
                    <button className="text-ecomattGreen text-sm font-bold bg-green-50 px-3 py-1 rounded-lg">Calendar</button>
                </div>
            </div>

            <div className="flex bg-white p-1 rounded-xl mb-6 shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
                {['Tasks', 'Feed', 'Pharmacy', 'Manure'].map(tab => (
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
                <button
                    onClick={onOpenVetSuite}
                    className="flex-1 py-2 text-xs font-bold rounded-lg text-ecomattGreen hover:bg-green-50 transition-all flex items-center justify-center gap-1"
                >
                    <i className="fas fa-heartbeat"></i> Health
                </button>
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

                                {(task.checklist?.length || 0) > 0 && (
                                    <div className="flex-none flex items-center">
                                        <button
                                            onClick={() => handleTaskClick(task)}
                                            className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition shadow-sm border border-blue-700"
                                        >
                                            Start Job
                                        </button>
                                    </div>
                                )}
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

            {/* Pharmacy View */}
            {activeTab === 'Pharmacy' && (
                <MedicalInventoryManager
                    items={medicalItems}
                    onSave={onSaveMedicalItem}
                    onDelete={onDeleteMedicalItem}
                    onCancel={() => setActiveTab('Tasks')}
                />
            )}

            {/* Manure View (New) */}
            {activeTab === 'Manure' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gradient-to-br from-amber-700 to-amber-900 text-white p-5 rounded-2xl mb-6 relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                            <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider">Manure Stock</h3>
                            <div className="flex items-end gap-2 mt-1">
                                <h1 className="text-4xl font-bold">1,250</h1>
                                <span className="text-sm text-white/70 mb-1">kg</span>
                            </div>
                            <p className="text-[10px] text-white/50 mt-2">Ready for Crop Application</p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 text-7xl text-white/10">
                            <i className="fas fa-recycle"></i>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-700 text-2xl">
                            <i className="fas fa-poop"></i>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Log Manure Collection</h3>
                        <p className="text-xs text-gray-500 mb-4 max-w-xs mx-auto">Record daily waste collection from Piggery to increase fertilizer stock.</p>

                        <button
                            onClick={() => setShowManureForm(true)}
                            className="bg-amber-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-900/20 hover:bg-amber-800 transition text-sm"
                        >
                            <i className="fas fa-plus mr-2"></i> Record Collection
                        </button>
                    </div>

                    {/* Manure Form Modal */}
                    {showManureForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-3xl w-full max-w-xs p-6 animate-in zoom-in duration-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Record Manure</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">Date</label>
                                        <input
                                            type="date"
                                            value={manureLog.date}
                                            onChange={e => setManureLog({ ...manureLog, date: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500">Amount (kg)</label>
                                        <input
                                            type="number"
                                            value={manureLog.amount}
                                            onChange={e => setManureLog({ ...manureLog, amount: parseFloat(e.target.value) })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold"
                                        />
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={() => setShowManureForm(false)} className="flex-1 py-2 text-gray-500 font-bold text-sm">Cancel</button>
                                        <button
                                            onClick={() => {
                                                if (onLogManure) onLogManure(manureLog.amount, manureLog.date);
                                                setShowManureForm(false);
                                                setManureLog({ ...manureLog, amount: 0 });
                                            }}
                                            className="flex-1 py-2 bg-amber-700 text-white rounded-lg font-bold text-sm"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Job Card Execution Modal */}
            {executingTask && (
                <JobCardExecution
                    task={executingTask}
                    onComplete={handleTaskComplete}
                    onCancel={() => setExecutingTask(null)}
                />
            )}
        </div>
    );
};

export default Operations;
