import React, { useState } from 'react';
import { VisitorLogEntry, KnowledgeDoc, User, UserRole } from '../types';
import VisitorsLog from './VisitorsLog';
import KnowledgeHub from './KnowledgeHub';
import HelpCentre from './HelpCentre';

interface BiosecurityFeaturesProps {
    visitorLogs: VisitorLogEntry[];
    onCheckInVisitor: (entry: VisitorLogEntry) => void;
    onCheckOutVisitor: (id: string, time: string) => void;
    knowledgeDocs: KnowledgeDoc[];
    onAddDocument: (doc: KnowledgeDoc) => void;
    onDeleteDocument: (id: string) => void;
    currentUser: User | null;
}

type Tab = 'Visitors' | 'Knowledge' | 'Help';

const BiosecurityFeatures: React.FC<BiosecurityFeaturesProps> = ({
    visitorLogs,
    onCheckInVisitor,
    onCheckOutVisitor,
    knowledgeDocs,
    onAddDocument,
    onDeleteDocument,
    currentUser
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('Visitors');

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="mb-6 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <i className="fas fa-shield-virus text-green-600"></i>
                        Biosecurity & Compliance
                    </h2>
                    <p className="text-gray-500 mt-1">Manage site access, protocols, and regulatory compliance.</p>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                {['Visitors', 'Knowledge', 'Help'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as Tab)}
                        className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-200 ${activeTab === tab
                                ? 'bg-white text-green-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {tab === 'Visitors' && 'Visitors Log'}
                        {tab === 'Knowledge' && 'Knowledge Hub'}
                        {tab === 'Help' && 'Help Centre'}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[60vh] animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'Visitors' && (
                    <VisitorsLog logs={visitorLogs} onCheckIn={onCheckInVisitor} onCheckOut={onCheckOutVisitor} />
                )}
                {activeTab === 'Knowledge' && (
                    <KnowledgeHub
                        docs={knowledgeDocs}
                        onAdd={onAddDocument}
                        onDelete={onDeleteDocument}
                        userRole={currentUser?.role || 'General Worker'}
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
