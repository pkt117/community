import {
  getFirestore,
  setDoc,
  doc,
  Timestamp,
  getDoc,
} from "firebase/firestore";

export default class DbService {
  constructor() {
    this.db = getFirestore();
  }

  async userRegister(uid, email, name, option) {
    switch (option) {
      case "email":
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
        break;

      case "google":
        const docRef = doc(this.db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) break;
        else {
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
        break;
    }
  }
}
