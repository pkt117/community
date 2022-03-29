import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "./types";
import firebaseApp from "../../service/firebase";
import AuthService from "../../service/authService";
import DbService from "../../service/dbService";
import { loadingStart, loadingFinish } from "../loading/actions";
import {
  getMyGroupAsync,
  getTotalGroupAsync,
  myBoardLoad,
} from "../board/actions";

const authService = new AuthService(firebaseApp);
const dbService = new DbService(firebaseApp);

export const googleLoginAsync = () => async (dispatch) => {
  try {
    dispatch(loadingStart());
    const user = await authService.googleLogin();
    dbService.userRegister(user.uid, user.email, user.displayName, "google");
    const profile = await dbService.getUserInfo(user.uid);
    dispatch(loadingFinish());

    return dispatch(
      loginSuccess({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        profileImg: profile.profileImg,
        intro: profile.intro,
        createdAt: profile.createdAt,
      })
    );
  } catch (error) {
    dispatch(loadingFinish());
    return dispatch(loginFailure(error.code));
  }
};

export const emailLoginAsync = (email, password) => async (dispatch) => {
  try {
    dispatch(loadingStart());
    const user = await authService.emailLogin(email, password);
    const profile = await dbService.getUserInfo(user.uid);
    dispatch(loadingFinish());

    return dispatch(
      loginSuccess({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        profileImg: profile.profileImg,
        intro: profile.intro,
        createdAt: profile.createdAt,
      })
    );
  } catch (error) {
    dispatch(loadingFinish());
    return dispatch(loginFailure(error.code));
  }
};

// 로그인 상태 체크
export const loginCheck = () => (dispatch) => {
  dispatch(loadingStart());
  authService.onAuthChange(async (user) => {
    if (user != null) {
      const { email, displayName, uid } = await user;
      const profile = await dbService.getUserInfo(uid);
      const userInfo = {
        email,
        name: displayName,
        uid,
        profileImg: profile.profileImg,
        intro: profile.intro,
        createdAt: profile.createdAt,
      };

      dispatch(getMyGroupAsync());
      dispatch(loadingFinish());
      return dispatch(loginSuccess(userInfo));
    } else {
      dispatch(loadingFinish());
    }
  });
};
//  로그아웃, 내 모임 관련 redux state 초기화
export const logoutAsync = () => (dispatch) => {
  authService.logout();
  dispatch(myBoardLoad([]));

  return dispatch(logout());
};

// 프로필 수정
export const profileChangeAsync =
  (imgFile, name, intro) => async (dispatch, getState) => {
    const userInfo = getState().loginReducer.userInfo;
    await dbService.profileChange(userInfo, imgFile, name, intro);
    const profile = await dbService.getUserInfo(userInfo.uid);

    return dispatch(loginSuccess(profile));
  };

// actions

export const loginSuccess = (userInfo) => {
  return {
    type: LOGIN_SUCCESS,
    payload: userInfo,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const loginFailure = (error) => {
  return {
    type: LOGIN_FAILURE,
    payload: error,
  };
};
