import { LOADING_START, LOADING_FINISH } from "./types";

export const loadingStart = () => {
  return {
    type: LOADING_START,
    payload: true,
  };
};

export const loadingFinish = () => {
  return {
    type: LOADING_FINISH,
    payload: false,
  };
};
