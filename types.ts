
export enum PigStatus {
  Active = 'Active',
  Sick = 'Sick',
  Quarantine = 'Quarantine',
  Sold = 'Sold',
  Deceased = 'Deceased',
  Pregnant = 'Pregnant'
}

export enum PigStage {
  Piglet = 'Piglet',
  Weaner = 'Weaner',
  Grower = 'Grower',
  Finisher = 'Finisher',
  Sow = 'Sow',
  Boar = 'Boar'
}

export type UserRole = 'Farm Manager' | 'Herdsman' | 'General Worker' | 'Veterinarian';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Added for mock auth
  hasCompletedOnboarding?: boolean;
}

export interface TimelineEvent {
  id?: string; // Added for unique identification
  date: string;
  title: string;
  subtitle: string;
  color: 'green' | 'yellow' | 'blue' | 'red';
  icon?: string;
  status?: 'Pending' | 'Completed'; // Added for tracking completion
  data?: any; // Added for structured event data (Smart Reporting)
}

export interface Pig {
  id: string;
  tagId: string;
  breed: string;
  dob: string;
  gender: 'Male' | 'Female';
  stage: PigStage;
  status: PigStatus;
  penLocation: string;
  weight: number;
  lastCheckup?: string;
  imageUrl?: string;
  notes?: string;

  // Lineage
  sireId?: string;
  damId?: string;

  // Extended Data
  timeline?: TimelineEvent[];
  lastFed?: string; // New Field
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Completed';
  assignedTo?: string;
  type: string;
}

export interface FeedInventory {
  id: string;
  name: string;
  type: string;
  quantityKg: number;
  reorderLevel: number;
  lastRestock: string;
}

export interface FinanceRecord {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  description: string;
  batchId?: string; // Added for Batch Profitability
  status?: 'Paid' | 'Scheduled' | 'Projected'; // Added for Cash Flow Forecasting
}

export interface BudgetRecord {
  id: string;
  category: string;
  amount: number;
  period: string; // e.g. 'Monthly'
}

export interface LoanRecord {
  id: string;
  lender: string;
  principal: number; // Original amount borrowed
  interestRate: number; // Annual Percentage Rate (APR)
  startDate: string;
  termMonths: number;
  balance: number; // Current remaining balance
  monthlyPayment: number;
  nextPaymentDate: string;
  status: 'Active' | 'Paid' | 'Defaulted';
}

export interface HealthRecord {
  id: string;
  pigId: string;
  date: string;
  type: 'Vaccination' | 'Treatment' | 'Checkup';
  description: string;
  medication?: string;
  administeredBy: string;
}

// Notification Settings
export interface NotificationConfig {
  emails: string[];
  alerts: {
    mortality: boolean;
    feed: boolean;
    tasks: boolean;
    finance: boolean;
  };
}

// Live Ops
export enum LogSeverity {
  Info = 'Info',
  Warning = 'Warning',
  Critical = 'Critical'
}

export interface LiveOpLog {
  id: string;
  time: string; // HH:mm
  title: string;
  message: string;
  severity: LogSeverity;
  timestamp: number; // for sorting
}

export enum ViewState {
  Dashboard = 'Dashboard',
  Pigs = 'Pigs',
  Operations = 'Operations',
  Finance = 'Finance',
  AI_Tools = 'AI_Tools',
  Settings = 'Settings',
  Calendar = 'Calendar',
  POS = 'POS'
}


export enum PigStatus {
  Active = 'Active',
  Sick = 'Sick',
  Quarantine = 'Quarantine',
  Sold = 'Sold',
  Deceased = 'Deceased',
  Pregnant = 'Pregnant'
}

export enum PigStage {
  Piglet = 'Piglet',
  Weaner = 'Weaner',
  Grower = 'Grower',
  Finisher = 'Finisher',
  Sow = 'Sow',
  Boar = 'Boar'
}

export type UserRole = 'Farm Manager' | 'Herdsman' | 'General Worker' | 'Veterinarian';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // Added for mock auth
  hasCompletedOnboarding?: boolean;
}

export interface TimelineEvent {
  id?: string; // Added for unique identification
  date: string;
  title: string;
  subtitle: string;
  color: 'green' | 'yellow' | 'blue' | 'red';
  icon?: string;
  status?: 'Pending' | 'Completed'; // Added for tracking completion
  data?: any; // Added for structured event data (Smart Reporting)
}

export interface Pig {
  id: string;
  tagId: string;
  breed: string;
  dob: string;
  gender: 'Male' | 'Female';
  stage: PigStage;
  status: PigStatus;
  penLocation: string;
  weight: number;
  lastCheckup?: string;
  imageUrl?: string;
  notes?: string;

  // Lineage
  sireId?: string;
  damId?: string;

  // Extended Data
  timeline?: TimelineEvent[];
  lastFed?: string; // New Field
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Completed';
  assignedTo?: string;
  type: string;
}

export interface FeedInventory {
  id: string;
  name: string;
  type: string;
  quantityKg: number;
  reorderLevel: number;
  lastRestock: string;
}

export interface FinanceRecord {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  description: string;
  batchId?: string; // Added for Batch Profitability
  status?: 'Paid' | 'Scheduled' | 'Projected'; // Added for Cash Flow Forecasting
}

export interface BudgetRecord {
  id: string;
  category: string;
  amount: number;
  period: string; // e.g. 'Monthly'
}

export interface LoanRecord {
  id: string;
  lender: string;
  principal: number; // Original amount borrowed
  interestRate: number; // Annual Percentage Rate (APR)
  startDate: string;
  termMonths: number;
  balance: number; // Current remaining balance
  monthlyPayment: number;
  nextPaymentDate: string;
  status: 'Active' | 'Paid' | 'Defaulted';
}

export interface HealthRecord {
  id: string;
  pigId: string;
  date: string;
  type: 'Vaccination' | 'Treatment' | 'Checkup';
  description: string;
  medication?: string;
  administeredBy: string;
}

// Notification Settings
export interface NotificationConfig {
  emails: string[];
  alerts: {
    mortality: boolean;
    feed: boolean;
    tasks: boolean;
    finance: boolean;
  };
}

// Live Ops
export enum LogSeverity {
  Info = 'Info',
  Warning = 'Warning',
  Critical = 'Critical'
}

export interface LiveOpLog {
  id: string;
  time: string; // HH:mm
  title: string;
  message: string;
  severity: LogSeverity;
  timestamp: number; // for sorting
}

export enum ViewState {
  Dashboard = 'Dashboard',
  Pigs = 'Pigs',
  Operations = 'Operations',
  Finance = 'Finance',
  AI_Tools = 'AI_Tools',
  Settings = 'Settings',
  Calendar = 'Calendar'
}

export interface MedicalItem {
  id: string;
  name: string;
  type: 'Antibiotic' | 'Vaccine' | 'Vitamin' | 'Disinfectant' | 'Equipment' | 'Other';
  quantity: number;
  unit: 'ml' | 'doses' | 'units' | 'kg' | 'g';
  costPerUnit: number;
  expiryDate?: string;
  batchNumber?: string;
  supplier?: string;
  minStockLevel?: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'Pork' | 'Live Animal' | 'Manure' | 'Other';
  price: number;
  unit: 'kg' | 'unit' | 'bag' | 'ton';
  image?: string; // Optional icon/image path
  inStock?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}