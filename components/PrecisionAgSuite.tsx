import React, { useState, useMemo } from 'react';
import { Field, Crop, SatelliteScan, PrecisionMap } from '../types';
import { Target, Zap, Activity, Calendar, FileText, Download, CheckCircle, AlertTriangle, Info, Map as MapIcon, ChevronRight } from 'lucide-react';

interface PrecisionAgSuiteProps {
    fields: Field[];
    crops: Crop[];
    defaultFieldId?: string | null;
    onBack?: () => void;
    onUpdatePrecisionMap?: (map: PrecisionMap) => void;
}

const PrecisionAgSuite: React.FC<PrecisionAgSuiteProps> = ({ fields, crops, defaultFieldId, onBack, onUpdatePrecisionMap }) => {
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(defaultFieldId || fields[0]?.id || null);
    const [activeView, setActiveView] = useState<'Health' | 'Prescription' | 'History'>('Health');
    const [showVrpSuccess, setShowVrpSuccess] = useState(false);

    const selectedField = useMemo(() => fields.find(f => f.id === selectedFieldId), [fields, selectedFieldId]);

    // Mock NDVI Data Point Generator for Heatmap
    const ndviData = useMemo(() => {
        const points = [];
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                // Generate a "pattern" of health
                const ndvi = 0.4 + (Math.sin(x / 2) * 0.2) + (Math.cos(y / 3) * 0.3) + (Math.random() * 0.1);
                points.push({ x, y, val: Math.min(1, Math.max(0, ndvi)) });
            }
        }
        return points;
    }, [selectedFieldId]);

    const getColorForNDVI = (val: number) => {
        if (val < 0.3) return '#ef4444'; // Red (Stressed)
        if (val < 0.6) return '#f59e0b'; // Amber (Yellow)
        return '#22c55e'; // Green (Healthy)
    };

    const handleGenerateVRP = () => {
        setShowVrpSuccess(true);
        setTimeout(() => setShowVrpSuccess(false), 3000);
    };

    return (
        <div className="bg-gray-50/30 min-h-screen animate-in fade-in duration-500">
            {/* Context Header */}
            <div className="p-8 max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <button onClick={onBack} className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-100">
                                <i className="fas fa-arrow-left text-xs"></i>
                            </button>
                            <span className="text-[10px] font-black text-ecomattGreen uppercase tracking-widest bg-green-50 px-2 py-1 rounded">Module 19 • Precision Ag</span>
                        </div>
                        <h2 className="text-4xl font-black text-ecomattBlack tracking-tighter flex items-center gap-4">
                            Precision Farming Hub
                        </h2>
                    </div>

                    <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-100 min-w-[300px]">
                        {fields.slice(0, 3).map(f => (
                            <button
                                key={f.id}
                                onClick={() => setSelectedFieldId(f.id)}
                                className={`flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${selectedFieldId === f.id ? 'bg-ecomattBlack text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                {f.name}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left: Health Heatmap & Controls */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Vegetation Health Index (NDVI)</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Satellite Analysis • Sentinel-2 Orbit</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-1 items-center bg-gray-50 px-3 py-1.5 rounded-full">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="ml-1 text-[10px] font-bold text-gray-500">Legend</span>
                                    </div>
                                    <button className="bg-ecomattGreen text-white p-3 rounded-2xl shadow-lg shadow-green-100 hover:scale-105 active:scale-95 transition-all">
                                        <Activity size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* SVG Heatmap */}
                            <div className="aspect-[2/1] bg-gray-900 rounded-3xl relative flex items-center justify-center p-8 group border-[12px] border-white shadow-2xl">
                                <svg viewBox="0 0 100 50" className="w-full h-full opacity-90 drop-shadow-2xl">
                                    {ndviData.map((p, i) => (
                                        <rect
                                            key={i}
                                            x={p.x * 10}
                                            y={p.y * 5}
                                            width="9.5"
                                            height="4.5"
                                            rx="1"
                                            fill={getColorForNDVI(p.val)}
                                            className="transition-all duration-700 hover:stroke-white hover:stroke-[1px]"
                                            style={{ filter: `brightness(${0.8 + p.val * 0.4})` }}
                                        />
                                    ))}
                                </svg>

                                {/* Overlay UI */}
                                <div className="absolute bottom-12 left-12 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white">
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg. Field Score</div>
                                    <div className="text-3xl font-black">{selectedField?.lastNDVI || '0.74'}</div>
                                    <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold mt-1">
                                        <i className="fas fa-caret-up"></i> +4.2% since last scan
                                    </div>
                                </div>
                            </div>

                            {/* Alert Ribbon */}
                            <div className="mt-8 flex items-center justify-between p-6 bg-amber-50 rounded-3xl border border-amber-100 border-dashed">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-amber-900">Low Biomass Detected in NW Quarter</div>
                                        <div className="text-[10px] text-amber-700 font-bold uppercase tracking-widest">Action Required: Field Scouting</div>
                                    </div>
                                </div>
                                <button className="bg-amber-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                                    Analyze Spot
                                </button>
                            </div>
                        </div>

                        {/* Prescriptions */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Prescription Engine</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Variable Rate Mapping (VRP)</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-6 py-3 rounded-2xl bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                                        Settings
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Goal Optimizer</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Yield Max', 'Cost Save', 'Balanced'].map(opt => (
                                                    <button key={opt} className={`py-3 rounded-xl text-[9px] font-black uppercase ${opt === 'Balanced' ? 'bg-ecomattBlack text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}>
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Input Type</label>
                                            <select className="w-full bg-white border border-gray-100 p-4 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-2 ring-ecomattGreen transition-all">
                                                <option>Nitrogen fertilizer (Urea)</option>
                                                <option>Phosphorus (MAP)</option>
                                                <option>Pesticide Mix A-1</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleGenerateVRP}
                                        className="w-full bg-ecomattGreen text-white py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                    >
                                        <Zap size={20} />
                                        Generate ISOXML Map
                                    </button>

                                    {showVrpSuccess && (
                                        <div className="p-4 bg-green-500 text-white rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                                            <CheckCircle size={18} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Prescription sent to Tractor #04</span>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative flex flex-col justify-between group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                        <Target size={120} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black mb-1">Efficiency Forecast</h4>
                                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Predictive Optimization</p>
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Projected Saving</div>
                                                <div className="text-4xl font-black">$1,420</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Input Reduction</div>
                                                <div className="text-2xl font-black">18.4%</div>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-white/10 rounded-full">
                                            <div className="h-full bg-green-400 rounded-full" style={{ width: '82%' }}></div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/10 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/40">
                                        <span>Confidence: 94%</span>
                                        <span className="flex items-center gap-1 text-white"><Info size={10} /> Algo V2.1</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Insights Sidebar */}
                    <div className="space-y-6">
                        {/* Weekly Trend */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
                            <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                <Calendar size={18} className="text-ecomattGreen" />
                                Health Trend
                            </h4>
                            <div className="flex-1 flex flex-col gap-3">
                                {[
                                    { week: 'Week 48', score: 0.74, status: 'Stable' },
                                    { week: 'Week 47', score: 0.71, status: 'Improving' },
                                    { week: 'Week 46', score: 0.65, status: 'Warning' },
                                    { week: 'Week 45', score: 0.62, status: 'Stressed' },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className={`w-2 h-2 rounded-full ${step.score > 0.7 ? 'bg-green-500' : step.score > 0.65 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                                                <span className="text-gray-400">{step.week}</span>
                                                <span className={step.score > 0.7 ? 'text-green-600' : 'text-amber-600'}>{step.score}</span>
                                            </div>
                                            <div className="h-1 w-full bg-gray-50 rounded-full">
                                                <div className={`h-full rounded-full ${step.score > 0.7 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${step.score * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-8 flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-ecomattBlack transition-all">
                                <span className="text-[10px] font-black text-gray-400 group-hover:text-white uppercase tracking-widest">Full History</span>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-white" />
                            </button>
                        </div>

                        {/* Export Center */}
                        <div className="bg-ecomattBlack text-white rounded-[2.5rem] p-8 shadow-xl">
                            <h4 className="text-lg font-black mb-6 flex items-center gap-2">
                                <FileText size={18} className="text-ecomattGreen" />
                                Export Center
                            </h4>
                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all group">
                                    <div className="text-left">
                                        <div className="text-[10px] font-black uppercase tracking-widest">Shapefile (.shp)</div>
                                        <div className="text-[9px] text-white/40 font-bold uppercase mt-1">John Deere Compatible</div>
                                    </div>
                                    <Download size={16} className="text-ecomattGreen opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all group">
                                    <div className="text-left">
                                        <div className="text-[10px] font-black uppercase tracking-widest">ISOXML (.xml)</div>
                                        <div className="text-[9px] text-white/40 font-bold uppercase mt-1">Universal Ag-Std</div>
                                    </div>
                                    <Download size={16} className="text-ecomattGreen opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrecisionAgSuite;
