import React, { FC, useState, useContext } from 'react';
import { Form, Formik, FormikConfig } from 'formik';
import StyledInput from '../../components/Form/StyledInput';
import { Button, Divider, Dialog, Classes } from '@blueprintjs/core';
import * as Yup from 'yup';
import { FirebaseContext } from '../../contexts/Firebase';
import { Student } from '../../types';

interface Props {
  isOpen: boolean;
  close: () => void;
  selected: Student | null;
}

const StudentsForm: FC<Props> = ({ isOpen, close, selected }) => {
  const { args, loading } = useForm(selected, close);

  return (
    <Dialog isOpen={isOpen}>
      <Formik {...args}>
        <Form>
          <div className={Classes.DIALOG_BODY}>
            <StyledInput type="hidden" name="uid" />
            <StyledInput name="firstName" label="First Name" />
            <StyledInput name="lastName" label="Last Name" />
            <StyledInput name="email" label="Email" />
            <StyledInput name="phone" label="Phone" />
            <Divider />
            <StyledInput name="billing.companyName" label="Company Name" />
            <StyledInput name="billing.companyAddress" label="Company address" />
            <StyledInput name="billing.companyRegNumber" label="Company Reg. Nr." />
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <Button type="submit" loading={loading} intent="primary" style={{ marginRight: '8px' }}>
              Save
            </Button>

            <Button onClick={close}>Cancel</Button>
          </div>
        </Form>
      </Formik>
    </Dialog>
  );
};

type FormModel = Student;

function useForm(selected: Props['selected'], close: Props['close']) {
  const [loading, setLoading] = useState(false);
  const firebase = useContext(FirebaseContext);
  const defaults = {
    uid: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    billing: { companyAddress: '', companyName: '', companyRegNumber: '' },
  };

  const args: FormikConfig<FormModel> = {
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required(),
      lastName: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      billing: Yup.object().shape({
        companyName: Yup.string().max(255),
        companyAddress: Yup.string().max(255),
        companyRegNumber: Yup.string().max(255),
      }),
    }),
    initialValues: selected ? { ...defaults, ...selected } : defaults,
    onSubmit: async (data) => {
      try {
        setLoading(true);
        if (data.uid.length > 0) {
          await firebase.student(data.uid).set(data);
        } else {
          await firebase
            .students()
            .doc()
            .set(data);
        }

        setLoading(false);
        close();
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
  };

  return { args, loading };
}

export default StudentsForm;
