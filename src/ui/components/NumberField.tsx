import React from 'react';

import { TextField, TextFieldProps } from '@mui/material';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  (props, ref) => {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onKeyUp={(e: any) => {
          onChange?.({
            target: {
              name: props.name,
              value: e.target.value?.replace(/,/g, ''),
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
      />
    );
  },
);

export const NumberField: React.FC<TextFieldProps> = props => {
  return (
    <TextField
      {...props}
      InputProps={{
        ...(props?.InputProps ?? {}),
        inputComponent: NumericFormatCustom as any,
      }}
    />
  );
};
