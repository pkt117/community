import { JOIN_SUCCESS, JOIN_FAILURE } from "./types";

const initialState = {
  joinState: null,
  error: null,
};

const joinReducer = (state = initialState, action) => {
  switch (action.type) {
    case JOIN_SUCCESS:
      return {
        ...state,
        joinState: "success",
        error: action.error,
      };

    case JOIN_FAILURE:
      return {
        ...state,
        joinState: "error",
        error: action.error,
      };
    default:
      return state;
  }
};

export default joinReducer;
