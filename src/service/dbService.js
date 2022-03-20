import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default class DbService {
  constructor() {
    this.db = getFirestore();
    this.storage = getStorage();
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
            createdAt: serverTimestamp(),
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
              createdAt: serverTimestamp(),
            });
          } catch (error) {
            console.log(error.message);
          }
        }
        break;
    }
  }

  // 게시글 등록
  async groupRegister(value, imageFile, uid) {
    const randomId =
      Math.random().toString(36).substring(2, 12) +
      Math.random().toString(36).substring(2, 12);

    const storageRef = ref(this.storage, `group/${randomId}/background.png`);
    let storageUrl;
    if (imageFile === null) {
      storageUrl =
        "https://firebasestorage.googleapis.com/v0/b/community-74415.appspot.com/o/group%2Fdefault_background.jpg?alt=media&token=d57745e2-d1ad-4dcd-b429-69c1dbca856f";
    } else {
      await uploadBytes(storageRef, imageFile);
      storageUrl = await getDownloadURL(storageRef);
    }

    const item = {
      uid,
      name: value.name,
      category: value.category,
      area: value.area,
      personnel: value.personnel,
      currentPersonnel: 1,
      personnelFull: false,
      content: value.content,
      createdAt: serverTimestamp(),
      postId: randomId,
      postImage: storageUrl,
    };
    await setDoc(doc(this.db, "group", randomId), item);
  }

  // 내 게시글 가져오기
  async getMyGroup(uid) {
    const q = query(collection(this.db, "group"), where("uid", "==", uid));
    const data = [];

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => data.push(doc.data()));

    // 시간순으로 내림차순
    data.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

    return data;
  }
  //  전체 게시글 가져오기
  async getTotalGroup() {
    const q = query(collection(this.db, "group"), orderBy("createdAt", "desc"));
    const data = [];

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => data.push(doc.data()));

    console.log(data);
    return data;
  }
}
