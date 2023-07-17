import { useEffect, useRef } from "react";
import { useFormikContext } from "formik";
import { Box, Stack } from "@mui/material";
import { NONE_OPTION, scrollToError, useWindowDimensions } from "common";
import {
  DropdownSelectField,
  SwitchInputField,
  TextInputField,
} from "components";
import { Button, HorizontalLine } from "elements";
import {
  UploadSongRequest,
  useGetEarliestReleaseDateQuery,
} from "modules/song";
import theme from "theme";

const AdvancedSongDetails = () => {
  const windowWidth = useWindowDimensions()?.width;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isrcRef = useRef<any>(null);
  const publicationDateRef = useRef<HTMLInputElement | null>(null);
  const barcodeNumberRef = useRef<HTMLInputElement | null>(null);
  const releaseDateRef = useRef<HTMLInputElement | null>(null);

  const { isSubmitting, setFieldValue, errors } =
    useFormikContext<UploadSongRequest>();

  const { data: { date: earliestReleaseDate } = {} } =
    useGetEarliestReleaseDateQuery();

  useEffect(() => {
    scrollToError(errors, isSubmitting, [
      {
        error: errors.releaseDate,
        element: releaseDateRef.current,
      },
      {
        error: errors.publicationDate,
        element: publicationDateRef.current,
      },
      {
        error: errors.isrc,
        element: isrcRef.current?.getInputDOMNode(),
      },
      {
        error: errors.barcodeNumber,
        element: barcodeNumberRef.current,
      },
    ]);
  }, [errors, isSubmitting, isrcRef]);

  return (
    <Stack
      marginX={ ["auto", "auto", "unset"] }
      maxWidth={ ["340px", "340px", "700px"] }
      spacing={ 3 }
    >
      <SwitchInputField
        name="isExplicit"
        title="Does the song contain explicit content?"
        tooltipText={
          "Explicit content includes strong or discriminatory language, " +
          "or depictions of sex, violence or substance abuse."
        }
      />
      <Stack
        display="grid"
        gridTemplateColumns={ ["repeat(1, 1fr)", null, "repeat(2, 1fr)"] }
        rowGap={ [2, null, 3] }
        columnGap={ [undefined, undefined, 1.5] }
      >
        <TextInputField
          isOptional={ false }
          label="SCHEDULE RELEASE DATE"
          min={ earliestReleaseDate }
          name="releaseDate"
          placeholder="Select a day"
          ref={ releaseDateRef }
          type="date"
          tooltipText={
            "When selecting a date to release your song on our " +
            "platform, please remember to factor in approval from any " +
            "contributors/featured artists as well as mint processing time " +
            "which can take up to 15 days."
          }
        />
        <TextInputField
          name="publicationDate"
          label="ORIGINAL PUBLICATION DATE"
          type="date"
          placeholder="Select a day"
          ref={ publicationDateRef }
          tooltipText={
            "If your song has already been launched on other platforms you " +
            "may input the release date here, but it is not required."
          }
          max={ new Date().toISOString().split("T")[0] }
        />
        <TextInputField
          name="copyrights"
          label="COPYRIGHT"
          placeholder={ `${new Date().getFullYear()} Example` }
          tooltipText={ "" }
        />
        <TextInputField
          label="ISRC"
          mask="aa-***-99-99999"
          maskChar={ null }
          name="isrc"
          placeholder="AA-AAA-00-00000"
          ref={ isrcRef }
          tooltipText={ " " }
          onChange={ (event) =>
            setFieldValue("isrc", event.target.value.toUpperCase())
          }
        />
        <DropdownSelectField
          name="barcodeType"
          label="BARCODE TYPE"
          tooltipText={ " " }
          placeholder="Select one"
          options={ [NONE_OPTION, "UPC", "EAN", "JAN"] }
        />
        <TextInputField
          name="barcodeNumber"
          label="BARCODE NUMBER"
          placeholder="0000000000"
          ref={ barcodeNumberRef }
          tooltipText={ " " }
        />
        <TextInputField
          name="userIpi"
          label="IPI"
          placeholder="000000000"
          tooltipText={ " " }
        />
        <TextInputField
          name="iswc"
          label="ISWC"
          placeholder="T 000000000 0"
          tooltipText={ " " }
        />
      </Stack>

      <Box>
        <HorizontalLine mb={ 5 } />

        <Button
          type="submit"
          isLoading={ isSubmitting }
          width={
            windowWidth && windowWidth > theme.breakpoints.values.md
              ? "compact"
              : "default"
          }
        >
          Next
        </Button>
      </Box>
    </Stack>
  );
};

export default AdvancedSongDetails;
