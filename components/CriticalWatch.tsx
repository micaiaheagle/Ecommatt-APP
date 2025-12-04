
import React from 'react';
import { Pig, Task, PigStatus, FeedInventory } from '../types';
import { exportToPDF } from '../services/exportService';

interface CriticalWatchProps {
    pigs: Pig[];
    tasks: Task[];
    feeds: FeedInventory[];
    onCancel: () => void;
    onNavigateToPig: (pig: Pig) => void;
}

const CriticalWatch: React.FC<CriticalWatchProps> = ({ pigs, tasks, feeds, onCancel, onNavigateToPig }) => {
    // 1. Health Alerts
    const sickPigs = pigs.filter(p => p.status === PigStatus.Sick || p.status === PigStatus.Quarantine);

    // 2. Feed Alerts
    const lowFeed = feeds.filter(f => f.quantityKg < f.reorderLevel);

    // 3. Task Alerts
    const urgentTasks = tasks.filter(t => t.priority === 'High' && t.status === 'Pending');

    // 4. Stagnant Growth (Simulation: Pigs > 150 days old but < 60kg)
    const stagnantPigs = pigs.filter(p => {
        const dob = new Date(p.dob);
        const ageDays = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24);
        return ageDays > 150 && p.weight < 60;
    });

    return (
        <div className="animate-in slide-in-from-right duration-300 bg-grayBg min-h-full pb-20">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50"
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">Critical Watch</h2>
                </div>
                <button onClick={() => {
                    const columns = ['Category', 'Item', 'Issue/Status', 'Details'];
                    const data = [
                        ...sickPigs.map(p => ['Health', p.tagId, p.status, `${p.penLocation}`]),
                        ...lowFeed.map(f => ['Feed', f.name, 'Low Stock', `${f.quantityKg}kg (Reorder: ${f.reorderLevel}kg)`]),
                        ...urgentTasks.map(t => ['Task', t.title, 'High Priority', `Due: ${t.dueDate}`]),
                        ...stagnantPigs.map(p => ['Growth', p.tagId, 'Slow Growth', `${p.weight}kg`])
                    ];
                    exportToPDF('Critical Watch Report', columns, data, 'critical_watch_report.pdf');
                }} className="bg-white text-gray-600 px-3 py-2 rounded-xl font-bold text-xs border border-gray-200 hover:bg-gray-50">
                    <i className="fas fa-file-pdf text-red-500 mr-1"></i> Export Report
                </button>
            </div>

            <div className="space-y-6">

                {/* Health Section */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-l-4 border-red-500">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <i className="fas fa-heart-broken text-red-500"></i> Health Alerts
                        </h3>
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">{sickPigs.length} Active</span>
                    </div>
                    {sickPigs.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No sick animals reported. Good job!</p>
                    ) : (
                        <div className="space-y-2">
                            {sickPigs.map(pig => (
                                <div
                                    key={pig.id}
                                    onClick={() => onNavigateToPig(pig)}
                                    className="flex justify-between items-center bg-red-50 p-3 rounded-xl border border-red-100 cursor-pointer hover:bg-red-100"
                                >
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{pig.tagId}</p>
                                        <p className="text-[10px] text-red-600">{pig.status} • {pig.penLocation}</p>
                                    </div>
                                    <i className="fas fa-chevron-right text-red-300 text-xs"></i>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Feed Section */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-l-4 border-yellow-500">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <i className="fas fa-exclamation-triangle text-yellow-500"></i> Low Inventory
                        </h3>
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">{lowFeed.length} Items</span>
                    </div>
                    {lowFeed.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">Stock levels are healthy.</p>
                    ) : (
                        <div className="space-y-2">
                            {lowFeed.map(feed => (
                                <div key={feed.id} className="flex justify-between items-center bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{feed.name}</p>
                                        <p className="text-[10px] text-yellow-700">Reorder at {feed.reorderLevel}kg</p>
                                    </div>
                                    <span className="text-sm font-bold text-red-500">{feed.quantityKg}kg</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Performance Warning */}
                {stagnantPigs.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-l-4 border-orange-500">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <i className="fas fa-chart-line text-orange-500"></i> Slow Growth
                            </h3>
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{stagnantPigs.length} Risks</span>
                        </div>
                        <div className="space-y-2">
                            {stagnantPigs.map(pig => (
                                <div key={pig.id} onClick={() => onNavigateToPig(pig)} className="flex justify-between items-center bg-orange-50 p-3 rounded-xl border border-orange-100 cursor-pointer">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{pig.tagId}</p>
                                        <p className="text-[10px] text-orange-700">Underweight for Age</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{pig.weight}kg</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tasks Section */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-l-4 border-blue-500">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <i className="fas fa-clipboard-list text-blue-500"></i> Priority Tasks
                        </h3>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{urgentTasks.length} Pending</span>
                    </div>
                    <div className="space-y-2">
                        {urgentTasks.map(task => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{task.title}</p>
                                    <p className="text-[10px] text-gray-500">Due: {task.dueDate}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CriticalWatch;
