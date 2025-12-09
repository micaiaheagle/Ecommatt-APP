
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PigManager from './components/PigManager';
import PigForm from './components/PigForm';
import PigProfile from './components/PigProfile';
import Operations from './components/Operations';
import FeedLogger from './components/FeedLogger';
import FeedFormulator from './components/FeedFormulator';
import CalendarView from './components/CalendarView';
import PointOfSale from './components/PointOfSale';
import CropManager from './components/CropManager';
import MachineryManager from './components/MachineryManager';
import CostCenters from './components/CostCenters';
import StaffManager from './components/StaffManager';
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
import EmailAlertsSetup from './components/EmailAlertsSetup';
import Onboarding from './components/Onboarding';
import Signup from './components/Signup';
import Verification from './components/Verification';
import BiosecurityFeatures from './components/BiosecurityFeatures';
import AutomationManager from './components/AutomationManager';
import { sendVerificationEmail, sendWelcomeEmail } from './services/emailService';
import { Pig, Task, PigStatus, PigStage, FeedInventory, HealthRecord, FinanceRecord, BudgetRecord, LoanRecord, ViewState, User, UserRole, TimelineEvent, NotificationConfig, MedicalItem, Product, CartItem, Field, Crop, CropCycle, CropActivity, Asset, MaintenanceLog, FuelLog, TimesheetLog, VisitorLogEntry, KnowledgeDoc, Protocol } from './types';
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
    { id: '7', tagId: 'EF-007', breed: 'Large White', dob: '2025-05-20', gender: 'Female', stage: PigStage.Finisher, status: PigStatus.Active, penLocation: 'Pen F2', weight: 85, lastFed: 'Today 10:00 AM' },
    { id: '8', tagId: 'EF-008', breed: 'Large White', dob: '2025-05-20', gender: 'Male', stage: PigStage.Finisher, status: PigStatus.Active, penLocation: 'Pen F2', weight: 88, lastFed: 'Today 10:00 AM' },
];

const SEED_TASKS: Task[] = [
    { id: 't1', title: 'Administer Iron', dueDate: today, priority: 'High', status: 'Pending', type: 'Health', description: 'Batch #204 needs Iron Dextran' },
    { id: 't2', title: 'Pregnancy Scan', dueDate: yesterday, priority: 'Low', status: 'Completed', type: 'Health', description: 'Check sow 104' },
    { id: 't3', title: 'Order Grower Pellets', dueDate: tomorrow, priority: 'Medium', status: 'Pending', type: 'General', description: 'Low stock' },
    { id: 't4', title: 'Pen Cleaning Routine', dueDate: today, priority: 'Medium', status: 'Pending', type: 'Cleaning', description: 'Pressure wash' },
    { id: 't5', title: 'Market Weight Check', dueDate: tomorrow, priority: 'High', status: 'Pending', type: 'General', description: 'Sort finishers' },
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
    { id: 'u1', name: 'Admin User', email: 'manager@ecomatt.co.zw', role: 'Farm Manager', password: '123456', hasCompletedOnboarding: true },
    { id: 'u2', name: 'Mike Herdsman', email: 'herdsman@ecomatt.co.zw', role: 'Herdsman', password: '123456', hasCompletedOnboarding: true },
    { id: 'u3', name: 'John Doe', email: 'worker@ecomatt.co.zw', role: 'General Worker', password: '123456', hasCompletedOnboarding: true },
    { id: 'u4', name: 'Sarah Vet', email: 'vet@ecomatt.co.zw', role: 'Veterinarian', password: '123456', hasCompletedOnboarding: true },
];

const ROLE_PERMISSIONS: Record<UserRole, ViewState[]> = {
    'Farm Manager': [ViewState.Dashboard, ViewState.Pigs, ViewState.Operations, ViewState.Calendar, ViewState.POS, ViewState.Finance, ViewState.AI_Tools, ViewState.Settings, ViewState.Crops, ViewState.Machinery, ViewState.Staff, ViewState.Biosecurity],
    'Herdsman': [ViewState.Dashboard, ViewState.Pigs, ViewState.Operations, ViewState.Calendar, ViewState.Crops, ViewState.Machinery],
    'General Worker': [ViewState.Dashboard, ViewState.Operations, ViewState.Calendar, ViewState.POS, ViewState.Crops, ViewState.Biosecurity],
    'Veterinarian': [ViewState.Dashboard, ViewState.Operations, ViewState.Pigs, ViewState.Calendar, ViewState.AI_Tools, ViewState.Biosecurity, ViewState.Automation]
};

