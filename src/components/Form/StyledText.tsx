import { Classes, FormGroup, TextArea } from '@blueprintjs/core';
import { Field, FieldProps } from 'formik';
import React, { FC } from 'react';

import { getMultiLevel } from '../../utils/form';

interface Props {
  name: string;
  label?: string;
  required?: boolean;
  inline?: boolean;
}

const StyledText: FC<Props> = (props) => {
  const { name, label, required = false, inline = false } = props;

  return (
    <Field
      name={name}
      render={({ field, form }: FieldProps) => {
        const isTouched = getMultiLevel(field.name, form.touched);
        const error = isTouched && getMultiLevel(field.name, form.errors);

        return (
          <FormGroup
            label={label}
            labelFor={`text-area-${name}`}
            labelInfo={required ? '(required)' : ''}
            intent={error ? 'danger' : 'none'}
            helperText={error}
            inline={inline}
          >
            <TextArea className={Classes.FILL} {...field} id={`text-area-${name}`} intent={error ? 'danger' : 'none'} />
          </FormGroup>
        );
      }}
    />
  );
};

export default StyledText;
