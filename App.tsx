
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PigManager from './components/PigManager';
import PigForm from './components/PigForm';
import PigProfile from './components/PigProfile';
import Operations from './components/Operations';
import FeedLogger from './components/FeedLogger';
import FeedFormulator from './components/FeedFormulator';
import Finance from './components/Finance';
import FinanceLogger from './components/FinanceLogger';
import BatchProfitability from './components/BatchProfitability';
import ProfitCalculator from './components/ProfitCalculator';
import CashFlowForecast from './components/CashFlowForecast';
import BudgetAnalysis from './components/BudgetAnalysis';
import LoanManagement from './components/LoanManagement';
import CostAnalysis from './components/CostAnalysis'; 
import FinancialRatios from './components/FinancialRatios';
import IntelligentCore from './components/IntelligentCore'; 
import BreedingAI from './components/BreedingAI'; 
import SlaughterOptimizer from './components/SlaughterOptimizer'; 
import CriticalWatch from './components/CriticalWatch'; 
import SmartAssistant from './components/SmartAssistant';
import Login from './components/Login';
import Settings from './components/Settings';
import EmailAlertsSetup from './components/EmailAlertsSetup'; // New
import Onboarding from './components/Onboarding';
import { Pig, Task, PigStatus, PigStage, FeedInventory, HealthRecord, FinanceRecord, BudgetRecord, LoanRecord, ViewState, User, UserRole, TimelineEvent, NotificationConfig } from './types';
import { loadData, saveData, STORAGE_KEYS } from './services/storageService';

// Mock Data (Used as initial seed only)
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

const SEED_PIGS: Pig[] = [
  { 
      id: '1', 
      tagId: 'EF-8842', 
      breed: 'Large White', 
      dob: '2023-01-15', 
      gender: 'Female', 
      stage: PigStage.Sow, 
      status: PigStatus.Pregnant, 
      penLocation: 'Pen 3B', 
      weight: 210, 
      imageUrl: '',
      sireId: 'LW-900',
      damId: 'LW-330',
      lastFed: 'Today 08:00 AM',
      timeline: [
          { id: 'e1', date: '2025-11-20', title: 'Routine Checkup', subtitle: 'Weight check', color: 'green', status: 'Pending' },
          { id: 'e2', date: '2025-11-10', title: 'Artificial Insemination', subtitle: 'Service 1 • Boar: #D-900', color: 'yellow', status: 'Completed' },
          { id: 'e3', date: '2025-10-15', title: 'Weaning (Litter 3)', subtitle: '10 Piglets • Moved to Pen 2', color: 'blue', status: 'Completed' }
      ]
  },
  { id: '2', tagId: 'EF-9001', breed: 'Duroc', dob: '2023-02-20', gender: 'Male', stage: PigStage.Boar, status: PigStatus.Active, penLocation: 'Pen 1A', weight: 210, sireId: 'D-100', damId: 'D-055', lastFed: 'Today 07:45 AM' },
  { id: '3', tagId: 'EF-003', breed: 'Landrace', dob: '2023-06-10', gender: 'Female', stage: PigStage.Grower, status: PigStatus.Sick, penLocation: 'Isolation', weight: 65, notes: 'Coughing', lastFed: 'Today 09:00 AM' },
  { id: '4', tagId: 'EF-004', breed: 'Large White', dob: '2023-07-01', gender: 'Male', stage: PigStage.Weaner, status: PigStatus.Active, penLocation: 'Pen C2', weight: 25, lastFed: 'Yesterday 04:00 PM' },
  { id: '5', tagId: 'EF-005', breed: 'Large White', dob: '2023-10-01', gender: 'Female', stage: PigStage.Piglet, status: PigStatus.Active, penLocation: 'Pen F1', weight: 12, lastFed: 'Today 10:00 AM' },
  { id: '6', tagId: 'EF-006', breed: 'Duroc', dob: '2023-10-01', gender: 'Male', stage: PigStage.Piglet, status: PigStatus.Active, penLocation: 'Pen F1', weight: 13, lastFed: 'Today 10:00 AM' },
  { id: '7', tagId: 'EF-007', breed: 'Large White', dob: '2025-05-20', gender: 'Female', stage: PigStage.Finisher, status: PigStatus.Active, penLocation: 'Pen F2', weight: 85, lastFed: 'Today 10:00 AM' },
  { id: '8', tagId: 'EF-008', breed: 'Large White', dob: '2025-05-20', gender: 'Male', stage: PigStage.Finisher, status: PigStatus.Active, penLocation: 'Pen F2', weight: 88, lastFed: 'Today 10:00 AM' },
];

