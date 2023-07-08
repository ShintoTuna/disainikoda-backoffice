import { FormGroup, InputGroup } from '@blueprintjs/core';
import { Field, FieldProps } from 'formik';
import React, { FC } from 'react';

import { getMultiLevel } from '../../utils/form';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  inline?: boolean;
  disabled?: boolean;
}

const StyledInput: FC<Props> = (props) => {
  const { name, label, placeholder, required = false, type = 'text', inline = false, disabled = false } = props;

  return (
    <Field
      name={name}
      render={({ field, form }: FieldProps) => {
        const isTouched = getMultiLevel(field.name, form.touched);
        const error = isTouched && getMultiLevel(field.name, form.errors);

        return (
          <FormGroup
            label={label}
            labelFor={`text-input-${name}`}
            labelInfo={required ? '(required)' : ''}
            intent={error ? 'danger' : 'none'}
            helperText={error}
            inline={inline}
          >
            <InputGroup
              {...field}
              type={type}
              id={`text-input-${name}`}
              placeholder={placeholder}
              disabled={disabled}
              intent={error ? 'danger' : 'none'}
            />
          </FormGroup>
        );
      }}
    />
  );
};

export default StyledInput;
