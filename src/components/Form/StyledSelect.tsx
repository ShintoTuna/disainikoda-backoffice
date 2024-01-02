import { Classes, FormGroup, HTMLSelect } from '@blueprintjs/core';
import { Field, FieldProps } from 'formik';
import React, { Component, FC } from 'react';

import { getMultiLevel } from '../../utils/form';

interface Props {
  name: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  required?: boolean;
  inline?: boolean;
}

interface OptionProps {
  value?: string;
  name: string;
}

class StyledSelect extends Component<Props> {
  public static Option: FC<OptionProps> = ({ value, name }) => <option value={value ? value : name}>{name}</option>;

  public render() {
    const { children, name, defaultValue, onChange, inline = false, label, required = false } = this.props;

    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const isTouched = getMultiLevel(field.name, form.touched);
          const error = isTouched && getMultiLevel(field.name, form.errors);
          const { onChange: formikOnChange, ...fieldArgs } = field;

          return (
            <FormGroup
              label={label}
              labelFor={`text-input-${name}`}
              labelInfo={required ? '(required)' : ''}
              intent={error ? 'danger' : 'none'}
              helperText={error}
              inline={inline}
            >
              <HTMLSelect {...fieldArgs} defaultValue={defaultValue} onChange={onChange ? onChange : formikOnChange}>
                {children}
              </HTMLSelect>
            </FormGroup>
          );
        }}
      </Field>
    );
  }
}

export default StyledSelect;