const SEED_TASKS: Task[] = [
  { id: 't1', title: 'Administer Iron', dueDate: today, priority: 'High', status: 'Pending', type: 'Medical' },
  { id: 't2', title: 'Pregnancy Scan', dueDate: yesterday, priority: 'Low', status: 'Completed', type: 'Repro' },
  { id: 't3', title: 'Order Grower Pellets', dueDate: tomorrow, priority: 'Medium', status: 'Pending', type: 'Procurement' },
  { id: 't4', title: 'Pen Cleaning Routine', dueDate: today, priority: 'Medium', status: 'Pending', type: 'Hygiene' },
  { id: 't5', title: 'Market Weight Check', dueDate: tomorrow, priority: 'High', status: 'Pending', type: 'Sales' },
];

const SEED_FEEDS: FeedInventory[] = [
  { id: 'f1', name: 'Sow Meal', type: 'Meal', quantityKg: 450, reorderLevel: 200, lastRestock: 'Nov 1' },
  { id: 'f2', name: 'Grower Pellets', type: 'Pellets', quantityKg: 150, reorderLevel: 300, lastRestock: 'Oct 20' },
  { id: 'f3', name: 'Creep Feed', type: 'Crumble', quantityKg: 80, reorderLevel: 50, lastRestock: 'Nov 10' },
];

const SEED_HEALTH: HealthRecord[] = [
  { id: 'h1', pigId: 'EF-003', date: 'Nov 20', type: 'Treatment', description: 'Swine Flu', medication: 'Oxytetracycline', administeredBy: 'Sarah' },
  { id: 'h2', pigId: 'EF-8842', date: 'Nov 15', type: 'Vaccination', description: 'Parvo', administeredBy: 'John' },
];

