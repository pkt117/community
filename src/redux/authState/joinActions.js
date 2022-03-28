import { JOIN_SUCCESS, JOIN_FAILURE } from "./types";
import firebaseApp from "../../service/firebase";
import AuthService from "../../service/authService";
import DbService from "../../service/dbService";
import { loadingStart, loadingFinish } from "../loading/actions";

const authService = new AuthService(firebaseApp);
const dbService = new DbService(firebaseApp);

export const userJoinAsync =
  (email, password, name, imgFile) => async (dispatch) => {
    try {
      dispatch(loadingStart());
      const res = await authService.join(email, password, name);
      dbService.userRegister(res, email, name, "email", imgFile);
      dispatch(loadingFinish());
      return dispatch(joinSuccess());
    } catch (error) {
      dispatch(loadingFinish());
      return dispatch(joinError(error.code));
    }
  };

export const joinSuccess = () => ({ type: JOIN_SUCCESS, error: null });
export const joinError = (error) => ({ type: JOIN_FAILURE, error });
