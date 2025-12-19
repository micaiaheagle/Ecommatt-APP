import React, { useState } from 'react';

interface TaxCalculatorProps {
    onCancel: () => void;
    monthlyRevenue: number;
}

const TaxCalculator: React.FC<TaxCalculatorProps> = ({ onCancel, monthlyRevenue }) => {
    const [revenue, setRevenue] = useState(monthlyRevenue.toString());

    // Zim Tax Logic (Simplified)
    // VAT: 15%
    // IMTT (Intermediated Money Transfer Tax): 2% (USD) or 1% (ZiG) - simplified to 2%
    // Corporate Tax: 24%

    const rev = parseFloat(revenue) || 0;
    const vat = rev * 0.15;
    const imtt = rev * 0.02;
    const taxableIncome = rev * 0.3; // Simplified: Assuming 70% expenses
    const corporateTax = taxableIncome * 0.24;

    const totalTax = vat + imtt + corporateTax;

    return (
        <div className="animate-in slide-in-from-bottom duration-500 bg-gray-50 min-h-screen p-4 pb-24">
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={onCancel}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm border border-gray-100"
                >
                    <i className="fas fa-arrow-left"></i>
                </button>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Tax Compliance</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Zimra Estimates</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-6">
                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1 mb-2 block">Monthly Revenue (USD)</label>
                <div className="relative mb-8">
                    <span className="absolute left-0 top-0 text-4xl font-black text-gray-200">$</span>
                    <input
                        type="number"
                        className="w-full bg-transparent border-b-2 border-gray-100 py-2 pl-8 text-5xl font-black focus:border-ecomattGreen outline-none transition-all"
                        value={revenue}
                        onChange={(e) => setRevenue(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                        <div>
                            <p className="text-sm font-black text-gray-700">VAT (15%)</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Value Added Tax on Sales</p>
                        </div>
                        <p className="text-lg font-black text-gray-900">${vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                        <div>
                            <p className="text-sm font-black text-gray-700">IMTT (2%)</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Money Transfer Tax Estimate</p>
                        </div>
                        <p className="text-lg font-black text-gray-900">${imtt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                        <div>
                            <p className="text-sm font-black text-gray-700">Income Tax (Est.)</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Based on 30% Margin @ 24%</p>
                        </div>
                        <p className="text-lg font-black text-gray-900">${corporateTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Total Provision</h3>
                        <p className="text-3xl font-black text-red-500">${totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold text-right mt-1">*This is an estimate for budgeting purposes only.</p>
                </div>
            </div>

            <div className="bg-blue-900 rounded-[2rem] p-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <i className="fas fa-info-circle text-blue-300"></i>
                    <p className="text-xs font-black uppercase tracking-widest">Tax Tip</p>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                    Ensure all your expense receipts are VAT-compliant to claim input tax credits. This could reduce your monthly VAT liability by up to <span className="text-ecomattYellow font-black">40%</span>.
                </p>
            </div>

            <button className="w-full mt-6 bg-white border-2 border-gray-900 text-gray-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-all">
                <i className="fas fa-download"></i> EXPORT TAX REPORT
            </button>
        </div>
    );
};

export default TaxCalculator;
