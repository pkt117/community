import { LOGIN, LOGOUT } from "./types";

const initialState = {
  currentState: "logout",
};

const authStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        currentState: "login",
      };
    case LOGOUT:
      return {
        ...state,
        currentState: "logout",
      };

    default:
      return state;
  }
};

export default authStateReducer;
