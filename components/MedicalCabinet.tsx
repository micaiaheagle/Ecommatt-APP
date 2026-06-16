
import React, { useState } from 'react';
import { Medication } from '../types';

interface MedicalCabinetProps {
  medications: Medication[];
  onAddStock: (med: Medication) => void;
  onCancel: () => void;
}

const MedicalCabinet: React.FC<MedicalCabinetProps> = ({ medications, onAddStock, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'Inventory' | 'Calculator'>('Inventory');
  
  // Calculator State
  const [calcWeight, setCalcWeight] = useState(50);
  const [selectedMedId, setSelectedMedId] = useState('');
  
  // Add Stock State
  const [isAdding, setIsAdding] = useState(false);
  const [newMed, setNewMed] = useState<Partial<Medication>>({
      name: '',
      type: 'Antibiotic',
      quantity: 0,
      unit: 'ml',
      expiryDate: '',
      withdrawalDays: 0,
      dosageRate: '1ml / 33kg'
  });

  const handleSaveMed = (e: React.FormEvent) => {
      e.preventDefault();
      if(newMed.name && newMed.quantity) {
          onAddStock({
              id: `med-${Date.now()}`,
              name: newMed.name!,
              type: newMed.type as any,
              unit: newMed.unit as any,
              quantity: Number(newMed.quantity),
              expiryDate: newMed.expiryDate!,
              withdrawalDays: Number(newMed.withdrawalDays),
              dosageRate: newMed.dosageRate
          });
          setIsAdding(false);
          setNewMed({ name: '', type: 'Antibiotic', quantity: 0, unit: 'ml', expiryDate: '', withdrawalDays: 0, dosageRate: '' });
      }
  };

  const getDosageResult = () => {
      if(!selectedMedId) return 0;
      const med = medications.find(m => m.id === selectedMedId);
      if(!med || !med.dosageRate) return 0;
      
      // Basic parser for "Xml / Ykg"
      // Example: "1ml / 33kg"
      try {
          const parts = med.dosageRate.toLowerCase().split('/');
          const dosePart = parseFloat(parts[0]); // 1
          const weightPart = parseFloat(parts[1].replace('kg', '')); // 33
          
          if(isNaN(dosePart) || isNaN(weightPart)) return 0;
          
          return ((calcWeight / weightPart) * dosePart).toFixed(1);
      } catch (e) {
          return 0;
      }
  };

  const selectedMedForCalc = medications.find(m => m.id === selectedMedId);

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
        <h2 className="text-xl font-bold text-gray-900">Medical Cabinet</h2>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl mb-6 shadow-sm border border-gray-100">
        <button 
            onClick={() => setActiveTab('Inventory')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Inventory' ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' : 'text-gray-500'}`}
        >
            Inventory
        </button>
        <button 
            onClick={() => setActiveTab('Calculator')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'Calculator' ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' : 'text-gray-500'}`}
        >
            Dosage Calc
        </button>
      </div>

      {activeTab === 'Inventory' && (
          <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Levels</h3>
                <button onClick={() => setIsAdding(!isAdding)} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg font-bold">
                    {isAdding ? 'Cancel' : '+ Add Meds'}
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 animate-in slide-in-from-top">
                    <form onSubmit={handleSaveMed} className="space-y-3">
                        <input type="text" placeholder="Name (e.g. Oxytetracycline)" className="w-full border p-2 rounded text-xs" required value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} />
                        <div className="grid grid-cols-2 gap-2">
                            <select className="border p-2 rounded text-xs" value={newMed.type} onChange={e => setNewMed({...newMed, type: e.target.value as any})}>
                                <option>Antibiotic</option><option>Vaccine</option><option>Supplement</option><option>Dewormer</option>
                            </select>
                            <input type="date" className="border p-2 rounded text-xs" required value={newMed.expiryDate} onChange={e => setNewMed({...newMed, expiryDate: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <input type="number" placeholder="Qty" className="border p-2 rounded text-xs" required value={newMed.quantity || ''} onChange={e => setNewMed({...newMed, quantity: parseFloat(e.target.value)})} />
                            <select className="border p-2 rounded text-xs" value={newMed.unit} onChange={e => setNewMed({...newMed, unit: e.target.value as any})}>
                                <option>ml</option><option>doses</option><option>pills</option>
                            </select>
                        </div>
                        <input type="text" placeholder="Dosage Rate (e.g. 1ml/10kg)" className="w-full border p-2 rounded text-xs" value={newMed.dosageRate} onChange={e => setNewMed({...newMed, dosageRate: e.target.value})} />
                        <button className="w-full bg-ecomattGreen text-white font-bold py-2 rounded text-xs">Save to Cabinet</button>
                    </form>
                </div>
            )}

            <div className="space-y-3">
                {medications.map(med => {
                    const isExpired = new Date(med.expiryDate) < new Date();
                    return (
                        <div key={med.id} className={`bg-white p-3 rounded-xl border flex items-center justify-between ${isExpired ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${med.type === 'Vaccine' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                    <i className="fas fa-prescription-bottle"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{med.name}</h4>
                                    <p className="text-[10px] text-gray-500">Exp: {med.expiryDate} {isExpired && <span className="text-red-600 font-bold">(EXPIRED)</span>}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">{med.quantity}<span className="text-xs text-gray-400 ml-1">{med.unit}</span></p>
                                <p className="text-[9px] text-gray-400">{med.withdrawalDays}d Withdrawal</p>
                            </div>
                        </div>
                    );
                })}
            </div>
          </>
      )}

      {activeTab === 'Calculator' && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Dosage Assistant</h3>
              
              <div className="mb-4">
                  <label className="text-xs text-gray-500 font-bold block mb-1">Select Medication</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none"
                    value={selectedMedId}
                    onChange={(e) => setSelectedMedId(e.target.value)}
                  >
                      <option value="">-- Choose Drug --</option>
                      {medications.filter(m => m.dosageRate).map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.dosageRate})</option>
                      ))}
                  </select>
              </div>

              <div className="mb-6">
                  <div className="flex justify-between mb-1">
                      <label className="text-xs text-gray-500 font-bold">Pig Weight</label>
                      <span className="text-xs font-bold text-gray-900">{calcWeight} kg</span>
                  </div>
                  <input 
                    type="range" min="1" max="300" 
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(parseInt(e.target.value))}
                  />
              </div>

              <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                  <p className="text-xs text-blue-500 font-bold uppercase mb-1">Administer Amount</p>
                  <h1 className="text-4xl font-bold text-blue-700">{getDosageResult()} <span className="text-base font-normal text-blue-500">{selectedMedForCalc?.unit || 'ml'}</span></h1>
                  {selectedMedForCalc?.withdrawalDays && (
                      <div className="mt-2 pt-2 border-t border-blue-200">
                          <p className="text-[10px] text-red-500 font-bold">
                              <i className="fas fa-exclamation-triangle mr-1"></i>
                              Withdrawal Period: {selectedMedForCalc.withdrawalDays} Days
                          </p>
                      </div>
                  )}
              </div>
          </div>
      )}

    </div>
  );
};

export default MedicalCabinet;