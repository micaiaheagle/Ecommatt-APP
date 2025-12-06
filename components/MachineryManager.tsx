import React, { useState } from 'react';
import { Asset, MaintenanceLog, FuelLog } from '../types';
import { Plus, Wrench, Droplet, Activity, Truck, AlertTriangle } from 'lucide-react';

interface MachineryManagerProps {
    assets: Asset[];
    maintenanceLogs: MaintenanceLog[];
    fuelLogs: FuelLog[];
    onAddAsset: (asset: Asset) => void;
    onLogMaintenance: (log: MaintenanceLog) => void;
    onLogFuel: (log: FuelLog) => void;
}

const MachineryManager: React.FC<MachineryManagerProps> = ({
    assets,
    maintenanceLogs,
    fuelLogs,
    onAddAsset,
    onLogMaintenance,
    onLogFuel
}) => {
    const [activeTab, setActiveTab] = useState<'Assets' | 'Maintenance' | 'Fuel'>('Assets');
    const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
    const [isLogMaintenanceModalOpen, setIsLogMaintenanceModalOpen] = useState(false);
    const [isLogFuelModalOpen, setIsLogFuelModalOpen] = useState(false);

    // Form States
    const [newAsset, setNewAsset] = useState<Partial<Asset>>({ type: 'Tractor', status: 'Active' });
    const [newMaintenance, setNewMaintenance] = useState<Partial<MaintenanceLog>>({ type: 'Service', date: new Date().toISOString().split('T')[0] });
    const [newFuel, setNewFuel] = useState<Partial<FuelLog>>({ date: new Date().toISOString().split('T')[0] });

    const handleSaveAsset = () => {
        if (newAsset.name && newAsset.model && newAsset.value) {
            onAddAsset({
                id: Date.now().toString(),
                name: newAsset.name,
                type: newAsset.type as any,
                model: newAsset.model,
                purchaseDate: newAsset.purchaseDate || new Date().toISOString().split('T')[0],
                value: Number(newAsset.value),
                status: newAsset.status as any
            });
            setIsAddAssetModalOpen(false);
            setNewAsset({ type: 'Tractor', status: 'Active' });
        }
    };

    const handleSaveMaintenance = () => {
        if (newMaintenance.assetId && newMaintenance.description && newMaintenance.cost) {
            onLogMaintenance({
                id: Date.now().toString(),
                assetId: newMaintenance.assetId,
                date: newMaintenance.date || new Date().toISOString().split('T')[0],
                type: newMaintenance.type as any,
                description: newMaintenance.description,
                cost: Number(newMaintenance.cost),
                provider: newMaintenance.provider,
                nextServiceDate: newMaintenance.nextServiceDate
            });
            setIsLogMaintenanceModalOpen(false);
            setNewMaintenance({ type: 'Service', date: new Date().toISOString().split('T')[0] });
        }
    };

    const handleSaveFuel = () => {
        if (newFuel.assetId && newFuel.quantity && newFuel.cost) {
            onLogFuel({
                id: Date.now().toString(),
                assetId: newFuel.assetId,
                date: newFuel.date || new Date().toISOString().split('T')[0],
                quantity: Number(newFuel.quantity),
                cost: Number(newFuel.cost),
                currentMeterReading: newFuel.currentMeterReading ? Number(newFuel.currentMeterReading) : undefined
            });
            setIsLogFuelModalOpen(false);
            setNewFuel({ date: new Date().toISOString().split('T')[0] });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'Broken': return 'bg-red-100 text-red-800';
            case 'Sold': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Tabs */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('Assets')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'Assets' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Assets
                    </button>
                    <button
                        onClick={() => setActiveTab('Maintenance')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'Maintenance' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Maintenance Log
                    </button>
                    <button
                        onClick={() => setActiveTab('Fuel')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'Fuel' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Fuel Log
                    </button>
                </div>
                <div>
                    {activeTab === 'Assets' && (
                        <button onClick={() => setIsAddAssetModalOpen(true)} className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            <Plus size={20} />
                            <span>Add Asset</span>
                        </button>
                    )}
                    {activeTab === 'Maintenance' && (
                        <button onClick={() => setIsLogMaintenanceModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            <Wrench size={20} />
                            <span>Log Service</span>
                        </button>
                    )}
                    {activeTab === 'Fuel' && (
                        <button onClick={() => setIsLogFuelModalOpen(true)} className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                            <Droplet size={20} />
                            <span>Log Fuel</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Assets View */}
            {activeTab === 'Assets' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map(asset => (
                        <div key={asset.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-50 rounded-full">
                                    <Truck className="text-green-600" size={24} />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                                    {asset.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{asset.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{asset.model} • {asset.type}</p>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Value:</span>
                                    <span className="font-semibold">${asset.value.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Purchased:</span>
                                    <span>{asset.purchaseDate}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {assets.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <Truck size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>No assets recorded yet. Add your first tractor, truck, or machine.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Maintenance View */}
            {activeTab === 'Maintenance' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Asset</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Provider</th>
                                <th className="p-4 text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {maintenanceLogs.map(log => {
                                const asset = assets.find(a => a.id === log.assetId);
                                return (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-gray-600">{log.date}</td>
                                        <td className="p-4 font-medium text-gray-800">{asset?.name || 'Unknown Asset'}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                                {log.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">{log.description}</td>
                                        <td className="p-4 text-gray-500">{log.provider || '-'}</td>
                                        <td className="p-4 text-right font-medium text-red-600">-${log.cost.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            {maintenanceLogs.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No maintenance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Fuel View */}
            {activeTab === 'Fuel' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Asset</th>
                                <th className="p-4">Quantity (L)</th>
                                <th className="p-4 text-right">Cost</th>
                                <th className="p-4 text-right text-gray-500">Efficiency</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {fuelLogs.map(log => {
                                const asset = assets.find(a => a.id === log.assetId);
                                return (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-gray-600">{log.date}</td>
                                        <td className="p-4 font-medium text-gray-800">{asset?.name || 'Unknown Asset'}</td>
                                        <td className="p-4 text-gray-800">{log.quantity} L</td>
                                        <td className="p-4 text-right font-medium text-red-600">-${log.cost.toFixed(2)}</td>
                                        <td className="p-4 text-right text-xs text-gray-400">
                                            {log.currentMeterReading ? `${log.currentMeterReading} km/hr` : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                            {fuelLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No fuel records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            {/* Add Asset Modal */}
            {isAddAssetModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Asset</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="e.g., John Deere 5050"
                                    value={newAsset.name || ''}
                                    onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        value={newAsset.type}
                                        onChange={e => setNewAsset({ ...newAsset, type: e.target.value as any })}
                                    >
                                        <option value="Tractor">Tractor</option>
                                        <option value="Truck">Truck</option>
                                        <option value="Generator">Generator</option>
                                        <option value="Pump">Pump</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded-lg"
                                        placeholder="Year/Model"
                                        value={newAsset.model || ''}
                                        onChange={e => setNewAsset({ ...newAsset, model: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-lg"
                                    value={newAsset.value || ''}
                                    onChange={e => setNewAsset({ ...newAsset, value: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setIsAddAssetModalOpen(false)}
                                    className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveAsset}
                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Add Asset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Log Maintenance Modal */}
            {isLogMaintenanceModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Log Maintenance</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={newMaintenance.assetId || ''}
                                    onChange={e => setNewMaintenance({ ...newMaintenance, assetId: e.target.value })}
                                >
                                    <option value="">Select Asset</option>
                                    {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        value={newMaintenance.type}
                                        onChange={e => setNewMaintenance({ ...newMaintenance, type: e.target.value as any })}
                                    >
                                        <option value="Service">Service</option>
                                        <option value="Repair">Repair</option>
                                        <option value="Inspection">Inspection</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border rounded-lg"
                                        value={newMaintenance.date}
                                        onChange={e => setNewMaintenance({ ...newMaintenance, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="e.g., Oil Change, Tire Replacement"
                                    value={newMaintenance.description || ''}
                                    onChange={e => setNewMaintenance({ ...newMaintenance, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-lg"
                                    value={newMaintenance.cost || ''}
                                    onChange={e => setNewMaintenance({ ...newMaintenance, cost: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setIsLogMaintenanceModalOpen(false)}
                                    className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveMaintenance}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Log Service
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Log Fuel Modal */}
            {isLogFuelModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Log Fuel</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                                <select
                                    className="w-full p-2 border rounded-lg"
                                    value={newFuel.assetId || ''}
                                    onChange={e => setNewFuel({ ...newFuel, assetId: e.target.value })}
                                >
                                    <option value="">Select Asset</option>
                                    {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-lg"
                                    value={newFuel.date}
                                    onChange={e => setNewFuel({ ...newFuel, date: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (L)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded-lg"
                                        value={newFuel.quantity || ''}
                                        onChange={e => setNewFuel({ ...newFuel, quantity: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost ($)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded-lg"
                                        value={newFuel.cost || ''}
                                        onChange={e => setNewFuel({ ...newFuel, cost: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Odometer/Hours (Optional)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-lg"
                                    value={newFuel.currentMeterReading || ''}
                                    onChange={e => setNewFuel({ ...newFuel, currentMeterReading: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={() => setIsLogFuelModalOpen(false)}
                                    className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveFuel}
                                    className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                                >
                                    Log Fuel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MachineryManager;
