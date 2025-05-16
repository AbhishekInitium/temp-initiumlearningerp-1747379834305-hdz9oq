
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partially-paid';
export type LeadSource = 'Referral' | 'Website' | 'Social Media' | 'Partner' | 'Event' | 'Direct' | 'Other';
export type TrainingMode = 'Online' | 'Offline' | 'Hybrid';
export type StudentStatus = 'active' | 'completed' | 'dropped' | 'on-hold';

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  paymentMethod: string;
  reference: string;
  notes?: string;
}

export interface PaymentSchedule {
  id: string;
  studentId: string;
  dueDate: string;
  amount: number;
  status: PaymentStatus;
  actualPaymentDate?: string;
  paymentId?: string;
}

export interface StudentFinancials {
  id: string;
  studentId: string;
  totalFee: number;
  totalPaid: number;
  balance: number;
  nextPaymentDate?: string;
  paymentTerms: string;
  schedules: PaymentSchedule[];
  payments: Payment[];
}

export interface StudentDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  batch: string;
  course: string;
  attendance: number;
  progress: number;
  placementStatus: 'placed' | 'searching' | 'not-started' | 'opted-out';
  // Financial tracking fields
  location: string;
  leadSource: LeadSource;
  scc: string; // Service center code
  market: string;
  year: number;
  month: number;
  mode: TrainingMode;
  module: string;
  status: StudentStatus;
  quoted: number; // Quoted fee
  dateExpected: string; // Expected payment date
  expectedMonth: string; // Expected payment month
  totalCollected: number;
  balance: number;
  comments?: string;
  financials: StudentFinancials;
}
