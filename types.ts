// Pig Status & Stage Enums
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
  language?: 'English' | 'Shona' | 'Ndebele'; // Added for Localization
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
  enterprise?: 'General' | 'Piggery' | 'Poultry' | 'Crops' | 'Machinery'; // Added for Cost Centers
  allocationId?: string; // ID for specific Field, Asset, or Batch
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
  medicalItemId?: string;
  quantityUsed?: number;
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
  smsFallback?: boolean; // Added for Connectivity
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
  POS = 'POS',
  Crops = 'Crops',
  Machinery = 'Machinery',
  Staff = 'Staff',
  Biosecurity = 'Biosecurity',
  Automation = 'Automation'
}

export interface Task {
  id: string;
  title: string;
  type: 'General' | 'Feeding' | 'Cleaning' | 'Health' | 'Maintenance' | 'Crops';
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  assignedTo?: string; // User ID
  description?: string;
  relatedEntityId?: string; // e.g., Pig ID, Field ID
  // Enhanced Fields
  checklist?: { id: string; text: string; completed: boolean; }[];
  verificationMethod?: 'None' | 'QR_Scan' | 'Photo' | 'GPS';
  targetQrCode?: string;
}

export interface TaskTemplate {
  id: string;
  title: string;
  type: Task['type'];
  priority: Task['priority'];
  daysAfterTrigger: number;
  description?: string;
  checklist?: string[]; // Array of strings for template
  verificationMethod?: Task['verificationMethod'];
}

export interface Protocol {
  id: string;
  name: string;
  description?: string;
  triggerType: 'Manual' | 'Event';
  triggerEvent?: string; // e.g. 'Sow_Farrowed'
  templates: TaskTemplate[];
  active: boolean;
}
export interface VisitorLogEntry {
  id: string;
  name: string;
  company?: string;
  contact: string;
  purpose: string;
  checkInTime: string; // ISO String
  checkOutTime?: string; // ISO String optional
  date: string;
  status: 'Checked In' | 'Checked Out';
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: 'SOPs' | 'Manuals' | 'Health' | 'HR' | 'Other';
  type: 'PDF' | 'DOCX' | 'XLSX' | 'TXT';
  size: string;
  uploadDate: string;
  addedBy: string;
  url?: string; // For mock download
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

export interface Asset {
  id: string;
  name: string;
  type: 'Tractor' | 'Truck' | 'Generator' | 'Pump' | 'Other';
  model: string;
  purchaseDate: string;
  value: number;
  status: 'Active' | 'Maintenance' | 'Broken' | 'Sold';
}

export interface MaintenanceLog {
  id: string;
  assetId: string;
  date: string;
  type: 'Service' | 'Repair' | 'Inspection';
  description: string;
  cost: number;
  nextServiceDate?: string;
  provider?: string;
}

export interface FuelLog {
  id: string;
  assetId: string;
  date: string;
  quantity: number;
  cost: number;
  currentMeterReading?: number;
}

// Crop Farming Types
export interface Field {
  id: string;
  name: string;
  size: number;
  location?: string;
  soilType?: string;
  status: 'Planted' | 'Fallow' | 'Preparation';
  currentCropId?: string;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  type: string;
  daysToMaturity: number;
  expectedYieldPerHa: number;
  imageUrl?: string;
}

export interface CropCycle {
  id: string;
  fieldId: string;
  cropId: string;
  plantingDate: string;
  expectedHarvestDate: string;
  status: 'Active' | 'Harvested' | 'Failed';
  harvestDate?: string;
  yieldAmount?: number;
  yieldQuality?: string;
  destination?: 'Market' | 'FeedInventory'; // Added for Mixed Farming
  feedTypeId?: string; // If destined for Feed
  notes?: string;
}

export interface CropActivity {
  id: string;
  fieldId: string;
  cycleId?: string;
  date: string;
  type: 'Scouting' | 'Fertilizer' | 'Pest Control' | 'Irrigation' | 'Harvest' | 'Land Prep' | 'Other';
  description: string;
  cost: number;
  fertilizerSource?: 'Synthetic' | 'Manure'; // Added for Mixed Farming
}

export interface HarvestLog {
  id: string;
  cycleId: string;
  date: string;
  quantity: number; // Added quantity
  quality: string;
  destination?: 'Market' | 'FeedInventory'; // Added for Mixed Farming
  feedTypeId?: string; // If destined for Feed
}

export interface TimesheetLog {
  id: string;
  userId: string;
  date: string;
  activityType: 'General' | 'Field Work' | 'Machinery' | 'Herding' | 'Other';
  hours: number;
  description: string;
  relatedId?: string; // Links to Field/Asset/Pig
}

