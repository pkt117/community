import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default class AuthService {
  constructor() {
    this.auth = getAuth();
    this.googleProvider = new GoogleAuthProvider();
  }

  //  이메일을 이용한 회원가입
  async join(email, password) {
    try {
      const userJoin = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      return { value: userJoin.user.uid, result: "success" };
    } catch (error) {
      return { value: error.code, result: "error" };
    }
  }

  defaultLogin(email, password) {
    signInWithEmailAndPassword(this.auth, email, password);
  }

  googleLogin() {
    signInWithPopup(this.auth, this.googleProvider);
  }
}
