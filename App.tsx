
import React, { useState } from 'react';
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

// Mock Data
const MOCK_PIGS: Pig[] = [
  { 
      id: '1', 
      tagId: 'EF-8842', 
      breed: 'Large White', 
      dob: '2023-01-15', 
      gender: 'Female', 
      stage: PigStage.Sow, 
      status: PigStatus.Active, 
      penLocation: 'Pen 3B', 
      weight: 210, 
      imageUrl: '',
      sireId: 'LW-900',
      damId: 'LW-330',
      timeline: [
          { date: '2025-11-20', title: 'Routine Checkup', subtitle: 'Weight check', color: 'green' },
          { date: '2025-11-10', title: 'Artificial Insemination', subtitle: 'Service 1 • Boar: #D-900', color: 'yellow' },
          { date: '2025-10-15', title: 'Weaning (Litter 3)', subtitle: '10 Piglets • Moved to Pen 2', color: 'blue' }
      ]
  },
  { id: '2', tagId: 'EF-9001', breed: 'Duroc', dob: '2023-02-20', gender: 'Male', stage: PigStage.Boar, status: PigStatus.Active, penLocation: 'Pen 1A', weight: 210, sireId: 'D-100', damId: 'D-055' },
  { id: '3', tagId: 'EF-003', breed: 'Landrace', dob: '2023-06-10', gender: 'Female', stage: PigStage.Grower, status: PigStatus.Sick, penLocation: 'Isolation', weight: 65, notes: 'Coughing' },
  { id: '4', tagId: 'EF-004', breed: 'Large White', dob: '2023-07-01', gender: 'Male', stage: PigStage.Weaner, status: PigStatus.Active, penLocation: 'Pen C2', weight: 25 },
];

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Administer Iron', dueDate: 'Today', priority: 'High', status: 'Pending', type: 'Medical' },
  { id: 't2', title: 'Pregnancy Scan', dueDate: 'Today', priority: 'Low', status: 'Completed', type: 'Repro' },
  { id: 't3', title: 'Order Grower Pellets', dueDate: 'Tomorrow', priority: 'Medium', status: 'Pending', type: 'Procurement' },
];

const MOCK_FEEDS: FeedInventory[] = [
  { id: 'f1', name: 'Sow Meal', type: 'Meal', quantityKg: 450, reorderLevel: 200, lastRestock: 'Nov 1' },
  { id: 'f2', name: 'Grower Pellets', type: 'Pellets', quantityKg: 150, reorderLevel: 300, lastRestock: 'Oct 20' },
  { id: 'f3', name: 'Creep Feed', type: 'Crumble', quantityKg: 80, reorderLevel: 50, lastRestock: 'Nov 10' },
];

const MOCK_HEALTH: HealthRecord[] = [
  { id: 'h1', pigId: 'EF-003', date: 'Nov 20', type: 'Treatment', description: 'Swine Flu', medication: 'Oxytetracycline', administeredBy: 'Sarah' },
  { id: 'h2', pigId: 'EF-8842', date: 'Nov 15', type: 'Vaccination', description: 'Parvo', administeredBy: 'John' },
];

const MOCK_FINANCE: FinanceRecord[] = [
  { id: 'fin1', date: 'Nov 15', type: 'Income', category: 'Sales', amount: 1200, description: 'Pork Sales Batch #21' },
  { id: 'fin2', date: 'Nov 10', type: 'Expense', category: 'Supplies', amount: 150, description: 'Vet Supplies' },
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
  
  // Data State
  const [pigs, setPigs] = useState<Pig[]>(MOCK_PIGS);
  
  // Navigation State for Pig Module
  const [selectedPig, setSelectedPig] = useState<Pig | null>(null);
  const [isAddingPig, setIsAddingPig] = useState(false);
  const [isEditingPig, setIsEditingPig] = useState(false);

  // Auth & User State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
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
    alert('Pig Record Created Successfully');
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

  // FAB Click from Layout
  const handleFabClick = () => {
      if (currentView === ViewState.Pigs) {
          setIsAddingPig(true);
      } else {
          // Default action for other screens? Or perhaps navigate to Pigs and open add
          setCurrentView(ViewState.Pigs);
          setIsAddingPig(true);
      }
  };

  const renderContent = () => {
    if (!currentUser) return null;
    const allowedViews = ROLE_PERMISSIONS[currentUser.role] || [];
    
    if (!allowedViews.includes(currentView)) {
        return <div className="p-8 text-center text-gray-500">Access Restricted</div>;
    }

    switch (currentView) {
      case ViewState.Dashboard:
        return <Dashboard pigs={pigs} tasks={MOCK_TASKS} onViewChange={handleNavClick} />;
      
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
                    onBack={() => setSelectedPig(null)} 
                    onDelete={handleDeletePig}
                    onUpdate={handleUpdatePig}
                    onEdit={() => setIsEditingPig(true)}
                   />;
        }
        return <PigManager 
                    pigs={pigs} 
                    onAddPigClick={() => setIsAddingPig(true)} 
                    onSelectPig={setSelectedPig} 
               />;
      
      case ViewState.Operations:
        return <Operations feeds={MOCK_FEEDS} healthRecords={MOCK_HEALTH} tasks={MOCK_TASKS} />;
      case ViewState.Finance:
        return <Finance records={MOCK_FINANCE} />;
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
        return <Dashboard pigs={pigs} tasks={MOCK_TASKS} onViewChange={handleNavClick} />;
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} error={loginError} />;

  return (
    <>
        <Layout 
            currentView={currentView} 
            setView={handleNavClick} 
            onAddClick={handleFabClick}
            currentUser={currentUser}
        >
            {renderContent()}
        </Layout>
        {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
    </>
  );
};

export default App;
