import { SectionKey } from "@/pages";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepIconProps,
  styled,
  stepConnectorClasses,
  StepConnector,
  useTheme
} from "@mui/material";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)"
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#ec4899",
      height: "100%"
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#ec4899",
      height: "100%"
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
    height: "100%",
    ...theme.applyStyles("dark", {
      borderColor: theme.palette.grey[800]
    })
  }
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme }) => ({
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    "& .QontoStepIcon-completedIcon": {
      color: "#ec4899",
      zIndex: 1,
      fontSize: 24
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor"
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[700]
    }),
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          color: "#ec4899"
        }
      }
    ]
  })
);

const QontoStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <FiberManualRecordOutlinedIcon className="QontoStepIcon-completedIcon" />
      ) : (
        <FiberManualRecordIcon />
      )}
    </QontoStepIconRoot>
  );
};

interface NavigationStepperProps {
  active: SectionKey;
  sections: readonly SectionKey[];
  onSelect: (key: SectionKey) => void;
}

export default function NavigationStepper({
  active,
  sections,
  onSelect
}: NavigationStepperProps) {
  return (
    <Box
      sx={{
        width: 220,
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        px: 2,
        boxSizing: "border-box"
      }}
    >
      <Stepper
        activeStep={sections.indexOf(active)}
        orientation="vertical"
        connector={<QontoConnector />}
        sx={{ height: "70vh" }}
      >
        {sections.map((name) => {
          return (
            <Step key={name} completed={false}>
              <StepLabel
                StepIconComponent={QontoStepIcon}
                onClick={() => onSelect(name)}
                sx={{
                  cursor: "pointer",
                  "& .MuiStepLabel-label": {
                    color: name === active ? "#ec4899" : undefined
                  }
                }}
              >
                {name.toUpperCase()}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
