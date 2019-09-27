import React, { FC, useState, useContext } from 'react';
import { Form, Formik, FormikConfig } from 'formik';
import StyledInput from '../../components/Form/StyledInput';
import { Button, Divider } from '@blueprintjs/core';
import * as Yup from 'yup';
import { FirebaseContext } from '../../contexts/Firebase';
import { Student } from '../../types';

type FormModel = Omit<Student, 'uid'>;

const validationSchema = () =>
    Yup.object().shape({
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
    });

const StudentsForm: FC = () => {
    const [loading, setLoading] = useState(false);
    const firebase = useContext(FirebaseContext);
    const args: FormikConfig<FormModel> = {
        validationSchema,
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            billing: { companyAddress: '', companyName: '', companyRegNumber: '' },
        },
        onSubmit: async (data) => {
            try {
                setLoading(true);
                await firebase
                    .students()
                    .doc()
                    .set(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        },
    };

    return (
        <div>
            <Formik {...args}>
                <Form>
                    <StyledInput name="firstName" label="First Name" />
                    <StyledInput name="lastName" label="Last Name" />
                    <StyledInput name="email" label="Email" />
                    <Divider />
                    <StyledInput name="billing.companyName" label="Company Name" />
                    <StyledInput name="billing.companyAddress" label="Company address" />
                    <StyledInput name="billing.companyRegNumber" label="Company Reg. Nr." />
                    <Button type="submit" loading={loading}>
                        Save
                    </Button>
                </Form>
            </Formik>
        </div>
    );
};

export default StudentsForm;
