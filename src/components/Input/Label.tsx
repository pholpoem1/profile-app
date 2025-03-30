import { Typography, TypographyProps } from "@mui/material";
import { ReactNode } from "react";
import RequireMark from "./RequireMark";

interface ILabel {
  children?: ReactNode;
  fontWeight?: TypographyProps["fontWeight"];
  required?: boolean;
  label?: string;
  // variant?: keyof typeof variants;
}

const Label = ({ children, required = false }: ILabel) => {
  return (
    <Typography
      variant="body2"
      sx={{
        "& svg": {
          display: "inline !important",
          mr: "0.5rem",
          width: "1.5rem",
          height: "1.5rem"
        }
      }}
    >
      <span>
        {children}
        {required ? <RequireMark /> : undefined}
      </span>
    </Typography>
  );
};

export default Label;
