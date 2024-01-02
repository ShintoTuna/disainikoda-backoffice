export interface UserWithRoles extends Omit<firebase.User, 'password'> {
  roles: { [key: string]: string };
}

export interface Student {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company: AllowedCompanies;
  billing?: {
    companyName: string;
    companyAddress: string;
    companyRegNumber: string;
  };
}

export interface Config {
  invoice: {
    defaultAmount: number;
    lastId: number;
    mcDefaultAmount: number;
    mcLastId: number;
  };
}

export interface Group {
  name: string;
  archived: boolean;
  uid: string;
}

export type GroupStudent = Omit<Student, 'email' | 'phone'> & { groupUid: string };

export type AllowedCompanies = 'dk' | 'mc';
