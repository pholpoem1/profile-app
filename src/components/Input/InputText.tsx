import { Box, TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import Label from './Label';

interface IInputText {
  isDisabled?: boolean;
  onChange?: (_e: ChangeEvent<HTMLInputElement> | undefined) => void;
  value?: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
}

const InputText = ({ onChange, value, isDisabled, label = '', isRequired = false, placeholder = '' }: IInputText) => {
  const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e);
  };

  return (
    <Box display={'flex'} flexDirection={'column'} width={'100%'} gap={'16px'}>
      <Label required={isRequired}>{label}</Label>
      <TextField
        label=""
        fullWidth
        value={value}
        onChange={onValueChange}
        disabled={isDisabled}
        placeholder={placeholder}
      />
    </Box>
  );
};

export default InputText;
