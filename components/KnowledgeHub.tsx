import React, { useState } from 'react';
import { KnowledgeDoc, UserRole } from '../types';

interface KnowledgeHubProps {
    docs: KnowledgeDoc[];
    onAdd: (doc: KnowledgeDoc) => void;
    onDelete: (id: string) => void;
    userRole: UserRole;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ docs, onAdd, onDelete, userRole }) => {
    const isManager = userRole === 'Farm Manager';
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'SOPs',
        type: 'PDF'
    });

    const handleDownload = (doc: KnowledgeDoc) => {
        // Simulate Download
        alert(`Downloading ${doc.title} (${doc.size})...`);
    };

    const handleAdd = () => {
        if (!formData.title) return alert("Title is required");

        const newDoc: KnowledgeDoc = {
            id: `doc-${Date.now()}`,
            title: formData.title,
            category: formData.category as any,
            type: formData.type as any,
            size: '0.5 MB', // Mock Size
            uploadDate: new Date().toISOString().split('T')[0],
            addedBy: 'Manager'
        };
        onAdd(newDoc);
        setShowModal(false);
        setFormData({ title: '', category: 'SOPs', type: 'PDF' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Knowledge Hub</h3>
                    <p className="text-gray-600 text-sm">Central repository for Standard Operating Procedures (SOPs), manuals, and farm policies.</p>
                </div>

                {isManager && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                    >
                        <i className="fas fa-upload"></i> Upload Document
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {docs.map(doc => (
                    <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition hover:border-blue-200 group relative">
                        {isManager && (
                            <button
                                onClick={() => onDelete(doc.id)}
                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                title="Delete Document"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                        <div className="flex items-start justify-between pr-8">
                            <div className={`p-3 rounded-lg ${doc.type === 'PDF' ? 'bg-red-100 text-red-600' : doc.type === 'XLSX' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                <i className={`fas ${doc.type === 'PDF' ? 'fa-file-pdf' : doc.type === 'XLSX' ? 'fa-file-excel' : 'fa-file-alt'} text-xl`}></i>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-1 rounded">{doc.type}</span>
                        </div>
                        <h4 className="font-bold text-lg mt-4 mb-1 text-gray-800 truncate" title={doc.title}>{doc.title}</h4>
                        <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                            <span>{doc.category} • {doc.uploadDate}</span>
                            <span>{doc.size}</span>
                        </div>
                        <button
                            onClick={() => handleDownload(doc)}
                            className="w-full py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-download"></i> Download
                        </button>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {docs.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <div className="text-gray-400 mb-2 text-4xl"><i className="fas fa-folder-open"></i></div>
                    <p className="text-gray-500 font-medium">No documents found.</p>
                    {isManager && <p className="text-sm text-gray-400">Upload a new document to get started.</p>}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xl font-bold text-gray-800">Upload Document</h4>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Biosecurity Policy 2025"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="SOPs">SOPs</option>
                                        <option value="Manuals">Manuals</option>
                                        <option value="Health">Health</option>
                                        <option value="HR">HR</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="PDF">PDF</option>
                                        <option value="DOCX">DOCX</option>
                                        <option value="XLSX">Excel</option>
                                        <option value="TXT">Text</option>
                                    </select>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 text-sm bg-gray-50">
                                <i className="fas fa-cloud-upload-alt text-2xl mb-2 text-gray-400"></i>
                                <p>Drag and drop file here (Simulated)</p>
                            </div>

                        </div>
                        <div className="flex gap-3 mt-6 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KnowledgeHub;