const SEED_PROTOCOLS: Protocol[] = [
    {
        id: 'p1',
        name: 'New Piglet Batch Protocol',
        triggerType: 'Event',
        triggerEvent: 'Sow_Farrowed',
        active: true,
        templates: [
            { id: 't1', title: 'Iron Injection', type: 'Health', priority: 'High', daysAfterTrigger: 3, checklist: ['Prepare Iron Dextran', 'Inject 1ml/piglet'], verificationMethod: 'None' },
            { id: 't2', title: 'Tail Docking', type: 'Health', priority: 'Medium', daysAfterTrigger: 4, checklist: ['Sanitize Cutter', 'Dock Tails', 'Apply Iodine'], verificationMethod: 'None' }
        ]
    }
];

const SEED_DOCS: KnowledgeDoc[] = [
    { id: '1', title: 'Biosecurity Protocol v2.4', category: 'SOPs', type: 'PDF', size: '2.4 MB', uploadDate: '2025-11-20', addedBy: 'Admin' },
    { id: '2', title: 'Visitor Entry Policy', category: 'SOPs', type: 'PDF', size: '1.1 MB', uploadDate: '2025-11-15', addedBy: 'Admin' },
    { id: '3', title: 'Tractor JD-550 Service Manual', category: 'Manuals', type: 'PDF', size: '15 MB', uploadDate: '2025-05-10', addedBy: 'Manager' },
    { id: '4', title: 'Vaccination Schedule 2025', category: 'Health', type: 'XLSX', size: '0.4 MB', uploadDate: '2025-12-01', addedBy: 'Vet' }
];

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [currentView, setCurrentView] = useState<ViewState>(ViewState.Dashboard);

    // Auth Flow State
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [pendingUser, setPendingUser] = useState<any>(null);
    const [verificationCode, setVerificationCode] = useState('');

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
    const [medicalInventory, setMedicalInventory] = useState<MedicalItem[]>(() => loadData(STORAGE_KEYS.MEDICAL, []));

    // Seed Products
    const [products] = useState<Product[]>([
        { id: 'p1', name: 'Pork Chops', category: 'Pork', price: 6.50, unit: 'kg', inStock: true },
        { id: 'p2', name: 'Pork Belly', category: 'Pork', price: 8.00, unit: 'kg', inStock: true },
        { id: 'p3', name: 'Sausages (Traditional)', category: 'Pork', price: 5.00, unit: 'kg', inStock: true },
        { id: 'p4', name: 'Piglet (Weaner)', category: 'Live Animal', price: 45.00, unit: 'unit', inStock: true },
        { id: 'p5', name: 'Pig Manure (Compost)', category: 'Manure', price: 2.00, unit: 'bag', inStock: true },
    ]);

    // Crop State
    const [fields, setFields] = useState<Field[]>(() => loadData('ECOMATT_FIELDS', [
        { id: 'f1', name: 'Lower Field', size: 2.5, soilType: 'Loam', location: 'South Valley', status: 'Fallow' },
        { id: 'f2', name: 'Upper Terrace', size: 1.2, soilType: 'Clay-Loam', location: 'North Ridge', status: 'Preparation' },
        { id: 'f3', name: 'Greenhouse A', size: 0.1, soilType: 'Potting Mix', location: 'Near Barn', status: 'Fallow' }
    ]));

    const [crops] = useState<Crop[]>([
        { id: 'c1', name: 'Maize', variety: 'SC727', type: 'Cereal', daysToMaturity: 120, expectedYieldPerHa: 8 },
        { id: 'c2', name: 'Sugar Beans', variety: 'NUA45', type: 'Legume', daysToMaturity: 90, expectedYieldPerHa: 2 },
        { id: 'c3', name: 'Tomatoes', variety: 'Rodade', type: 'Vegetable', daysToMaturity: 75, expectedYieldPerHa: 40 },
        { id: 'c4', name: 'Cabbages', variety: 'Fabian', type: 'Vegetable', daysToMaturity: 85, expectedYieldPerHa: 60 }
    ]);

    const [cropCycles, setCropCycles] = useState<CropCycle[]>(() => loadData('ECOMATT_CYCLES', []));
    const [cropActivities, setCropActivities] = useState<CropActivity[]>(() => loadData('ECOMATT_CROP_ACTIVITIES', []));

    // Machinery State
    const [assets, setAssets] = useState<Asset[]>(() => loadData('ECOMATT_ASSETS', []));
    const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(() => loadData('ECOMATT_MAINTENANCE', []));
    const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => loadData('ECOMATT_FUEL', []));

    const [timesheets, setTimesheets] = useState<TimesheetLog[]>(() => loadData('ECOMATT_TIMESHEETS', []));

    // Manure State
    const [manureStock, setManureStock] = useState<number>(() => loadData('ECOMATT_MANURE_STOCK', 0));

    // Biosecurity & Automation State
    const [visitorLogs, setVisitorLogs] = useState<VisitorLogEntry[]>(() => loadData('ECOMATT_VISITORS', []));
    const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDoc[]>(() => loadData('ECOMATT_DOCS', SEED_DOCS));
    const [protocols, setProtocols] = useState<Protocol[]>(() => loadData('ECOMATT_PROTOCOLS', SEED_PROTOCOLS));



    // Save Effects
    useEffect(() => saveData('ECOMATT_FIELDS', fields), [fields]);
    useEffect(() => saveData('ECOMATT_CYCLES', cropCycles), [cropCycles]);
    useEffect(() => saveData('ECOMATT_ASSETS', assets), [assets]);
    useEffect(() => saveData('ECOMATT_MAINTENANCE', maintenanceLogs), [maintenanceLogs]);
    useEffect(() => saveData('ECOMATT_FUEL', fuelLogs), [fuelLogs]);
    useEffect(() => saveData('ECOMATT_MANURE_STOCK', manureStock), [manureStock]);
    useEffect(() => saveData('ECOMATT_VISITORS', visitorLogs), [visitorLogs]);
    useEffect(() => saveData('ECOMATT_DOCS', knowledgeDocs), [knowledgeDocs]);
    useEffect(() => saveData('ECOMATT_PROTOCOLS', protocols), [protocols]);



    // Crop Handlers
    const handlePlantField = (fieldId: string, cropId: string, date: string) => {
        const crop = crops.find(c => c.id === cropId);
        if (!crop) return;

        const expectedHarvest = new Date(new Date(date).getTime() + (crop.daysToMaturity * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

        const newCycle: CropCycle = {
            id: `cycle-${Date.now()}`,
            fieldId,
            cropId,
            plantingDate: date,
            expectedHarvestDate: expectedHarvest,
            status: 'Active'
        };

        setCropCycles([...cropCycles, newCycle]);
        setFields(fields.map(f => f.id === fieldId ? { ...f, status: 'Planted', currentCropId: newCycle.id } : f));
    };

    const handleUpdateFieldStatus = (fieldId: string, status: 'Fallow' | 'Preparation') => {
        setFields(fields.map(f => f.id === fieldId ? { ...f, status } : f));
    };

    const handleHarvestCrop = (cycleId: string, date: string, quantity: number, quality: string, destination: 'Market' | 'FeedInventory', feedType?: string) => {
        // 1. Update Cycle
        setCropCycles(cropCycles.map(c => c.id === cycleId ? {
            ...c,
            status: 'Harvested',
            harvestDate: date,
            yieldAmount: quantity,
            yieldQuality: quality,
            destination: destination,
            feedTypeId: feedType
        } : c));

        // 2. Free Field
        const cycle = cropCycles.find(c => c.id === cycleId);
        if (cycle) {
            setFields(fields.map(f => f.id === cycle.fieldId ? { ...f, status: 'Fallow', currentCropId: undefined } : f));
        }

        // 3. Handle Destination
        if (destination === 'Market') {
            // Record Finance Income (Estimated)
            handleSaveTransaction({
                date,
                type: 'Income',
                category: 'Crop Sales',
                amount: quantity * 100, // Dummy pricing logic
                description: `Harvest: ${quantity} tons (Quality: ${quality})`,
                status: 'Projected'
            });
        } else if (destination === 'FeedInventory' && feedType) {
            // Convert Tonnes to Kg
            const quantityKg = quantity * 1000;

            // Update or Add to Feed Inventory
            const existingFeed = feeds.find(f => f.name.toLowerCase().includes(feedType.toLowerCase()));

            if (existingFeed) {
                setFeeds(feeds.map(f => f.id === existingFeed.id ? { ...f, quantityKg: f.quantityKg + quantityKg, lastRestock: date } : f));
                alert(`Added ${quantityKg}kg to ${existingFeed.name} inventory.`);
            } else {
                const newFeed: FeedInventory = {
                    id: `feed-${Date.now()}`,
                    name: `${feedType} (Harvest)`,
                    type: 'Grain',
                    quantityKg: quantityKg,
                    reorderLevel: 100,
                    lastRestock: date
                };
                setFeeds([...feeds, newFeed]);
                alert(`Created new feed: ${newFeed.name} with ${quantityKg}kg.`);
            }
        }
    };

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
    useEffect(() => saveData(STORAGE_KEYS.MEDICAL, medicalInventory), [medicalInventory]);
    useEffect(() => saveData('ECOMATT_TIMESHEETS', timesheets), [timesheets]);

    // Navigation State for Pig Module
    const [selectedPig, setSelectedPig] = useState<Pig | null>(null);
    const [isAddingPig, setIsAddingPig] = useState(false);
    const [isEditingPig, setIsEditingPig] = useState(false);

    // Operations Navigation State
    const [operationsInitialTab, setOperationsInitialTab] = useState<'Tasks' | 'Feed' | 'Health' | undefined>(undefined);
    const [operationsPigFilter, setOperationsPigFilter] = useState<string | undefined>(undefined);
    const [operationsSubView, setOperationsSubView] = useState<'None' | 'FeedLogger' | 'FeedFormulator'>('None');

    // Finance Navigation State
    // Finance Navigation State
    const [financeSubView, setFinanceSubView] = useState<'None' | 'Logger' | 'Batch' | 'Calculator' | 'Forecast' | 'Budget' | 'Loans' | 'CostAnalysis' | 'Ratios' | 'CostCenters'>('None');

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
            // Only show onboarding if user hasn't completed it
            if (!user.hasCompletedOnboarding) {
                setShowOnboarding(true);
            }
        } else {
            setLoginError('Invalid email or password.');
        }
    };

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        if (currentUser) {
            const updatedUser = { ...currentUser, hasCompletedOnboarding: true };
            setCurrentUser(updatedUser);
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        }
    };

    // Signup Handlers
    const handleSignupSubmit = async (formData: any) => {
        setPendingUser(formData);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setVerificationCode(code);

        // Send Verification Email
        await sendVerificationEmail(formData.email, code);

        setIsSigningUp(false);
        setIsVerifying(true);
    };

    const handleVerificationSuccess = async () => {
        if (!pendingUser) return;

        const newUser: User = {
            id: `u${Date.now()}`,
            name: `${pendingUser.firstName} ${pendingUser.lastName}`,
            email: pendingUser.email,
            role: pendingUser.role as UserRole,
            password: pendingUser.password,
            hasCompletedOnboarding: false
        };

        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        setIsAuthenticated(true);
        setIsVerifying(false);
        setShowOnboarding(true);

        // Send Welcome Email
        await sendWelcomeEmail(newUser.email, newUser.name);
    };

    // Automation Trigger Helper
    const checkAutomationTriggers = (eventName: string, context: any) => {
        const activeProtocols = protocols.filter(p => p.active && p.triggerType === 'Event' && p.triggerEvent === eventName);

        activeProtocols.forEach(protocol => {
            const newTasks = protocol.templates.map(template => {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + template.daysAfterTrigger);

                return {
                    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: template.title,
                    type: template.type,
                    status: 'Pending' as const,
                    priority: template.priority,
                    dueDate: dueDate.toISOString().split('T')[0],
                    description: `Auto-generated by protocol: ${protocol.name}. ${template.description || ''}`,
                    checklist: template.checklist?.map((item, idx) => ({ id: `cl-${idx}`, text: item, completed: false })),
                    verificationMethod: template.verificationMethod
                };
            });

            if (newTasks.length > 0) {
                setTasks(prev => [...newTasks, ...prev]);
                alert(`⚡ Automation: Generated ${newTasks.length} tasks from "${protocol.name}"`);
            }
        });
    };

    // Pig Management Handlers
    const handleSaveNewPig = (newPig: Pig) => {
        setPigs([...pigs, newPig]);
        setIsAddingPig(false);

        // Trigger Automation
        // Example: If adding a Piglet, we assume a farrowing event might have occurred or we just trigger 'New_Pig_Added'
        // For the specific user requirement "Sow Farrowed", this usually implies a batch of piglets.
        // We will trigger 'Sow_Farrowed' if the stage is Piglet, just for demonstration of the "Autopilot".
        if (newPig.stage === PigStage.Piglet) {
            checkAutomationTriggers('Sow_Farrowed', { pigId: newPig.id });
        }
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

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const handleNavClick = (view: ViewState) => {
        setCurrentView(view);
        // Reset sub-views when changing main module
        if (view !== ViewState.Pigs) {
            setSelectedPig(null);
            setIsAddingPig(false);
            setIsEditingPig(false);
        }
        if (view !== ViewState.Operations) {
            setOperationsInitialTab(undefined);
            setOperationsPigFilter(undefined);
            setOperationsSubView('None');
        }
        if (view !== ViewState.Finance) {
            setFinanceSubView('None');
        }
        if (view !== ViewState.AI_Tools) {
            setIntelligentSubView('None');
        }
        if (view !== ViewState.Settings) {
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

    const handleLogManure = (amount: number, date: string) => {
        setManureStock(prev => prev + amount);
        alert(`Logged ${amount}kg of manure. Total Stock: ${manureStock + amount}kg`);
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

    // Medical Inventory Handlers
    const handleSaveMedicalItem = (item: MedicalItem) => {
        if (medicalInventory.some(i => i.id === item.id)) {
            setMedicalInventory(medicalInventory.map(i => i.id === item.id ? item : i));
        } else {
            setMedicalInventory([...medicalInventory, item]);
        }
    };

    const handleDeleteMedicalItem = (id: string) => {
        setMedicalInventory(medicalInventory.filter(i => i.id !== id));
    };

    const handleSaveHealthRecord = (record: HealthRecord) => {
        setHealthRecords(prev => [record, ...prev]);

        // Auto-deduct from Inventory
        if (record.medicalItemId && record.quantityUsed) {
            setMedicalInventory(prev => prev.map(item => {
                if (item.id === record.medicalItemId) {
                    return { ...item, quantity: Math.max(0, item.quantity - (record.quantityUsed || 0)) };
                }
                return item;
            }));
        }
    };


    // POS Handlers
    const handleSaleComplete = (items: CartItem[], total: number, paymentMethod: string) => {
        const description = `POS Sale: ${items.map(i => `${i.name} (x${i.quantity})`).join(', ')}`;
        handleSaveTransaction({
            date: new Date().toISOString().split('T')[0],
            type: 'Income',
            category: 'Sales',
            amount: total,
            description,
            status: 'Paid'
        });
    };

    // GLOBAL QUICK ACTIONS HANDLER
    const handleQuickAction = (action: string) => {
        switch (action) {
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


    const handleLogCropActivity = (activity: CropActivity) => {
        setCropActivities(prev => [...prev, activity]);

        // If cost exists, log expense automatically
        if (activity.cost > 0) {
            handleSaveTransaction({
                date: activity.date,
                type: 'Expense',
                category: 'Crop Input',
                amount: activity.cost,
                description: `${activity.type}: ${activity.description}`,
                status: 'Paid'
            });
        }
    };


    // Machinery Handlers
    const handleAddAsset = (asset: Asset) => {
        setAssets([...assets, asset]);
    };

    const handleLogMaintenance = (log: MaintenanceLog) => {
        setMaintenanceLogs([...maintenanceLogs, log]);

        // Auto Expense
        handleSaveTransaction({
            date: log.date,
            type: 'Expense',
            category: 'Maintenance',
            amount: log.cost,
            description: `Maintenance: ${log.type} on Asset`, // Could lookup name if needed
            status: 'Paid'
        });
    };

    const handleLogFuel = (log: FuelLog) => {
        setFuelLogs([...fuelLogs, log]);

        // Auto Expense
        handleSaveTransaction({
            date: log.date,
            type: 'Expense',
            category: 'Fuel',
            amount: log.cost,
            description: `Fuel: ${log.quantity}L`,
            status: 'Paid'
        });
    };

    const handleLogTime = (log: TimesheetLog) => {
        setTimesheets([...timesheets, log]);
    };

    // Biosecurity Handlers
    const handleCheckInVisitor = (entry: VisitorLogEntry) => {
        setVisitorLogs([entry, ...visitorLogs]);
    };

    const handleCheckOutVisitor = (id: string, time: string) => {
        setVisitorLogs(visitorLogs.map(v => v.id === id ? { ...v, checkOutTime: time, status: 'Checked Out' } : v));
    };

    const handleAddDocument = (doc: KnowledgeDoc) => {
        setKnowledgeDocs([...knowledgeDocs, doc]);
    };

    const handleDeleteDocument = (id: string) => {
        setKnowledgeDocs(knowledgeDocs.filter(d => d.id !== id));
    };

    // Automation Handlers
    const handleSaveProtocol = (protocol: Protocol) => {
        if (protocols.find(p => p.id === protocol.id)) {
            setProtocols(protocols.map(p => p.id === protocol.id ? protocol : p));
        } else {
            setProtocols([...protocols, protocol]);
        }
    };

    const handleToggleProtocol = (id: string) => {
        setProtocols(protocols.map(p => p.id === id ? { ...p, active: !p.active } : p));
    };

    const handleDeleteProtocol = (id: string) => {
        setProtocols(protocols.filter(p => p.id !== id));
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
                    fields={fields}
                    cropCycles={cropCycles}
                    assets={assets}
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
                    pigs={pigs}
                    feeds={feeds}
                    healthRecords={healthRecords}
                    tasks={tasks}
                    initialTab={operationsInitialTab}
                    pigFilter={operationsPigFilter}
                    onOpenFeedLogger={() => setOperationsSubView('FeedLogger')}
                    onOpenFeedFormulator={() => setOperationsSubView('FeedFormulator')}
                    medicalItems={medicalInventory}
                    onSaveMedicalItem={handleSaveMedicalItem}
                    onDeleteMedicalItem={handleDeleteMedicalItem}
                    onSaveHealthRecord={handleSaveHealthRecord}
                    onLogManure={handleLogManure}
                    onUpdateTask={handleUpdateTask}
                />;

            case ViewState.Finance:
                if (financeSubView === 'Logger') {
                    return <FinanceLogger
                        onSave={handleSaveTransaction}
                        onCancel={() => setFinanceSubView('None')}
                        fields={fields}
                        assets={assets}
                    />;
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
                if (financeSubView === 'CostCenters') {
                    return <CostCenters financeRecords={financeRecords} fields={fields} assets={assets} onCancel={() => setFinanceSubView('None')} />;
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
                    onOpenCostCenters={() => setFinanceSubView('CostCenters')}
                />;

            case ViewState.AI_Tools:
                if (intelligentSubView === 'Chat') {
                    return <SmartAssistant
                        user={currentUser}
                        onUpdateUser={(updated) => {
                            setUsers(users.map(u => u.id === updated.id ? updated : u));
                            setCurrentUser(updated);
                        }}
                        config={notificationConfig}
                        onUpdateConfig={setNotificationConfig}
                    />;
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

            case ViewState.Calendar:
                return <CalendarView
                    pigs={pigs}
                    tasks={tasks}
                    financeRecords={financeRecords}
                    onNavigate={handleNavClick}
                />;

            case ViewState.POS:
                return <PointOfSale
                    products={products}
                    onCompleteSale={handleSaleComplete}
                    onCancel={() => handleNavClick(ViewState.Dashboard)}
                />;

            case ViewState.Crops:
                return <CropManager
                    fields={fields}
                    crops={crops}
                    cycles={cropCycles}
                    activities={cropActivities}
                    onPlantField={handlePlantField}
                    onHarvest={handleHarvestCrop}
                    onUpdateFieldStatus={handleUpdateFieldStatus}
                    onLogActivity={handleLogCropActivity}
                />;

            case ViewState.Machinery:
                return <MachineryManager
                    assets={assets}
                    maintenanceLogs={maintenanceLogs}
                    fuelLogs={fuelLogs}
                    onAddAsset={handleAddAsset}
                    onLogMaintenance={handleLogMaintenance}
                    onLogFuel={handleLogFuel}
                />;

            case ViewState.Staff:
                return <StaffManager
                    users={users}
                    currentUser={currentUser}
                    timesheets={timesheets}
                    tasks={tasks}
                    onLogTime={handleLogTime}
                />;

            case ViewState.Biosecurity:
                return <BiosecurityFeatures
                    visitorLogs={visitorLogs}
                    onCheckInVisitor={handleCheckInVisitor}
                    onCheckOutVisitor={handleCheckOutVisitor}
                    knowledgeDocs={knowledgeDocs}
                    onAddDocument={handleAddDocument}
                    onDeleteDocument={handleDeleteDocument}
                    currentUser={currentUser}
                />;

            case ViewState.Automation:
                return <AutomationManager
                    protocols={protocols}
                    onSaveProtocol={handleSaveProtocol}
                    onToggleProtocol={handleToggleProtocol}
                    onDeleteProtocol={handleDeleteProtocol}
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
                return <Dashboard
                    pigs={pigs}
                    tasks={tasks}
                    financeRecords={financeRecords}
                    feeds={feeds}
                    fields={fields}
                    cropCycles={cropCycles}
                    assets={assets}
                    onViewChange={handleNavClick}
                />;
        }
    };

    if (!isAuthenticated) {
        if (isVerifying) {
            return <Verification
                contactInfo={{ email: pendingUser?.email, phone: pendingUser?.phone }}
                onVerifySuccess={handleVerificationSuccess}
                onBack={() => { setIsVerifying(false); setIsSigningUp(true); }}
            />;
        }
        if (isSigningUp) {
            return <Signup
                onSignupSubmit={handleSignupSubmit}
                onNavigateToLogin={() => setIsSigningUp(false)}
            />;
        }
        return <Login
            onLogin={handleLogin}
            onSignupClick={() => setIsSigningUp(true)}
            error={loginError}
        />;
    }

    // Determine Back Button Logic
    let showBack = false;
    let onBack: (() => void) | undefined = undefined;

    if (currentView === ViewState.Pigs) {
        if (selectedPig || isAddingPig || isEditingPig) {
            showBack = true;
            onBack = () => {
                setSelectedPig(null);
                setIsAddingPig(false);
                setIsEditingPig(false);
            };
        }
    } else if (currentView === ViewState.Operations) {
        if (operationsSubView !== 'None') {
            showBack = true;
            onBack = () => setOperationsSubView('None');
        }
    } else if (currentView === ViewState.Finance) {
        if (financeSubView !== 'None') {
            showBack = true;
            onBack = () => setFinanceSubView('None');
        }
    } else if (currentView === ViewState.AI_Tools) {
        if (intelligentSubView !== 'None') {
            showBack = true;
            onBack = () => setIntelligentSubView('None');
        }
    } else if (currentView === ViewState.Settings) {
        if (settingsSubView !== 'None') {
            showBack = true;
            onBack = () => setSettingsSubView('None');
        }
    }

    return (
        <>
            <Layout
                currentView={currentView}
                setView={handleNavClick}
                onAddClick={handleFabClick}
                onQuickAction={handleQuickAction}
                currentUser={currentUser}
                onLogout={handleLogout}
                showBack={showBack}
                onBack={onBack}
            >
                {renderContent()}
            </Layout>
            {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
        </>
    );
};

export default App;