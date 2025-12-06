import React, { useState } from 'react';
import { User, TimesheetLog, Task } from '../types';

interface StaffManagerProps {
    users: User[];
    currentUser: User;
    timesheets: TimesheetLog[];
    tasks: Task[];
    onLogTime: (log: TimesheetLog) => void;
    onAssignTask?: (taskId: string, userId: string) => void; // Optional for now
}

const StaffManager: React.FC<StaffManagerProps> = ({ users, currentUser, timesheets, tasks, onLogTime, onAssignTask }) => {
    const [activeTab, setActiveTab] = useState<'Timesheets' | 'Tasks'>('Timesheets');
    const [isLogging, setIsLogging] = useState(false);

    // Timesheet Form State
    const [logData, setLogData] = useState({
        date: new Date().toISOString().split('T')[0],
        hours: '',
        activityType: 'General',
        description: ''
    });

    const handleSubmitLog = (e: React.FormEvent) => {
        e.preventDefault();
        const newLog: TimesheetLog = {
            id: `ts-${Date.now()}`,
            userId: currentUser.id,
            date: logData.date,
            activityType: logData.activityType as any,
            hours: parseFloat(logData.hours),
            description: logData.description
        };
        onLogTime(newLog);
        setIsLogging(false);
        setLogData({ ...logData, hours: '', description: '' });
    };

    // Calculate Stats
    const myWeeklyHours = timesheets
        .filter(t => t.userId === currentUser.id) // simplistic logic, ideally check date range
        .reduce((acc, curr) => acc + curr.hours, 0);

    return (
        <div className="animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staff & Labor</h1>
                    <p className="text-xs text-gray-500">Manage timesheets and daily assignments.</p>
                </div>
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                    <button
                        onClick={() => setActiveTab('Timesheets')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'Timesheets' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Timesheets
                    </button>
                    <button
                        onClick={() => setActiveTab('Tasks')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'Tasks' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Task Board
                    </button>
                </div>
            </div>

            {/* TIMESHEETS VIEW */}
            {activeTab === 'Timesheets' && (
                <>
                    {/* Stats Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">My Total Hours</p>
                            <h2 className="text-3xl font-bold text-gray-900 mt-1">{myWeeklyHours.toFixed(1)} <span className="text-sm font-normal text-gray-400">hrs</span></h2>
                        </div>
                        <button
                            onClick={() => setIsLogging(true)}
                            className="bg-ecomattGreen text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-green-600 transition flex items-center gap-2"
                        >
                            <i className="fas fa-clock"></i> Log Hours
                        </button>
                    </div>

                    {/* Log Form Modal */}
                    {isLogging && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Log Work Hours</h3>
                                <form onSubmit={handleSubmitLog} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                                            <input type="date" required value={logData.date} onChange={e => setLogData({ ...logData, date: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm mt-1 focus:border-ecomattGreen outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Hours</label>
                                            <input type="number" step="0.5" required value={logData.hours} onChange={e => setLogData({ ...logData, hours: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm mt-1 focus:border-ecomattGreen outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Activity</label>
                                        <select value={logData.activityType} onChange={e => setLogData({ ...logData, activityType: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm mt-1 outline-none">
                                            <option>General</option>
                                            <option>Field Work</option>
                                            <option>Machinery</option>
                                            <option>Herding</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                        <textarea required value={logData.description} onChange={e => setLogData({ ...logData, description: e.target.value })} placeholder="What did you work on?" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm mt-1 h-20 outline-none"></textarea>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setIsLogging(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-50 rounded-xl">Cancel</button>
                                        <button type="submit" className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg">Save Log</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* History List */}
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Logs</h3>
                    <div className="space-y-3">
                        {timesheets.length === 0 ? (
                            <p className="text-center text-gray-400 text-xs py-8 bg-white rounded-xl border border-gray-100 border-dashed">No timesheets recorded yet.</p>
                        ) : (
                            timesheets.slice().reverse().map(log => {
                                const user = users.find(u => u.id === log.userId);
                                return (
                                    <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                                                {user?.name.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{log.description}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">{log.activityType}</span>
                                                    <span className="text-[10px] text-gray-400">{log.date} • {user?.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg text-xs">{log.hours}h</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>
            )}

            {/* TASK BOARD VIEW */}
            {activeTab === 'Tasks' && (
                <div className="space-y-6">
                    {users.map(user => {
                        const userTasks = tasks.filter(t => t.assignedTo === user.id);
                        return (
                            <div key={user.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{user.name}</h3>
                                        <p className="text-[10px] text-gray-400">{user.role}</p>
                                    </div>
                                    <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full font-bold text-gray-600">{userTasks.filter(t => t.status === 'Pending').length} Pending</span>
                                </div>

                                <div className="space-y-2">
                                    {userTasks.length === 0 ? (
                                        <p className="text-[11px] text-gray-400 italic pl-1">No tasks assigned.</p>
                                    ) : (
                                        userTasks.filter(t => t.status === 'Pending').map(task => (
                                            <div key={task.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-2">
                                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-400'}`}></div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-gray-800">{task.title}</p>
                                                    <p className="text-[10px] text-gray-500">Due: {task.dueDate}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StaffManager;
