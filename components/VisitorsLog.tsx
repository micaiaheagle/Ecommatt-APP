import React, { useState } from 'react';
import { VisitorLogEntry } from '../types';

interface VisitorsLogProps {
    logs: VisitorLogEntry[];
    onCheckIn: (entry: VisitorLogEntry) => void;
    onCheckOut: (id: string, date: string) => void;
}

const VisitorsLog: React.FC<VisitorsLogProps> = ({ logs, onCheckIn, onCheckOut }) => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        contact: '',
        purpose: '',
        visitedOtherFarm: false,
        sanitized: false,
        notes: ''
    });

    const isCheckedIn = (log: VisitorLogEntry) => log.status === 'Checked In';

    const handleCheckIn = () => {
        if (!formData.name || !formData.contact) return alert("Name and Contact are required");

        const riskLevel = formData.visitedOtherFarm ? 'High' : 'Low';

        const newEntry: VisitorLogEntry = {
            id: `vis-${Date.now()}`,
            name: formData.name,
            company: formData.company,
            contact: formData.contact,
            purpose: formData.purpose,
            checkInTime: new Date().toLocaleTimeString(),
            date: new Date().toISOString().split('T')[0],
            status: 'Checked In',
            visitedOtherFarm: formData.visitedOtherFarm,
            sanitized: formData.sanitized,
            riskLevel: riskLevel,
            notes: formData.notes
        };

        onCheckIn(newEntry);
        setShowModal(false);
        setFormData({ name: '', company: '', contact: '', purpose: '', visitedOtherFarm: false, sanitized: false, notes: '' });
    };

    const handleCheckOut = (id: string) => {
        onCheckOut(id, new Date().toLocaleTimeString());
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Digital Site Access Log</h3>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Dr. Gusha Compliance: Strict Bio-Security</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-ecomattBlack text-white px-6 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-gray-200 text-xs font-black uppercase tracking-widest"
                >
                    <i className="fas fa-user-shield"></i> Secure Check-In
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Visitor / Risk</th>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Purpose</th>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sanitation</th>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Entry Time</th>
                            <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Access Control</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center">
                                    <div className="text-gray-200 text-6xl mb-4"><i className="fas fa-shield-virus"></i></div>
                                    <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No Active Site Visitors</p>
                                </td>
                            </tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log.id} className="group hover:bg-gray-50/50 transition-all">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${log.riskLevel === 'High' ? 'bg-red-50 text-red-500 shadow-sm border border-red-100' : 'bg-green-50 text-green-500 shadow-sm border border-green-100'
                                                }`}>
                                                <i className={`fas ${log.riskLevel === 'High' ? 'fa-exclamation-triangle' : 'fa-user-check'}`}></i>
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 text-sm tracking-tight">{log.name}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {log.company && <div className="text-[10px] text-gray-400 font-bold">{log.company}</div>}
                                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${log.riskLevel === 'High' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {log.riskLevel} Risk
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="text-xs font-black text-gray-700 uppercase tracking-tighter bg-gray-100 px-3 py-1.5 rounded-xl w-fit">{log.purpose}</div>
                                        <div className="text-[10px] text-gray-400 font-bold mt-2 truncate max-w-[150px]">{log.notes || 'No security notes'}</div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${log.sanitized ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></span>
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                                {log.sanitized ? 'Footbath Verified' : 'Awaiting Sanitation'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="font-black text-gray-900 text-xs">{log.checkInTime}</div>
                                        <div className="text-[10px] text-gray-400 font-bold">{log.date}</div>
                                    </td>
                                    <td className="p-6 text-right">
                                        {log.status === 'Checked In' ? (
                                            <button
                                                onClick={() => handleCheckOut(log.id)}
                                                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                                            >
                                                Revoke Access
                                            </button>
                                        ) : (
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Exited @ {log.checkOutTime}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h4 className="text-2xl font-black text-gray-900 tracking-tight">Visitor Pre-Entry Scan</h4>
                                <p className="text-[10px] text-ecomattGreen font-black uppercase tracking-widest">Immediate Bio-Risk Assessment</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl p-4 font-black text-gray-900 focus:border-ecomattGreen outline-none transition-all placeholder:text-gray-300 text-sm"
                                        placeholder="Mandatory field"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl p-4 font-black text-gray-900 focus:border-ecomattGreen outline-none transition-all placeholder:text-gray-300 text-sm"
                                        placeholder="+263..."
                                        value={formData.contact}
                                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Purpose & Destination</label>
                                <select
                                    className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl p-4 font-black text-gray-900 focus:border-ecomattGreen outline-none transition-all text-sm appearance-none"
                                    value={formData.purpose}
                                    onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                >
                                    <option value="">Select Category...</option>
                                    <option value="Delivery">Delivery / Pickup</option>
                                    <option value="Maintenance">Maintenance / Repair</option>
                                    <option value="Vet">Dr. Gusha / Vet Services</option>
                                    <option value="Inspection">Regulatory Inspection</option>
                                    <option value="Visitor">General Visitor</option>
                                </select>
                            </div>

                            {/* Risk Assessment Section */}
                            <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100">
                                <h5 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <i className="fas fa-biohazard text-amber-500"></i> Critical Bio-Risk Assessment
                                </h5>

                                <label className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 cursor-pointer group hover:border-ecomattGreen transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-ecomattGreen group-hover:bg-green-50 transition-all">
                                            <i className="fas fa-tractor"></i>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">Visited another farm last 72h?</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-ecomattGreen"
                                        checked={formData.visitedOtherFarm}
                                        onChange={e => setFormData({ ...formData, visitedOtherFarm: e.target.checked })}
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 cursor-pointer group hover:border-ecomattGreen transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-ecomattGreen group-hover:bg-green-50 transition-all">
                                            <i className="fas fa-soap"></i>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">Verified footbath sanitation?</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-ecomattGreen"
                                        checked={formData.sanitized}
                                        onChange={e => setFormData({ ...formData, sanitized: e.target.checked })}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-4 text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handleCheckIn}
                                className="flex-2 bg-ecomattGreen text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Grant Site Access
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitorsLog;


