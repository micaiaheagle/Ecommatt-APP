
import React, { useState, useEffect } from 'react';
import { Pig } from '../types';

interface EventReportingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (eventData: any) => void;
    pig: Pig;
}

const EventReportingModal: React.FC<EventReportingModalProps> = ({ isOpen, onClose, onSubmit, pig }) => {
    const [eventType, setEventType] = useState('Farrowing');
    const [step, setStep] = useState(1); // 1: Form, 2: Summary

    // Farrowing Form State
    const [farrowingData, setFarrowingData] = useState({
        actualTime: '',
        bornAlive: '',
        stillborn: '',
        avgWeight: '',
        interventions: [] as string[],
        checklist: {
            iodine: false,
            teethClipping: false,
            earNotching: false,
            vaccination: false
        },
        notes: ''
    });

    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setErrors([]);
            setFarrowingData({
                actualTime: new Date().toTimeString().slice(0, 5),
                bornAlive: '',
                stillborn: '0',
                avgWeight: '',
                interventions: [],
                checklist: {
                    iodine: false,
                    teethClipping: false,
                    earNotching: false,
                    vaccination: false
                },
                notes: ''
            });
        }
    }, [isOpen]);

    const handleInterventionChange = (intervention: string) => {
        if (farrowingData.interventions.includes(intervention)) {
            setFarrowingData({ ...farrowingData, interventions: farrowingData.interventions.filter(i => i !== intervention) });
        } else {
            setFarrowingData({ ...farrowingData, interventions: [...farrowingData.interventions, intervention] });
        }
    };

    const handleChecklistChange = (key: keyof typeof farrowingData.checklist) => {
        setFarrowingData({
            ...farrowingData,
            checklist: { ...farrowingData.checklist, [key]: !farrowingData.checklist[key] }
        });
    };

    const validateForm = () => {
        const newErrors = [];
        if (!farrowingData.actualTime) newErrors.push("Actual farrowing time is required.");
        if (farrowingData.bornAlive === '') newErrors.push("Number born alive is required.");
        if (farrowingData.stillborn === '') newErrors.push("Number stillborn is required.");

        // Checklist validation (example: at least iodine required)
        if (!farrowingData.checklist.iodine) newErrors.push("Umbilical iodine application is mandatory.");

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            setStep(2);
        }
    };

    const handleSubmit = () => {
        const totalPiglets = parseInt(farrowingData.bornAlive || '0') + parseInt(farrowingData.stillborn || '0');

        const summary = `Farrowing Report: ${totalPiglets} piglets (${farrowingData.bornAlive} alive, ${farrowingData.stillborn} stillborn).`;

        const eventPayload = {
            title: 'Farrowing Event',
            subtitle: summary,
            date: new Date().toISOString().split('T')[0],
            color: 'blue',
            status: 'Completed',
            icon: 'fa-baby-carriage',
            data: {
                type: 'Farrowing',
                ...farrowingData,
                totalPiglets
            }
        };

        onSubmit(eventPayload);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <i className="fas fa-clipboard-check text-ecomattGreen"></i> Smart Event Report
                        </h2>
                        <p className="text-gray-400 text-xs mt-1">Guided reporting for consistent data.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">

                    {step === 1 ? (
                        <div className="space-y-6">
                            {/* Event Type Selector (Fixed for now) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Event Type</label>
                                <select
                                    value={eventType}
                                    onChange={(e) => setEventType(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 outline-none focus:border-ecomattGreen"
                                >
                                    <option value="Farrowing">Farrowing / New Litter</option>
                                    {/* Add more types later */}
                                </select>
                            </div>

                            {/* Farrowing Form */}
                            {eventType === 'Farrowing' && (
                                <div className="space-y-4 animate-in slide-in-from-right duration-300">

                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm">
                                            <i className="fas fa-info"></i>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-blue-800">Sow: {pig.tagId}</p>
                                            <p className="text-[10px] text-blue-600">Expected: {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Actual Time <span className="text-red-500">*</span></label>
                                            <input
                                                type="time"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ecomattGreen font-bold"
                                                value={farrowingData.actualTime}
                                                onChange={e => setFarrowingData({ ...farrowingData, actualTime: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Avg Weight (kg)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ecomattGreen font-bold"
                                                placeholder="Optional"
                                                value={farrowingData.avgWeight}
                                                onChange={e => setFarrowingData({ ...farrowingData, avgWeight: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Born Alive <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                className="w-full p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl outline-none focus:border-ecomattGreen font-bold text-center text-xl"
                                                value={farrowingData.bornAlive}
                                                onChange={e => setFarrowingData({ ...farrowingData, bornAlive: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stillborn <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                className="w-full p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl outline-none focus:border-red-500 font-bold text-center text-xl"
                                                value={farrowingData.stillborn}
                                                onChange={e => setFarrowingData({ ...farrowingData, stillborn: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Interventions</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Fostering', 'Manual Assist', 'Oxytocin', 'Resuscitation'].map(opt => (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleInterventionChange(opt)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${farrowingData.interventions.includes(opt)
                                                            ? 'bg-purple-100 border-purple-300 text-purple-800'
                                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Post-Birth Checklist <span className="text-red-500">*</span></label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-ecomattGreen rounded focus:ring-ecomattGreen"
                                                    checked={farrowingData.checklist.iodine}
                                                    onChange={() => handleChecklistChange('iodine')}
                                                />
                                                <span className="text-sm text-gray-700">Umbilical Iodine Applied</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-ecomattGreen rounded focus:ring-ecomattGreen"
                                                    checked={farrowingData.checklist.teethClipping}
                                                    onChange={() => handleChecklistChange('teethClipping')}
                                                />
                                                <span className="text-sm text-gray-700">Teeth Clipping</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-ecomattGreen rounded focus:ring-ecomattGreen"
                                                    checked={farrowingData.checklist.earNotching}
                                                    onChange={() => handleChecklistChange('earNotching')}
                                                />
                                                <span className="text-sm text-gray-700">Ear Notching Scheduled</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-ecomattGreen rounded focus:ring-ecomattGreen"
                                                    checked={farrowingData.checklist.vaccination}
                                                    onChange={() => handleChecklistChange('vaccination')}
                                                />
                                                <span className="text-sm text-gray-700">Vaccination Added to Calendar</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notes</label>
                                        <textarea
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ecomattGreen text-sm"
                                            rows={2}
                                            placeholder="Any additional observations..."
                                            value={farrowingData.notes}
                                            onChange={e => setFarrowingData({ ...farrowingData, notes: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {errors.length > 0 && (
                                <div className="bg-red-50 border border-red-200 p-3 rounded-xl animate-in shake">
                                    <div className="flex items-center gap-2 mb-1">
                                        <i className="fas fa-exclamation-circle text-red-500"></i>
                                        <span className="text-xs font-bold text-red-800">Please fix the following:</span>
                                    </div>
                                    <ul className="list-disc list-inside text-[10px] text-red-700 ml-1">
                                        {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                                    </ul>
                                </div>
                            )}

                        </div>
                    ) : (
                        // Step 2: Summary Preview
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-ecomattGreen text-2xl shadow-sm">
                                    <i className="fas fa-check"></i>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Ready to Submit?</h3>
                                <p className="text-sm text-gray-500">Review the generated report below.</p>
                            </div>

                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                                <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Event</p>
                                        <p className="font-bold text-gray-900">Farrowing Logged</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Date</p>
                                        <p className="font-bold text-gray-900">{new Date().toLocaleDateString()} at {farrowingData.actualTime}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                                        <p className="text-2xl font-bold text-green-600">{farrowingData.bornAlive}</p>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Born Alive</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                                        <p className="text-2xl font-bold text-red-500">{farrowingData.stillborn}</p>
                                        <p className="text-[10px] uppercase font-bold text-gray-400">Stillborn</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Interventions</p>
                                    <div className="flex flex-wrap gap-1">
                                        {farrowingData.interventions.length > 0 ? (
                                            farrowingData.interventions.map(i => (
                                                <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">{i}</span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">None</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Checklist Completed</p>
                                    <ul className="space-y-1">
                                        {Object.entries(farrowingData.checklist).map(([key, val]) => (
                                            <li key={key} className={`text-xs flex items-center gap-2 ${val ? 'text-green-700' : 'text-gray-400'}`}>
                                                <i className={`fas ${val ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex items-start gap-3">
                                <i className="fas fa-bell text-yellow-500 mt-1"></i>
                                <div>
                                    <p className="text-xs font-bold text-yellow-800">Auto-Scheduled Tasks</p>
                                    <ul className="text-[10px] text-yellow-700 list-disc list-inside mt-1">
                                        <li>Piglet weighing in 7 days</li>
                                        <li>Iron injection alert in 48 hrs</li>
                                        <li>Weaning countdown started</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    {step === 1 ? (
                        <>
                            <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition">
                                Cancel
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center gap-2"
                            >
                                Next Step <i className="fas fa-arrow-right"></i>
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition">
                                Back to Edit
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-ecomattGreen text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition flex items-center gap-2"
                            >
                                <i className="fas fa-check"></i> Submit Report
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default EventReportingModal;
