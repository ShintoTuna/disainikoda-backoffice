import React, { FC, useState, useContext, useEffect } from 'react';
import { Student } from '../../types';
import { FirebaseContext } from '../../contexts/Firebase';
import { Classes, Button, Card } from '@blueprintjs/core';
import Loader from '../../components/Loader';
import StudentsForm from './StudentForm';
import { withAuthorization, Condition } from '../../contexts/Session';

const Students: FC = () => {
    const [isOpen, setOpen] = useState(false);
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
        <Card style={{ maxWidth: '800px' }}>
            <Button onClick={() => setOpen(true)} style={{ marginBottom: '16px' }}>
                Add new
            </Button>
            <StudentsForm isOpen={isOpen} close={() => setOpen(false)} />
            <Loader loading={loading}>{students.length > 0 && <StudentsTable students={students} />}</Loader>
        </Card>
    );
};

const StudentsTable: FC<{ students: Student[] }> = ({ students }) => {
    return (
        <table
            className={[Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED, Classes.INTERACTIVE].join(' ')}
            style={{ width: '100%' }}
        >
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
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
            <td>{student.phone}</td>
            <td>{billingInformation()}</td>
        </tr>
    );
};

export default withAuthorization(Condition.isAdmin)(Students);
