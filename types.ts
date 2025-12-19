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
  nursingCount?: number; // Added for Dr. Gusha ration formula
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
  currency?: Currency; // Added for Multi-currency support
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
  type: 'Vaccination' | 'Treatment' | 'Checkup' | 'Mortality' | 'Deworming';
  description: string;
  medication?: string;
  administeredBy: string;
  medicalItemId?: string;
  quantityUsed?: number;
  // Clinical Data
  causeOfDeath?: 'Crushed' | 'Scouring' | 'Weak' | 'Disease' | 'Unknown';
  temperature?: number;
  bodyConditionScore?: number; // 1 to 5 scale
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

export type Currency = 'USD' | 'ZiG' | 'ZAR';

export interface ExchangeRate {
  pair: 'USD/ZiG';
  rate: number;
  lastUpdated: string;
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
  Automation = 'Automation',
  CRM = 'CRM',
  PrecisionFeeding = 'PrecisionFeeding',
  FarrowingWatch = 'FarrowingWatch',
  Vet = 'Vet',
  PrecisionAg = 'PrecisionAg',
  Workforce = 'Workforce',
  Logistics = 'Logistics',
  Genetics = 'Genetics',
  Energy = 'Energy',
  Procurement = 'Procurement'
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
  // Risk Assessment (Dr. Gusha Report)
  visitedOtherFarm: boolean;
  sanitized: boolean;
  riskLevel: 'Low' | 'Medium' | 'High';
  notes?: string;
}

export interface BiosecurityZone {
  id: string;
  name: string;
  riskCategory: 'Red' | 'Yellow' | 'Green';
  lastDisinfected: string;
  requiredSOPId?: string;
}

export interface ComplianceDoc {
  id: string;
  type: 'Movement Permit' | 'Vet Certificate' | 'Health Report';
  issueDate: string;
  expiryDate?: string;
  issuedBy: string;
  status: 'Valid' | 'Expired' | 'Pending';
  fileUrl?: string;
}

export interface AttendanceLog {
  id: string;
  userId: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  location?: { lat: number; lng: number; };
  status: 'On Site' | 'Out';
  method: 'Manual' | 'GPS' | 'Biometric';
}

export interface PerformanceScore {
  id: string;
  userId: string;
  category: 'Mortality Control' | 'Harvest Efficiency' | 'Task Completion';
  score: number; // 0-100
  period: string; // e.g., '2025-W48'
}

export interface PieceRateEarning {
  id: string;
  userId: string;
  date: string;
  taskType: string;
  quantity: number;
  unit: string;
  ratePerUnit: number;
  totalAmount: number;
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
  satelliteScans?: SatelliteScan[];
  lastNDVI?: number;
}

export interface SatelliteScan {
  id: string;
  date: string;
  imageUrl: string;
  ndviScore: number; // 0 to 1
  healthReport: string;
  alerts: string[];
}

export interface PrecisionMap {
  id: string;
  fieldId: string;
  type: 'Fertilizer' | 'Pest Control' | 'Seeding';
  prescriptionDate: string;
  resolutionMeters: number;
  dataPoints: { x: number, y: number, value: number, unit: string }[];
  status: 'Draft' | 'Sent to Tractor' | 'Applied';
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


// CRM & Direct Sales Types
export interface Customer {
  id: string;
  name: string;
  type: 'Wholesale' | 'Retail' | 'Restaurant' | 'Individual';
  contact: string;
  email?: string;
  address?: string;
  balance: number; // Current amount owed
  creditLimit?: number;
  lastOrderDate?: string;
}

export interface Order {
  id: string;
  customerId: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  totalAmount: number;
  paymentStatus: 'Unpaid' | 'Partial' | 'Paid';
  deliveryDate?: string;
  notes?: string;
  invoiceId?: string; // Linked Invoice
}

export interface Invoice {
  id: string;
  orderId: string;
  customerId: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
}

export interface LogisticsRoute {
  id: string;
  driverName: string;
  vehicleId: string;
  stops: {
    locationName: string;
    type: 'Pickup' | 'Dropoff' | 'Abattoir';
    status: 'Pending' | 'Completed' | 'Skipped';
    arrivalTime?: string;
  }[];
  status: 'En Route' | 'Completed' | 'Idle' | 'Maintenance';
  currentLat: number;
  currentLng: number;
  eta: string;
}

export interface WholesaleProduct {
  id: string;
  name: string;
  category: 'Pork' | 'Grain' | 'Vegetables';
  availableQty: number;
  unit: string;
  pricePerUnit: number;
  expectedHarvestDate?: string;
  qualityGrade: 'A' | 'B' | 'C';
}

export interface InventoryScan {
  id: string;
  itemId: string; // Feed ID or Med ID
  type: 'Inbound' | 'Usage' | 'Stocktake';
  quantity: number;
  timestamp: string;
  scannedBy: string;
  location: string;
}

export interface EnergyAsset {
  id: string;
  name: string;
  type: 'Critical' | 'Non-Essential';
  powerDrawKw: number;
  status: 'Active' | 'Shed';
}

export interface SolarSystemStatus {
  batteryLevel: number; // 0-100
  generationKw: number;
  currentLoadKw: number;
  isGridDown: boolean;
  assets: EnergyAsset[];
}

export interface SupplierQuote {
  id: string;
  supplierName: string;
  itemName: string;
  price: number;
  currency: Currency;
  date: string;
  validUntil: string;
  notes?: string;
}

export interface MarketRate {
  pair: string; // e.g., 'USD/ZAR'
  rate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PenMovement {
  id: string;
  userId: string;
  userName: string;
  penId: string;
  penName: string;
  timestamp: string;
  type: 'In' | 'Out';
  sanitized: boolean;
}

export interface InfectionAlert {
  id: string;
  penId: string;
  penName: string;
  disease: string;
  severity: 'Critical' | 'Warning';
  detectedAt: string;
  status: 'Active' | 'Contained';
}
