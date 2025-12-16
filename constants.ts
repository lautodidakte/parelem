
import { Organization, User, ImpactReport, RotationItem, Debt, Post, LoanRequest } from './types';

// Utilisateur Hybride : Il gère "Cercle des Entrepreneurs" et est membre de "Famille"
// Fix: Added isVerified property required by User interface
export const CURRENT_USER_TREASURER: User = {
  uid: 'u1',
  email: 'mahamat@directpare.td',
  displayName: 'Mahamat Ali',
  role: 'TREASURER',
  isVerified: true,
  managedOrgIds: ['org1'],
  memberOrgIds: ['org2']
};

// Fix: Added isVerified property required by User interface
export const CURRENT_USER_MEMBER: User = {
  uid: 'u3',
  email: 'zara@directpare.td',
  displayName: 'Zara Yacoub',
  role: 'MEMBER',
  isVerified: false,
  managedOrgIds: [],
  memberOrgIds: ['org1']
};

// Fix: Added isVerified property required by User interface
export const CURRENT_USER_THIERRY: User = {
  uid: 'u_thierry',
  email: 'thierry@directpare.td',
  displayName: 'Thierry Nemonguel',
  role: 'MEMBER',
  isVerified: false,
  managedOrgIds: [],
  memberOrgIds: ['org1']
};

// Fix: Added isVerified property required by User interface
export const CURRENT_USER_SUPERVISOR: User = {
  uid: 'u2',
  email: 'fatime@ngo-chad.org',
  displayName: 'Fatimé Zara',
  role: 'SUPERVISOR',
  isVerified: true,
  managedOrgIds: [],
  memberOrgIds: []
};

// Aliases for compatibility
export const CURRENT_USER = CURRENT_USER_TREASURER;
export const CURRENT_SUPERVISOR = CURRENT_USER_SUPERVISOR;

export const MOCK_WALLET_TRANSACTIONS = [
  { id: 'wt1', type: 'CREDIT', amount: 50000, label: 'Rechargement Mobile Money', date: '01 Juin 2025' },
  { id: 'wt2', type: 'DEBIT', amount: 10000, label: 'Cotisation "Famille"', date: '05 Juin 2025' },
  { id: 'wt3', type: 'CREDIT', amount: 15000, label: 'Vente Sésame (Partiel)', date: '10 Juin 2025' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    authorId: 'u2',
    authorName: 'Fatimé Zara (ONG)',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatime',
    content: 'Félicitations au groupe "Femmes de Mongo" pour l\'achat de leur nouveau moulin ! 🌾 Un bel exemple de réussite communautaire.',
    type: 'ANNOUNCEMENT',
    likes: 45,
    comments: 12,
    timestamp: '2025-06-10T09:00:00Z'
  },
  {
    id: 'p2',
    authorId: 'u5',
    authorName: 'Idriss Déby',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Idriss',
    content: 'Je cherche des conseils pour configurer une tontine rotative pour 20 personnes. Quelle fréquence recommandez-vous ?',
    type: 'DISCUSSION',
    likes: 8,
    comments: 24,
    timestamp: '2025-06-11T14:30:00Z'
  },
  {
    id: 'p3',
    authorId: 'u1',
    authorName: 'Mahamat Ali',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mahamat',
    orgId: 'org1',
    content: 'Rappel : La réunion mensuelle aura lieu ce samedi à 15h. Ordre du jour : Validation des Business Plans.',
    type: 'DISCUSSION',
    likes: 12,
    comments: 5,
    timestamp: '2025-06-12T10:00:00Z'
  }
];

export const MOCK_LOAN_REQUESTS: LoanRequest[] = [
  {
    id: 'lr1',
    memberId: 'm2',
    memberName: 'Zara Yacoub',
    amount: 500000,
    businessPlanSummary: 'Achat de semences améliorées et location de tracteur pour la saison des pluies.',
    jobsPromise: 3,
    status: 'PENDING',
    requestDate: '2025-06-10'
  },
  {
    id: 'lr2',
    memberId: 'm3',
    memberName: 'Abakar Moussa',
    amount: 250000,
    businessPlanSummary: 'Extension du stock de la boutique de quartier.',
    jobsPromise: 1,
    status: 'VALIDATED',
    requestDate: '2025-06-05'
  }
];

