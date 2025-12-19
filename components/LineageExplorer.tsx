import React, { useState, useMemo } from 'react';
import { Pig, PigStage, PigStatus } from '../types';
import {
    Dna,
    ArrowLeft,
    Search,
    AlertTriangle,
    Info,
    ChevronRight,
    ChevronDown,
    Binary,
    GitBranch,
    TrendingUp,
    Award
} from 'lucide-react';

interface LineageExplorerProps {
    pigs: Pig[];
    onBack: () => void;
    onSelectPig?: (pig: Pig) => void;
}

const LineageExplorer: React.FC<LineageExplorerProps> = ({ pigs, onBack, onSelectPig }) => {
    const [selectedPigId, setSelectedPigId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedPig = useMemo(() =>
        pigs.find(p => p.id === selectedPigId),
        [pigs, selectedPigId]
    );

    const filteredPigs = useMemo(() =>
        pigs.filter(p =>
            p.tagId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.breed.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [pigs, searchTerm]
    );

    // Helper to find ancestors recursively
    const getAncestors = (pig: Pig, depth: number = 0, maxDepth: number = 2): any => {
        if (depth >= maxDepth) return null;

        const sire = pigs.find(p => p.tagId === pig.sireId || p.id === pig.sireId);
        const dam = pigs.find(p => p.tagId === pig.damId || p.id === pig.damId);

        return {
            sire: sire ? getAncestors(sire, depth + 1, maxDepth) : null,
            dam: dam ? getAncestors(dam, depth + 1, maxDepth) : null,
            pig: sire || dam ? pig : null,
            sireRef: sire,
            damRef: dam
        };
    };

    const lineage = useMemo(() =>
        selectedPig ? getAncestors(selectedPig) : null,
        [selectedPig, pigs]
    );

    // Simple Inbreeding Coefficient Calculator (Mock Logic)
    const calculateInbreedingRisk = (pig: Pig) => {
        const ancestors = new Set<string>();
        const checkDupes = (pId?: string, depth = 0) => {
            if (!pId || depth > 3) return false;
            if (ancestors.has(pId)) return true;
            ancestors.add(pId);
            const p = pigs.find(x => x.id === pId || x.tagId === pId);
            if (p) {
                return checkDupes(p.sireId, depth + 1) || checkDupes(p.damId, depth + 1);
            }
            return false;
        };

        // Clear set before checking sire and dam lines for overlap
        ancestors.clear();
        const sireLine = new Set<string>();
        const fillLine = (pId: string | undefined, set: Set<string>, d: number) => {
            if (!pId || d > 3) return;
            set.add(pId);
            const p = pigs.find(x => x.id === pId || x.tagId === pId);
            if (p) {
                fillLine(p.sireId, set, d + 1);
                fillLine(p.damId, set, d + 1);
            }
        };

        if (pig.sireId) fillLine(pig.sireId, sireLine, 0);

        let overlap = false;
        const checkOverlap = (pId: string | undefined, d: number) => {
            if (!pId || d > 3) return;
            if (sireLine.has(pId)) { overlap = true; return; }
            const p = pigs.find(x => x.id === pId || x.tagId === pId);
            if (p) {
                checkOverlap(p.sireId, d + 1);
                checkOverlap(p.damId, d + 1);
            }
        };
        if (pig.damId) checkOverlap(pig.damId, 0);

        return overlap;
    };

    const renderNode = (pig: Pig | undefined, label: string) => {
        if (!pig) {
            return (
                <div className="p-3 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/50 text-slate-500 text-[10px] md:text-xs flex items-center justify-center min-w-[120px] md:min-w-[140px]">
                    Unknown {label}
                </div>
            );
        }

        return (
            <div
                onClick={() => setSelectedPigId(pig.id)}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:scale-105 min-w-[120px] md:min-w-[160px] ${selectedPigId === pig.id ? 'border-primary bg-primary/10' : 'border-slate-700 bg-slate-800'
                    }`}
            >
                <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${pig.gender === 'Male' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                    <span className="text-xs font-bold text-slate-300">{pig.tagId}</span>
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-tight font-medium">
                    {pig.breed} • {pig.stage}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-2">
                            <GitBranch className="text-emerald-400" size={24} />
                            Biogenetic Lineage Explorer
                        </h1>
                        <p className="text-slate-500 text-sm">Visualizing ancestry and genetic purity</p>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Tag ID or Breed..."
                        className="bg-slate-800 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                {/* Mobile Search - Fixed at top of content when sidebar is hidden */}
                <div className="md:hidden p-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search pigs..."
                            className="bg-slate-800 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-primary w-full text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Sidebar - Pig List (Full width on mobile if no pig selected) */}
                <div className={`${selectedPigId ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-white/5 bg-slate-900/30 overflow-y-auto`}>
                    {filteredPigs.length > 0 ? filteredPigs.map(pig => (
                        <div
                            key={pig.id}
                            onClick={() => setSelectedPigId(pig.id)}
                            className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${selectedPigId === pig.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-slate-200">{pig.tagId}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${pig.gender === 'Male' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'
                                    }`}>
                                    {pig.gender}
                                </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium">{pig.breed} • {pig.stage}</div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-slate-600 font-bold uppercase text-[10px] tracking-widest">No pigs found</div>
                    )}
                </div>

                {/* Tree Visualization (Full width on mobile when a pig IS selected) */}
                <div className={`${selectedPigId ? 'block' : 'hidden md:block'} flex-1 overflow-auto p-4 md:p-12 pb-32 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 relative`}>

                    {/* Mobile Back Button to List */}
                    {selectedPigId && (
                        <button
                            onClick={() => setSelectedPigId(null)}
                            className="md:hidden mb-6 flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl"
                        >
                            <ArrowLeft size={14} /> Back to List
                        </button>
                    )}

                    {selectedPig ? (
                        <div className="max-w-4xl mx-auto">
                            {/* Inbreeding Warning Card */}
                            {calculateInbreedingRisk(selectedPig) && (
                                <div className="mb-6 md:mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 animate-pulse">
                                    <div className="p-2 md:p-3 bg-red-500/20 rounded-full">
                                        <AlertTriangle className="text-red-400" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-red-500 text-xs md:text-sm uppercase tracking-tight">Genomic Overlap</h3>
                                        <p className="text-[10px] md:text-xs text-red-400/80 font-bold">Inbreeding risk found in ancestry line.</p>
                                    </div>
                                </div>
                            )}

                            {/* Tree Grid - Responsive Vertical Logic */}
                            <div className="flex flex-col items-center gap-8 md:gap-16">

                                {/* Generation 3 (Grandparents) - Stacked on Mobile */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8 w-full">
                                    <div className="flex flex-col gap-3 md:gap-4">
                                        {renderNode(pigs.find(p => p.tagId === (pigs.find(s => s.tagId === selectedPig.sireId || s.id === selectedPig.sireId)?.sireId)), 'Paternal G-Sire')}
                                        {renderNode(pigs.find(p => p.tagId === (pigs.find(s => s.tagId === selectedPig.sireId || s.id === selectedPig.sireId)?.damId)), 'Paternal G-Dam')}
                                    </div>
                                    <div className="flex flex-col gap-3 md:gap-4 md:col-start-4">
                                        {renderNode(pigs.find(p => p.tagId === (pigs.find(s => s.tagId === selectedPig.damId || s.id === selectedPig.damId)?.sireId)), 'Maternal G-Sire')}
                                        {renderNode(pigs.find(p => p.tagId === (pigs.find(s => s.tagId === selectedPig.damId || s.id === selectedPig.damId)?.damId)), 'Maternal G-Dam')}
                                    </div>
                                </div>

                                {/* Generation 2 (Parents) */}
                                <div className="flex flex-col md:flex-row gap-8 md:gap-48 relative">
                                    {/* Sire */}
                                    <div className="flex flex-col items-center relative">
                                        <div className="hidden md:block absolute -top-8 w-px h-8 bg-slate-700"></div>
                                        {renderNode(pigs.find(p => p.tagId === selectedPig.sireId || p.id === selectedPig.sireId), 'Sire')}
                                        <div className="h-6 md:h-8 w-px bg-slate-700 mt-2" />
                                    </div>
                                    {/* Dam */}
                                    <div className="flex flex-col items-center relative">
                                        <div className="hidden md:block absolute -top-8 w-px h-8 bg-slate-700"></div>
                                        {renderNode(pigs.find(p => p.tagId === selectedPig.damId || p.id === selectedPig.damId), 'Dam')}
                                        <div className="h-6 md:h-8 w-px bg-slate-700 mt-2" />
                                    </div>
                                </div>

                                {/* Generation 1 (Target) */}
                                <div className="relative group w-full max-w-[280px] md:max-w-none">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                    <div className="relative p-5 md:p-6 bg-slate-900 border-2 border-primary rounded-2xl shadow-2xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-2 bg-primary/20 rounded-lg">
                                                <Dna className="text-primary" size={24} />
                                            </div>
                                            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Genetic Core</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-xl md:text-2xl font-black text-white">{selectedPig.tagId}</h2>
                                            <div className="flex items-center gap-2 text-primary font-bold text-xs md:text-sm">
                                                <span>{selectedPig.breed}</span>
                                                <div className="w-1 h-1 rounded-full bg-slate-700" />
                                                <span>{selectedPig.stage}</span>
                                            </div>
                                        </div>

                                        <div className="mt-5 md:mt-6 pt-5 md:pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] text-slate-500 uppercase font-bold">Litter Weight</span>
                                                <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs md:text-sm">
                                                    <TrendingUp size={14} />
                                                    <span>{selectedPig.weight}kg</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] text-slate-500 uppercase font-bold">Efficiency</span>
                                                <div className="flex items-center gap-1 text-cyan-400 font-bold text-xs md:text-sm">
                                                    <Award size={14} />
                                                    <span>PPR 4.2</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center px-6">
                            <div className="p-6 md:p-8 bg-slate-900/50 rounded-full border border-white/5 mb-6">
                                <Binary size={64} className="opacity-20 translate-y-2 animate-pulse" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-400">Ancestry heritage visualization</h3>
                            <p className="max-w-xs mt-2 text-xs md:text-sm font-medium text-slate-500 italic">Select an animal from the list to explore its biogenetic lineage</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LineageExplorer;
