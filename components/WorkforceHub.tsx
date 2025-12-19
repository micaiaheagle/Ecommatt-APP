import React, { useState, useMemo } from 'react';
import { User, AttendanceLog, PerformanceScore, PieceRateEarning, Task, TimesheetLog } from '../types';
import { Trophy, Clock, MapPin, Calculator, TrendingUp, Award, CheckCircle, ChevronRight, Zap, Target, History, User as UserIcon, Calendar } from 'lucide-react';

interface WorkforceHubProps {
    users: User[];
    currentUser: User;
    attendanceLogs: AttendanceLog[];
    performanceScores: PerformanceScore[];
    pieceRateEarnings: PieceRateEarning[];
    timesheets: TimesheetLog[];
    tasks: Task[];
    onLogAttendance: (log: AttendanceLog) => void;
    onLogPieceRate: (earning: PieceRateEarning) => void;
    onLogTime: (log: TimesheetLog) => void;
    onBack?: () => void;
}

const WorkforceHub: React.FC<WorkforceHubProps> = ({
    users,
    currentUser,
    attendanceLogs,
    performanceScores,
    pieceRateEarnings,
    timesheets,
    tasks,
    onLogAttendance,
    onLogPieceRate,
    onLogTime,
    onBack
}) => {
    const [activeTab, setActiveTab] = useState<'Leaderboard' | 'Attendance' | 'Earnings' | 'Tasks'>('Leaderboard');
    const [showPieceRateModal, setShowPieceRateModal] = useState(false);
    const [pieceRateData, setPieceRateData] = useState({
        taskType: 'Maize Picking',
        quantity: '',
        unit: 'crates'
    });

    const rates: Record<string, { rate: number, unit: string }> = {
        'Maize Picking': { rate: 0.5, unit: 'crates' },
        'Soya Bagging': { rate: 1.2, unit: 'bags' },
        'Fertilizer Application': { rate: 0.75, unit: 'rows' },
        'Crating': { rate: 0.1, unit: 'units' }
    };

    const leaderboardData = useMemo(() => {
        return users.map(user => {
            const score = performanceScores
                .filter(s => s.userId === user.id)
                .reduce((acc, curr) => acc + curr.score, 0) / (performanceScores.filter(s => s.userId === user.id).length || 1);
            return { ...user, score: Math.round(score || 0) };
        }).sort((a, b) => b.score - a.score);
    }, [users, performanceScores]);

    const isCheckedIn = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const lastLog = attendanceLogs.find(l => l.userId === currentUser.id && l.date === today);
        return lastLog && !lastLog.checkOutTime;
    }, [attendanceLogs, currentUser.id]);

    const handleAttendance = () => {
        const today = new Date().toISOString().split('T')[0];
        const time = new Date().toLocaleTimeString();

        if (isCheckedIn) {
            // Find the active log to "check out"
            const activeLog = attendanceLogs.find(l => l.userId === currentUser.id && l.date === today && !l.checkOutTime);
            if (activeLog) {
                onLogAttendance({ ...activeLog, checkOutTime: time, status: 'Out' });
            }
        } else {
            const newLog: AttendanceLog = {
                id: `att-${Date.now()}`,
                userId: currentUser.id,
                date: today,
                checkInTime: time,
                status: 'On Site',
                method: 'GPS',
                location: { lat: -17.8248, lng: 31.0530 } // Mock Ecomatt Farm Coords
            };
            onLogAttendance(newLog);
        }
    };

    const handleLogPieceRateEarning = () => {
        const rateInfo = rates[pieceRateData.taskType];
        const qty = parseFloat(pieceRateData.quantity);
        if (isNaN(qty) || qty <= 0) return alert("Please enter a valid quantity");

        const newEarning: PieceRateEarning = {
            id: `pr-${Date.now()}`,
            userId: currentUser.id,
            date: new Date().toISOString().split('T')[0],
            taskType: pieceRateData.taskType,
            quantity: qty,
            unit: pieceRateData.unit,
            ratePerUnit: rateInfo.rate,
            totalAmount: qty * rateInfo.rate
        };

        onLogPieceRate(newEarning);
        setShowPieceRateModal(false);
        setPieceRateData({ ...pieceRateData, quantity: '' });
    };

    return (
        <div className="bg-gray-50/30 min-h-screen animate-in fade-in duration-500">
            <div className="p-8 max-w-7xl mx-auto">
                {/* Context Header */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {onBack && (
                                <button onClick={onBack} className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100">
                                    <i className="fas fa-arrow-left text-xs"></i>
                                </button>
                            )}
                            <span className="text-[10px] font-black text-ecomattGreen uppercase tracking-widest bg-green-50 px-2 py-1 rounded">Module 18 • Workforce Management</span>
                        </div>
                        <h2 className="text-4xl font-black text-ecomattBlack tracking-tighter">Workforce Hub</h2>
                    </div>

                    <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-100 min-w-[300px]">
                        {['Leaderboard', 'Attendance', 'Earnings', 'Tasks'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${activeTab === tab ? 'bg-ecomattBlack text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Leaderboard View */}
                        {activeTab === 'Leaderboard' && (
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                            <Trophy className="text-yellow-500" /> Farm Excellence
                                        </h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Live Performance Rankings • Nov 2025</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-amber-100">
                                            Reward: $50 Bonus
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {leaderboardData.map((staff, idx) => (
                                        <div key={staff.id} className={`flex items-center gap-6 p-6 rounded-3xl transition-all border ${idx === 0 ? 'bg-amber-50/50 border-amber-200 shadow-lg shadow-amber-50' : idx === 1 ? 'bg-gray-50 border-gray-200' : 'border-gray-50 hover:bg-gray-50/50'}`}>
                                            <div className="w-12 text-center text-xl font-black text-gray-400">
                                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-black text-gray-400 shadow-sm relative overflow-hidden">
                                                {staff.name.charAt(0)}
                                                {idx === 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-ecomattGreen rounded-bl-lg border-b border-l border-white"></div>}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-gray-900 uppercase tracking-tight">{staff.name}</h4>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{staff.role}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">XP Score</div>
                                                <div className="text-2xl font-black text-ecomattBlack">{staff.score}</div>
                                            </div>
                                            <div className="w-48 hidden md:block">
                                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-ecomattGreen' : 'bg-gray-400'}`} style={{ width: `${staff.score}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Attendance View */}
                        {activeTab === 'Attendance' && (
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                            <MapPin className="text-blue-500" /> Digital Punch Card
                                        </h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Geo-Stamped Presence Verification</p>
                                    </div>
                                    <button
                                        onClick={handleAttendance}
                                        className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${isCheckedIn ? 'bg-red-500 text-white shadow-red-100' : 'bg-ecomattGreen text-white shadow-green-100'} hover:scale-105 active:scale-95 flex items-center gap-3`}
                                    >
                                        <Clock size={18} />
                                        {isCheckedIn ? 'End Shift' : 'Initiate Shift'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 border-dashed flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm border border-gray-100 mb-4 animate-pulse">
                                            <Zap size={24} />
                                        </div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">GPS Connection</div>
                                        <div className="text-sm font-black text-gray-900">Ecomatt Farm HQ Verified</div>
                                        <div className="mt-2 text-[9px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded tracking-widest">SIGNAL STRENGTH: 98%</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-white border border-gray-100 rounded-3xl">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Check In</div>
                                            <div className="text-xl font-black">{attendanceLogs.find(l => l.userId === currentUser.id && l.date === new Date().toISOString().split('T')[0])?.checkInTime || '--:--'}</div>
                                        </div>
                                        <div className="p-6 bg-white border border-gray-100 rounded-3xl">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Duration</div>
                                            <div className="text-xl font-black">0.0 hrs</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">Shift History</h4>
                                    {attendanceLogs.filter(l => l.userId === currentUser.id).slice().reverse().map(log => (
                                        <div key={log.id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm">
                                                    <Calendar size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{log.date}</div>
                                                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Metod: {log.method}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 shrink-0 sm:gap-8 ml-4">
                                                <div className="text-right">
                                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">In</div>
                                                    <div className="text-xs font-black whitespace-nowrap">{log.checkInTime}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Out</div>
                                                    <div className="text-xs font-black whitespace-nowrap">{log.checkOutTime || 'Active'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Earnings View */}
                        {activeTab === 'Earnings' && (
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                            <Calculator className="text-purple-500" /> Piece-Rate Earnings
                                        </h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Output-Based Wage Projection</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPieceRateModal(true)}
                                        className="bg-ecomattBlack text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-gray-200 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Log Output
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div className="p-8 bg-ecomattBlack text-white rounded-[2rem] relative overflow-hidden group">
                                        <TrendingUp className="absolute bottom-[-20px] right-[-20px] w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                                        <div className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-1">Accrued (ZiG)</div>
                                        <div className="text-4xl font-black">
                                            ${pieceRateEarnings.filter(e => e.userId === currentUser.id).reduce((acc, curr) => acc + curr.totalAmount, 0).toFixed(2)}
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-green-400 text-[9px] font-black tracking-widest uppercase">
                                            <Zap size={10} /> +12% Efficiency
                                        </div>
                                    </div>
                                    <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Crates Harvested</div>
                                        <div className="text-3xl font-black text-gray-900">142</div>
                                    </div>
                                    <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Units Bagged</div>
                                        <div className="text-3xl font-black text-gray-900">45</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">Earnings Log</h4>
                                    {pieceRateEarnings.filter(e => e.userId === currentUser.id).slice().reverse().map(earning => (
                                        <div key={earning.id} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 hover:border-ecomattGreen transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-ecomattGreen transition-colors">
                                                    <Zap size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-gray-900 uppercase tracking-tight">{earning.taskType}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                        {earning.quantity} {earning.unit} @ ${earning.ratePerUnit}/{earning.unit}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0 ml-4">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 whitespace-nowrap">{earning.date}</div>
                                                <div className="text-lg font-black text-ecomattBlack whitespace-nowrap">${earning.totalAmount.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tasks View - Inherited & Upgraded */}
                        {activeTab === 'Tasks' && (
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3 mb-8">
                                    <Award className="text-orange-500" /> Assignment Center
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {users.map(user => {
                                        const userTasks = tasks.filter(t => t.assignedTo === user.id);
                                        return (
                                            <div key={user.id} className="p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] relative group cursor-pointer hover:bg-white hover:shadow-xl transition-all">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center font-black text-gray-400 text-lg shadow-sm">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 uppercase tracking-tight">{user.name}</h4>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user.role}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    {userTasks.length === 0 ? (
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic text-center py-4 bg-white/50 rounded-2xl">Standing by for orders</div>
                                                    ) : (
                                                        userTasks.map(task => (
                                                            <div key={task.id} className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-blue-400'}`}></div>
                                                                    <span className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{task.title}</span>
                                                                </div>
                                                                <div className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                    {task.status}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Left: Quick Stats & My Score */}
                    <div className="space-y-6">
                        {/* My XP Profile */}
                        <div className="bg-ecomattBlack text-white rounded-[2.5rem] p-8 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5">
                                    <UserIcon size={32} className="text-ecomattGreen" />
                                </div>
                                <div>
                                    <div className="text-xl font-black">{currentUser.name}</div>
                                    <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">{currentUser.role}</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Level 12 • Field Specialist</div>
                                        <div className="text-xs font-black">2,450 XP</div>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-ecomattGreen rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                    <p className="text-[9px] text-white/40 mt-2 font-bold uppercase tracking-widest">350 XP until next promotion</p>
                                </div>

                                <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Rank</div>
                                        <div className="text-xl font-black text-ecomattGreen">Top 5</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Badge</div>
                                        <div className="text-xl font-black text-yellow-400">Expert</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Badges */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">Achievement unlocked</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                                    <Award className="text-yellow-600" size={24} />
                                    <div>
                                        <div className="text-[11px] font-black text-yellow-900 uppercase">Fast Picker</div>
                                        <p className="text-[9px] text-yellow-700 font-bold uppercase">Maize Harvest 2025</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                                    <CheckCircle className="text-green-600" size={24} />
                                    <div>
                                        <div className="text-[11px] font-black text-green-900 uppercase">Early Bird</div>
                                        <p className="text-[9px] text-green-700 font-bold uppercase">7 Day Streak</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Piece Rate Modal */}
            {showPieceRateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Work Submission</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Record your output for verification</p>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Task Classifier</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.keys(rates).map(task => (
                                        <button
                                            key={task}
                                            onClick={() => setPieceRateData({ ...pieceRateData, taskType: task, unit: rates[task].unit })}
                                            className={`p-4 rounded-2xl text-[10px] font-black uppercase transition-all border ${pieceRateData.taskType === task ? 'bg-ecomattBlack text-white border-transparent' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                                        >
                                            {task}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Volume ({pieceRateData.unit})</label>
                                    <input
                                        type="number"
                                        value={pieceRateData.quantity}
                                        onChange={e => setPieceRateData({ ...pieceRateData, quantity: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 p-5 rounded-3xl text-xl font-black outline-none focus:ring-4 ring-ecomattGreen/10 transition-all placeholder:text-gray-200"
                                        placeholder="0.0"
                                    />
                                </div>
                                <div className="bg-gray-50 rounded-3xl p-6 flex flex-col justify-center">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Est. Accrual</div>
                                    <div className="text-2xl font-black text-ecomattGreen">
                                        ${(parseFloat(pieceRateData.quantity || '0') * rates[pieceRateData.taskType].rate).toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setShowPieceRateModal(false)} className="flex-1 py-5 font-black text-gray-400 uppercase text-[10px] tracking-widest hover:bg-gray-50 rounded-3xl transition-colors">Abort</button>
                                <button onClick={handleLogPieceRateEarning} className="flex-1 py-5 bg-ecomattGreen text-white font-black uppercase text-[10px] tracking-widest rounded-3xl shadow-xl shadow-green-100 hover:scale-[1.02] transition-all">Submit Assignment</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkforceHub;