const SEED_FINANCE: FinanceRecord[] = [
  { id: 'fin1', date: '2025-11-15', type: 'Income', category: 'Sales', amount: 1200, description: 'Pork Sales Batch #21', batchId: 'Batch #21', status: 'Paid' },
  { id: 'fin2', date: '2025-11-10', type: 'Expense', category: 'Supplies', amount: 150, description: 'Vet Supplies', status: 'Paid' },
  { id: 'fin3', date: '2025-11-05', type: 'Expense', category: 'Feed', amount: 450, description: 'Sow Meal Bulk', status: 'Paid' },
  // Scheduled Transactions for Forecasting
  { id: 'sched1', date: new Date(Date.now() + (10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], type: 'Expense', category: 'Feed', amount: 800, description: 'Bulk Feed Order', status: 'Scheduled' },
  { id: 'sched2', date: new Date(Date.now() + (25 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], type: 'Expense', category: 'Labor', amount: 1200, description: 'Monthly Wages', status: 'Scheduled' },
];

const SEED_BUDGETS: BudgetRecord[] = [
    { id: 'b1', category: 'Feed', amount: 1000, period: 'Monthly' },
    { id: 'b2', category: 'Labor', amount: 1500, period: 'Monthly' },
    { id: 'b3', category: 'Supplies', amount: 300, period: 'Monthly' },
    { id: 'b4', category: 'Maintenance', amount: 200, period: 'Monthly' },
];

const SEED_LOANS: LoanRecord[] = [
    { 
        id: 'l1', 
        lender: 'AgriBank', 
        principal: 5000, 
        interestRate: 12, 
        startDate: '2025-01-01', 
        termMonths: 12, 
        balance: 4200, 
        monthlyPayment: 450, 
        nextPaymentDate: '2025-12-01', 
        status: 'Active' 
    }
];

// Initial Users
const INITIAL_USERS: User[] = [
    { id: 'u1', name: 'Admin User', email: 'manager@ecomatt.co.zw', role: 'Farm Manager', password: '123456' },
    { id: 'u2', name: 'Mike Herdsman', email: 'herdsman@ecomatt.co.zw', role: 'Herdsman', password: '123456' },
    { id: 'u3', name: 'John Doe', email: 'worker@ecomatt.co.zw', role: 'General Worker', password: '123456' },
    { id: 'u4', name: 'Sarah Vet', email: 'vet@ecomatt.co.zw', role: 'Veterinarian', password: '123456' },
];

const ROLE_PERMISSIONS: Record<UserRole, ViewState[]> = {
    'Farm Manager': [ViewState.Dashboard, ViewState.Pigs, ViewState.Operations, ViewState.Finance, ViewState.AI_Tools, ViewState.Settings],
    'Herdsman': [ViewState.Dashboard, ViewState.Pigs, ViewState.Operations],
    'General Worker': [ViewState.Dashboard, ViewState.Operations],
    'Veterinarian': [ViewState.Dashboard, ViewState.Pigs, ViewState.Operations, ViewState.AI_Tools]
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.Dashboard);
  
  // Data State - Initialize from Storage or Seed
  const [pigs, setPigs] = useState<Pig[]>(() => loadData(STORAGE_KEYS.PIGS, SEED_PIGS));
  const [tasks, setTasks] = useState<Task[]>(() => loadData(STORAGE_KEYS.TASKS, SEED_TASKS));
  const [feeds, setFeeds] = useState<FeedInventory[]>(() => loadData(STORAGE_KEYS.FEEDS, SEED_FEEDS));
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() => loadData(STORAGE_KEYS.HEALTH, SEED_HEALTH));
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>(() => loadData(STORAGE_KEYS.FINANCE, SEED_FINANCE));
  const [budgets, setBudgets] = useState<BudgetRecord[]>(() => loadData('ECOMATT_BUDGET_DB', SEED_BUDGETS));
  const [loans, setLoans] = useState<LoanRecord[]>(() => loadData('ECOMATT_LOANS_DB', SEED_LOANS));
  const [users, setUsers] = useState<User[]>(() => loadData(STORAGE_KEYS.USERS, INITIAL_USERS));
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>(() => loadData(STORAGE_KEYS.NOTIFICATIONS, { emails: [], alerts: { mortality: true, feed: true, tasks: false, finance: false } }));

  // Persistence Effects - Auto Save when state changes
  useEffect(() => saveData(STORAGE_KEYS.PIGS, pigs), [pigs]);
  useEffect(() => saveData(STORAGE_KEYS.TASKS, tasks), [tasks]);
  useEffect(() => saveData(STORAGE_KEYS.FEEDS, feeds), [feeds]);
  useEffect(() => saveData(STORAGE_KEYS.HEALTH, healthRecords), [healthRecords]);
  useEffect(() => saveData(STORAGE_KEYS.FINANCE, financeRecords), [financeRecords]);
  useEffect(() => saveData('ECOMATT_BUDGET_DB', budgets), [budgets]);
  useEffect(() => saveData('ECOMATT_LOANS_DB', loans), [loans]);
  useEffect(() => saveData(STORAGE_KEYS.USERS, users), [users]);
  useEffect(() => saveData(STORAGE_KEYS.NOTIFICATIONS, notificationConfig), [notificationConfig]);
  
  // Navigation State for Pig Module
  const [selectedPig, setSelectedPig] = useState<Pig | null>(null);
  const [isAddingPig, setIsAddingPig] = useState(false);
  const [isEditingPig, setIsEditingPig] = useState(false);
  
  // Operations Navigation State
  const [operationsInitialTab, setOperationsInitialTab] = useState<'Tasks' | 'Feed' | 'Health' | undefined>(undefined);
  const [operationsPigFilter, setOperationsPigFilter] = useState<string | undefined>(undefined);
  const [operationsSubView, setOperationsSubView] = useState<'None' | 'FeedLogger' | 'FeedFormulator'>('None');

  // Finance Navigation State
  const [financeSubView, setFinanceSubView] = useState<'None' | 'Logger' | 'Batch' | 'Calculator' | 'Forecast' | 'Budget' | 'Loans' | 'CostAnalysis' | 'Ratios'>('None');

  // Intelligent Core Navigation State
  const [intelligentSubView, setIntelligentSubView] = useState<'None' | 'Breeding' | 'Optimizer' | 'Critical' | 'Chat'>('None');

  // Settings Navigation State
  const [settingsSubView, setSettingsSubView] = useState<'None' | 'EmailSetup'>('None');

  // Auth & User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  
  // Handlers
  const handleLogin = (email: string, password?: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        setLoginError('');
        setShowOnboarding(true); 
    } else {
        setLoginError('Invalid email or password.');
    }
  };
  
  const handleOnboardingComplete = () => setShowOnboarding(false);

  // Pig Management Handlers
  const handleSaveNewPig = (newPig: Pig) => {
    setPigs([...pigs, newPig]);
    setIsAddingPig(false);
  };

  const handleDeletePig = (id: string) => {
      setPigs(pigs.filter(p => p.id !== id));
      setSelectedPig(null); // Return to list
  };

  const handleUpdatePig = (updatedPig: Pig) => {
      setPigs(pigs.map(p => p.id === updatedPig.id ? updatedPig : p));
      setSelectedPig(updatedPig);
      setIsEditingPig(false);
  };

  const handleNavClick = (view: ViewState) => {
      setCurrentView(view);
      // Reset sub-views when changing main module
      if(view !== ViewState.Pigs) {
          setSelectedPig(null);
          setIsAddingPig(false);
          setIsEditingPig(false);
      }
      if(view !== ViewState.Operations) {
          setOperationsInitialTab(undefined);
          setOperationsPigFilter(undefined);
          setOperationsSubView('None');
      }
      if(view !== ViewState.Finance) {
          setFinanceSubView('None');
      }
      if(view !== ViewState.AI_Tools) {
          setIntelligentSubView('None');
      }
      if(view !== ViewState.Settings) {
          setSettingsSubView('None');
      }
  };

  // Link to Health Records from Pig Profile
  const handleViewHealthRecords = () => {
      if (selectedPig) {
        setOperationsPigFilter(selectedPig.tagId);
      }
      setOperationsInitialTab('Health');
      setCurrentView(ViewState.Operations);
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setCurrentView(ViewState.Dashboard);
  };

  const handleAddUser = (newUser: User) => setUsers([...users, newUser]);

  const handleUpdatePassword = (newPassword: string) => {
      if (!currentUser) return;
      const updatedUsers = users.map(u => 
        u.id === currentUser.id ? { ...u, password: newPassword } : u
      );
      setUsers(updatedUsers);
      setCurrentUser({ ...currentUser, password: newPassword });
  };

  const handleSaveNotificationConfig = (config: NotificationConfig) => {
      setNotificationConfig(config);
      setSettingsSubView('None');
      alert("Email & Alert preferences updated.");
  };

  // Feed Handlers
  const handleLogDailyFeed = (data: { feedId: string; quantity: number; pen: string; batch?: string }) => {
      // 1. Deduct stock
      const updatedFeeds = feeds.map(f => {
          if (f.id === data.feedId) {
              return { ...f, quantityKg: Math.max(0, f.quantityKg - data.quantity) };
          }
          return f;
      });
      setFeeds(updatedFeeds);
      setOperationsSubView('None');
      alert(`Feed Logged: ${data.quantity}kg for ${data.pen}`);
  };

  // Finance Handlers
  const handleSaveTransaction = (recordData: Omit<FinanceRecord, 'id'>) => {
      const newRecord: FinanceRecord = {
          id: `fin-${Date.now()}`,
          ...recordData,
          status: 'Paid' // Default to Paid for new logs
      };
      setFinanceRecords([...financeRecords, newRecord]);
      setFinanceSubView('None');
  };

  // GLOBAL QUICK ACTIONS HANDLER
  const handleQuickAction = (action: string) => {
      switch(action) {
          case 'add_pig':
              setCurrentView(ViewState.Pigs);
              setIsAddingPig(true);
              setSelectedPig(null);
              break;
          
          case 'log_feed':
              setCurrentView(ViewState.Operations);
              setOperationsInitialTab('Feed');
              setOperationsSubView('FeedLogger');
              break;
          
          case 'log_health':
              setCurrentView(ViewState.Operations);
              setOperationsInitialTab('Health');
              break;

          case 'add_task':
              setCurrentView(ViewState.Operations);
              setOperationsInitialTab('Tasks');
              break;

          case 'add_income':
          case 'add_expense':
              setCurrentView(ViewState.Finance);
              setFinanceSubView('Logger');
              break;

          case 'add_user':
              setCurrentView(ViewState.Settings);
              break;

          default:
              // Fallback
              break;
      }
  };

  const handleFabClick = () => {
      setCurrentView(ViewState.Pigs);
      setIsAddingPig(true);
  };

  const renderContent = () => {
    if (!currentUser) return null;
    const allowedViews = ROLE_PERMISSIONS[currentUser.role] || [];
    
    if (!allowedViews.includes(currentView)) {
        return <div className="p-8 text-center text-gray-500">Access Restricted</div>;
    }

    switch (currentView) {
      case ViewState.Dashboard:
        return <Dashboard 
                  pigs={pigs} 
                  tasks={tasks} 
                  financeRecords={financeRecords} 
                  feeds={feeds}
                  onViewChange={handleNavClick} 
               />;
      
      case ViewState.Pigs:
        if (isAddingPig) {
            return <PigForm onSave={handleSaveNewPig} onCancel={() => setIsAddingPig(false)} />;
        }
        if (isEditingPig && selectedPig) {
            return <PigForm 
                initialData={selectedPig}
                onSave={handleUpdatePig} 
                onCancel={() => setIsEditingPig(false)} 
            />;
        }
        if (selectedPig) {
            return <PigProfile 
                    pig={selectedPig} 
                    allPigs={pigs} 
                    onBack={() => setSelectedPig(null)} 
                    onDelete={handleDeletePig}
                    onUpdate={handleUpdatePig}
                    onEdit={() => setIsEditingPig(true)}
                    onViewHealth={handleViewHealthRecords}
                   />;
        }
        return <PigManager 
                    pigs={pigs} 
                    onAddPigClick={() => setIsAddingPig(true)} 
                    onSelectPig={setSelectedPig} 
               />;
      
      case ViewState.Operations:
        if (operationsSubView === 'FeedLogger') {
            return <FeedLogger feeds={feeds} onSave={handleLogDailyFeed} onCancel={() => setOperationsSubView('None')} />;
        }
        if (operationsSubView === 'FeedFormulator') {
            return <FeedFormulator onCancel={() => setOperationsSubView('None')} />;
        }
        return <Operations 
            feeds={feeds} 
            healthRecords={healthRecords} 
            tasks={tasks} 
            initialTab={operationsInitialTab}
            pigFilter={operationsPigFilter}
            onOpenFeedLogger={() => setOperationsSubView('FeedLogger')}
            onOpenFeedFormulator={() => setOperationsSubView('FeedFormulator')}
        />;
      
      case ViewState.Finance:
        if (financeSubView === 'Logger') {
            return <FinanceLogger onSave={handleSaveTransaction} onCancel={() => setFinanceSubView('None')} />;
        }
        if (financeSubView === 'Batch') {
            return <BatchProfitability records={financeRecords} onCancel={() => setFinanceSubView('None')} />;
        }
        if (financeSubView === 'Calculator') {
            return <ProfitCalculator onCancel={() => setFinanceSubView('None')} />;
        }
        if (financeSubView === 'Forecast') {
            return <CashFlowForecast records={financeRecords} pigs={pigs} onCancel={() => setFinanceSubView('None')} />;
        }
        if (financeSubView === 'Budget') {
            return <BudgetAnalysis records={financeRecords} budgets={budgets} onCancel={() => setFinanceSubView('None')} />;
        }
        if (financeSubView === 'Loans') {
            return <LoanManagement loans={loans} onCancel={() => setFinanceSubView('None')} />;
        }
        if (financeSubView === 'CostAnalysis') {
            return <CostAnalysis onCancel={() => setFinanceSubView('None')} />;
        }
        if (financeSubView === 'Ratios') {
            return <FinancialRatios financeRecords={financeRecords} pigs={pigs} feeds={feeds} loans={loans} onCancel={() => setFinanceSubView('None')} />;
        }
        return <Finance 
            records={financeRecords} 
            onOpenLogger={() => setFinanceSubView('Logger')}
            onOpenBatch={() => setFinanceSubView('Batch')}
            onOpenCalculator={() => setFinanceSubView('Calculator')}
            onOpenForecast={() => setFinanceSubView('Forecast')}
            onOpenBudget={() => setFinanceSubView('Budget')}
            onOpenLoans={() => setFinanceSubView('Loans')}
            onOpenCostAnalysis={() => setFinanceSubView('CostAnalysis')}
            onOpenRatios={() => setFinanceSubView('Ratios')}
        />;

      case ViewState.AI_Tools:
        if (intelligentSubView === 'Chat') {
            return <SmartAssistant />;
        }
        if (intelligentSubView === 'Critical') {
            return <CriticalWatch pigs={pigs} tasks={tasks} feeds={feeds} onCancel={() => setIntelligentSubView('None')} onNavigateToPig={(pig) => { setSelectedPig(pig); setCurrentView(ViewState.Pigs); }} />;
        }
        if (intelligentSubView === 'Optimizer') {
            return <SlaughterOptimizer pigs={pigs} onCancel={() => setIntelligentSubView('None')} onNavigateToPig={(pig) => { setSelectedPig(pig); setCurrentView(ViewState.Pigs); }} />;
        }
        if (intelligentSubView === 'Breeding') {
            return <BreedingAI pigs={pigs} onCancel={() => setIntelligentSubView('None')} onNavigateToPig={(pig) => { setSelectedPig(pig); setCurrentView(ViewState.Pigs); }} />;
        }
        return <IntelligentCore 
            onOpenBreeding={() => setIntelligentSubView('Breeding')}
            onOpenOptimizer={() => setIntelligentSubView('Optimizer')}
            onOpenCritical={() => setIntelligentSubView('Critical')}
            onOpenChat={() => setIntelligentSubView('Chat')}
        />;

      case ViewState.Settings:
        if (settingsSubView === 'EmailSetup') {
            return <EmailAlertsSetup config={notificationConfig} onSave={handleSaveNotificationConfig} onCancel={() => setSettingsSubView('None')} />;
        }
        return <Settings 
                currentUser={currentUser} 
                allUsers={users}
                onAddUser={handleAddUser}
                onUpdatePassword={handleUpdatePassword}
                onLogout={handleLogout}
                onOpenEmailSetup={() => setSettingsSubView('EmailSetup')}
               />;
      default:
        return <Dashboard pigs={pigs} tasks={tasks} financeRecords={financeRecords} feeds={feeds} onViewChange={handleNavClick} />;
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} error={loginError} />;

  return (
    <>
        <Layout 
            currentView={currentView} 
            setView={handleNavClick} 
            onAddClick={handleFabClick}
            onQuickAction={handleQuickAction}
            currentUser={currentUser}
            onLogout={handleLogout}
        >
            {renderContent()}
        </Layout>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
    </>
  );
};

export default App;