import React, { FC, useContext, useState } from 'react';
import { Button, Card, Elevation, H3 } from '@blueprintjs/core';
import s from './SignIn.module.css';
import { Form, FormikProps, Formik, FormikConfig } from 'formik';
import StyledInput from '../../components/Form/StyledInput';
import { FirebaseContext } from '../../contexts/Firebase';
import Route from '../../constants/routes';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import * as Yup from 'yup';

interface FormModel {
  email: string;
  password: string;
}

type Props = FormikProps<FormModel> & RouteComponentProps<null>;

const validationSchema = () =>
  Yup.object().shape({
    password: Yup.string().required(),
    email: Yup.string()
      .email()
      .required(),
  });

const SignIn: FC<Props> = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const firebase = useContext(FirebaseContext);

  const args: FormikConfig<FormModel> = {
    validationSchema,
    validateOnBlur: true,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ email, password }, { setFieldError }) => {
      try {
        setLoading(true);
        await firebase.doSignInWithEmailAndPassword(email, password);
        history.push(Route.home);
      } catch (error) {
        if (error.code === 'auth/wrong-password') {
          setFieldError('password', error.message);
        } else {
          setFieldError('password', 'Invalid credentials');
        }

        setLoading(false);
      }
    },
  };

  return (
    <div className={s.container}>
      <Card interactive={true} elevation={Elevation.TWO} style={{ width: '300px' }}>
        <H3>Sign In</H3>
        <Formik {...args}>
          <Form>
            <div>
              <StyledInput name="email" label="Email" />
              <StyledInput name="password" type="password" label="Password" />
            </div>
            <Button type="submit" intent="primary" loading={loading}>
              Sign In
            </Button>
          </Form>
        </Formik>
      </Card>
    </div>
  );
};

export default withRouter(SignIn);
