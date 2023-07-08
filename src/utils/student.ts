import { Student } from '../types';

export const getName = (student: Student) => `${student.firstName} ${student.lastName}`;
