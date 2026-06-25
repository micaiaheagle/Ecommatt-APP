import React, { useState } from 'react';

const SalesCRM: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Customers' | 'Orders' | 'Invoices' | 'Dispatch'>('Orders');

    const customers = [
        { id: 'C001', name: 'Valley Meats Ltd', type: 'Wholesale', contact: '+263 77 123 4567', totalSpent: '$45,200', lastOrder: '2026-06-20', status: 'Active' },
        { id: 'C002', name: 'Fresh Cut Butchers', type: 'Retail', contact: '+263 71 987 6543', totalSpent: '$12,450', lastOrder: '2026-06-22', status: 'Active' },
        { id: 'C003', name: 'Highland Farms', type: 'Breeding Partner', contact: '+263 78 555 1234', totalSpent: '$8,900', lastOrder: '2026-05-15', status: 'Inactive' },
        { id: 'C004', name: 'City Supermarkets', type: 'Wholesale', contact: '+263 24 234 5678', totalSpent: '$104,500', lastOrder: '2026-06-24', status: 'Active' },
    ];

    const orders = [
        { id: 'ORD-1042', customer: 'City Supermarkets', date: '2026-06-24', items: '50 Pork Carcasses', total: '$12,500', status: 'Processing' },
        { id: 'ORD-1041', customer: 'Fresh Cut Butchers', date: '2026-06-22', items: '15 Pork Halves', total: '$2,250', status: 'Shipped' },
        { id: 'ORD-1040', customer: 'Valley Meats Ltd', date: '2026-06-20', items: '100 Pork Carcasses', total: '$25,000', status: 'Delivered' },
        { id: 'ORD-1039', customer: 'Local Market', date: '2026-06-19', items: '5 Live Weaners', total: '$350', status: 'Delivered' },
    ];

    const invoices = [
        { id: 'INV-2042', orderId: 'ORD-1042', date: '2026-06-24', amount: '$12,500', status: 'Unpaid', dueDate: '2026-07-08' },
        { id: 'INV-2041', orderId: 'ORD-1041', date: '2026-06-22', amount: '$2,250', status: 'Paid', dueDate: '2026-07-06' },
        { id: 'INV-2040', orderId: 'ORD-1040', date: '2026-06-20', amount: '$25,000', status: 'Paid', dueDate: '2026-07-04' },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Sales & CRM</h2>
                    <p className="text-sm text-gray-500">Manage customers, orders, and fulfillment</p>
                </div>
                <button className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2">
                    <i className="fas fa-plus"></i> New Order
                </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
                {(['Orders', 'Customers', 'Invoices', 'Dispatch'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        {tab === 'Orders' && <><i className="fas fa-shopping-cart mr-2"></i> Orders</>}
                        {tab === 'Customers' && <><i className="fas fa-users mr-2"></i> Customers</>}
                        {tab === 'Invoices' && <><i className="fas fa-file-invoice-dollar mr-2"></i> Invoices</>}
                        {tab === 'Dispatch' && <><i className="fas fa-truck-loading mr-2"></i> Dispatch</>}
                    </button>
                ))}
            </div>

            {/* Content area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {activeTab === 'Orders' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-4 font-bold">Order ID</th>
                                    <th className="p-4 font-bold">Customer</th>
                                    <th className="p-4 font-bold">Date</th>
                                    <th className="p-4 font-bold">Items Summary</th>
                                    <th className="p-4 font-bold text-right">Total</th>
                                    <th className="p-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {orders.map(order => (
                                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-mono font-bold text-orange-600">{order.id}</td>
                                        <td className="p-4 font-bold text-gray-900">{order.customer}</td>
                                        <td className="p-4 text-gray-600">{order.date}</td>
                                        <td className="p-4 text-gray-600">{order.items}</td>
                                        <td className="p-4 text-right font-mono font-bold text-gray-900">{order.total}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-50 text-green-700' : order.status === 'Processing' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Customers' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-4 font-bold">Name</th>
                                    <th className="p-4 font-bold">Type</th>
                                    <th className="p-4 font-bold">Contact</th>
                                    <th className="p-4 font-bold text-right">Lifetime Value</th>
                                    <th className="p-4 font-bold">Last Order</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {customers.map(c => (
                                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-bold text-gray-900">{c.name}</td>
                                        <td className="p-4 text-gray-600">{c.type}</td>
                                        <td className="p-4 text-gray-600">{c.contact}</td>
                                        <td className="p-4 text-right font-mono text-gray-900 font-bold">{c.totalSpent}</td>
                                        <td className="p-4 text-gray-600">{c.lastOrder}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Invoices' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="p-4 font-bold">Invoice #</th>
                                    <th className="p-4 font-bold">Order #</th>
                                    <th className="p-4 font-bold">Date Issued</th>
                                    <th className="p-4 font-bold">Due Date</th>
                                    <th className="p-4 font-bold text-right">Amount</th>
                                    <th className="p-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {invoices.map(inv => (
                                    <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-mono font-bold text-gray-900">{inv.id}</td>
                                        <td className="p-4 font-mono text-gray-500">{inv.orderId}</td>
                                        <td className="p-4 text-gray-600">{inv.date}</td>
                                        <td className="p-4 text-gray-600">{inv.dueDate}</td>
                                        <td className="p-4 text-right font-mono font-bold text-gray-900">{inv.amount}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Dispatch' && (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 text-2xl mb-4">
                            <i className="fas fa-truck"></i>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Live Dispatch Map</h3>
                        <p className="text-sm max-w-sm mx-auto mb-6">Real-time GPS tracking of delivery vehicles will be displayed here.</p>
                        <button className="text-orange-500 font-bold text-sm hover:underline">View Active Routes</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesCRM;
