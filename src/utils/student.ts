import { GroupStudent, Student } from '../types';

export const getCompany = (student: Student | GroupStudent) => (student.company === 'mc' ? 'MC' : 'DK');

export const getName = (student: Student | GroupStudent) =>
  `${student.firstName} ${student.lastName} (${getCompany(student)})`;
