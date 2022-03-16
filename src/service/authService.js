import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  updateEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export default class AuthService {
  constructor() {
    this.auth = getAuth();
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.addScope("email"); // 식별자가 공백으로 나오는 현상 해결
  }

  //  이메일을 이용한 회원가입
  async join(email, password, name) {
    const user = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    updateProfile(this.auth.currentUser, { displayName: name });
    return user.user.uid;
  }

  //  이메일을 이용한 로그인
  async emailLogin(email, password) {
    const user = await signInWithEmailAndPassword(this.auth, email, password);
    return user.user;
  }
  // 구글 로그인
  async googleLogin() {
    const user = await signInWithPopup(this.auth, this.googleProvider);
    await updateEmail(this.auth.currentUser, user._tokenResponse.email);
    return user.user;
  }

  // 로그인 상태 체크
  onAuthChange(onAuthChanged) {
    const unsubscribe = onAuthStateChanged(this.auth, (user) => {
      onAuthChanged(user);
    });

    return unsubscribe;
  }

  logout() {
    signOut(this.auth);
  }
}
