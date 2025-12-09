import React, { useState } from 'react';
import { Task } from '../types';

interface JobCardExecutionProps {
    task: Task;
    onComplete: (completedTask: Task) => void;
    onCancel: () => void;
}

const JobCardExecution: React.FC<JobCardExecutionProps> = ({ task, onComplete, onCancel }) => {
    // Initialize checklist state. If task doesn't have one, create a default one or use existing
    const [checklist, setChecklist] = useState<{ id: string, text: string, completed: boolean }[]>(
        task.checklist || [
            { id: '1', text: 'Visual Inspection', completed: false },
            { id: '2', text: 'Confirm Safety Protocols', completed: false }
        ]
    );

    const [scannedTime, setScannedTime] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const toggleItem = (id: string) => {
        setChecklist(checklist.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const handleMockScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setScannedTime(new Date().toLocaleTimeString());
        }, 1500);
    };

    const allChecked = checklist.every(i => i.completed);
    const verificationPaszed = task.verificationMethod === 'None' || task.verificationMethod === undefined || scannedTime !== null;
    const canComplete = allChecked && verificationPaszed;

    const finalizeTask = () => {
        if (!canComplete) return;
        const updatedTask = {
            ...task,
            status: 'Completed' as const,
            checklist: checklist // Save the state of checklist
        };
        onComplete(updatedTask);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gray-900 text-white p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <h2 className="text-2xl font-bold relative z-10">{task.title}</h2>
                    <p className="text-blue-200 text-sm relative z-10">{task.type} • Due: {task.dueDate}</p>
                    <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-8">

                    {/* Checklist Section */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <i className="fas fa-list-ul text-blue-600"></i> Job Card Checklist
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-2 space-y-1">
                            {checklist.map(item => (
                                <label key={item.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-300 transition cursor-pointer shadow-sm">
                                    <input
                                        type="checkbox"
                                        checked={item.completed}
                                        onChange={() => toggleItem(item.id)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className={`flex-1 font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                        {item.text}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Verification Section */}
                    {task.verificationMethod === 'QR_Scan' && (
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <i className="fas fa-qrcode text-purple-600"></i> Location Verification
                            </h3>
                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 text-center">
                                {scannedTime ? (
                                    <div className="animate-in zoom-in">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
                                            <i className="fas fa-check"></i>
                                        </div>
                                        <p className="text-green-800 font-bold">Verified at {scannedTime}</p>
                                        <p className="text-xs text-green-600">Location ID: PIG-PEN-04</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-purple-800 mb-4 text-sm font-medium">Scan QR code at the location to prove presence.</p>
                                        <button
                                            onClick={handleMockScan}
                                            disabled={isScanning}
                                            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition flex items-center gap-2 mx-auto font-bold shadow-lg shadow-purple-200"
                                        >
                                            {isScanning ? (
                                                <><i className="fas fa-circle-notch fa-spin"></i> Scanning...</>
                                            ) : (
                                                <><i className="fas fa-camera"></i> Scan QR Code</>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                    <div className="text-xs text-gray-400 font-bold">
                        {checklist.filter(i => i.completed).length}/{checklist.length} Steps
                    </div>
                    <button
                        onClick={finalizeTask}
                        disabled={!canComplete}
                        className={`px-8 py-3 rounded-xl font-bold shadow-lg transition transform active:scale-95 ${canComplete
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Mark Complete
                    </button>
                </div>

            </div>
        </div>
    );
};

export default JobCardExecution;
