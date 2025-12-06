
import React, { useState, useMemo } from 'react';
import { Product, CartItem, FinanceRecord } from '../types';
import { ShoppingCart, Plus, Minus, Trash2, Printer, CheckCircle, Search } from 'lucide-react';

interface PointOfSaleProps {
    products: Product[];
    onCompleteSale: (items: CartItem[], total: number, paymentMethod: string) => void;
    onCancel: () => void;
}

const PointOfSale: React.FC<PointOfSaleProps> = ({ products, onCompleteSale, onCancel }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastSale, setLastSale] = useState<{ items: CartItem[], total: number, date: string } | null>(null);

    // Filter Products
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    // Cart Logic
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        const total = cartTotal;
        const items = [...cart];

        onCompleteSale(items, total, 'Cash'); // Default to Cash for now
        setLastSale({ items, total, date: new Date().toLocaleString() });
        setShowReceipt(true);
        setCart([]);
    };

    const categories = ['All', 'Pork', 'Live Animal', 'Manure', 'Other'];

    if (showReceipt && lastSale) {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-300">
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 max-w-sm w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Sale Completed!</h2>
                    <p className="text-sm text-gray-500 mb-6">Transaction recorded successfully.</p>

                    <div className="border-t border-b border-dashed border-gray-300 py-4 mb-6">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>Date:</span>
                            <span>{lastSale.date}</span>
                        </div>
                        <div className="space-y-1 mb-4">
                            {lastSale.items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-gray-800">{item.name} x{item.quantity}</span>
                                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                            <span>Total</span>
                            <span>${lastSale.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
                        >
                            <Printer size={18} /> Print
                        </button>
                        <button
                            onClick={() => { setShowReceipt(false); setLastSale(null); }}
                            className="flex-1 bg-ecomattBlack text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition"
                        >
                            Next Sale
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
            {/* Left: Product Catalog */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Search & Filter Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-ecomattGreen focus:ring-1 focus:ring-ecomattGreen transition"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-ecomattGreen text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50/30">
                    {filteredProducts.map(product => (
                        <button
                            key={product.id}
                            onClick={() => addToCart(product)}
                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-ecomattGreen/50 transition-all text-left group flex flex-col h-full"
                        >
                            <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                                {product.category === 'Pork' && '🍖'}
                                {product.category === 'Live Animal' && '🐖'}
                                {product.category === 'Manure' && '🌱'}
                                {product.category === 'Other' && '📦'}
                            </div>
                            <h3 className="font-bold text-gray-900 text-sm leading-tight flex-1">{product.name}</h3>
                            <div className="flex justify-between items-end mt-2">
                                <span className="text-ecomattGreen font-bold">${product.price}/{product.unit}</span>
                                <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-ecomattGreen group-hover:text-white transition-colors">
                                    <Plus size={14} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Cart */}
            <div className="w-96 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={20} className="text-ecomattGreen" />
                        <h2 className="font-bold">Current Order</h2>
                    </div>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded font-mono">{cart.length} items</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                    {cart.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <ShoppingCart size={48} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">Cart is empty</p>
                            <p className="text-xs mt-1">Select items to start sale</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                                    {item.category === 'Pork' && '🍖'}
                                    {item.category === 'Live Animal' && '🐖'}
                                    {item.category === 'Manure' && '🌱'}
                                    {item.category === 'Other' && '📦'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                                    <p className="text-xs text-gray-500">${item.price}/{item.unit}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition"><Minus size={12} /></button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-gray-600 transition"><Plus size={12} /></button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-white border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 text-sm">Subtotal</span>
                        <span className="font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 text-sm">Tax (0%)</span>
                        <span className="font-bold text-gray-900">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-dashed border-gray-200">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-ecomattGreen">${cartTotal.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full bg-ecomattBlack text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Review & Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PointOfSale;
