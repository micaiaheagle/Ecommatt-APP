
import React, { useState } from 'react';
import { FinanceRecord, BudgetRecord } from '../types';

interface BudgetAnalysisProps {
  records: FinanceRecord[];
  budgets: BudgetRecord[];
  onCancel: () => void;
}

const BudgetAnalysis: React.FC<BudgetAnalysisProps> = ({ records, budgets, onCancel }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // 1. Calculate Actuals per Category
  const actualsByCategory = records
    .filter(r => r.type === 'Expense' && r.status === 'Paid')
    .reduce((acc, curr) => {
        const cat = curr.category;
        if (!acc[cat]) acc[cat] = { total: 0, items: [] };
        acc[cat].total += curr.amount;
        acc[cat].items.push(curr);
        return acc;
    }, {} as Record<string, { total: number, items: FinanceRecord[] }>);

  // 2. Merge with Budgets to ensure all tracked categories are shown
  const categories = Array.from(new Set([
      ...budgets.map(b => b.category),
      ...Object.keys(actualsByCategory)
  ]));

  // Calculate Totals
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalActual = Object.values(actualsByCategory).reduce((sum, cat) => sum + cat.total, 0);
  const totalVariance = totalBudget - totalActual;

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
        <h2 className="text-xl font-bold text-gray-900">Budget Analysis</h2>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Monthly Overview</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded ${totalVariance >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {totalVariance >= 0 ? `$${totalVariance.toLocaleString()} Under` : `$${Math.abs(totalVariance).toLocaleString()} Over`}
              </span>
          </div>
          
          {/* Main Progress Bar */}
          <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Spent: ${totalActual.toLocaleString()}</span>
                  <span>Budget: ${totalBudget.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${totalActual > totalBudget ? 'bg-red-500' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min(100, (totalActual / totalBudget) * 100)}%` }}
                  ></div>
              </div>
          </div>
      </div>

      {/* Categories List */}
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">Department Breakdown</h3>
      <div className="space-y-3">
          {categories.map(category => {
              const budget = budgets.find(b => b.category === category)?.amount || 0;
              const actualData = actualsByCategory[category] || { total: 0, items: [] };
              const actual = actualData.total;
              const percent = budget > 0 ? (actual / budget) * 100 : actual > 0 ? 100 : 0;
              const isOver = actual > budget && budget > 0;
              const isExpanded = expandedCategory === category;

              // Color Logic
              let colorClass = 'bg-green-500';
              if (isOver) colorClass = 'bg-red-500';
              else if (percent > 90) colorClass = 'bg-yellow-500';
              else if (percent > 75) colorClass = 'bg-blue-500';

              return (
                  <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedCategory(isExpanded ? null : category)}
                      >
                          <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900 text-sm">{category}</span>
                                  {budget === 0 && <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 rounded">Unbudgeted</span>}
                              </div>
                              <div className="text-right">
                                  <span className={`font-bold text-sm ${isOver ? 'text-red-600' : 'text-gray-900'}`}>${actual.toLocaleString()}</span>
                                  <span className="text-xs text-gray-400"> / ${budget.toLocaleString()}</span>
                              </div>
                          </div>
                          
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                                style={{ width: `${Math.min(100, percent)}%` }}
                              ></div>
                          </div>
                          
                          <div className="flex justify-between mt-1">
                              <span className="text-[10px] text-gray-400">{percent.toFixed(0)}% Used</span>
                              <span className="text-[10px] text-gray-400">
                                  {isExpanded ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                              </span>
                          </div>
                      </div>

                      {/* Expanded Drill-down */}
                      {isExpanded && (
                          <div className="bg-gray-50 border-t border-gray-100 p-3 animate-in slide-in-from-top duration-200">
                              <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">Transactions</h4>
                              {actualData.items.length === 0 ? (
                                  <p className="text-xs text-gray-400 italic">No transactions found.</p>
                              ) : (
                                  <div className="space-y-2">
                                      {actualData.items.map(item => (
                                          <div key={item.id} className="flex justify-between items-center text-xs">
                                              <div>
                                                  <span className="text-gray-700 font-medium">{item.description}</span>
                                                  <span className="text-gray-400 ml-2">{item.date}</span>
                                              </div>
                                              <span className="font-bold text-gray-900">${item.amount.toLocaleString()}</span>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              );
          })}
      </div>

    </div>
  );
};

export default BudgetAnalysis;