export const MOCK_ORG: Organization = {
  id: 'org1',
  name: 'Cercle des Entrepreneurs',
  type: 'ROTATIVE',
  visibility: 'PRIVATE',
  location: { region: 'Chari-Baguirmi', city: 'N’Djamena' },
  currency: 'XAF',
  balance: 325000,
  stats: {
    totalMembers: 13,
    totalSaved: 4500000
  },
  members: [
    { id: 'm1', userId: 'u1', fullName: 'Mahamat Ali', role: 'ADMIN', phone: '+235 66 12 34 56', status: 'UP_TO_DATE', totalContributed: 200000, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mahamat' },
    { id: 'm2', userId: 'u3', fullName: 'Zara Yacoub', role: 'MEMBER', phone: '+235 99 88 77 66', status: 'UP_TO_DATE', totalContributed: 150000, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara' },
    { id: 'm3', userId: 'u4', fullName: 'Abakar Moussa', role: 'MEMBER', phone: '+235 66 00 11 22', status: 'LATE', totalContributed: 50000, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abakar' },
    { id: 'm4', userId: 'u_thierry', fullName: 'Thierry Nemonguel', role: 'MEMBER', phone: '+235 66 99 88 77', status: 'UP_TO_DATE', totalContributed: 0, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thierry' },
  ],
  transactions: [
    { 
      id: 't1', 
      type: 'EXPENSE', 
      amount: 150000, 
      category: 'Location Moto-pompe', 
      date: '2025-06-05T10:00:00Z', 
      memberId: 'm3', 
      memberName: 'AUTRE',
      provider: 'CASH',
      aiAnalysis: { isSuspicious: false, reason: 'Location matériel agricole' } 
    },
    { 
      id: 't2', 
      type: 'INCOME', 
      amount: 500000, 
      category: 'Vente de sésame', 
      date: '2025-06-01T09:00:00Z', 
      memberId: 'm2', 
      memberName: 'VENTES',
      provider: 'AIRTEL_MONEY',
      fees: 5000,
      aiAnalysis: { isSuspicious: false }
    },
  ],
  cycles: [
    {
      id: 'c1',
      type: 'ROTATING',
      status: 'ACTIVE',
      participants: ['m1', 'm2', 'm3', 'm4'],
      method: 'ORDER',
      amountPerMember: 100000,
      frequency: 'MONTHLY'
    }
  ],
  loanRequests: MOCK_LOAN_REQUESTS
};

export const MOCK_ROTATION: RotationItem[] = [
  { rank: 1, memberId: 'm2', memberName: 'Zara Yacoub', date: '15 Jan 2025', status: 'Reçu', amount: 1200000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara' },
  { rank: 2, memberId: 'm3', memberName: 'Abakar Moussa', date: '15 Fév 2025', status: 'Reçu', amount: 1200000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abakar' },
  { rank: 3, memberId: 'm1', memberName: 'Mahamat Ali (Vous)', date: '15 Mar 2025', status: 'En cours', amount: 1200000, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mahamat' },
];

export const MOCK_DEBTS: { owedByMe: Debt[], owedToMe: Debt[] } = {
  owedByMe: [
    { id: 'd1', type: 'OWED_BY_ME', counterparty: 'Zara Yacoub', reason: 'Achat semences urgentes', amount: 50000, totalAmount: 50000, dueDate: '20 Juin 2025', date: '2025-05-20', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara' }
  ],
  owedToMe: [
    { id: 'd2', type: 'OWED_TO_ME', counterparty: 'Abakar Moussa', reason: 'Dépannage frais médicaux', amount: 10000, date: '15 Mai 2025', dueDate: '15 Juin 2025', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abakar' }
  ]
};

export const MOCK_IMPACT_REPORTS: ImpactReport[] = [
  {
    id: 'ir1',
    organizationId: 'org1',
    period: '2023-T4',
    metrics: { jobsCreated: 3, revenueGrowth: 12, accessToFinanceScore: 7.5 },
    processScore: 85
  }
];

export const MOCK_COHORTS = [
  {
    id: 'coh1',
    name: 'Cohorte N’Djamena Est - 2024',
    organizationIds: ['org1'],
    milestones: [
      { name: 'Formation Initiale', status: 'COMPLETED', date: '2024-01-15' },
      { name: 'Plan d\'Affaires', status: 'IN_PROGRESS', date: '2024-03-30' },
    ]
  }
];
