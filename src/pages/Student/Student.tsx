import React, { FC, useState, useContext, useEffect } from 'react';
import { Student } from '../../types';
import { FirebaseContext } from '../../contexts/Firebase';
import { Classes } from '@blueprintjs/core';

const Students: FC = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const firebase = useContext(FirebaseContext);

    useEffect(
        () =>
            firebase.students().onSnapshot((snapshot) => {
                const dbStudents: Student[] = [];

                snapshot.forEach((doc) => dbStudents.push({ ...(doc.data() as Student), uid: doc.id }));

                setStudents(dbStudents);
                setLoading(false);
            }),
        [firebase],
    );

    return (
        <div>
            {loading && <p>Loading ...</p>}
            {students.length > 0 && <StudentsTable students={students} />}
        </div>
    );
};

const StudentsTable: FC<{ students: Student[] }> = ({ students }) => {
    return (
        <table className={[Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED].join(' ')}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Billing</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student, i) => (
                    <StudentRow key={i} student={student} />
                ))}
            </tbody>
        </table>
    );
};

const StudentRow: FC<{ student: Student }> = ({ student }) => {
    const billingInformation = () => {
        if (student.billing) {
            return (
                <div>
                    {student.billing.companyName}
                    <br />
                    {student.billing.companyAddress}
                    <br />
                    {student.billing.companyRegNumber}
                </div>
            );
        }

        return '';
    };
    return (
        <tr>
            <td>{`${student.lastName} ${student.firstName}`}</td>
            <td>{student.email}</td>
            <td>{billingInformation()}</td>
        </tr>
    );
};

export default Students;
