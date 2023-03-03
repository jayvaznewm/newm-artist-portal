import { FunctionComponent } from "react";
import {
  Box,
  Collapse,
  Alert as MUIAlert,
  AlertProps as MUIAlertProps,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import theme from "theme";

interface AlertProps extends MUIAlertProps {
  open?: boolean;
}

// replaces warning icon (filled instead of outline)
const iconMapping = {
  warning: <WarningIcon />,
};

const Alert: FunctionComponent<AlertProps> = ({
  action,
  children,
  open = true,
  severity = "info",
  ...rest
}) => {
  return (
    <Box sx={ { width: "100%" } }>
      <Collapse in={ open }>
        <MUIAlert
          action={
            <Box sx={ { display: "flex", height: "100%", alignItems: "center" } }>
              { action }
            </Box>
          }
          severity={ severity }
          iconMapping={ iconMapping }
          sx={ {
            backgroundColor: theme.colors.grey600,
            borderRadius: "6px",
            p: "8px 16px",
            ".MuiAlert-icon": {
              alignItems: "center",
            },
            ".MuiSvgIcon-root": {
              color: "inherit",
            },
            ".MuiAlert-action": {
              p: 0,
              mr: 0,
            },
          } }
          { ...rest }
        >
          { children }
        </MUIAlert>
      </Collapse>
    </Box>
  );
};

export default Alert;
