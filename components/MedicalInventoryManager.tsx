
import React, { useState } from 'react';
import { MedicalItem } from '../types';
import { Trash2, Edit2, Plus, AlertTriangle, Syringe, Pill, Activity, Briefcase } from 'lucide-react';

interface MedicalInventoryManagerProps {
    items: MedicalItem[];
    onSave: (item: MedicalItem) => void;
    onDelete: (id: string) => void;
    onCancel: () => void;
}

const MedicalInventoryManager: React.FC<MedicalInventoryManagerProps> = ({ items, onSave, onDelete, onCancel }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<MedicalItem>>({});

    // Filtering & Sorting (Mock for now, can be expanded)
    const sortedItems = [...items].sort((a, b) => {
        if (a.minStockLevel && a.quantity <= a.minStockLevel) return -1; // Low stock first
        return 0;
    });

    const handleEdit = (item: MedicalItem) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentItem({
            id: `med-${Date.now()}`,
            type: 'Antibiotic',
            unit: 'ml',
            quantity: 0,
            costPerUnit: 0,
            minStockLevel: 0
        });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (currentItem.name && currentItem.quantity !== undefined) {
            onSave(currentItem as MedicalItem);
            setIsEditing(false);
            setCurrentItem({});
        }
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'Antibiotic': return <Syringe className="w-5 h-5 text-blue-500" />;
            case 'Vaccine': return <Activity className="w-5 h-5 text-purple-500" />;
            case 'Vitamin': return <Pill className="w-5 h-5 text-green-500" />;
            default: return <Briefcase className="w-5 h-5 text-gray-500" />;
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {currentItem.id?.startsWith('med-') ? 'Edit Item' : 'Add New Item'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                        <input
                            type="text"
                            value={currentItem.name || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-ecomattGreen focus:border-transparent outline-none"
                            placeholder="e.g. Oxytetracycline 20%"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={currentItem.type}
                            onChange={(e) => setCurrentItem({ ...currentItem, type: e.target.value as any })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-ecomattGreen outline-none"
                        >
                            <option value="Antibiotic">Antibiotic</option>
                            <option value="Vaccine">Vaccine</option>
                            <option value="Vitamin">Vitamin</option>
                            <option value="Disinfectant">Disinfectant</option>
                            <option value="Equipment">Equipment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Quantity & Unit */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                type="number"
                                value={currentItem.quantity}
                                onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-ecomattGreen outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                            <select
                                value={currentItem.unit}
                                onChange={(e) => setCurrentItem({ ...currentItem, unit: e.target.value as any })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-ecomattGreen outline-none"
                            >
                                <option value="ml">ml</option>
                                <option value="doses">doses</option>
                                <option value="units">units</option>
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                            </select>
                        </div>
                    </div>

                    {/* Cost */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cost per Unit ($)</label>
                        <input
                            type="number"
                            value={currentItem.costPerUnit}
                            onChange={(e) => setCurrentItem({ ...currentItem, costPerUnit: Number(e.target.value) })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-ecomattGreen outline-none"
                        />
                    </div>

                    {/* Min Stock */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                        <input
                            type="number"
                            value={currentItem.minStockLevel}
                            onChange={(e) => setCurrentItem({ ...currentItem, minStockLevel: Number(e.target.value) })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-ecomattGreen outline-none"
                        />
                    </div>

                    {/* Expiry */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                            type="date"
                            value={currentItem.expiryDate || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, expiryDate: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-ecomattGreen outline-none"
                        />
                    </div>
                    {/* Batch */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch #</label>
                        <input
                            type="text"
                            value={currentItem.batchNumber || ''}
                            onChange={(e) => setCurrentItem({ ...currentItem, batchNumber: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-ecomattGreen outline-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg bg-ecomattGreen text-white font-medium hover:bg-green-600 shadow-md hover:shadow-lg transition-all"
                    >
                        Save Item
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-ecomattGreen" />
                        Farm Pharmacy
                    </h2>
                    <p className="text-sm text-gray-500">Manage medicines, vaccines, and equipment</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 rounded-lg bg-ecomattGreen text-white font-medium hover:bg-green-600 shadow-sm flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Item
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-ecomattGreen" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Pharmacy is Empty</h3>
                    <p className="text-gray-500 mb-4">Add your first medicine or equipment to start tracking.</p>
                    <button
                        onClick={handleAddNew}
                        className="px-6 py-2 rounded-lg bg-ecomattGreen text-white font-medium hover:bg-green-600"
                    >
                        Add First Item
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {sortedItems.map(item => {
                        const isLowStock = item.minStockLevel !== undefined && item.quantity <= item.minStockLevel;
                        const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();

                        return (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isExpired ? 'bg-red-50' : 'bg-gray-50'}`}>
                                        {getIconForType(item.type)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                            {item.name}
                                            {isLowStock && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={10} /> Low Stock</span>}
                                            {isExpired && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Expired</span>}
                                        </h3>
                                        <div className="text-sm text-gray-500 flex items-center gap-3">
                                            <span>{item.type}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span>Batch: {item.batchNumber || 'N/A'}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span>Exp: {item.expiryDate || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">
                                            {item.quantity} <span className="text-sm font-normal text-gray-500">{item.unit}</span>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            ${item.costPerUnit}/{item.unit}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default MedicalInventoryManager;
