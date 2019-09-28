import { Switch } from '@blueprintjs/core';
import { Field, FieldProps } from 'formik';
import React, { FC } from 'react';

interface Props {
    name: string;
    label?: string;
}

const StyledSwitch: FC<Props> = (props) => {
    const { name, label } = props;

    return (
        <Field
            name={name}
            render={({ field }: FieldProps) => <Switch {...field} label={label} checked={field.value} />}
        />
    );
};

export default StyledSwitch;
