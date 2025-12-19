import React, { useState, useMemo } from 'react';
import {
    Users,
    Map as MapIcon,
    History,
    AlertTriangle,
    ShieldCheck,
    Route,
    Search,
    Zap,
    CheckCircle2,
    XCircle,
    Scan,
    UserCheck
} from 'lucide-react';
import { PenMovement, InfectionAlert, User } from '../types';

interface ContactTracingProps {
    movements: PenMovement[];
    alerts: InfectionAlert[];
    users: User[];
    onLogMovement: (movement: Partial<PenMovement>) => void;
}

const ContactTracing: React.FC<ContactTracingProps> = ({
    movements,
    alerts,
    users,
    onLogMovement
}) => {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedPen, setSelectedPen] = useState<string | null>(null);

    const infectionPath = useMemo(() => {
        if (!selectedPen) return [];

        // Find movements for the selected pen
        const penMovements = movements.filter(m => m.penId === selectedPen);
        const exposedUsers = new Set(penMovements.map(m => m.userId));

        // Find all subsequent movements for those users
        return movements.filter(m => exposedUsers.has(m.userId)).sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }, [selectedPen, movements]);

    const activeAlert = alerts.find(a => a.penId === selectedPen && a.status === 'Active');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Top Controls: Scan & Quick Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="lg:col-span-3 bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-ecomattBlack text-white rounded-2xl md:rounded-3xl flex items-center justify-center text-xl md:text-2xl shadow-xl shadow-gray-200 shrink-0">
                            <Scan size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg md:text-xl font-black text-ecomattBlack">Gate-Logging Pulse</h3>
                            <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Simulated Pen Entry/Exit Monitoring</p>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => onLogMovement({ penId: 'z1', penName: 'Farrowing House', type: 'In', sanitized: true })}
                            className="flex-1 md:flex-none px-4 md:px-6 py-3 md:py-4 bg-ecomattGreen text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                            <Zap size={14} /> Log Entry
                        </button>
                        <button
                            onClick={() => onLogMovement({ penId: 'z1', penName: 'Farrowing House', type: 'Out', sanitized: true })}
                            className="flex-1 md:flex-none px-4 md:px-6 py-3 md:py-4 bg-gray-100 text-gray-400 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center"
                        >
                            Log Exit
                        </button>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 flex items-center md:flex-col justify-center md:justify-center text-left md:text-center group transition-all hover:bg-red-100 gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-110 transition-transform shrink-0">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <div className="text-xl md:text-2xl font-black text-red-600 leading-none">{alerts.filter(a => a.status === 'Active').length}</div>
                        <div className="text-[9px] md:text-[10px] font-black text-red-400 uppercase tracking-widest mt-1 md:mt-2">Active Alerts</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left Column: Infection Risk Map / Pen List */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 md:mb-8 flex items-center gap-2">
                            <MapIcon size={14} className="text-ecomattGreen" />
                            Zone Risk Assessment
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4">
                            {['z1', 'z2', 'z3', 'z4', 'z5'].map((id) => {
                                const penAlert = alerts.find(a => a.penId === id && a.status === 'Active');
                                const isSelected = selectedPen === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => setSelectedPen(id)}
                                        className={`w-full p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all flex items-center justify-between text-left ${isSelected
                                            ? 'bg-ecomattBlack border-ecomattBlack text-white shadow-xl translate-x-1 md:translate-x-1'
                                            : 'bg-gray-50/50 border-gray-100 text-gray-900 hover:bg-white hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-xs md:text-base ${penAlert ? 'bg-red-500 text-white' : isSelected ? 'bg-white/10 text-white' : 'bg-white text-gray-400'
                                                }`}>
                                                {id === 'z1' ? 'FH' : id === 'z2' ? 'WD' : id === 'z3' ? 'GR' : id === 'z4' ? 'FW' : 'MG'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-xs md:text-sm tracking-tight">
                                                    {id === 'z1' ? 'Farrowing House' : id === 'z2' ? 'Weaner Deck' : id === 'z3' ? 'Gestation Row' : id === 'z4' ? 'Feed Warehouse' : 'Main Gate'}
                                                </div>
                                                <div className={`text-[9px] md:text-[10px] font-bold ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>
                                                    {penAlert ? penAlert.disease : 'No active threats'}
                                                </div>
                                            </div>
                                        </div>
                                        {penAlert && <AlertTriangle size={14} className="text-white animate-pulse" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                        <div className="relative z-10">
                            <ShieldCheck size={40} className="text-white/20 mb-6" />
                            <h4 className="text-lg font-black leading-tight mb-2">Sanitation Protocol Enforcement</h4>
                            <p className="text-white/60 text-[11px] leading-relaxed mb-6 font-medium">
                                Mandatory sanitation scans are required between Red and Yellow zone transitions.
                            </p>
                            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-emerald-400">
                                <CheckCircle2 size={16} /> Compliance: 94.2%
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                    </div>
                </div>

                {/* Right Column: Path of Infection Report */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-0 border border-gray-100 shadow-sm overflow-hidden min-h-0 md:min-h-[600px] flex flex-col">
                        <div className="p-4 md:p-8 border-b border-gray-50 flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50/50 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-500 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                                    <Route size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-ecomattBlack">Path of Infection Report</h3>
                                    <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Cross-movement analysis engine</p>
                                </div>
                            </div>
                            {selectedPen && (
                                <button
                                    onClick={() => setSelectedPen(null)}
                                    className="text-[9px] md:text-[10px] font-black text-gray-400 hover:text-ecomattBlack uppercase tracking-widest"
                                >
                                    Clear Analysis
                                </button>
                            )}
                        </div>

                        <div className="flex-1 p-8">
                            {selectedPen ? (
                                <div className="space-y-8">
                                    {/* Summary of Exposure */}
                                    <div className={`p-6 rounded-3xl border flex items-center justify-between ${activeAlert ? 'bg-red-50 border-red-100 shadow-inner' : 'bg-amber-50 border-amber-100 shadow-inner'
                                        }`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeAlert ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                                                }`}>
                                                <AlertTriangle size={24} />
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900">
                                                    {activeAlert ? `${activeAlert.disease} Exposure Analysis` : `Suspicious Pen: ${selectedPen}`}
                                                </div>
                                                <div className="text-xs text-gray-500 font-medium">Analyzing contact history for users who entered this zone.</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-gray-900">{new Set(infectionPath.map(m => m.userId)).size}</div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Exposed Staff</div>
                                        </div>
                                    </div>

                                    {/* Movemement Timeline */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tracing Timeline (Desc)</h4>
                                        <div className="relative pl-8 space-y-8">
                                            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-100" />

                                            {infectionPath.length > 0 ? infectionPath.map((move, idx) => (
                                                <div key={move.id} className="relative flex items-center justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className={`absolute -left-8 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white ${move.penId === selectedPen ? 'bg-red-500' : 'bg-amber-500'
                                                        }`}>
                                                        {idx + 1}
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                                            <UserCheck size={20} />
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-gray-900 text-sm">{move.userName}</div>
                                                            <div className="text-[10px] text-gray-500 font-bold">
                                                                {move.type === 'In' ? 'Entered' : 'Exited'} <span className="text-ecomattBlack">{move.penName}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-xs font-black text-gray-900">{move.timestamp.split('T')[1].substring(0, 5)}</div>
                                                        <div className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 justify-end mt-1 ${move.sanitized ? 'text-emerald-500' : 'text-red-500'
                                                            }`}>
                                                            {move.sanitized ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                                            {move.sanitized ? 'Sanitized' : 'No Record'}
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-12 text-gray-400 font-bold italic border-2 border-dashed border-gray-100 rounded-3xl">
                                                    No tracing data available for this zone.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-gray-200 border-2 border-dashed border-gray-100">
                                        <Search size={40} />
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight">Select Pen to Track Infection</h4>
                                    <p className="text-sm text-gray-400 max-w-xs mx-auto mt-3 font-medium">
                                        Choose a zone from the risk assessment map to generate a recursive path tracing report.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactTracing;
