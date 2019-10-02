import React, { FC, useState, useContext, useEffect } from 'react';
import { Classes, Button, Card } from '@blueprintjs/core';
import { Student, Config } from '../../types';
import { FirebaseContext } from '../../contexts/Firebase';
import StyledInput from '../../components/Form/StyledInput';
import { Form, Formik, FormikConfig } from 'formik';
import * as Yup from 'yup';
import StyledCheckbox from '../../components/Form/StyledCheckbox';
import Loader from '../../components/Loader';
import maxBy from 'lodash/maxBy';
import { withAuthorization, Condition } from '../../contexts/Session';

interface FormModel {
    invoices: any[];
    title: string;
}

const Invoice: FC = () => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const firebase = useContext(FirebaseContext);
    const { formikArgs, submitting } = useForm(students, firebase.config as Config);

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
        <Loader loading={!(students.length > 0 && firebase.config) || loading}>
            <Formik {...formikArgs}>
                <Form>
                    <Card>
                        <table
                            className={[Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED, Classes.INTERACTIVE].join(' ')}
                            style={{ width: '100%', marginBottom: '16px' }}
                        >
                            <thead>
                                <tr>
                                    <th>&nbsp;</th>
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
                        <StyledInput name="title" label="Invoice subject title" />
                        <Button loading={submitting} type="submit" intent="primary">
                            Send invoices
                        </Button>
                    </Card>
                </Form>
            </Formik>
        </Loader>
    );
};

const InvoiceRow: FC<{ student: Student; index: number }> = ({ student, index }) => {
    const billingName = () =>
        student.billing && student.billing.companyName ? ` (${student.billing.companyName})` : '';

    return (
        <tr>
            <td>
                <StyledCheckbox name={`invoices.${index}.included`} disabled />
            </td>
            <td>{`${student.lastName} ${student.firstName}${billingName()}`}</td>
            <td>
                <StyledInput type="number" disabled name={`invoices.${index}.number`} />
            </td>
            <td>
                <StyledInput type="number" name={`invoices.${index}.amount`} />
            </td>
        </tr>
    );
};

function useForm(students: Student[], config: Config) {
    const [loading, setLoading] = useState(false);
    const firebase = useContext(FirebaseContext);
    let counter = 0;

    const initialValues = () =>
        students.map((s) => {
            counter++;
            const id = (config && config.invoice.lastId) || 0;
            const amount = (config && config.invoice.defaultAmount) || 0;

            return { uid: s.uid, number: id + counter, amount, included: true };
        });

    const formikArgs: FormikConfig<FormModel> = {
        validationSchema: Yup.object().shape({
            title: Yup.string().required(),
            invoices: Yup.array().required(),
        }),
        enableReinitialize: true,
        initialValues: {
            title: '',
            invoices: config ? initialValues() : [],
        },
        onSubmit: async (data) => {
            const ask = window.confirm('Send invoices?');

            if (!ask) {
                return;
            }

            try {
                setLoading(true);

                const { number: lastId } = maxBy(data.invoices, 'number');
                const batch = firebase.db.batch();

                for (const invoice of data.invoices) {
                    if (invoice.included) {
                        const ref = firebase.invoice(invoice.number);
                        batch.set(ref, {
                            student: invoice.uid,
                            amount: invoice.amount,
                            title: data.title,
                            date: firebase.getTimestamp(),
                        });
                    }
                }

                batch.commit();

                firebase.setNewInvoiceId(lastId);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        },
    };

    return { formikArgs, submitting: loading };
}

export default withAuthorization(Condition.isAdmin)(Invoice);
