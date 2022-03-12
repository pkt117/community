import { MY_GROUP, FREE_BOARD, FIND_GROUP, LOGIN } from "./types";

const initialState = {
  path: "/",
};

const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case MY_GROUP:
      return {
        ...state,
        path: "/",
      };

    case FIND_GROUP:
      return {
        ...state,
        path: "/find_group",
      };

    case FREE_BOARD:
      return {
        ...state,
        path: "/free_board",
      };

    case LOGIN:
      return {
        ...state,
        path: "/login",
      };

    default:
      return state;
  }
};

export default navigationReducer;
