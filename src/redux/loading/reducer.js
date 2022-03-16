import { LOADING_START, LOADING_FINISH } from "./types";

const initialState = {
  loading: false,
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_START:
      return {
        ...state,
        loadingState: true,
      };
    case LOADING_FINISH:
      return {
        ...state,
        loadingState: false,
      };

    default:
      return state;
  }
};

export default loadingReducer;
