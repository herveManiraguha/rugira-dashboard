// Demo users for Replit demo (DO NOT use in production)
export interface DemoUser {
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
  tenantRoles: Record<string, string[]>;
}

export const demoUsers: DemoUser[] = [
  {
    username: 'hans.mueller',
    password: 'Hans1234!',
    name: 'Hans Müller',
    email: 'hans.mueller@rugira.ch',
    role: 'Admin',
    tenantRoles: {
      'rugira-prod': ['admin', 'trader'],
      'rugira-test': ['admin'],
      'client-alpha': ['admin']
    }
  },
  {
    username: 'clara.fischer',
    password: 'Clara1234!',
    name: 'Clara Fischer',
    email: 'clara.fischer@rugira.ch',
    role: 'Compliance',
    tenantRoles: {
      'rugira-prod': ['compliance'],
      'rugira-test': ['compliance'],
      'client-alpha': ['compliance']
    }
  },
  {
    username: 'martin.keller',
    password: 'Martin1234!',
    name: 'Martin Keller',
    email: 'martin.keller@rugira.ch',
    role: 'Trading Lead',
    tenantRoles: {
      'rugira-prod': ['trader', 'admin'],
      'rugira-test': ['trader'],
      'client-alpha': ['trader']
    }
  },
  {
    username: 'lin.zhang',
    password: 'Lin1234!',
    name: 'Lin Zhang',
    email: 'lin.zhang@rugira.ch',
    role: 'Trader',
    tenantRoles: {
      'rugira-prod': ['trader'],
      'rugira-test': ['trader'],
      'client-alpha': ['viewer']
    }
  },
  {
    username: 'emma.sanchez',
    password: 'Emma1234!',
    name: 'Emma Sanchez',
    email: 'emma.sanchez@rugira.ch',
    role: 'Analyst',
    tenantRoles: {
      'rugira-prod': ['analyst'],
      'rugira-test': ['analyst'],
      'client-alpha': ['analyst']
    }
  },
  {
    username: 'viktor.meier',
    password: 'Viktor1234!',
    name: 'Viktor Meier',
    email: 'viktor.meier@rugira.ch',
    role: 'Viewer',
    tenantRoles: {
      'rugira-prod': ['viewer'],
      'rugira-test': ['viewer'],
      'client-alpha': ['viewer']
    }
  },
  {
    username: 'audit.guest',
    password: 'Audit1234!',
    name: 'External Auditor',
    email: 'audit@external.com',
    role: 'External Auditor',
    tenantRoles: {
      'rugira-prod': ['auditor'],
      'rugira-test': ['auditor']
    }
  }
];