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
}

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

const StudentsForm: FC<Props> = ({ isOpen, close }) => {
    const [loading, setLoading] = useState(false);
    const firebase = useContext(FirebaseContext);
    const args: FormikConfig<FormModel> = {
        validationSchema,
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            billing: { companyAddress: '', companyName: '', companyRegNumber: '' },
        },
        onSubmit: async (data) => {
            try {
                setLoading(true);
                await firebase
                    .students()
                    .doc()
                    .set(data);

                setLoading(false);
                close();
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        },
    };

    return (
        <Dialog isOpen={isOpen}>
            <Formik {...args}>
                <Form>
                    <div className={Classes.DIALOG_BODY}>
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

export default StudentsForm;
