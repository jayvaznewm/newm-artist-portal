import { FunctionComponent } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Stack, useTheme } from "@mui/material";
import { Button, Typography } from "elements";
import { useExtractProperty } from "common";
import {
  Creditor,
  MintingStatus,
  getIsCreditorEditable,
  useGetCollaboratorsQuery,
} from "modules/song";
import DropdownSelectField from "components/form/DropdownSelectField";
import { useGetRolesQuery } from "modules/content";
import Details from "./Details";
import { getCollaboratorInfo } from "./utils";

interface CreditorsProps {
  readonly creditors: ReadonlyArray<Creditor>;
  readonly songMintingStatus: MintingStatus;
  readonly isDeleteDisabled?: boolean;
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
  songMintingStatus,
  isDeleteDisabled = false,
}) => {
  const theme = useTheme();
  const { data: roles = [] } = useGetRolesQuery();
  const roleOptions = useExtractProperty(roles, "name");
  const emails = creditors.map((creditor) => creditor.email);

  const { data: collaborators } = useGetCollaboratorsQuery(
    {
      emails,
    },
    {
      skip: !emails.length,
    }
  );

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
        const isEditable = getIsCreditorEditable(songMintingStatus, creditor);
        const collaboratorInfo = getCollaboratorInfo(
          creditor.email,
          collaborators
        );

        return (
          <Stack
            key={ creditor.email }
            sx={ {
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 2,
              rowGap: 2,
              columnGap: 1,
            } }
          >
            <Details
              email={ creditor.email }
              pictureUrl={ collaboratorInfo.pictureUrl }
              firstName={ collaboratorInfo.firstName }
              lastName={ collaboratorInfo.lastName }
            />

            <Stack direction="row" alignItems="center">
              { isEditable ? (
                <DropdownSelectField
                  isOptional={ false }
                  name={ `creditors[${idx}].role` }
                  options={ roleOptions }
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
                sx={ { ml: [1, 1, 3] } }
                variant="secondary"
                disabled={ isDeleteDisabled }
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
