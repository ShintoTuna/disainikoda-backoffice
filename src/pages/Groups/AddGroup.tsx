import { Button, Dialog } from '@blueprintjs/core';
import React, { FC, useContext, useState } from 'react';
import StyledInput from '../../components/Form/StyledInput';
import * as Yup from 'yup';
import { Form, Formik, FormikConfig } from 'formik';
import { FirebaseContext } from '../../contexts/Firebase';

interface Props {
  isOpen: boolean;
  close: () => void;
}
export const AddGroup: FC<Props> = ({ close, isOpen }) => {
  const { args, loading } = useForm(close);
  return (
    <Dialog isOpen={isOpen}>
      <h1>Add Group</h1>
      <Formik {...args}>
        <Form>
          <StyledInput name="name" label="Name" />
          <Button type="submit" loading={loading}>
            Save
          </Button>
        </Form>
      </Formik>
    </Dialog>
  );
};

function useForm(close: () => void) {
  const [loading, setLoading] = useState(false);
  const firebase = useContext(FirebaseContext);

  const args: FormikConfig<{ name: string }> = {
    initialValues: { name: '' },
    validationSchema: Yup.string().required('Required'),
    onSubmit: async (values) => {
      setLoading(true);
      console.log(values);
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      await firebase.groups().add({ ...values, archived: false });

      setLoading(false);
      close();
    },
  };

  return { args, loading };
}
