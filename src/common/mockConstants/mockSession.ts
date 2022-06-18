import { SessionState } from "modules/session";
import { mockProfile } from "./mockProfile";

export const mockSession: SessionState = {
  isLoggedIn: true,
  errorMessage: "",
  profile: mockProfile,
};
