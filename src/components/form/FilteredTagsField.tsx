import { FunctionComponent } from "react";
import { Box } from "@mui/material";
import { Field, FieldProps } from "formik";
import { OutlinedButton } from "elements";

interface FilteredTagsFieldProps {
  readonly name: string;
  readonly tags: ReadonlyArray<string>;
}

/**
 * Formik field component that displays tags based on the value of
 * the field. Pressing one of the tags will update the field with that value.
 */
const FilteredTagsField: FunctionComponent<FilteredTagsFieldProps> = ({
  name,
  tags,
}) => (
  <Field name={ name }>
    { ({ field, form }: FieldProps) => {
      const filteredTags = tags.filter(filterTags(field.value));

      return (
        <Box
          sx={ {
            display: "flex",
            flexWrap: [null, null, "wrap"],
            justifyContent: [null, null, "center"],
            overflow: "auto",
            width: "100%",
          } }
        >
          { filteredTags.map((tag) => (
            <Box key={ tag } m={ 1 }>
              <OutlinedButton onClick={ () => form.handleChange(name)(tag) }>
                { tag }
              </OutlinedButton>
            </Box>
          )) }
        </Box>
      );
    } }
  </Field>
);

/**
 * If there is no query string, display all tags. Otherwise, only show tags
 * that match the query string. Once the query string exactly matches a
 * tag, hide the remaining tag.
 */
const filterTags = (query: string) => (tag: string) => {
  const emptyQuery = query.length === 0;
  const queryExactlyMatchesTag = tag === query;
  const tagIncludesQuery = tag.toLowerCase().includes(query.toLowerCase());

  return emptyQuery || (!queryExactlyMatchesTag && tagIncludesQuery);
};

export default FilteredTagsField;
