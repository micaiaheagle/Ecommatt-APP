import React from 'react';

const DocumentCenter: React.FC = () => {
    return (
        <div className="animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Document Center</h2>
                    <p className="text-sm text-gray-500">Secure storage for contracts, licenses, and farm policies</p>
                </div>
                <button className="bg-ecomattBlack text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2">
                    <i className="fas fa-upload"></i> Upload File
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Categories */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Categories</h3>
                    <ul className="space-y-1">
                        <li>
                            <button className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 text-gray-900 font-bold text-sm">
                                <i className="fas fa-folder-open text-gray-400 mr-2"></i> All Documents
                            </button>
                        </li>
                        <li>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm transition">
                                <i className="fas fa-certificate text-gray-400 mr-2"></i> Licenses & Permits
                            </button>
                        </li>
                        <li>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm transition">
                                <i className="fas fa-file-contract text-gray-400 mr-2"></i> Supplier Contracts
                            </button>
                        </li>
                        <li>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm transition">
                                <i className="fas fa-users text-gray-400 mr-2"></i> HR Policies
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-64">
                            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                            <input type="text" placeholder="Search documents..." className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-ecomattGreen" />
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"><i className="fas fa-th-large"></i></button>
                            <button className="p-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900"><i className="fas fa-list"></i></button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                                    <th className="pb-3 font-bold">Name</th>
                                    <th className="pb-3 font-bold">Category</th>
                                    <th className="pb-3 font-bold">Date Modified</th>
                                    <th className="pb-3 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition group">
                                    <td className="py-4 flex items-center gap-3">
                                        <i className="fas fa-file-pdf text-red-500 text-xl"></i>
                                        <span className="font-bold text-gray-900">Commercial Farming License 2026.pdf</span>
                                    </td>
                                    <td className="py-4 text-gray-600">Licenses & Permits</td>
                                    <td className="py-4 text-gray-500">Jan 12, 2026</td>
                                    <td className="py-4 text-right">
                                        <button className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition"><i className="fas fa-download"></i></button>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition group">
                                    <td className="py-4 flex items-center gap-3">
                                        <i className="fas fa-file-word text-blue-500 text-xl"></i>
                                        <span className="font-bold text-gray-900">Employee_Handbook_v3.docx</span>
                                    </td>
                                    <td className="py-4 text-gray-600">HR Policies</td>
                                    <td className="py-4 text-gray-500">Mar 05, 2026</td>
                                    <td className="py-4 text-right">
                                        <button className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition"><i className="fas fa-download"></i></button>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition group">
                                    <td className="py-4 flex items-center gap-3">
                                        <i className="fas fa-file-pdf text-red-500 text-xl"></i>
                                        <span className="font-bold text-gray-900">Valley_Meats_Supply_Agreement.pdf</span>
                                    </td>
                                    <td className="py-4 text-gray-600">Supplier Contracts</td>
                                    <td className="py-4 text-gray-500">Jun 10, 2026</td>
                                    <td className="py-4 text-right">
                                        <button className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition"><i className="fas fa-download"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentCenter;
