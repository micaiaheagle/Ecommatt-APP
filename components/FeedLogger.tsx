
import React, { useState } from 'react';
import { FeedInventory } from '../types';

interface FeedLoggerProps {
  feeds: FeedInventory[];
  onSave: (data: { feedId: string; quantity: number; pen: string; batch?: string }) => void;
  onCancel: () => void;
}

const FeedLogger: React.FC<FeedLoggerProps> = ({ feeds, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    penLocation: 'Weaner Pen 1',
    feedId: feeds.length > 0 ? feeds[0].id : '',
    quantity: '',
    batch: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.feedId || !formData.quantity) return;
    
    onSave({
        feedId: formData.feedId,
        quantity: parseFloat(formData.quantity),
        pen: formData.penLocation,
        batch: formData.batch
    });
  };

  const selectedFeed = feeds.find(f => f.id === formData.feedId);

  return (
    <div className="animate-in slide-in-from-bottom duration-300 bg-grayBg min-h-full pb-20">
        <div className="flex items-center gap-3 mb-6">
            <button 
                onClick={onCancel}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50"
            >
                <i className="fas fa-arrow-left"></i>
            </button>
            <h2 className="text-xl font-bold text-gray-900">Daily Feed Log</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                
                <div>
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">Pen / Location</label>
                    <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm text-gray-700 focus:border-ecomattGreen outline-none"
                        value={formData.penLocation}
                        onChange={(e) => setFormData({...formData, penLocation: e.target.value})}
                    >
                        <option>Weaner Pen 1</option>
                        <option>Weaner Pen 2</option>
                        <option>Grower Unit A</option>
                        <option>Grower Unit B</option>
                        <option>Farrowing House</option>
                        <option>Sow Stalls</option>
                    </select>
                </div>

                <div>
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">Feed Type</label>
                    <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm text-gray-700 focus:border-ecomattGreen outline-none"
                        value={formData.feedId}
                        onChange={(e) => setFormData({...formData, feedId: e.target.value})}
                    >
                        {feeds.map(feed => (
                            <option key={feed.id} value={feed.id}>{feed.name} ({feed.type})</option>
                        ))}
                    </select>
                    {selectedFeed && (
                        <p className="text-[10px] text-gray-400 mt-1 text-right">
                            Available: <span className={selectedFeed.quantityKg < selectedFeed.reorderLevel ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{selectedFeed.quantityKg} kg</span>
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase ml-1">Quantity (Kg)</label>
                        <input 
                            type="number" 
                            step="0.1"
                            placeholder="0.0"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-lg font-bold focus:border-ecomattGreen outline-none"
                            value={formData.quantity}
                            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold uppercase ml-1">Batch ID</label>
                        <input 
                            type="text" 
                            placeholder="Optional"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mt-1 text-sm focus:border-ecomattGreen outline-none"
                            value={formData.batch}
                            onChange={(e) => setFormData({...formData, batch: e.target.value})}
                        />
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] text-blue-500 font-bold uppercase">Avg Consumption</p>
                        <p className="text-xs text-blue-700">Based on pen population</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xl font-bold text-blue-800">~2.0</span>
                        <span className="text-xs text-blue-600 ml-1">kg/pig</span>
                    </div>
                </div>

            </div>

            <button className="w-full bg-ecomattGreen text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                <i className="fas fa-check"></i> Confirm Log
            </button>
        </form>
    </div>
  );
};

export default FeedLogger;
