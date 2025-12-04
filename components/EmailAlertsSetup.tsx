
import React, { useState } from 'react';
import { NotificationConfig } from '../types';
import { sendAlertEmail } from '../services/emailService';

interface EmailAlertsSetupProps {
    config: NotificationConfig;
    onSave: (config: NotificationConfig) => void;
    onCancel: () => void;
}

const EmailAlertsSetup: React.FC<EmailAlertsSetupProps> = ({ config, onSave, onCancel }) => {
    const [emails, setEmails] = useState<string[]>(config.emails || []);
    const [newEmail, setNewEmail] = useState('');
    const [alerts, setAlerts] = useState(config.alerts || {
        mortality: true,
        feed: true,
        tasks: false,
        finance: false
    });
    const [showPreview, setShowPreview] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleAddEmail = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEmail && !emails.includes(newEmail) && newEmail.includes('@')) {
            setEmails([...emails, newEmail]);
            setNewEmail('');
        }
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        setEmails(emails.filter(e => e !== emailToRemove));
    };

    const handleToggleAlert = (key: keyof typeof alerts) => {
        setAlerts(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        onSave({ emails, alerts });
    };

    const handleSendTest = () => {
        if (emails.length === 0) {
            alert("Please add at least one email recipient.");
            return;
        }
        setIsSending(true);

        // Use real service
        sendAlertEmail(
            emails,
            "Test Alert",
            "This is a test alert from your Ecommatt Farm Manager configuration."
        ).then((success) => {
            setIsSending(false);
            if (success) {
                alert(`Test email sent successfully to ${emails.length} recipients!`);
            } else {
                alert("Failed to send test email. Check console for details.");
            }
        });
    };

    return (
        <div className="animate-in slide-in-from-right duration-300 bg-grayBg min-h-full pb-20">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onCancel}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50"
                >
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900">Email & Alerts</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Left Column: Configuration */}
                <div className="space-y-6">

                    {/* Email List */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xs font-bold text-gray-900 uppercase mb-4 tracking-wider flex items-center gap-2">
                            <i className="fas fa-envelope text-blue-500"></i> Alert Recipients
                        </h3>

                        <form onSubmit={handleAddEmail} className="flex gap-2 mb-4">
                            <input
                                type="email"
                                placeholder="Enter email address"
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-ecomattGreen outline-none"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-gray-800">
                                Add
                            </button>
                        </form>

                        <div className="space-y-2">
                            {emails.length === 0 && <p className="text-xs text-gray-400 italic">No emails added yet.</p>}
                            {emails.map(email => (
                                <div key={email} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                    <span className="text-sm text-gray-700 font-medium">{email}</span>
                                    <button onClick={() => handleRemoveEmail(email)} className="text-gray-400 hover:text-red-500">
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Triggers */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xs font-bold text-gray-900 uppercase mb-4 tracking-wider flex items-center gap-2">
                            <i className="fas fa-bell text-ecomattYellow"></i> Trigger Events
                        </h3>

                        <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500"><i className="fas fa-skull"></i></div>
                                    <div>
                                        <span className="block text-sm font-bold text-gray-900">Mortality Spike</span>
                                        <span className="block text-[10px] text-gray-500">Alert when deaths exceed 2%</span>
                                    </div>
                                </div>
                                <input type="checkbox" checked={alerts.mortality} onChange={() => handleToggleAlert('mortality')} className="w-5 h-5 accent-ecomattGreen" />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600"><i className="fas fa-cubes"></i></div>
                                    <div>
                                        <span className="block text-sm font-bold text-gray-900">Low Feed Stock</span>
                                        <span className="block text-[10px] text-gray-500">Alert when inventory drops below reorder</span>
                                    </div>
                                </div>
                                <input type="checkbox" checked={alerts.feed} onChange={() => handleToggleAlert('feed')} className="w-5 h-5 accent-ecomattGreen" />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><i className="fas fa-tasks"></i></div>
                                    <div>
                                        <span className="block text-sm font-bold text-gray-900">Urgent Tasks</span>
                                        <span className="block text-[10px] text-gray-500">Daily summary of high priority tasks</span>
                                    </div>
                                </div>
                                <input type="checkbox" checked={alerts.tasks} onChange={() => handleToggleAlert('tasks')} className="w-5 h-5 accent-ecomattGreen" />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500"><i className="fas fa-wallet"></i></div>
                                    <div>
                                        <span className="block text-sm font-bold text-gray-900">Financial Report</span>
                                        <span className="block text-[10px] text-gray-500">Weekly P&L summary PDF</span>
                                    </div>
                                </div>
                                <input type="checkbox" checked={alerts.finance} onChange={() => handleToggleAlert('finance')} className="w-5 h-5 accent-ecomattGreen" />
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleSendTest}
                            disabled={isSending}
                            className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                        >
                            {isSending ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                            Send Test
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-ecomattGreen text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-600 transition"
                        >
                            Save Configuration
                        </button>
                    </div>

                </div>

                {/* Right Column: Preview */}
                <div className="bg-gray-200 p-6 rounded-3xl flex flex-col items-center justify-center">

                    <div className="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-[1.02]">
                        <div className="bg-gray-900 p-4 border-b border-gray-800 flex items-center gap-3">
                            <div className="w-8 h-8 bg-ecomattGreen rounded-full flex items-center justify-center text-white font-bold text-xs">E</div>
                            <div>
                                <p className="text-white text-xs font-bold">Ecomatt Farm Alerts</p>
                                <p className="text-gray-400 text-[9px]">alerts@ecomatt.co.zw</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Morning Farm Report</h4>
                            <p className="text-xs text-gray-500 mb-4">Here is the summary for {new Date().toLocaleDateString()}.</p>

                            {alerts.mortality && (
                                <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500 mb-2">
                                    <p className="text-xs text-red-800 font-bold">CRITICAL: Mortality Alert</p>
                                    <p className="text-[10px] text-red-600">Pen 3B reported 2 losses. Rate: 2.1%</p>
                                </div>
                            )}

                            {alerts.feed && (
                                <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500 mb-2">
                                    <p className="text-xs text-yellow-800 font-bold">WARNING: Low Feed</p>
                                    <p className="text-[10px] text-yellow-600">Grower Pellets below 200kg.</p>
                                </div>
                            )}

                            {(!alerts.mortality && !alerts.feed && !alerts.tasks) && (
                                <div className="text-center py-4 border border-dashed border-gray-200 rounded-lg">
                                    <p className="text-xs text-gray-400">No alerts configured.</p>
                                </div>
                            )}

                            <button className="w-full bg-ecomattGreen text-white text-xs font-bold py-2 rounded mt-4">
                                Open Dashboard
                            </button>
                        </div>
                        <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                            <p className="text-[9px] text-gray-400">© 2025 Ecomatt Farm Manager</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-xs font-bold mt-4 uppercase tracking-wider">Live Email Preview</p>

                </div>
            </div>

        </div>
    );
};

export default EmailAlertsSetup;