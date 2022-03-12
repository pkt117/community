import { MY_GROUP, FREE_BOARD, FIND_GROUP, LOGIN } from "./types";

export const clickMyGroup = () => {
  return {
    type: MY_GROUP,
  };
};

export const clickFreeBoard = () => {
  return {
    type: FREE_BOARD,
  };
};

export const clickFindGroup = () => {
  return {
    type: FIND_GROUP,
  };
};

export const clickLogin = () => {
  return {
    type: LOGIN,
  };
};
