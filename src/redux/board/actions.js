import {
  //   BOARD_SAVE,
  BOARD_REMOVE,
  BOARD_UPDATE,
  MY_BOARD_LOAD,
  TOTAL_BOARD_LOAD,
  SELECTED_BOARD,
} from "./types";
import DbService from "../../service/dbService";
import firebaseApp from "../../service/firebase";
import AuthService from "../../service/authService";
import { loadingFinish, loadingStart } from "../loading/actions";

const dbService = new DbService(firebaseApp);
const authService = new AuthService(firebaseApp);

//  게시글 생성
export const createGroupAsync = (value, imageFile) => async (dispatch) => {
  dispatch(loadingStart());
  const { uid } = authService.getUserInfo();

  try {
    await dbService.groupRegister(value, imageFile, uid);
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

  const { uid } = authService.getUserInfo();
  try {
    const item = await dbService.getMyGroup(uid);
    // dispatch(loadingFinish());
    return dispatch(myBoardLoad(item));
  } catch (error) {
    // dispatch(loadingFinish());
    return console.log(error.code);
  }
};

// 전체게시글 불러오기
export const getTotalGroupAsync = () => async (dispatch) => {
  try {
    const item = await dbService.getTotalGroup();

    return dispatch(totalBoardLoad(item));
  } catch (error) {
    return console.log(error.code);
  }
};

// 선택된 게시글
export const getSelectedGroupAsync = (postId) => async (dispatch) => {
  const selectedGroup = await dbService.getSelectedGroup(postId);

  return dispatch(selectedBoard(selectedGroup[0]));
};

export const selectedBoard = (value) => {
  const { uid } = authService.getUserInfo();
  let userCheck = false;
  value.userList.forEach((item) => {
    if (item.uid === uid) {
      userCheck = true;
      return false;
    }
  });
  value = { ...value, userCheck };

  return {
    type: SELECTED_BOARD,
    payload: value,
  };
};

export const myBoardLoad = (value) => {
  return {
    type: MY_BOARD_LOAD,
    payload: value,
  };
};

export const totalBoardLoad = (value) => {
  return {
    type: TOTAL_BOARD_LOAD,
    payload: value,
  };
};
