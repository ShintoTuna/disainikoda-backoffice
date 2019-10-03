import { Checkbox } from '@blueprintjs/core';
import { Field, FieldProps } from 'formik';
import React, { FC } from 'react';

interface Props {
    name: string;
    label?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

const StyledCheckbox: FC<Props> = (props) => {
    const { name, label, onChange: onChangeOuter, disabled = false } = props;

    return (
        <Field
            name={name}
            render={({ field }: FieldProps) => (
                <Checkbox
                    {...field}
                    onChange={onChangeOuter ? onChangeOuter : field.onChange}
                    disabled={disabled}
                    label={label}
                    checked={field.value}
                />
            )}
        />
    );
};

export default StyledCheckbox;
