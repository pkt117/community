import { LOGIN, LOGOUT } from "./types";

export const clickLogin = () => {
  return {
    type: LOGIN,
  };
};

export const clickLogout = () => {
  return {
    type: LOGOUT,
  };
};
