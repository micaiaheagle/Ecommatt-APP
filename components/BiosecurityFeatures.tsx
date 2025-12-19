import React, { useState } from 'react';
import { VisitorLogEntry, KnowledgeDoc, User, BiosecurityZone, ComplianceDoc, PenMovement, InfectionAlert } from '../types'; import VisitorsLog from './VisitorsLog';
import KnowledgeHub from './KnowledgeHub';
import HelpCentre from './HelpCentre';
import ContactTracing from './ContactTracing';

interface BiosecurityFeaturesProps {
    visitorLogs: VisitorLogEntry[];
    onCheckInVisitor: (entry: VisitorLogEntry) => void;
    onCheckOutVisitor: (id: string, time: string) => void;
    knowledgeDocs: KnowledgeDoc[];
    onAddDocument: (doc: KnowledgeDoc) => void;
    onDeleteDocument: (id: string) => void;
    currentUser: User | null;
    movements: PenMovement[];
    alerts: InfectionAlert[];
    users: User[];
    onLogMovement: (movement: Partial<PenMovement>) => void;
}

type Tab = 'Visitors' | 'Knowledge' | 'Help' | 'Zones' | 'Compliance' | 'Tracing';

const BiosecurityFeatures: React.FC<BiosecurityFeaturesProps> = ({
    visitorLogs,
    onCheckInVisitor,
    onCheckOutVisitor,
    knowledgeDocs,
    onAddDocument,
    onDeleteDocument,
    currentUser,
    movements,
    alerts,
    users,
    onLogMovement
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('Visitors');

    // Internal Mock for Zones (Dr. Gusha Report)
    const zones: BiosecurityZone[] = [
        { id: 'z1', name: 'Farrowing House', riskCategory: 'Red', lastDisinfected: '2025-12-18' },
        { id: 'z2', name: 'Weaner Deck', riskCategory: 'Red', lastDisinfected: '2025-12-17' },
        { id: 'z3', name: 'Gestation Row', riskCategory: 'Yellow', lastDisinfected: '2025-12-15' },
        { id: 'z4', name: 'Feed Warehouse', riskCategory: 'Green', lastDisinfected: '2025-12-10' },
        { id: 'z5', name: 'Main Gate / Footbath', riskCategory: 'Green', lastDisinfected: '2025-12-19' },
    ];

    const complianceDocs: ComplianceDoc[] = [
        { id: 'c1', type: 'Movement Permit', issueDate: '2025-12-15', expiryDate: '2025-12-22', issuedBy: 'Dept. of Vet Services', status: 'Valid' },
        { id: 'c2', type: 'Vet Certificate', issueDate: '2025-12-10', issuedBy: 'Dr. Gusha', status: 'Valid' },
        { id: 'c3', type: 'Health Report', issueDate: '2025-11-20', issuedBy: 'Farm Manager', status: 'Expired' },
    ];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 bg-gray-50/30 min-h-screen">
            <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                <div>
                    <h2 className="text-2xl md:text-4xl font-black text-ecomattBlack tracking-tighter flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-ecomattGreen text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                            <i className="fas fa-shield-virus text-lg md:text-xl"></i>
                        </div>
                        Active Site Defense
                    </h2>
                    <p className="text-gray-400 font-bold text-[9px] md:text-xs uppercase tracking-widest mt-2 md:mt-3 ml-1">Dr. Gusha Compliance & Biosecurity Center</p>
                </div>

                <div className="flex bg-white p-1.5 md:p-2 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto">
                    <div className="flex-1 md:flex-none px-3 md:px-4 py-1.5 md:py-2 border-r border-gray-100 text-center">
                        <div className="text-lg md:text-xl font-black text-red-500">2</div>
                        <div className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter">Critical Zones</div>
                    </div>
                    <div className="flex-1 md:flex-none px-3 md:px-4 py-1.5 md:py-2 text-center">
                        <div className="text-lg md:text-xl font-black text-green-500">3</div>
                        <div className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter">Valid Permits</div>
                    </div>
                </div>
            </header>

            {/* Modern Tab Navigation - Horizontal Scroll on Mobile */}
            <div className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {[
                    { id: 'Visitors', label: 'Access', icon: 'fa-user-lock' },
                    { id: 'Zones', label: 'Zones', icon: 'fa-map-marked-alt' },
                    { id: 'Compliance', label: 'Vault', icon: 'fa-file-signature' },
                    { id: 'Tracing', label: 'Tracing', icon: 'fa-shoe-prints' },
                    { id: 'Knowledge', label: 'SOPs', icon: 'fa-book-open' },
                    { id: 'Help', label: 'Support', icon: 'fa-headset' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 md:gap-3 shadow-sm border whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-ecomattBlack text-white border-ecomattBlack shadow-lg md:shadow-xl shadow-gray-200 scale-105'
                            : 'bg-white text-gray-400 border-gray-100 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <i className={`fas ${tab.icon}`}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'Visitors' && (
                    <VisitorsLog logs={visitorLogs} onCheckIn={onCheckInVisitor} onCheckOut={onCheckOutVisitor} />
                )}

                {activeTab === 'Zones' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {zones.map(zone => (
                            <div key={zone.id} className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                                <div className="flex justify-between items-start mb-4 md:mb-6">
                                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-inner ${zone.riskCategory === 'Red' ? 'bg-red-50 text-red-500' :
                                        zone.riskCategory === 'Yellow' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'
                                        }`}>
                                        <i className={`fas ${zone.riskCategory === 'Red' ? 'fa-biohazard' : 'fa-door-closed'}`}></i>
                                    </div>
                                    <span className={`text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-full uppercase tracking-tighter ${zone.riskCategory === 'Red' ? 'bg-red-100 text-red-700' :
                                        zone.riskCategory === 'Yellow' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {zone.riskCategory} Zone
                                    </span>
                                </div>
                                <h4 className="text-lg md:text-xl font-black text-gray-900 tracking-tight mb-2">{zone.name}</h4>
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex justify-between items-center text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">
                                        <span>Last Disinfection</span>
                                        <span className="text-gray-900">{zone.lastDisinfected}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${zone.riskCategory === 'Red' ? 'bg-red-500' :
                                            zone.riskCategory === 'Yellow' ? 'bg-amber-500' : 'bg-green-500'
                                            }`} style={{ width: zone.riskCategory === 'Red' ? '100%' : zone.riskCategory === 'Yellow' ? '60%' : '30%' }}></div>
                                    </div>
                                </div>
                                <button className="w-full mt-6 md:mt-8 bg-gray-50 text-gray-400 py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-ecomattBlack hover:text-white transition-all">
                                    Refresh Sanitation
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'Compliance' && (
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Compliance Vault</h3>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Regulatory Permits & Certifications</p>
                            </div>
                            <button className="bg-ecomattGreen text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 hover:scale-105 active:scale-95 transition-all">
                                Upload Document
                            </button>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {complianceDocs.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 hover:border-ecomattGreen transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${doc.status === 'Valid' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                                            }`}>
                                            <i className="fas fa-file-contract"></i>
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 text-sm tracking-tight">{doc.type}</div>
                                            <div className="text-[10px] text-gray-400 font-bold mt-1">Issued by: {doc.issuedBy}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${doc.status === 'Valid' ? 'text-green-600' : 'text-red-600'
                                            }`}>{doc.status}</div>
                                        <div className="text-[9px] text-gray-400 font-bold">Expires: {doc.expiryDate || 'N/A'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'Knowledge' && (
                    <KnowledgeHub
                        docs={knowledgeDocs}
                        onAdd={onAddDocument}
                        onDelete={onDeleteDocument}
                        userRole={currentUser?.role || 'General Worker'}
                    />
                )}
                {activeTab === 'Tracing' && (
                    <ContactTracing
                        movements={movements}
                        alerts={alerts}
                        users={users}
                        onLogMovement={onLogMovement}
                    />
                )}
                {activeTab === 'Help' && (
                    <HelpCentre />
                )}
            </div>
        </div>
    );
};

export default BiosecurityFeatures;

