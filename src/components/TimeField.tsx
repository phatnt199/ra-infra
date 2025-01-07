import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { NumericFormatProps, PatternFormat } from 'react-number-format';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const CustomFormat = React.forwardRef<NumericFormatProps, CustomProps>((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <PatternFormat
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
      format="##:##:##"
    />
  );
});

export const TimeField: React.FC<TextFieldProps> = props => {
  return (
    <TextField
      {...props}
      InputProps={{
        ...(props?.InputProps ?? {}),
        inputComponent: CustomFormat as any,
      }}
    />
  );
};
