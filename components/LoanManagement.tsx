
import React, { useState } from 'react';
import { LoanRecord } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface LoanManagementProps {
  loans: LoanRecord[];
  onCancel: () => void;
}

const LoanManagement: React.FC<LoanManagementProps> = ({ loans, onCancel }) => {
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(loans.length > 0 ? loans[0].id : null);
  const [extraPayment, setExtraPayment] = useState(100); // For calculator

  const selectedLoan = loans.find(l => l.id === selectedLoanId);

  // --- Calculations for Calculator ---
  const calculateSavings = () => {
      if (!selectedLoan) return { savedInterest: 0, monthsSaved: 0 };
      
      const rate = (selectedLoan.interestRate / 100) / 12;
      const currentPayment = selectedLoan.monthlyPayment;
      const newPayment = currentPayment + extraPayment;
      
      // Basic Amortization Estimate (Simplified)
      // N = -log(1 - (r * P) / A) / log(1 + r)
      const currentMonths = -Math.log(1 - (rate * selectedLoan.balance) / currentPayment) / Math.log(1 + rate);
      const newMonths = -Math.log(1 - (rate * selectedLoan.balance) / newPayment) / Math.log(1 + rate);
      
      const monthsSaved = Math.max(0, currentMonths - newMonths);
      const totalInterestCurrent = (currentPayment * currentMonths) - selectedLoan.balance;
      const totalInterestNew = (newPayment * newMonths) - selectedLoan.balance;
      const savedInterest = Math.max(0, totalInterestCurrent - totalInterestNew);

      return {
          savedInterest: savedInterest,
          monthsSaved: monthsSaved
      };
  };

  const savings = calculateSavings();

  // --- Total Stats ---
  const totalDebt = loans.filter(l => l.status === 'Active').reduce((sum, l) => sum + l.balance, 0);
  const totalMonthly = loans.filter(l => l.status === 'Active').reduce((sum, l) => sum + l.monthlyPayment, 0);

  // --- Chart Data (Principal vs Interest Remaining) ---
  // This is a rough estimate for visualization
  const principalPortion = selectedLoan ? selectedLoan.balance : 0;
  const estimatedInterestRemaining = selectedLoan 
    ? (selectedLoan.monthlyPayment * (selectedLoan.termMonths - (selectedLoan.principal - selectedLoan.balance)/ (selectedLoan.principal/selectedLoan.termMonths))) - selectedLoan.balance 
    : 0;
    // Note: The above is a very rough approximation. Real amortization is non-linear.
    // For visual purposes, let's use a simpler static ratio based on rate for the prototype.
  
  const chartData = [
      { name: 'Principal', value: principalPortion, color: '#3b82f6' },
      { name: 'Interest Cost', value: Math.max(0, principalPortion * (selectedLoan?.interestRate || 0) / 100 * 0.5), color: '#f1b103' }
  ];

  return (
    <div className="animate-in slide-in-from-right duration-300 bg-grayBg min-h-full pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
            onClick={onCancel}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50"
        >
            <i className="fas fa-arrow-left"></i>
        </button>
        <h2 className="text-xl font-bold text-gray-900">Loan Manager</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-bold">Total Debt</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">${totalDebt.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-bold">Monthly Bill</p>
              <h3 className="text-2xl font-bold text-red-500 mt-1">${totalMonthly.toLocaleString()}</h3>
          </div>
      </div>

      {/* Active Loans List */}
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Active Loans</h3>
      <div className="space-y-3 mb-8">
          {loans.map(loan => (
              <div 
                key={loan.id} 
                onClick={() => setSelectedLoanId(loan.id)}
                className={`bg-white p-4 rounded-2xl shadow-sm border cursor-pointer transition-all ${selectedLoanId === loan.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/10' : 'border-gray-100 hover:border-blue-200'}`}
              >
                  <div className="flex justify-between items-start mb-3">
                      <div>
                          <h4 className="font-bold text-gray-900">{loan.lender}</h4>
                          <span className="text-xs text-gray-500">{loan.interestRate}% APR • {loan.termMonths} Months</span>
                      </div>
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">
                          Active
                      </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Paid: ${((loan.principal - loan.balance).toFixed(0))}</span>
                          <span className="font-bold text-gray-900">${loan.balance.toLocaleString()} Left</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${((loan.principal - loan.balance) / loan.principal) * 100}%` }}
                          ></div>
                      </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-50">
                      <span className="text-gray-400">Next Payment: <span className="text-gray-700 font-bold">{loan.nextPaymentDate}</span></span>
                      <span className="font-bold text-red-500">${loan.monthlyPayment}</span>
                  </div>
              </div>
          ))}
          {loans.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No active loans.</p>}
      </div>

      {/* Early Payment Calculator */}
      {selectedLoan && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
              
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">Payoff Accelerator</h3>
                  <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                      <i className="fas fa-calculator"></i>
                  </div>
              </div>

              <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold text-gray-600">Extra Monthly Pay</span>
                      <span className="font-bold text-green-600">+${extraPayment}</span>
                  </div>
                  <input 
                      type="range" 
                      min="0" 
                      max="1000" 
                      step="50"
                      value={extraPayment}
                      onChange={(e) => setExtraPayment(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>$0</span>
                      <span>$1,000</span>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                      <span className="block text-[10px] text-gray-500 uppercase font-bold">Interest Saved</span>
                      <span className="block text-xl font-bold text-green-600 mt-1">
                          ${savings.savedInterest.toFixed(0)}
                      </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                      <span className="block text-[10px] text-gray-500 uppercase font-bold">Time Saved</span>
                      <span className="block text-xl font-bold text-blue-600 mt-1">
                          {Math.floor(savings.monthsSaved)} <span className="text-xs text-gray-400">mos</span>
                      </span>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default LoanManagement;
