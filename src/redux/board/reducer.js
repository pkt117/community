import {
  BOARD_REMOVE,
  BOARD_UPDATE,
  MY_BOARD_LOAD,
  TOTAL_BOARD_LOAD,
  SELECTED_BOARD,
} from "./types";

const boardInitialState = {
  totalGroups: [],
  myGroups: [],
};

export const selectedBoardReducer = (state = { selected: {} }, action) => {
  switch (action.type) {
    case SELECTED_BOARD:
      return {
        ...state,
        selected: action.payload,
      };

    default:
      return state;
  }
};

export const boardReducer = (state = boardInitialState, action) => {
  switch (action.type) {
    case MY_BOARD_LOAD:
      return {
        ...state,
        myGroups: action.payload,
      };

    case TOTAL_BOARD_LOAD:
      return {
        ...state,
        totalGroups: action.payload,
      };

    // case SELECTED_BOARD:
    //   return {
    //     ...state,
    //     selected: action.payload,
    //   };

    default:
      return state;
  }
};
