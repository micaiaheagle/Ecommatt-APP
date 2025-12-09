import React, { useState } from 'react';
import { Protocol, TaskTemplate } from '../types';

interface AutomationManagerProps {
    protocols: Protocol[];
    onSaveProtocol: (protocol: Protocol) => void;
    onToggleProtocol: (id: string) => void;
    onDeleteProtocol: (id: string) => void;
}

const AutomationManager: React.FC<AutomationManagerProps> = ({ protocols, onSaveProtocol, onToggleProtocol, onDeleteProtocol }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<Partial<Protocol>>({
        name: '',
        triggerType: 'Event',
        triggerEvent: 'Sow_Farrowed',
        active: true,
        templates: []
    });

    const [newTemplate, setNewTemplate] = useState<Partial<TaskTemplate>>({
        title: '',
        daysAfterTrigger: 0,
        type: 'General',
        priority: 'Medium'
    });

    const handleAddTemplate = () => {
        if (!newTemplate.title) return alert("Task title required");
        const template: TaskTemplate = {
            id: `temp-${Date.now()}`,
            title: newTemplate.title!,
            type: newTemplate.type as any,
            priority: newTemplate.priority as any,
            daysAfterTrigger: newTemplate.daysAfterTrigger || 0,
            checklist: [],
            verificationMethod: 'None'
        };

        setFormData({
            ...formData,
            templates: [...(formData.templates || []), template]
        });
        setNewTemplate({ title: '', daysAfterTrigger: 0, type: 'General', priority: 'Medium' });
    };

    const handleSave = () => {
        if (!formData.name) return alert("Protocol Name required");
        if ((formData.templates?.length || 0) === 0) return alert("Add at least one task template");

        const newProtocol: Protocol = {
            id: formData.id || `prot-${Date.now()}`,
            name: formData.name!,
            triggerType: 'Event', // Hardcoded for now
            triggerEvent: formData.triggerEvent!,
            active: true,
            templates: formData.templates as TaskTemplate[]
        };

        onSaveProtocol(newProtocol);
        setIsCreating(false);
        setFormData({ name: '', triggerType: 'Event', triggerEvent: 'Sow_Farrowed', templates: [] });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <i className="fas fa-robot text-blue-600"></i>
                        Chitsano Autopilot
                    </h2>
                    <p className="text-gray-500 mt-1">Configure automated workflows and SOPs.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
                >
                    <i className="fas fa-plus"></i> New Protocol
                </button>
            </header>

            {isCreating ? (
                <div className="bg-white rounded-xl shadow-lg p-6 animate-in slide-in-from-right-4">
                    <h3 className="text-xl font-bold mb-6 border-b pb-4">Create New Protocol</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Protocol Name</label>
                            <input
                                className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Newborn Piglet Protocol"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Trigger Event</label>
                            <select
                                className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.triggerEvent}
                                onChange={e => setFormData({ ...formData, triggerEvent: e.target.value })}
                            >
                                <option value="Sow_Farrowed">Sow Farrowed</option>
                                <option value="Piglet_Weaned">Piglets Weaned</option>
                                <option value="New_Staff_Onboarded">New Staff Onboarded</option>
                                <option value="Machine_Breakdown">Machine Breakdown Logged</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 mb-8">
                        <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                            Add Task Templates
                        </h4>
                        <div className="flex flex-wrap gap-4 items-end">
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Task Title</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    placeholder="Task to create..."
                                    value={newTemplate.title}
                                    onChange={e => setNewTemplate({ ...newTemplate, title: e.target.value })}
                                />
                            </div>
                            <div className="w-32">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Due In (Days)</label>
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    value={newTemplate.daysAfterTrigger}
                                    onChange={e => setNewTemplate({ ...newTemplate, daysAfterTrigger: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="w-32">
                                <label className="text-xs font-bold text-gray-500 mb-1 block">Priority</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={newTemplate.priority}
                                    onChange={e => setNewTemplate({ ...newTemplate, priority: e.target.value as any })}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <button
                                onClick={handleAddTemplate}
                                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition"
                            >
                                Add Step
                            </button>
                        </div>

                        {/* List of templates */}
                        <div className="mt-4 space-y-2">
                            {formData.templates?.map((t, idx) => (
                                <div key={t.id} className="flex justify-between items-center bg-white p-3 rounded border shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-gray-400 font-bold">Step {idx + 1}</span>
                                        <span className="font-medium">{t.title}</span>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                            {t.daysAfterTrigger === 0 ? 'Same Day' : `+${t.daysAfterTrigger} days`}
                                        </span>
                                    </div>
                                    <button className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-6 py-3 rounded-lg text-gray-600 font-bold hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg"
                        >
                            Save Protocol
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {protocols.map(p => (
                        <div key={p.id} className={`bg-white p-6 rounded-xl border-l-4 shadow-sm transition hover:shadow-md ${p.active ? 'border-green-500' : 'border-gray-300 opacity-75'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800">{p.name}</h4>
                                    <p className="text-sm text-gray-500">Trigger: <span className="font-mono bg-gray-100 px-1 rounded">{p.triggerEvent}</span></p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onToggleProtocol(p.id)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition ${p.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                    >
                                        <i className={`fas ${p.active ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
                                    </button>
                                    <button
                                        onClick={() => onDeleteProtocol(p.id)}
                                        className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {p.templates.map((t, idx) => (
                                    <div key={t.id} className="flex items-center text-sm text-gray-600 gap-2">
                                        <i className="fas fa-arrow-right text-gray-300 text-xs"></i>
                                        <span className="font-medium text-gray-900">{t.title}</span>
                                        <span className="text-xs text-gray-400">
                                            ({t.daysAfterTrigger === 0 ? 'Same day' : `Day ${t.daysAfterTrigger}`})
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-3 border-t text-xs text-gray-400 flex justify-between">
                                <span>{p.templates.length} automated steps</span>
                                <span>{p.active ? 'Active' : 'Paused'}</span>
                            </div>
                        </div>
                    ))}
                    {protocols.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                            <i className="fas fa-magic text-4xl mb-3"></i>
                            <p>No automation protocols configured yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AutomationManager;
