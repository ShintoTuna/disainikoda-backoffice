import React, { FC, useState, useContext } from 'react';
import { Classes, Button, Card, HTMLSelect } from '@blueprintjs/core';
import { Student, Config, AllowedCompanies } from 'types';
import { FirebaseContext } from 'contexts/Firebase';
import StyledInput from 'components/Form/StyledInput';
import { Form, Formik, FormikConfig } from 'formik';
import * as Yup from 'yup';
import Loader from 'components/Loader';
import maxBy from 'lodash/maxBy';
import { withAuthorization, Condition } from 'contexts/Session';

import { getName } from 'utils/student';
import GroupPicker from 'pages/Invoice/GroupPicker';
import ClientPicker from 'pages/Invoice/ClientPicker';
import StyledSelect from 'components/Form/StyledSelect';

interface FormModel {
  invoices: any[];
  title: string;
}

const Invoice: FC = () => {
  const [loading] = useState(false);
  const [company, setCompany] = useState<AllowedCompanies>('dk');
  const [students, setStudents] = useState<Student[]>([]);
  const firebase = useContext(FirebaseContext);
  const { formikArgs, submitting } = useForm(students, firebase.config as Config, company);

  const handleAddStudent = (newStudent: Student) => {
    if (window.confirm(`Add ${getName(newStudent)} to invoice?`)) {
      setStudents((currentStudents) => {
        const isAlreadyAdded = currentStudents.find((student) => student.uid === newStudent.uid);

        return !!isAlreadyAdded ? currentStudents : [...currentStudents, newStudent];
      });
    }
  };

  const handleAddGroupOfStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
  };

  const handleRemoveStudent = (index: number) => {
    setStudents((currentStudents) => {
      const newStudents = [...currentStudents];
      newStudents.splice(index, 1);

      return newStudents;
    });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setCompany(e.target.value as AllowedCompanies);
  };

  return (
    <Loader loading={!firebase.config || loading}>
      <Formik {...formikArgs}>
        <Form>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div>
                <GroupPicker addStudents={handleAddGroupOfStudents} />
                <ClientPicker addStudents={handleAddStudent} />
              </div>
              <div style={{ flex: 1, paddingLeft: '20px' }}>
                {students.length > 0 && (
                  <>
                    <HTMLSelect name="company" defaultValue="dk" onChange={handleCompanyChange}>
                      <option value="dk">Disainikoda</option>
                      <option value="mc">Monochrome</option>
                    </HTMLSelect>
                    <table
                      className={[Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED, Classes.INTERACTIVE].join(' ')}
                      style={{ width: '100%', marginBottom: '16px' }}
                    >
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Invoice Nr.</th>
                          <th>Billing Amount</th>
                          <th>&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, i) => (
                          <InvoiceRow key={i} student={student} index={i} removeStudent={handleRemoveStudent} />
                        ))}
                      </tbody>
                    </table>
                    <StyledInput name="title" label="Invoice subject title" />
                    <Button loading={submitting} type="submit" intent="primary">
                      Send invoices
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </Form>
      </Formik>
    </Loader>
  );
};

const InvoiceRow: FC<{ student: Student; index: number; removeStudent: (i: number) => void }> = ({
  student,
  index,
  removeStudent,
}) => {
  const billingName = () => (student.billing && student.billing.companyName ? ` (${student.billing.companyName})` : '');

  return (
    <tr>
      <td>{`${getName(student)}${billingName()}`}</td>
      <td>{student.email}</td>
      <td>
        <StyledInput type="number" disabled name={`invoices.${index}.number`} />
      </td>
      <td>
        <StyledInput type="number" name={`invoices.${index}.amount`} />
      </td>
      <td>
        <Button icon="trash" onClick={() => removeStudent(index)} />
      </td>
    </tr>
  );
};

function useForm(students: Student[], config: Config, company: AllowedCompanies) {
  const [loading, setLoading] = useState(false);
  const firebase = useContext(FirebaseContext);
  let counter = 0;

  const id = (company === 'mc' ? config && config.invoice.mcLastId : config && config.invoice.lastId) || 0;
  const amount =
    (company === 'mc' ? config && config.invoice.mcDefaultAmount : config && config.invoice.defaultAmount) || 0;

  const initialValues = () =>
    students.map((s) => {
      counter++;

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

        console.log(data);

        const { number: lastId } = maxBy(data.invoices, 'number');
        const batch = firebase.db.batch();

        for (const invoice of data.invoices) {
          if (invoice.included) {
            const ref = firebase.invoice(invoice.number);
            batch.set(ref, {
              student: invoice.uid,
              amount: invoice.amount,
              title: data.title,
              company,
              date: firebase.getTimestamp(),
            });
          }
        }

        await batch.commit();
        await firebase.setNewInvoiceId(lastId, company);
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
