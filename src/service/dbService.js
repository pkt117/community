import {
  getFirestore,
  setDoc,
  doc,
  Timestamp,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

export default class DbService {
  constructor() {
    this.db = getFirestore();
  }

  // 회원가입 후 db에 유저정보등록
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

  // 게시글 등록
  async groupRegister(value, uid) {
    const item = {
      uid,
      name: value.name,
      category: value.category,
      area: value.area,
      personnel: value.personnel,
      currentPersonnel: 1,
      personnelFull: false,
      content: value.content,
      timestamp: serverTimestamp(),
    };
    await addDoc(collection(this.db, "group"), item);
  }

  // 내 게시글 가져오기
  async getMyGroup(uid) {
    const q = query(collection(this.db, "group"), where("uid", "==", uid));
    const data = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => data.push(doc.data()));

    return data;
  }
}
