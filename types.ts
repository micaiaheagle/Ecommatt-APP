
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
}

export interface TimelineEvent {
  id?: string; // Added for unique identification
  date: string;
  title: string;
  subtitle: string;
  color: 'green' | 'yellow' | 'blue' | 'red';
  icon?: string;
  status?: 'Pending' | 'Completed'; // Added for tracking completion
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
  Settings = 'Settings'
}
