import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Label from "./Label";

interface IInputSelect {
  onChange?: (_e: SelectChangeEvent) => void;
  value?: string | number;
  label?: string;
  isRequired?: boolean;
  options?: { label: string | number; value: string | number }[];
  isDisabled?: boolean;
}

const InputSelect = ({
  onChange,
  value,
  options,
  isRequired,
  label,
  isDisabled
}: IInputSelect) => {
  return (
    <Box display={"flex"} flexDirection={"column"} width={"100%"} gap={"16px"}>
      <Label required={isRequired}>{label}</Label>
      <Select
        value={value as string}
        label=""
        onChange={onChange}
        fullWidth
        disabled={isDisabled}
      >
        {options?.map((option) => (
          <MenuItem value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default InputSelect;
