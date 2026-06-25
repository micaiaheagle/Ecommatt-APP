import React, { useState } from 'react';

const Inventory: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Equipment' | 'General' | 'Pharmacy' | 'Maintenance'>('Equipment');

    // Simulated Data
    const equipmentList = [
        { id: 'EQ001', name: 'John Deere Tractor 5055E', category: 'Heavy Machinery', status: 'Operational', lastService: '2026-05-10', nextService: '2026-11-10' },
        { id: 'EQ002', name: 'Digital Pig Scale 500kg', category: 'Measurement', status: 'Needs Calibration', lastService: '2026-01-15', nextService: '2026-07-15' },
        { id: 'EQ003', name: 'High-Pressure Washer', category: 'Cleaning', status: 'Operational', lastService: '2026-06-01', nextService: '2026-12-01' },
        { id: 'EQ004', name: 'Feed Mixer 1000L', category: 'Feeding', status: 'Under Maintenance', lastService: '2026-06-20', nextService: '2026-12-20' },
    ];

    const generalStock = [
        { id: 'ST001', item: 'Disinfectant Boot Dip', quantity: 50, unit: 'Liters', reorderLevel: 20, status: 'In Stock' },
        { id: 'ST002', item: 'Heavy Duty Gloves', quantity: 15, unit: 'Boxes', reorderLevel: 10, status: 'Low Stock' },
        { id: 'ST003', item: 'Ear Tags (Yellow)', quantity: 500, unit: 'Pieces', reorderLevel: 100, status: 'In Stock' },
        { id: 'ST004', item: 'Marking Spray (Green)', quantity: 5, unit: 'Cans', reorderLevel: 10, status: 'Low Stock' },
        { id: 'ST005', item: 'Heat Lamps', quantity: 8, unit: 'Units', reorderLevel: 5, status: 'In Stock' },
    ];

    const pharmacyStock = [
        { id: 'PH001', name: 'Penicillin G Procaine', type: 'Antibiotic', quantity: 20, unit: 'Bottles (100ml)', expiry: '2027-10-15', status: 'Good' },
        { id: 'PH002', name: 'Iron Dextran 20%', type: 'Supplement', quantity: 5, unit: 'Bottles (100ml)', expiry: '2026-08-01', status: 'Low Stock' },
        { id: 'PH003', name: 'Ivermectin Pour-On', type: 'Anti-parasitic', quantity: 12, unit: 'Liters', expiry: '2028-01-20', status: 'Good' },
        { id: 'PH004', name: 'Oxytocin Injection', type: 'Hormone', quantity: 2, unit: 'Bottles (50ml)', expiry: '2026-07-10', status: 'Expiring Soon' },
        { id: 'PH005', name: 'Amoxicillin Trihydrate', type: 'Antibiotic', quantity: 15, unit: 'Bottles (250ml)', expiry: '2027-05-11', status: 'Good' },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Inventory & Assets</h2>
                    <p className="text-sm text-gray-500">Manage equipment, supplies, and medical stock</p>
                </div>
                <button className="bg-ecomattGreen text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors shadow-sm flex items-center gap-2">
                    <i className="fas fa-plus"></i> Add Item
                </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
                {(['Equipment', 'General', 'Pharmacy', 'Maintenance'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        {tab === 'Equipment' && <><i className="fas fa-tractor mr-2"></i> Equipment</>}
                        {tab === 'General' && <><i className="fas fa-boxes mr-2"></i> General Stock</>}
                        {tab === 'Pharmacy' && <><i className="fas fa-prescription-bottle-alt mr-2"></i> Pharmacy Cabinet</>}
                        {tab === 'Maintenance' && <><i className="fas fa-tools mr-2"></i> Maintenance Logs</>}
                    </button>
                ))}
            </div>

            {/* Content area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === 'Equipment' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-4 font-bold">ID</th>
                                    <th className="p-4 font-bold">Name</th>
                                    <th className="p-4 font-bold">Category</th>
                                    <th className="p-4 font-bold">Status</th>
                                    <th className="p-4 font-bold">Next Service</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {equipmentList.map(item => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-mono text-gray-500">{item.id}</td>
                                        <td className="p-4 font-bold text-gray-900">{item.name}</td>
                                        <td className="p-4 text-gray-600">{item.category}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'Operational' ? 'bg-green-50 text-green-700' : item.status === 'Under Maintenance' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">{item.nextService}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'General' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-4 font-bold">Item</th>
                                    <th className="p-4 font-bold text-right">Quantity</th>
                                    <th className="p-4 font-bold text-right">Reorder Lvl</th>
                                    <th className="p-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {generalStock.map(item => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-bold text-gray-900">{item.item} <span className="text-xs font-normal text-gray-400 block">{item.id}</span></td>
                                        <td className="p-4 text-right font-mono text-gray-700">{item.quantity} <span className="text-xs text-gray-400">{item.unit}</span></td>
                                        <td className="p-4 text-right font-mono text-gray-500">{item.reorderLevel}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'In Stock' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Pharmacy' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-4 font-bold">Medicine</th>
                                    <th className="p-4 font-bold">Type</th>
                                    <th className="p-4 font-bold text-right">Stock</th>
                                    <th className="p-4 font-bold">Expiry</th>
                                    <th className="p-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {pharmacyStock.map(item => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-bold text-gray-900">{item.name} <span className="text-xs font-normal text-gray-400 block">{item.id}</span></td>
                                        <td className="p-4 text-gray-600">{item.type}</td>
                                        <td className="p-4 text-right font-mono text-gray-700">{item.quantity} <span className="text-xs text-gray-400">{item.unit}</span></td>
                                        <td className="p-4 text-gray-600">{item.expiry}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'Good' ? 'bg-green-50 text-green-700' : item.status === 'Low Stock' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Maintenance' && (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 text-2xl mb-4">
                            <i className="fas fa-clipboard-check"></i>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Maintenance History</h3>
                        <p className="text-sm max-w-sm mx-auto mb-6">Select an equipment item from the list to view its complete service history, part replacements, and cost logs.</p>
                        <button className="text-ecomattGreen font-bold text-sm hover:underline">Select Equipment</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
