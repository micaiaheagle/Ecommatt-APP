
import React, { useState } from 'react';
import { Pig, PigStage, PigStatus } from '../types';

interface PigFormProps {
  onSave: (pig: Pig) => void;
  onCancel: () => void;
  initialData?: Pig;
}

const PigForm: React.FC<PigFormProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<Pig>>(initialData || {
    tagId: '',
    breed: 'Large White',
    gender: 'Female',
    dob: '',
    stage: PigStage.Piglet,
    status: PigStatus.Active,
    penLocation: '',
    weight: 0,
    sireId: '',
    damId: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tagId || !formData.dob) return;

    const pigData: Pig = {
        id: initialData?.id || Date.now().toString(), // Preserve ID if editing
        tagId: formData.tagId || '',
        breed: formData.breed || 'Large White',
        gender: (formData.gender as 'Male' | 'Female') || 'Female',
        dob: formData.dob || '',
        stage: (formData.stage as PigStage) || PigStage.Piglet,
        status: (formData.status as PigStatus) || PigStatus.Active,
        penLocation: formData.penLocation || 'Unassigned',
        weight: Number(formData.weight) || 0,
        sireId: formData.sireId || '',
        damId: formData.damId || '',
        notes: formData.notes || '',
        lastFed: initialData?.lastFed || undefined, // Preserve lastFed if it exists
        // Preserve existing timeline if editing, else create new
        timeline: initialData?.timeline || [
            {
                date: new Date().toISOString().split('T')[0],
                title: 'Record Created',
                subtitle: 'Added to system',
                color: 'green',
                icon: 'fa-plus'
            }
        ],
        imageUrl: initialData?.imageUrl
    };
    onSave(pigData);
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-300 bg-grayBg min-h-full pb-20">
        <div className="flex items-center gap-3 mb-6">
            <button 
                onClick={onCancel}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50"
            >
                <i className="fas fa-arrow-left"></i>
            </button>
            <h2 className="text-xl font-bold text-gray-900">{initialData ? 'Edit Animal' : 'New Animal'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                
                <div>
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">Pig ID / Tag</label>
                    <input 
                        type="text" 
                        placeholder="e.g. EF-2025"
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                        value={formData.tagId}
                        onChange={(e) => setFormData({...formData, tagId: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase ml-1">Gender</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm text-gray-600 focus:border-ecomattGreen outline-none"
                            value={formData.gender}
                            onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                        >
                            <option value="Female">Sow/Gilt</option>
                            <option value="Male">Boar/Barrow</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase ml-1">Breed</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm text-gray-600 focus:border-ecomattGreen outline-none"
                            value={formData.breed}
                            onChange={(e) => setFormData({...formData, breed: e.target.value})}
                        >
                            <option value="Large White">Large White</option>
                            <option value="Landrace">Landrace</option>
                            <option value="Duroc">Duroc</option>
                            <option value="Cross">Cross</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">Date of Birth</label>
                    <input 
                        type="date" 
                        required
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm text-gray-600 focus:border-ecomattGreen outline-none"
                        value={formData.dob}
                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs text-gray-500 font-bold uppercase ml-1">Stage</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm text-gray-600 focus:border-ecomattGreen outline-none"
                            value={formData.stage}
                            onChange={(e) => setFormData({...formData, stage: e.target.value as any})}
                        >
                            <option value={PigStage.Piglet}>Piglet</option>
                            <option value={PigStage.Weaner}>Weaner</option>
                            <option value={PigStage.Grower}>Grower</option>
                            <option value={PigStage.Finisher}>Finisher</option>
                            <option value={PigStage.Sow}>Sow</option>
                            <option value={PigStage.Boar}>Boar</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase ml-1">Status</label>
                        <select 
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm text-gray-600 focus:border-ecomattGreen outline-none"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        >
                            <option value={PigStatus.Active}>Active</option>
                            <option value={PigStatus.Sick}>Sick</option>
                            <option value={PigStatus.Quarantine}>Quarantine</option>
                            <option value={PigStatus.Sold}>Sold</option>
                            <option value={PigStatus.Deceased}>Deceased</option>
                        </select>
                    </div>
                </div>

                 <div>
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">Pen Location</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Pen 3B"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                        value={formData.penLocation}
                        onChange={(e) => setFormData({...formData, penLocation: e.target.value})}
                    />
                </div>

                 <div>
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">Weight (kg)</label>
                    <input 
                        type="number" 
                        placeholder="0.0"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase ml-1">Sire ID (Father)</label>
                        <input 
                            type="text" 
                            placeholder="Optional"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                            value={formData.sireId}
                            onChange={(e) => setFormData({...formData, sireId: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase ml-1">Dam ID (Mother)</label>
                        <input 
                            type="text" 
                            placeholder="Optional"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                            value={formData.damId}
                            onChange={(e) => setFormData({...formData, damId: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">Notes</label>
                    <textarea 
                        placeholder="Health history, behavioral notes, etc."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                        rows={3}
                        value={formData.notes || ''}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                </div>

            </div>

            <button className="w-full bg-ecomattGreen text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-600 transition-colors">
                {initialData ? 'Update Record' : 'Save Record'}
            </button>
        </form>
    </div>
  );
};

export default PigForm;
