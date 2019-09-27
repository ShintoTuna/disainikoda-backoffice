import React, { FC, useState, useContext, useEffect } from 'react';
import { Classes, Button } from '@blueprintjs/core';
import { Student } from '../../types';
import { FirebaseContext } from '../../contexts/Firebase';
import StyledInput from '../../components/Form/StyledInput';
import { Form, Formik, FormikConfig, FieldArray } from 'formik';
import * as Yup from 'yup';
import StyledCheckbox from '../../components/Form/StyledCheckbox';
import FormikDebug from '../../utils/FormikDebug';

interface FormModel {}

const Invoice: FC = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const firebase = useContext(FirebaseContext);
    const { formikArgs, submitting } = useForm(students);

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
            <Formik {...formikArgs}>
                <Form>
                    <FieldArray name="invoices">
                        {(arrayHelpers) =>
                            students.length > 0 && (
                                <table className={[Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED].join(' ')}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Invoice Nr.</th>
                                            <th>Billing Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, i) => (
                                            <InvoiceRow key={i} student={student} index={i} />
                                        ))}
                                    </tbody>
                                </table>
                            )
                        }
                    </FieldArray>
                    <Button>Send invoices</Button>
                    <FormikDebug />
                </Form>
            </Formik>
        </div>
    );
};

const InvoiceRow: FC<{ student: Student; index: number }> = ({ student, index }) => {
    const billingName = () =>
        student.billing && student.billing.companyName ? ` (${student.billing.companyName})` : '';

    return (
        <tr>
            <td>{`${student.lastName} ${student.firstName}${billingName()}`}</td>
            <td>
                <StyledInput name={`invoices.${index}.number`} />
            </td>
            <td>
                <StyledInput name={`invoices.${index}.amount`} />
            </td>
        </tr>
    );
};

function useForm(students: Student[]) {
    const [loading, setLoading] = useState(false);
    const firebase = useContext(FirebaseContext);

    // const initialValues = () => {
    //     return
    // }

    const formikArgs: FormikConfig<FormModel> = {
        initialValues: {
            invoices: [],
        },
        onSubmit: async (data) => {
            try {
                setLoading(true);
                // await firebase
                //     .students()
                //     .doc()
                //     .set(data);

                console.log(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        },
    };

    return { formikArgs, submitting: loading };
}

export default Invoice;
