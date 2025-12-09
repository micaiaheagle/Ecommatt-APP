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
        purpose: ''
    });

    const isCheckedIn = (log: VisitorLogEntry) => log.status === 'Checked In';

    const handleCheckIn = () => {
        if (!formData.name || !formData.contact) return alert("Name and Contact are required");

        const newEntry: VisitorLogEntry = {
            id: `vis-${Date.now()}`,
            name: formData.name,
            company: formData.company,
            contact: formData.contact,
            purpose: formData.purpose,
            checkInTime: new Date().toLocaleTimeString(),
            date: new Date().toISOString().split('T')[0],
            status: 'Checked In'
        };

        onCheckIn(newEntry);
        setShowModal(false);
        setFormData({ name: '', company: '', contact: '', purpose: '' });
    };

    const handleCheckOut = (id: string) => {
        onCheckOut(id, new Date().toLocaleTimeString());
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Visitors Log</h3>
                    <p className="text-gray-500 text-sm">Track all non-staff entries for biosecurity compliance.</p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
                >
                    <i className="fas fa-plus"></i> Check In Visitor
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Name & Company</th>
                            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Purpose</th>
                            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Time In</th>
                            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center">
                                    <div className="text-gray-300 text-4xl mb-3"><i className="fas fa-clipboard-list"></i></div>
                                    <p className="text-gray-500 font-medium">No visitors logged today.</p>
                                </td>
                            </tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-5">
                                        <div className="font-bold text-gray-800">{log.name}</div>
                                        {log.company && <div className="text-xs text-blue-600 font-medium mt-0.5">{log.company}</div>}
                                    </td>
                                    <td className="p-5 text-sm text-gray-600">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{log.purpose}</span>
                                    </td>
                                    <td className="p-5 text-sm text-gray-600 font-mono">{log.contact}</td>
                                    <td className="p-5 text-sm">
                                        <div className="font-medium text-gray-800">{log.checkInTime}</div>
                                        <div className="text-xs text-gray-400">{log.date}</div>
                                    </td>
                                    <td className="p-5">
                                        {log.status === 'Checked In' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                On Site
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                Checked Out ({log.checkOutTime})
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-5 text-right">
                                        {log.status === 'Checked In' && (
                                            <button
                                                onClick={() => handleCheckOut(log.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
                                            >
                                                Check Out
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xl font-bold text-gray-800">Visitor Check-In</h4>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                                    value={formData.company}
                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                                    value={formData.purpose}
                                    onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                >
                                    <option value="">Select Purpose...</option>
                                    <option value="Delivery">Delivery / Pickup</option>
                                    <option value="Maintenance">Maintenance / Repair</option>
                                    <option value="Vet">Veterinary Check</option>
                                    <option value="Inspection">Inspection / Audit</option>
                                    <option value="Meeting">Business Meeting</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="+263..."
                                    value={formData.contact}
                                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCheckIn}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
                            >
                                Confirm Check-In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitorsLog;


