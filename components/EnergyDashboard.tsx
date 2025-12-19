import React, { useState, useEffect, useMemo } from 'react';
import {
    Zap,
    Battery,
    BatteryLow,
    BatteryMedium,
    BatteryFull,
    Sun,
    ArrowDownCircle,
    AlertTriangle,
    Power,
    Timer,
    Activity,
    Lightbulb,
    Wind,
    Droplets,
    PowerOff
} from 'lucide-react';
import { SolarSystemStatus, EnergyAsset } from '../types';

interface EnergyDashboardProps {
    status: SolarSystemStatus;
    onToggleAsset: (assetId: string) => void;
    onBack: () => void;
}

const EnergyDashboard: React.FC<EnergyDashboardProps> = ({ status, onToggleAsset, onBack }) => {
    const [simulationActive, setSimulationActive] = useState(false);
    const [simulatedBattery, setSimulatedBattery] = useState(status.batteryLevel);

    // Simulation effect for demonstration
    useEffect(() => {
        let interval: any;
        if (simulationActive) {
            interval = setInterval(() => {
                setSimulatedBattery(prev => {
                    const drain = (status.currentLoadKw - status.generationKw) * 0.1;
                    const next = prev - drain;
                    return next < 0 ? 0 : next > 100 ? 100 : next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [simulationActive, status.currentLoadKw, status.generationKw]);

    const currentBattery = simulationActive ? simulatedBattery : status.batteryLevel;

    const hoursRemaining = useMemo(() => {
        const netDraw = status.currentLoadKw - status.generationKw;
        if (netDraw <= 0) return Infinity;
        // Assuming a 20kWh battery bank for mock logic
        const capacityRemaining = (currentBattery / 100) * 20;
        return capacityRemaining / netDraw;
    }, [currentBattery, status.currentLoadKw, status.generationKw]);

    const getBatteryIcon = () => {
        if (currentBattery < 20) return <BatteryLow className="text-red-500" size={32} />;
        if (currentBattery < 60) return <BatteryMedium className="text-yellow-500" size={32} />;
        return <BatteryFull className="text-emerald-500" size={32} />;
    };

    const criticalIssues = useMemo(() => {
        const issues = [];
        if (currentBattery < 20) issues.push("Battery Critically Low - Immediate Shedding Recommended");
        if (status.isGridDown) issues.push("Regional Power Failure - Operating on Backup");
        if (status.currentLoadKw > status.generationKw * 2 && currentBattery < 40) issues.push("High Discharge Rate Detected");
        return issues;
    }, [currentBattery, status.isGridDown, status.currentLoadKw, status.generationKw]);

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-200 overflow-y-auto">
            {/* Header */}
            <div className="p-4 md:p-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl shrink-0">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-2 md:p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                            <Zap className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                                Energy Resilience Hub
                            </h1>
                            <p className="text-slate-500 text-[10px] md:text-sm font-medium">Monitoring Flora Solar Assets • Unity Day Sync</p>
                        </div>
                    </div>

                    <div className="flex w-full md:w-auto gap-2">
                        <button
                            onClick={() => setSimulationActive(!simulationActive)}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${simulationActive
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            <Activity size={16} />
                            {simulationActive ? 'Sim Live' : 'Run Scenario'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                {/* Main Status Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Energy Matrix Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sun size={64} />
                            </div>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Generation</span>
                            <div className="text-4xl font-black text-emerald-400 mt-2">{status.generationKw.toFixed(2)} kW</div>
                            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <Activity size={12} className="text-emerald-500" />
                                Peak efficiency today
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ArrowDownCircle size={64} />
                            </div>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Current Load</span>
                            <div className="text-4xl font-black text-amber-400 mt-2">{status.currentLoadKw.toFixed(2)} kW</div>
                            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <Power size={12} className="text-amber-500" />
                                12 active systems
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Battery size={64} />
                            </div>
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Battery Bank</span>
                            <div className={`text-4xl font-black mt-2 ${currentBattery < 20 ? 'text-red-500' : 'text-cyan-400'}`}>
                                {currentBattery.toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                {getBatteryIcon()}
                                {status.isGridDown ? 'Discharging' : 'Optimized'}
                            </div>
                        </div>
                    </div>

                    {/* Critical Run-Time Visualizer */}
                    <div className="bg-slate-900 rounded-3xl border border-white/5 p-8 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1 space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Timer className="text-primary" />
                                    Life-Support Run-Time Estimate
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    Predicted duration for current load based on battery discharge rate and local weather forecasting.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">At Current Load</span>
                                        <div className="text-2xl font-black text-white">
                                            {hoursRemaining === Infinity ? '∞' : `${hoursRemaining.toFixed(1)}h`}
                                        </div>
                                    </div>
                                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Critical Only</span>
                                        <div className="text-2xl font-black text-emerald-400">
                                            {(hoursRemaining * 2.5).toFixed(1)}h
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-48 h-48 relative flex items-center justify-center">
                                <svg className="w-full h-full rotate-[-90deg]">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="84"
                                        className="stroke-slate-800"
                                        strokeWidth="12"
                                        fill="none"
                                    />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="84"
                                        className={`transition-all duration-1000 ${currentBattery < 20 ? 'stroke-red-500' : 'stroke-primary'}`}
                                        strokeWidth="12"
                                        fill="none"
                                        strokeDasharray={527.7}
                                        strokeDashoffset={527.7 - (527.7 * currentBattery) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black">{currentBattery.toFixed(0)}%</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Reserve</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Load Management Table */}
                    <div className="bg-slate-900 rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <Lightbulb className="text-amber-400" />
                                Active Load Management
                            </h3>
                            <div className="px-3 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-500/20">
                                Load Shedding Enabled
                            </div>
                        </div>
                        <div className="divide-y divide-white/5">
                            {status.assets.map(asset => (
                                <div key={asset.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${asset.type === 'Critical' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {asset.name.toLowerCase().includes('water') ? <Droplets size={20} /> : asset.name.toLowerCase().includes('fan') ? <Wind size={20} /> : <Zap size={20} />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{asset.name}</div>
                                            <div className="text-[10px] text-slate-500 uppercase font-medium">{asset.type} • {asset.powerDrawKw}kW Draw</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onToggleAsset(asset.id)}
                                        disabled={asset.type === 'Critical'}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${asset.status === 'Active'
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            } ${asset.type === 'Critical' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                                    >
                                        {asset.status === 'Active' ? <Power size={14} /> : <PowerOff size={14} />}
                                        {asset.status === 'Active' ? 'ACTIVE' : 'SHED'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Intelligence Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 space-y-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <Activity className="text-primary" />
                            Health & Alerts
                        </h3>
                        <div className="space-y-3">
                            {criticalIssues.length > 0 ? (
                                criticalIssues.map((issue, i) => (
                                    <div key={i} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3">
                                        <AlertTriangle className="text-red-400 flex-shrink-0" size={18} />
                                        <span className="text-xs text-red-200 font-medium leading-relaxed">{issue}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex gap-3">
                                    <Activity className="text-emerald-400 flex-shrink-0" size={18} />
                                    <span className="text-xs text-emerald-200 font-medium leading-relaxed">All systems nominal. Battery bank at optimal temp.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/20 to-cyan-500/20 p-6 rounded-3xl border border-primary/20 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white">Zim-Grid Status</h3>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${status.isGridDown ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        </div>
                        <div className="text-xs text-slate-300 leading-relaxed">
                            {status.isGridDown
                                ? "Local ZETDC substation reporting fault in Mashingaidze area. Restoration expected in 4-6 hours."
                                : "Grid active. Surplus generation being fed back via net metering."}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 space-y-6">
                        <h3 className="font-bold">Sustainability Metrics</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-500 font-medium">Solar Reliance</span>
                                    <span className="text-emerald-400 font-bold">92%</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-400 w-[92%]" />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <div className="text-xs text-slate-500">CO2 Displaced (MT)</div>
                                <div className="text-2xl font-black text-white mt-1">14.82</div>
                                <div className="text-[10px] text-emerald-400 font-bold mt-1 tracking-wider uppercase">Equiv. 242 Trees</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EnergyDashboard;
