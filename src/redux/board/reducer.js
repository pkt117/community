import {
  //   BOARD_SAVE,
  BOARD_REMOVE,
  BOARD_UPDATE,
  MY_BOARD_LOAD,
  TOTAL_BOARD_LOAD,
  SELECTED_BOARD,
} from "./types";

const initialState = {
  totalGroups: [],
  myGroups: [],
  selected: {},
};

const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    // case BOARD_SAVE:
    //   return {
    //     ...state,
    //     totalGroups: state.totalGroups.concat(action.payload),
    //     myGroups: state.myGroups.concat(action.payload),
    //     selected: {},
    //   };

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

    case SELECTED_BOARD:
      return {
        ...state,
        selected: action.payload,
      };

    default:
      return state;
  }
};

export default boardReducer;
