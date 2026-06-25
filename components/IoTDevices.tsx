import React from 'react';

const IoTDevices: React.FC = () => {
    return (
        <div className="animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">IoT & Sensors</h2>
                    <p className="text-sm text-gray-500">Live environmental monitoring and smart hardware</p>
                </div>
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                    <i className="fas fa-plug"></i> Pair Device
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Device Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-gray-900">Farrowing House A</h3>
                            <p className="text-xs text-gray-500">Env Sensor (Model X)</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1"><i className="fas fa-thermometer-half text-orange-500"></i> Temp</p>
                            <p className="text-xl font-mono font-bold text-gray-900">22.4°C</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1"><i className="fas fa-tint text-blue-500"></i> Humidity</p>
                            <p className="text-xl font-mono font-bold text-gray-900">54%</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl col-span-2">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1"><i className="fas fa-wind text-gray-400"></i> Ammonia (NH3)</p>
                            <p className="text-xl font-mono font-bold text-gray-900">12 ppm <span className="text-xs text-green-600 font-normal">Safe</span></p>
                        </div>
                    </div>
                </div>

                {/* Device Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-300"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-gray-900">Grower Pen 3</h3>
                            <p className="text-xs text-gray-500">Smart Feeder</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span> Offline
                        </span>
                    </div>
                    <div className="p-4 text-center">
                        <i className="fas fa-wifi text-gray-300 text-3xl mb-2"></i>
                        <p className="text-sm text-gray-500">Device disconnected 2 hours ago. Check power or network.</p>
                        <button className="text-blue-500 text-xs font-bold mt-2 hover:underline">Troubleshoot</button>
                    </div>
                </div>

                {/* Device Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-gray-900">Silo 1 (Maize)</h3>
                            <p className="text-xs text-gray-500">Level Sensor</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-6 p-2">
                        <div className="w-12 h-32 bg-gray-100 rounded-lg relative overflow-hidden border border-gray-200">
                            <div className="absolute bottom-0 w-full bg-yellow-400" style={{ height: '75%' }}></div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase mb-1">Current Level</p>
                            <p className="text-3xl font-mono font-bold text-gray-900">75%</p>
                            <p className="text-sm text-gray-600 mt-1">~ 18.5 Tons</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default IoTDevices;
