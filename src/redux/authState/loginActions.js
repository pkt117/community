import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from "./types";
import firebaseApp from "../../service/firebase";
import AuthService from "../../service/authService";
import DbService from "../../service/dbService";
import { loadingStart, loadingFinish } from "../loading/actions";
import { getMyGroupAsync, myBoardLoad } from "../board/actions";

const authService = new AuthService(firebaseApp);
const dbService = new DbService(firebaseApp);

export const googleLoginAsync = () => async (dispatch) => {
  try {
    dispatch(loadingStart());
    const user = await authService.googleLogin();
    dbService.userRegister(user.uid, user.email, user.displayName, "google");
    dispatch(loadingFinish());

    return dispatch(
      loginSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
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
    dispatch(loadingFinish());

    return dispatch(
      loginSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
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
      const userInfo = { email, displayName, uid };

      dispatch(getMyGroupAsync());
      dispatch(loadingFinish());
      return dispatch(loginSuccess(userInfo));
    } else {
      dispatch(loadingFinish());
    }
  });
};
//  내 모임 관련 redux state 초기화
export const logoutAsync = () => (dispatch) => {
  authService.logout();
  dispatch(myBoardLoad([]));

  return dispatch(logout());
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
