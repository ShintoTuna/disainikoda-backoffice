import { Student } from '../types';

export const getCompany = (student: Student) => (student.company === 'mc' ? 'MC' : 'DK');

export const getName = (student: Student) => `${student.firstName} ${student.lastName} (${getCompany(student)})`;
