import * as Yup from "yup";

/**
 * Password regex, it must contain the following:
 * 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number.
 */
const passwordRequirementRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

/**
 * Returns true if all genres are included in the genre options array
 *
 * NOTE: Accounts for known Yup issue where array and elements in array
 * can be an undefined type: https://github.com/jquense/yup/issues/1853
 */
const includesGenres = (
  genreOptions: ReadonlyArray<string>,
  genres?: ReadonlyArray<string | undefined>
) => {
  // don't validate that genres array is present, this is validated separately
  if (!genres) return true;

  // return false if a genre is found to not be included in genreOptions
  const hasInvalidGenre = !!genres.find((genre) => {
    // return as invalid if genre is undefined (see above note)
    if (!genre) return true;

    return !genreOptions.includes(genre);
  });

  // return true if all genres were valid
  return !hasInvalidGenre;
};

export const commonYupValidation = {
  email: Yup.string()
    .email("Please enter a vaild email")
    .required("Email is required"),
  firstName: Yup.string()
    .max(15, "Must be 15 characters or less")
    .required("First name is required"),
  lastName: Yup.string()
    .max(20, "Must be 20 characters or less")
    .required("Last name is required"),
  role: (roles: string[]) =>
    Yup.string()
      .required("Role is required")
      .test(
        "is-role",
        "You need to type or select one of the ones below",
        (role) => (role ? roles.includes(role) : false)
      ),
  genres: (genreOptions: string[]) =>
    Yup.array(Yup.string()).test(
      "is-genres",
      "You need to select one or more of the genres below",
      (genre) => includesGenres(genreOptions, genre)
    ),
  nickname: Yup.string()
    .required("Stage name is required")
    .matches(/^[aA-zZ\s]+$/, "Please only use letters"),
  password: Yup.string().required("Password is required"),
  newPassword: Yup.string()
    .test(
      "is-trimmed",
      "Password must not start or end with a space character",
      (password) => (password ? password === password.trim() : true)
    )
    .matches(
      passwordRequirementRegex,
      "Minimum 8 characters, at least one uppercase letter, one lowercase letter and one number"
    ),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "Passwords must match"
  ),
};
