
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PigManager from './components/PigManager';
import PigForm from './components/PigForm';
import PigProfile from './components/PigProfile';
import Operations from './components/Operations';
import Finance from './components/Finance';
import SmartAssistant from './components/SmartAssistant';
import Login from './components/Login';
import Settings from './components/Settings';
import Onboarding from './components/Onboarding';
import { Pig, Task, PigStatus, PigStage, FeedInventory, HealthRecord, FinanceRecord, ViewState, User, UserRole, TimelineEvent } from './types';
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
  { id: 'fin1', date: 'Nov 15', type: 'Income', category: 'Sales', amount: 1200, description: 'Pork Sales Batch #21' },
  { id: 'fin2', date: 'Nov 10', type: 'Expense', category: 'Supplies', amount: 150, description: 'Vet Supplies' },
  { id: 'fin3', date: 'Nov 05', type: 'Expense', category: 'Feed', amount: 450, description: 'Sow Meal Bulk' },
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
  const [users, setUsers] = useState<User[]>(() => loadData(STORAGE_KEYS.USERS, INITIAL_USERS));

  // Persistence Effects - Auto Save when state changes
  useEffect(() => saveData(STORAGE_KEYS.PIGS, pigs), [pigs]);
  useEffect(() => saveData(STORAGE_KEYS.TASKS, tasks), [tasks]);
  useEffect(() => saveData(STORAGE_KEYS.FEEDS, feeds), [feeds]);
  useEffect(() => saveData(STORAGE_KEYS.HEALTH, healthRecords), [healthRecords]);
  useEffect(() => saveData(STORAGE_KEYS.FINANCE, financeRecords), [financeRecords]);
  useEffect(() => saveData(STORAGE_KEYS.USERS, users), [users]);
  
  // Navigation State for Pig Module
  const [selectedPig, setSelectedPig] = useState<Pig | null>(null);
  const [isAddingPig, setIsAddingPig] = useState(false);
  const [isEditingPig, setIsEditingPig] = useState(false);
  
  // Operations Navigation State
  const [operationsInitialTab, setOperationsInitialTab] = useState<'Tasks' | 'Feed' | 'Health' | undefined>(undefined);
  const [operationsPigFilter, setOperationsPigFilter] = useState<string | undefined>(undefined);

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
      // Reset operations tab and filter if navigating away
      if(view !== ViewState.Operations) {
          setOperationsInitialTab(undefined);
          setOperationsPigFilter(undefined);
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

  // GLOBAL QUICK ACTIONS HANDLER
  const handleQuickAction = (action: string) => {
      console.log("Quick Action Triggered:", action);
      switch(action) {
          case 'add_pig':
              setCurrentView(ViewState.Pigs);
              setIsAddingPig(true);
              setSelectedPig(null);
              break;
          
          case 'log_feed':
              setCurrentView(ViewState.Operations);
              setOperationsInitialTab('Feed');
              break;
          
          case 'log_health':
              setCurrentView(ViewState.Operations);
              setOperationsInitialTab('Health');
              break;

          case 'add_task':
              setCurrentView(ViewState.Operations);
              setOperationsInitialTab('Tasks');
              // TODO: Open Add Task Modal (Need to implement Add Task state in Operations)
              break;

          case 'add_income':
          case 'add_expense':
          case 'create_invoice':
              setCurrentView(ViewState.Finance);
              break;

          case 'add_user':
              setCurrentView(ViewState.Settings);
              // Note: Settings component handles UI state internally, might need prop to auto-open
              break;

          default:
              alert(`Action '${action}' is coming soon in the next update!`);
      }
  };

  const handleFabClick = () => {
      // Legacy FAB now opens Quick Action for adding pig by default if on mobile
      // or we could open the quick menu programmatically if we moved state up.
      // For now, keeping it as 'Add Pig' shortcut.
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
                    allPigs={pigs} // Pass all pigs for pedigree lookup
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
        return <Operations 
            feeds={feeds} 
            healthRecords={healthRecords} 
            tasks={tasks} 
            initialTab={operationsInitialTab}
            pigFilter={operationsPigFilter}
        />;
      case ViewState.Finance:
        return <Finance records={financeRecords} />;
      case ViewState.AI_Tools:
        return <SmartAssistant />;
      case ViewState.Settings:
        return <Settings 
                currentUser={currentUser} 
                allUsers={users}
                onAddUser={handleAddUser}
                onUpdatePassword={handleUpdatePassword}
                onLogout={handleLogout} 
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
