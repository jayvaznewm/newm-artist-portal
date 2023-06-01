import { Box, Stack, useTheme } from "@mui/material";
import { Button, Typography } from "elements";
import { CollaborationStatus, Creditor } from "modules/song";
import { FunctionComponent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DropdownSelectField from "components/form/DropdownSelectField";
import { useGetRolesQuery } from "modules/content";

interface CreditorsProps {
  readonly creditors: ReadonlyArray<Creditor>;
  readonly onDelete: (
    creditor: Creditor,
    creditors: ReadonlyArray<Creditor>
  ) => void;
}

/**
 * Allows for displaying and updating creditors when minting a song.
 */
const Creditors: FunctionComponent<CreditorsProps> = ({
  creditors,
  onDelete,
}) => {
  const theme = useTheme();

  const { data: roles = [] } = useGetRolesQuery();

  return (
    <Box>
      <Stack flexDirection="row" justifyContent="space-between" mb={ -0.5 }>
        <Typography color="grey100" variant="h5">
          CREDITS TO SHOW ON SONG DETAIL
        </Typography>
        <Typography color="grey100" variant="h5">
          ROLES
        </Typography>
      </Stack>

      { creditors.map((creditor, idx) => {
        const isEditable = creditor.status === CollaborationStatus.Editing;

        return (
          <Stack
            key={ creditor.email }
            sx={ {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            } }
          >
            <Typography variant="subtitle1">{ creditor.email }</Typography>

            <Stack direction="row" alignItems="center">
              { isEditable ? (
                <DropdownSelectField
                  isOptional={ false }
                  name={ `creditors[${idx}].role` }
                  options={ roles }
                  placeholder="Select role"
                  widthType="full"
                />
              ) : (
                <Typography color="white" fontWeight={ 500 }>
                  { creditor.role }
                </Typography>
              ) }

              <Button
                color="white"
                sx={ { ml: 3 } }
                variant="secondary"
                width="icon"
                onClick={ () => {
                  onDelete(creditor, creditors);
                } }
              >
                <CloseIcon sx={ { color: theme.colors.white } } />
              </Button>
            </Stack>
          </Stack>
        );
      }) }
    </Box>
  );
};

export default Creditors;
