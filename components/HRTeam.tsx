import React, { useState } from 'react';

const HRTeam: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Directory' | 'Shifts' | 'Payroll' | 'Performance'>('Directory');

    const staffList = [
        { id: 'EMP-001', name: 'John Doe', role: 'Farm Manager', department: 'Management', joined: '2022-03-15', status: 'Active' },
        { id: 'EMP-002', name: 'Mike Smith', role: 'Lead Herdsman', department: 'Livestock', joined: '2023-01-10', status: 'Active' },
        { id: 'EMP-003', name: 'Sarah Vet', role: 'Veterinarian', department: 'Health', joined: '2024-06-01', status: 'Active' },
        { id: 'EMP-004', name: 'David Moyo', role: 'General Worker', department: 'Operations', joined: '2025-02-20', status: 'On Leave' },
        { id: 'EMP-005', name: 'Grace Banda', role: 'Farm Hand', department: 'Operations', joined: '2025-08-11', status: 'Active' },
    ];

    const shifts = [
        { id: 'SH-101', employee: 'Mike Smith', date: '2026-06-24', shift: 'Morning (06:00 - 14:00)', task: 'Feeding & Cleaning', status: 'Completed' },
        { id: 'SH-102', employee: 'Grace Banda', date: '2026-06-24', shift: 'Afternoon (14:00 - 22:00)', task: 'Maternity Ward Watch', status: 'In Progress' },
        { id: 'SH-103', employee: 'Sarah Vet', date: '2026-06-24', shift: 'On Call (24h)', task: 'Routine Health Checks', status: 'Scheduled' },
    ];

    const payroll = [
        { id: 'PR-2026-05-001', employee: 'John Doe', period: 'May 2026', base: '$1,500', overtime: '$0', total: '$1,500', status: 'Paid' },
        { id: 'PR-2026-05-002', employee: 'Mike Smith', period: 'May 2026', base: '$800', overtime: '$120', total: '$920', status: 'Paid' },
        { id: 'PR-2026-05-003', employee: 'Sarah Vet', period: 'May 2026', base: '$1,200', overtime: '$0', total: '$1,200', status: 'Paid' },
        { id: 'PR-2026-05-004', employee: 'David Moyo', period: 'May 2026', base: '$450', overtime: '$50', total: '$500', status: 'Paid' },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">HR & Team</h2>
                    <p className="text-sm text-gray-500">Manage staff, payroll, and schedules</p>
                </div>
                <button className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2">
                    <i className="fas fa-user-plus"></i> Add Employee
                </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
                {(['Directory', 'Shifts', 'Payroll', 'Performance'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        {tab === 'Directory' && <><i className="fas fa-address-book mr-2"></i> Directory</>}
                        {tab === 'Shifts' && <><i className="fas fa-calendar-alt mr-2"></i> Shifts & Attendance</>}
                        {tab === 'Payroll' && <><i className="fas fa-money-check-alt mr-2"></i> Payroll</>}
                        {tab === 'Performance' && <><i className="fas fa-star mr-2"></i> Performance</>}
                    </button>
                ))}
            </div>

            {/* Content area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === 'Directory' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-4 font-bold">ID</th>
                                    <th className="p-4 font-bold">Name</th>
                                    <th className="p-4 font-bold">Role</th>
                                    <th className="p-4 font-bold">Department</th>
                                    <th className="p-4 font-bold">Joined</th>
                                    <th className="p-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {staffList.map(emp => (
                                    <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-mono text-gray-500">{emp.id}</td>
                                        <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                                                {emp.name.charAt(0)}
                                            </div>
                                            {emp.name}
                                        </td>
                                        <td className="p-4 text-gray-600">{emp.role}</td>
                                        <td className="p-4 text-gray-600">{emp.department}</td>
                                        <td className="p-4 text-gray-600">{emp.joined}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${emp.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Shifts' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-4 font-bold">Date</th>
                                    <th className="p-4 font-bold">Employee</th>
                                    <th className="p-4 font-bold">Shift</th>
                                    <th className="p-4 font-bold">Primary Task</th>
                                    <th className="p-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {shifts.map(shift => (
                                    <tr key={shift.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 text-gray-600">{shift.date}</td>
                                        <td className="p-4 font-bold text-gray-900">{shift.employee}</td>
                                        <td className="p-4 text-gray-600">{shift.shift}</td>
                                        <td className="p-4 text-gray-600">{shift.task}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${shift.status === 'Completed' ? 'bg-green-50 text-green-700' : shift.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {shift.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Payroll' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-4 font-bold">Period</th>
                                    <th className="p-4 font-bold">Employee</th>
                                    <th className="p-4 font-bold text-right">Base</th>
                                    <th className="p-4 font-bold text-right">Overtime/Bonus</th>
                                    <th className="p-4 font-bold text-right">Total Net</th>
                                    <th className="p-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {payroll.map(pr => (
                                    <tr key={pr.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 text-gray-600">{pr.period}</td>
                                        <td className="p-4 font-bold text-gray-900">{pr.employee}</td>
                                        <td className="p-4 text-right font-mono text-gray-600">{pr.base}</td>
                                        <td className="p-4 text-right font-mono text-gray-600">{pr.overtime}</td>
                                        <td className="p-4 text-right font-mono font-bold text-gray-900">{pr.total}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${pr.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                                {pr.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Performance' && (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 text-2xl mb-4">
                            <i className="fas fa-chart-bar"></i>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">KPIs & Reviews</h3>
                        <p className="text-sm max-w-sm mx-auto mb-6">Staff task completion rates, mortality rates per pen assignment, and bi-annual performance reviews.</p>
                        <button className="text-purple-600 font-bold text-sm hover:underline">View Team Metrics</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HRTeam;
