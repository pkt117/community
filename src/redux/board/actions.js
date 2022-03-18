import {
  //   BOARD_SAVE,
  BOARD_REMOVE,
  BOARD_UPDATE,
  MY_BOARD_LOAD,
  TOTAL_BOARD_LOAD,
} from "./types";
import DbService from "../../service/dbService";
import firebaseApp from "../../service/firebase";
import AuthService from "../../service/authService";
import { loadingFinish, loadingStart } from "../loading/actions";

const dbService = new DbService(firebaseApp);
const authService = new AuthService(firebaseApp);

//  게시글 생성
export const createGroupAsync = (value) => async (dispatch) => {
  dispatch(loadingStart());
  const uid = authService.getUid();

  try {
    await dbService.groupRegister(value, uid);
    const item = await dbService.getMyGroup(uid);
    dispatch(loadingFinish());
    return dispatch(myBoardLoad(item));
  } catch (error) {
    dispatch(loadingFinish());
    return console.log(error.code);
  }
};

// 내 게시글 불러오기
export const getMyGroupAsync = () => async (dispatch) => {
  //   dispatch(loadingStart());

  const uid = authService.getUid();
  try {
    const item = await dbService.getMyGroup(uid);
    // dispatch(loadingFinish());
    return dispatch(myBoardLoad(item));
  } catch (error) {
    // dispatch(loadingFinish());
    return console.log(error.code);
  }
};

// export const boardSave = (value) => {
//   return {
//     type: BOARD_SAVE,
//     payload: value,
//   };
// };

export const myBoardLoad = (value) => {
  return {
    type: MY_BOARD_LOAD,
    payload: value,
  };
};
