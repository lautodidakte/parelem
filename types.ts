
export type Role = 'TREASURER' | 'MEMBER' | 'SUPERVISOR';
export type GlobalRole = 'USER' | Role; // SUPERVISOR garde un accès spécial ONG
export type OrganizationRole = 'ADMIN' | 'MEMBER';
export type TransactionType = 'CONTRIBUTION' | 'LOAN' | 'LOAN_REPAYMENT' | 'INCOME' | 'EXPENSE';
export type MemberStatus = 'UP_TO_DATE' | 'LATE';
export type CycleType = 'ROTATING' | 'SAVINGS';
export type SelectionMethod = 'ORDER' | 'RANDOM' | 'VOTE';
export type Visibility = 'PUBLIC' | 'PRIVATE';
export type BusinessPlanStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';
export type PaymentProvider = 'CASH' | 'AIRTEL_MONEY' | 'MOOV_MONEY' | 'KONOOM';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: GlobalRole; 
  // IDs des tontines gérées (Admin)
  managedOrgIds: string[];
  // IDs des tontines où l'utilisateur est membre
  memberOrgIds: string[];
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface Member {
  id: string;
  userId: string; // Lien vers le profil User global
  fullName: string;
  phone: string;
  status: MemberStatus;
  role: OrganizationRole;
  avatarUrl?: string;
  totalContributed: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  orgId?: string; // Si lié à une tontine spécifique
  content: string;
  type: 'ANNOUNCEMENT' | 'DISCUSSION' | 'NEW_GROUP';
  likes: number;
  comments: number;
  timestamp: string; // ISO Date
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  memberId?: string;
  memberName?: string;
  provider?: PaymentProvider;
  fees?: number;
  aiAnalysis?: {
    isSuspicious: boolean;
    reason?: string;
  };
}

export interface Cycle {
  id: string;
  type: CycleType;
  status: 'ACTIVE' | 'COMPLETED';
  participants: string[];
  currentBeneficiaryId?: string;
  method: SelectionMethod;
  amountPerMember: number;
  frequency: 'WEEKLY' | 'MONTHLY';
}

export interface LoanRequest {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  businessPlanSummary: string;
  jobsPromise: number; // Impact data: estimated jobs created
  status: BusinessPlanStatus;
  requestDate: string;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  visibility: Visibility;
  location: {
    region: string;
    city: string;
  };
  currency: string;
  balance: number;
  stats: {
    totalMembers: number;
    totalSaved: number;
  };
  members: Member[];
  transactions: Transaction[];
  cycles: Cycle[];
  loanRequests: LoanRequest[]; // Sub-collection for business plan tracking
}

export interface ImpactReport {
  id: string;
  organizationId: string;
  period: string;
  metrics: {
    jobsCreated: number;
    revenueGrowth: number;
    accessToFinanceScore: number;
  };
  processScore: number;
}

export interface RotationItem {
    rank: number;
    memberId: string;
    memberName: string;
    date: string;
    status: 'Reçu' | 'En cours' | 'En attente';
    amount: number;
    avatar: string;
}

export interface Debt {
    id: string;
    counterparty: string;
    reason: string;
    amount: number;
    totalAmount?: number;
    date: string;
    dueDate?: string;
    avatar: string;
    type: 'OWED_BY_ME' | 'OWED_TO_ME';
}
