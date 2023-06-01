import { IconButton, Stack } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { Creditors, Owners } from "components";
import { Button, HorizontalLine, Tooltip, Typography } from "elements";
import { Formik, FormikProps } from "formik";
import { Creditor, Featured, Owner } from "modules/song";
import { FunctionComponent, useEffect, useState } from "react";
import theme from "theme";
import AddOwnerModal from "./AddOwnerModal";
import FeaturedArtists from "./FeaturedArtists";

interface FormValues {
  readonly owners: ReadonlyArray<Owner>;
  readonly creditors: ReadonlyArray<Creditor>;
  readonly featured: ReadonlyArray<Featured>;
}

type FormContentProps = FormikProps<FormValues>;

interface SelectCoOwnersProps {
  readonly owners: ReadonlyArray<Owner>;
  readonly creditors: ReadonlyArray<Creditor>;
  readonly featured: ReadonlyArray<Featured>;
  readonly onChangeOwners: (newOwners: ReadonlyArray<Owner>) => void;
  readonly onChangeCreditors: (newCreditors: ReadonlyArray<Creditor>) => void;
  readonly onChangeFeatured: (newFeatured: ReadonlyArray<Featured>) => void;
}

/**
 * Add, update, and remove owners and creditors when minting a song.
 */
const SelectCoCeators: FunctionComponent<SelectCoOwnersProps> = ({
  owners,
  creditors,
  featured,
  onChangeOwners,
  onChangeCreditors,
  onChangeFeatured,
}) => {
  const initialValues = {
    owners,
    creditors,
    featured,
  };

  const handleSubmit = (values: FormValues) => {
    onChangeOwners(values.owners);
    onChangeCreditors(values.creditors);
    onChangeFeatured(values.featured);
  };

  return (
    <Formik initialValues={ initialValues } onSubmit={ handleSubmit }>
      { (formikProps) => <FormContent { ...formikProps } /> }
    </Formik>
  );
};

const FormContent: FunctionComponent<FormContentProps> = ({
  values,
  setFieldValue,
  handleSubmit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Call onChange callbacks when form values change.
   */
  useEffect(() => {
    handleSubmit();
  }, [values, handleSubmit]);

  return (
    <Stack px={ 2 } pb={ 2 }>
      { !!values.owners.length && (
        <>
          <HorizontalLine sx={ { my: 5 } } />

          <Owners
            owners={ values.owners }
            onDelete={ ({ email }, owners) => {
              const newOwners = owners.filter((owner) => owner.email !== email);
              setFieldValue("owners", newOwners);
            } }
          />
        </>
      ) }

      { !!values.creditors.length && (
        <>
          <HorizontalLine sx={ { my: 5 } } />

          <Creditors
            creditors={ values.creditors }
            onDelete={ ({ email }, creditors) => {
              const newCreditors = creditors.filter(
                (creditor) => creditor.email !== email
              );

              setFieldValue("creditors", newCreditors);
            } }
          />
        </>
      ) }

      { !!values.featured.length && (
        <>
          <HorizontalLine sx={ { my: 5 } } />

          <Typography color="grey100" mb={ -0.5 } variant="h5">
            FEATURED ARTISTS
          </Typography>

          <FeaturedArtists
            featured={ values.featured }
            onDelete={ ({ email }, featured) => {
              const newFeaturedArtists = featured.filter(
                (featured) => featured.email !== email
              );

              setFieldValue("featured", newFeaturedArtists);
            } }
          />
        </>
      ) }

      <HorizontalLine sx={ { mt: 5, mb: 2.5 } } />

      <Stack>
        <Button
          color="white"
          variant="outlined"
          width="full"
          onClick={ () => {
            setIsModalOpen(true);
          } }
        >
          Add new owner
        </Button>
      </Stack>

      <Stack mt={ 1.5 } flexDirection="row">
        <Typography variant="subtitle2">
          For every additional collaborator who will receive royalties, the fee
          to complete the minting process will increase by 1.5 ADA.
        </Typography>
        <Tooltip
          title={
            "This cost is increased with each additional collaborator because " +
            "this ADA needs to travel with each portion of stream tokens in order " +
            "to complete the split, which is an added extra cost for each transaction."
          }
        >
          <IconButton sx={ { padding: 0 } }>
            <HelpIcon
              sx={ {
                color: theme.colors.grey100,
                height: "18px",
                width: "18px",
              } }
            />
          </IconButton>
        </Tooltip>
      </Stack>

      <AddOwnerModal
        open={ isModalOpen }
        onClose={ () => {
          setIsModalOpen(false);
        } }
        onSubmit={ ({
          email,
          isCreator,
          isRightsOwner,
          isCredited,
          isFeatured,
          role,
          status,
        }) => {
          const hasCreditorBeenAdded = values.creditors.find(
            (creditor) => creditor.email === email
          );
          const hasOwnerBeenAdded = values.owners.find(
            (owner) => owner.email === email
          );
          const hasFeaturedBeenAdded = values.featured.find(
            (featuredArtist) => featuredArtist.email === email
          );

          if (isRightsOwner && !hasOwnerBeenAdded) {
            setFieldValue("owners", [
              ...values.owners,
              {
                email,
                isCreator,
                isRightsOwner,
                percentage: 0,
                role,
                status,
              },
            ]);
          }

          if (isCredited && !hasCreditorBeenAdded) {
            setFieldValue("creditors", [
              ...values.creditors,
              {
                email,
                role,
                isCredited,
                status,
              },
            ]);
          }

          if (isFeatured && !hasFeaturedBeenAdded) {
            setFieldValue("featured", [
              ...values.featured,
              {
                email,
                role,
                isFeatured,
                status,
              },
            ]);
          }

          setIsModalOpen(false);
        } }
      />
    </Stack>
  );
};

export default SelectCoCeators;
