import React, { useState } from 'react';
import { InventoryScan, FeedInventory, MedicalItem } from '../types';
import { QrCode, Camera, CheckCircle, X, ChevronRight, Package, ShieldCheck, Zap, History, Layout, Database } from 'lucide-react';

interface InventoryQRScannerProps {
    feeds: FeedInventory[];
    medicalItems: MedicalItem[];
    onLogScan: (scan: InventoryScan) => void;
    onBack?: () => void;
}

const InventoryQRScanner: React.FC<InventoryQRScannerProps> = ({
    feeds,
    medicalItems,
    onLogScan,
    onBack
}) => {
    const [scannedItem, setScannedItem] = useState<any | null>(null);
    const [scanQuantity, setScanQuantity] = useState('1');
    const [scanType, setScanType] = useState<'Inbound' | 'Usage' | 'Stocktake'>('Usage');
    const [isScanning, setIsScanning] = useState(false);
    const [recentScans, setRecentScans] = useState<InventoryScan[]>([]);

    const handleSimulateScan = () => {
        setIsScanning(true);
        // Simulate a delay for "finding" a QR code
        setTimeout(() => {
            const randomFeed = feeds[Math.floor(Math.random() * feeds.length)];
            setScannedItem(randomFeed);
            setIsScanning(false);
        }, 1500);
    };

    const handleConfirmScan = () => {
        if (!scannedItem) return;

        const newScan: InventoryScan = {
            id: `scan-${Date.now()}`,
            itemId: scannedItem.id,
            type: scanType,
            quantity: parseFloat(scanQuantity),
            timestamp: new Date().toLocaleTimeString(),
            scannedBy: 'Operational Lead',
            location: 'Main Silo Complex'
        };

        onLogScan(newScan);
        setRecentScans([newScan, ...recentScans].slice(0, 5));
        setScannedItem(null);
        setScanQuantity('1');
    };

    return (
        <div className="bg-[#0f172a] min-h-screen text-white animate-in fade-in duration-500">
            <div className="max-w-xl mx-auto p-8 relative min-h-screen flex flex-col">

                {/* Mobile-Style Header */}
                <header className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button onClick={onBack} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all">
                                <i className="fas fa-arrow-left text-xs text-white/40"></i>
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter">QR Input Logger</h2>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Stock Precision v2.4</p>
                        </div>
                    </div>
                    <div className="w-14 h-14 bg-blue-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                        <QrCode size={24} />
                    </div>
                </header>

                {/* Simulated Camera Viewfinder */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-full aspect-square max-w-[320px] relative">
                        {/* Frame Corners */}
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl"></div>
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-3xl"></div>

                        <div className="absolute inset-4 bg-slate-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                            {isScanning ? (
                                <div className="text-center animate-pulse">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/50">
                                        <Camera className="text-blue-500" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Scanning Barcode...</p>
                                </div>
                            ) : scannedItem ? (
                                <div className="text-center px-10 animate-in zoom-in-95 duration-300">
                                    <div className="w-16 h-16 bg-ecomattGreen/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-ecomattGreen/50">
                                        <CheckCircle className="text-ecomattGreen" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight">{scannedItem.name}</h3>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Found in Inventory</p>
                                </div>
                            ) : (
                                <div className="text-center opacity-40">
                                    <QrCode size={48} className="mx-auto mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Align QR Code in Frame</p>
                                </div>
                            )}

                            {/* Scanline Animation */}
                            {isScanning && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan"></div>
                            )}
                        </div>
                    </div>

                    {!scannedItem && !isScanning && (
                        <button
                            onClick={handleSimulateScan}
                            className="mt-12 px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                        >
                            Trigger Scanner
                        </button>
                    )}
                </div>

                {/* Input Details Modal-ish Panel */}
                {scannedItem && (
                    <div className="bg-slate-900 rounded-[3rem] p-8 border border-white/5 animate-in slide-in-from-bottom-5 duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Batch Identification</h4>
                                <p className="text-sm font-black uppercase">{scannedItem.id}</p>
                            </div>
                            <button onClick={() => setScannedItem(null)} className="text-white/20 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-2">
                                {['Inbound', 'Usage', 'Stocktake'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setScanType(type as any)}
                                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all border ${scanType === type ? 'bg-blue-500 border-transparent' : 'bg-white/5 border-white/5 text-white/40'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                                    <label className="text-[9px] font-black text-white/30 uppercase block mb-2">Quantity Logged</label>
                                    <input
                                        type="number"
                                        value={scanQuantity}
                                        onChange={(e) => setScanQuantity(e.target.value)}
                                        className="w-full bg-transparent text-2xl font-black text-white outline-none"
                                    />
                                </div>
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
                                    <label className="text-[9px] font-black text-white/30 uppercase block mb-1">Stock on Hand</label>
                                    <p className="text-xl font-black text-ecomattGreen">{scannedItem.quantityKg} <span className="text-[10px] opacity-40">kg</span></p>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmScan}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98]"
                            >
                                Commit Transaction
                            </button>
                        </div>
                    </div>
                )}

                {/* History Quick-View */}
                {!scannedItem && !isScanning && (
                    <div className="mt-auto pt-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
                                <History size={12} /> Recent Transactions
                            </h3>
                            <ChevronRight size={14} className="text-white/20" />
                        </div>
                        <div className="space-y-3">
                            {recentScans.length > 0 ? recentScans.map(scan => {
                                const item = feeds.find(f => f.id === scan.itemId) || medicalItems.find(m => m.id === scan.itemId);
                                return (
                                    <div key={scan.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 border border-white/5">
                                                {scan.type === 'Usage' ? <Zap size={16} /> : <Database size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-tight">{item?.name || 'Unknown Item'}</p>
                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{scan.timestamp} • {scan.type}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-black ${scan.type === 'Usage' ? 'text-red-400' : 'text-ecomattGreen'}`}>{scan.type === 'Usage' ? '-' : '+'}{scan.quantity}</p>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="p-8 text-center text-white/10 italic text-[10px] font-bold uppercase tracking-widest">No active session history</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0% }
                    100% { top: 100% }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                    position: absolute;
                }
            `}</style>
        </div>
    );
};

export default InventoryQRScanner;
