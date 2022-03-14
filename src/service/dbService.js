import { getFirestore, setDoc, doc, Timestamp } from "firebase/firestore";

export default class DbService {
  constructor() {
    this.db = getFirestore();
  }

  async userRegister(uid, email, name) {
    console.log(this.db);
    try {
      await setDoc(doc(this.db, "users", uid), {
        uid: uid,
        email: email,
        name: name,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}
