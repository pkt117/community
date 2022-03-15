import { LOGIN, LOGOUT } from "./types";

const initialState = {
  currentState: "logout",
  userInfo: null,
};

const authStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        currentState: "login",
        userInfo: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        currentState: "logout",
        userInfo: null,
      };

    default:
      return state;
  }
};

export default authStateReducer;
