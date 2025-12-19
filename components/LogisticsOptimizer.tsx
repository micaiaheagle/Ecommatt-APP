import React, { useState } from 'react';
import { LogisticsRoute, Asset } from '../types';
import { Truck, MapPin, Clock, Navigation, CheckCircle, AlertCircle, ChevronRight, Play, Pause, MoreVertical, Fuel, Settings } from 'lucide-react';

interface LogisticsOptimizerProps {
    routes: LogisticsRoute[];
    assets: Asset[];
    onUpdateRoute: (route: LogisticsRoute) => void;
    onBack?: () => void;
}

const LogisticsOptimizer: React.FC<LogisticsOptimizerProps> = ({
    routes,
    assets,
    onUpdateRoute,
    onBack
}) => {
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(routes[0]?.id || null);

    const selectedRoute = routes.find(r => r.id === selectedRouteId);

    const stats = {
        active: routes.filter(r => r.status === 'En Route').length,
        completed: routes.filter(r => r.status === 'Completed').length,
        maintenance: assets.filter(a => a.status === 'Maintenance').length
    };

    const handleStopToggle = (routeId: string, stopIdx: number) => {
        const route = routes.find(r => r.id === routeId);
        if (!route) return;

        const newStops = [...route.stops];
        const stop = newStops[stopIdx];

        if (stop.status === 'Pending') {
            stop.status = 'Completed';
            stop.arrivalTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            stop.status = 'Pending';
            delete stop.arrivalTime;
        }

        onUpdateRoute({ ...route, stops: newStops });
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen animate-in fade-in duration-500">
            <div className="p-8 max-w-[1600px] mx-auto">

                {/* Header Area */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {onBack && (
                                <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                                    <i className="fas fa-arrow-left text-xs"></i>
                                </button>
                            )}
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg">
                                <Navigation size={14} className="animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Live Logistics Ops</span>
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Fleet & Supply Optimizer</h2>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                            <div className="px-6 py-2 border-r border-slate-100 text-center">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active</div>
                                <div className="text-xl font-black text-blue-600">{stats.active}</div>
                            </div>
                            <div className="px-6 py-2 border-r border-slate-100 text-center">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Done</div>
                                <div className="text-xl font-black text-ecomattGreen">{stats.completed}</div>
                            </div>
                            <div className="px-6 py-2 text-center">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fleet Alert</div>
                                <div className="text-xl font-black text-red-500">{stats.maintenance}</div>
                            </div>
                        </div>
                        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-105 transition-all active:scale-95">
                            New Dispatch
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Panel: Active Route List */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Waypoints</h3>
                            <button className="text-[10px] font-black text-blue-500 uppercase">View All Assets</button>
                        </div>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar pr-2">
                            {routes.map(route => {
                                const vehicle = assets.find(a => a.id === route.vehicleId);
                                const progress = (route.stops.filter(s => s.status === 'Completed').length / route.stops.length) * 100;

                                return (
                                    <button
                                        key={route.id}
                                        onClick={() => setSelectedRouteId(route.id)}
                                        className={`w-full p-6 bg-white rounded-[2rem] border-2 transition-all text-left group relative overflow-hidden ${selectedRouteId === route.id ? 'border-slate-900 shadow-2xl scale-[1.02]' : 'border-transparent shadow-sm hover:border-slate-200'}`}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${selectedRouteId === route.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                                    <Truck size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 uppercase tracking-tight">{route.driverName}</h4>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vehicle?.name || 'Heavy Duty Truck'}</p>
                                                </div>
                                            </div>
                                            <div className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest ${route.status === 'En Route' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                                {route.status}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-[11px] font-black text-slate-900 uppercase">
                                                <span>{route.stops[0].locationName}</span>
                                                <ChevronRight size={14} className="text-slate-300" />
                                                <span>{route.stops[route.stops.length - 1].locationName}</span>
                                            </div>

                                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${selectedRouteId === route.id ? 'bg-blue-500' : 'bg-slate-300'}`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                                                    <Clock size={12} />
                                                    ETA: {route.eta}
                                                </div>
                                                <div className="text-[10px] font-black text-slate-900">
                                                    {route.stops.filter(s => s.status === 'Completed').length}/{route.stops.length} STOPS
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Panel: Live Tracking & Manifest */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* Mock Live Map / Visualization */}
                        <div className="bg-slate-900 rounded-[2.5rem] h-[400px] relative overflow-hidden group shadow-2xl">
                            {/* Grid Watermark */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center relative">
                                    <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center animate-ping absolute -inset-0 opacity-20"></div>
                                    <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center text-white shadow-3xl shadow-blue-500 relative z-10 animate-bounce">
                                        <Truck size={32} />
                                    </div>
                                    <div className="mt-8">
                                        <div className="text-white font-black text-2xl tracking-tighter uppercase">{selectedRoute?.driverName}'s Unit</div>
                                        <div className="text-blue-400 text-[10px] font-black tracking-widest uppercase mt-1">Harare Main Corridor • {selectedRoute?.currentLat.toFixed(4)}, {selectedRoute?.currentLng.toFixed(4)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Floating Controls */}
                            <div className="absolute top-8 right-8 flex flex-col gap-3">
                                <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/5">
                                    <Fuel size={20} />
                                </button>
                                <button className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/5">
                                    <Settings size={20} />
                                </button>
                            </div>

                            {/* Live Telemetry Bar */}
                            <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-xl border-t border-white/10 p-6 flex justify-around">
                                <div className="text-center">
                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Speed</div>
                                    <div className="text-xl font-black text-white">64 <span className="text-[10px] text-white/40">KM/H</span></div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Fuel Range</div>
                                    <div className="text-xl font-black text-ecomattGreen">420 <span className="text-[10px] text-white/40">KM</span></div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Payload</div>
                                    <div className="text-xl font-black text-white">4.2 <span className="text-[10px] text-white/40">TONS</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Route manifest */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex-1">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                        <Navigation className="text-blue-500" /> Manifest & Waypoints
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Route ID: {selectedRoute?.id}</p>
                                </div>
                                <button className="p-3 hover:bg-slate-50 rounded-xl transition-all">
                                    <MoreVertical size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {selectedRoute?.stops.map((stop, idx) => (
                                    <div key={idx} className="flex gap-8 relative group">
                                        {/* Line Decorator */}
                                        {idx !== selectedRoute.stops.length - 1 && (
                                            <div className="absolute left-6 top-10 bottom-[-24px] w-[2px] bg-slate-100">
                                                <div className={`w-full h-full transition-all duration-1000 ${stop.status === 'Completed' ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                            </div>
                                        )}

                                        {/* Stop Node */}
                                        <div className="relative z-10">
                                            <button
                                                onClick={() => handleStopToggle(selectedRoute.id, idx)}
                                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${stop.status === 'Completed' ? 'bg-blue-500 text-white shadow-lg shadow-blue-100 scale-110' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-200'}`}
                                            >
                                                {stop.status === 'Completed' ? <CheckCircle size={20} /> : <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-400"></div>}
                                            </button>
                                        </div>

                                        {/* Stop Context */}
                                        <div className="flex-1 flex justify-between items-center py-2">
                                            <div>
                                                <h5 className={`font-black uppercase tracking-tight ${stop.status === 'Completed' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'} transition-colors`}>{stop.locationName}</h5>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${stop.type === 'Abattoir' ? 'bg-orange-50 text-orange-600' : stop.type === 'Pickup' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                        {stop.type}
                                                    </span>
                                                    {stop.arrivalTime && (
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                            <Clock size={10} /> {stop.arrivalTime}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="px-4 py-2 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Details</button>
                                                {stop.status === 'Pending' && (
                                                    <button
                                                        onClick={() => handleStopToggle(selectedRoute.id, idx)}
                                                        className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsOptimizer;
