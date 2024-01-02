import { firestore } from 'firebase-admin';

export interface Invoice {
  company: 'dk' | 'mc';
  amount: number;
  date: firestore.Timestamp;
  student: string;
  title: string;
}

export interface InvoiceWithNumber extends Invoice {
  number: number;
}

export interface Student {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  billing?: {
    companyName: string;
    companyAddress: string;
    companyRegNumber: string;
  };
}
