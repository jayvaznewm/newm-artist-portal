import { Stack } from "@mui/material";
import { Creditors, Owners } from "components";
import { Button, HorizontalLine, Typography } from "elements";
import { Formik, FormikProps } from "formik";
import { Creditor, Owner } from "modules/song";
import { FunctionComponent, useEffect, useState } from "react";
import AddOwnerModal from "./AddOwnerModal";

interface FormValues {
  readonly owners: ReadonlyArray<Owner>;
  readonly creditors: ReadonlyArray<Creditor>;
}

type FormContentProps = FormikProps<FormValues>;

interface SelectCoOwnersProps {
  readonly owners: ReadonlyArray<Owner>;
  readonly creditors: ReadonlyArray<Creditor>;
  readonly onChangeOwners: (newOwners: ReadonlyArray<Owner>) => void;
  readonly onChangeCreditors: (newCreditors: ReadonlyArray<Creditor>) => void;
}

/**
 * Add, update, and remove owners and creditors when minting a song.
 */
const SelectCoCeators: FunctionComponent<SelectCoOwnersProps> = ({
  owners,
  creditors,
  onChangeOwners,
  onChangeCreditors,
}) => {
  const initialValues = {
    owners,
    creditors,
  };

  const handleChange = (values: FormValues) => {
    onChangeOwners(values.owners);
    onChangeCreditors(values.creditors);
  };

  return (
    <Formik initialValues={ initialValues } onSubmit={ handleChange }>
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

          <Stack flexDirection="row" justifyContent="space-between">
            <Typography color="grey100" variant="h5">
              MASTER OWNERS
            </Typography>
            <Typography color="grey100" variant="h5">
              SHARES
            </Typography>
          </Stack>

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

          <Typography color="grey100" mb={ -0.5 } variant="h5">
            CREDITS TO SHOW ON SONG DETAIL
          </Typography>

          <Creditors
            creditors={ values.creditors }
            onDelete={ ({ email }, creditors) => {
              const newOwners = creditors.filter(
                (creditor) => creditor.email !== email
              );

              setFieldValue("creditors", newOwners);
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
          role,
          status,
        }) => {
          const hasCreditorBeenAdded = values.creditors.find(
            (creditor) => creditor.email === email
          );
          const hasOwnerBeenAdded = values.owners.find(
            (owner) => owner.email === email
          );

          if (!hasCreditorBeenAdded) {
            if (isCredited) {
              setFieldValue("creditors", [
                ...values.creditors,
                {
                  email,
                  isCreator,
                  isRightsOwner,
                  role,
                  status,
                  isCredited,
                },
              ]);
            }
          }

          if (!hasOwnerBeenAdded) {
            if (isRightsOwner) {
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
          }

          setIsModalOpen(false);
        } }
      />
    </Stack>
  );
};

export default SelectCoCeators;
