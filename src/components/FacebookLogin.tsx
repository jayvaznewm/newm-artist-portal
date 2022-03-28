/**
 * Logs the user into the app using the Facebook Auth SDK.
 */

import { extendedApi as sessionApi } from "modules/session";
import { setErrorMessage } from "modules/ui";
import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import FacebookLoginHelper from "react-facebook-login/dist/facebook-login-render-props";
import {
  ReactFacebookFailureResponse,
  ReactFacebookLoginInfo,
} from "react-facebook-login";
import FacebookIcon from "assets/images/FacebookIcon";
import { IconButton } from "@mui/material";

const FacebookLogin: FunctionComponent = () => {
  const dispatch = useDispatch();

  const handleFacebookResponse = (
    resp: ReactFacebookLoginInfo | ReactFacebookFailureResponse
  ) => {
    const loginInfo = resp as ReactFacebookLoginInfo;
    const { accessToken } = loginInfo;

    if (!accessToken) {
      dispatch(setErrorMessage("Facebook authentication was not successful"));
      return;
    }

    dispatch(sessionApi.endpoints.facebookLogin.initiate({ accessToken }));
  };

  return (
    <FacebookLoginHelper
      appId={ process.env.REACT_APP_FACEBOOK_CLIENT_ID || "" }
      callback={ handleFacebookResponse }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render={ (renderProps: any) => (
        <IconButton
          onClick={ renderProps.onClick }
          disabled={ renderProps.disabled }
        >
          <FacebookIcon />
        </IconButton>
      ) }
    />
  );
};

export default FacebookLogin;
