
import React, { useState } from 'react';
import { VisitorRecord } from '../types';

interface VisitorLogProps {
  visitors: VisitorRecord[];
  onCheckIn: (visitor: VisitorRecord) => void;
  onCheckOut: (id: string) => void;
  onCancel: () => void;
}

const VisitorLog: React.FC<VisitorLogProps> = ({ visitors, onCheckIn, onCheckOut, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    purpose: 'Maintenance',
    vehicleReg: '',
    hasDisinfected: false
  });

  const activeVisitors = visitors.filter(v => !v.checkOut);
  const historyVisitors = visitors.filter(v => v.checkOut).sort((a,b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newVisitor: VisitorRecord = {
        id: `v-${Date.now()}`,
        name: formData.name,
        company: formData.company,
        purpose: formData.purpose,
        vehicleReg: formData.vehicleReg,
        hasDisinfected: formData.hasDisinfected,
        checkIn: new Date().toISOString()
    };
    onCheckIn(newVisitor);
    setFormData({ name: '', company: '', purpose: 'Maintenance', vehicleReg: '', hasDisinfected: false });
  };

  const formatDate = (isoString: string) => {
      return new Date(isoString).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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
        <h2 className="text-xl font-bold text-gray-900">Biosecurity Log</h2>
      </div>

      {/* Check-in Form */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h3 className="text-xs font-bold text-gray-900 uppercase mb-4 tracking-wider flex items-center gap-2">
              <i className="fas fa-user-plus text-ecomattGreen"></i> Visitor Check-In
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Full Name" required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-ecomattGreen outline-none"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Company / Org"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-ecomattGreen outline-none"
                    value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-ecomattGreen outline-none"
                    value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}
                  >
                      <option>Maintenance</option>
                      <option>Vet Visit</option>
                      <option>Delivery</option>
                      <option>Buyer</option>
                      <option>Inspection</option>
                  </select>
                  <input 
                    type="text" placeholder="Vehicle Reg (Optional)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-ecomattGreen outline-none"
                    value={formData.vehicleReg} onChange={e => setFormData({...formData, vehicleReg: e.target.value})}
                  />
              </div>
              
              <label className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-ecomattGreen"
                    checked={formData.hasDisinfected}
                    onChange={e => setFormData({...formData, hasDisinfected: e.target.checked})}
                  />
                  <div>
                      <span className="block text-sm font-bold text-gray-800">Biosecurity Declaration</span>
                      <span className="block text-[10px] text-gray-500">I confirm footwear disinfection & 48h pig-free period.</span>
                  </div>
              </label>

              <button disabled={!formData.hasDisinfected} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition">
                  Check In Visitor
              </button>
          </form>
      </div>

      {/* Active Visitors */}
      {activeVisitors.length > 0 && (
          <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">On Farm Now</h3>
              <div className="space-y-3">
                  {activeVisitors.map(v => (
                      <div key={v.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 flex justify-between items-center">
                          <div>
                              <h4 className="font-bold text-gray-900">{v.name}</h4>
                              <p className="text-xs text-gray-500">{v.company} • {v.purpose}</p>
                              <p className="text-[10px] text-green-600 mt-1"><i className="fas fa-clock"></i> In: {formatDate(v.checkIn)}</p>
                          </div>
                          <button 
                            onClick={() => onCheckOut(v.id)}
                            className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100"
                          >
                              Check Out
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* History */}
      <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Visit History</h3>
          <div className="space-y-2">
              {historyVisitors.map(v => (
                  <div key={v.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center opacity-75">
                      <div>
                          <p className="text-sm font-bold text-gray-700">{v.name} <span className="text-[10px] font-normal text-gray-400">({v.company})</span></p>
                          <p className="text-[10px] text-gray-400">{formatDate(v.checkIn)} - {v.checkOut ? new Date(v.checkOut).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '?'}</p>
                      </div>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">{v.purpose}</span>
                  </div>
              ))}
              {historyVisitors.length === 0 && <p className="text-center text-gray-400 text-xs py-4">No history yet.</p>}
          </div>
      </div>

    </div>
  );
};

export default VisitorLog;
