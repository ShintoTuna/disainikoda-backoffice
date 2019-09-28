import { Checkbox } from '@blueprintjs/core';
import { Field, FieldProps } from 'formik';
import React, { FC } from 'react';

interface Props {
    name: string;
    label?: string;
    onChange?: (e: React.ChangeEvent<any>) => void;
}

const StyledCheckbox: FC<Props> = (props) => {
    const { name, label, onChange: onChangeOuter } = props;

    return (
        <Field
            name={name}
            render={({ field }: FieldProps) => (
                <Checkbox
                    {...field}
                    onChange={onChangeOuter ? onChangeOuter : field.onChange}
                    label={label}
                    checked={field.value}
                />
            )}
        />
    );
};

export default StyledCheckbox;
