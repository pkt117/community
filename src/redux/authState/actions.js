import { LOGIN, LOGOUT } from "./types";

export const stateLogin = (userInfo) => {
  return {
    type: LOGIN,
    payload: userInfo,
  };
};

export const stateLogout = () => {
  return {
    type: LOGOUT,
  };
};
