import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "./types";

const initialState = {
  currentState: "logout",
  userInfo: null,
  error: null,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        currentState: "login",
        userInfo: action.payload,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        currentState: "logout",
        userInfo: null,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        currentState: "logout",
        userInfo: null,
        error: null,
      };

    default:
      return state;
  }
};

export default loginReducer;
