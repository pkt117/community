import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  collection,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

export default class DbService {
  constructor() {
    this.db = getFirestore();
    this.storage = getStorage();
  }

  // 회원가입 후 db에 유저정보등록
  async userRegister(uid, email, name, option, imgFile) {
    const storageRef = ref(this.storage, `profile/${uid}/profileImg.png`);
    let storageUrl;
    switch (option) {
      case "email":
        try {
          if (imgFile === null)
            storageUrl =
              "https://firebasestorage.googleapis.com/v0/b/community-74415.appspot.com/o/profile%2Fdefault_profile.png?alt=media&token=c811083e-ecac-4deb-9bbf-49b272f629e5";
          else {
            await uploadBytes(storageRef, imgFile);
            storageUrl = await getDownloadURL(storageRef);
          }
          await setDoc(doc(this.db, "users", uid), {
            uid,
            email,
            name,
            createdAt: serverTimestamp(),
            profileImg: storageUrl,
            intro: "",
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
              uid,
              email,
              name,
              createdAt: serverTimestamp(),
              profileImg:
                "https://firebasestorage.googleapis.com/v0/b/community-74415.appspot.com/o/profile%2Fdefault_profile.png?alt=media&token=c811083e-ecac-4deb-9bbf-49b272f629e5",
              intro: "",
            });
          } catch (error) {
            console.log(error.message);
          }
        }
        break;
    }
  }

  // 프로필 수정
  async profileChange(userInfo, imgFile, name, intro) {
    if (imgFile == null) {
      await setDoc(doc(this.db, "users", userInfo.uid), {
        uid: userInfo.uid,
        email: userInfo.email,
        name,
        createdAt: userInfo.createdAt,
        profileImg: userInfo.profileImg,
        intro,
      });
    } else {
      const storageRef = ref(
        this.storage,
        `profile/${userInfo.uid}/profileImg.png`
      );
      await uploadBytes(storageRef, imgFile);
      const storageUrl = await getDownloadURL(storageRef);
      await setDoc(doc(this.db, "users", userInfo.uid), {
        uid: userInfo.uid,
        email: userInfo.email,
        name,
        createdAt: userInfo.createdAt,
        profileImg: storageUrl,
        intro,
      });
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
      switch (value.category) {
        case "스터디":
          storageUrl =
            "https://firebasestorage.googleapis.com/v0/b/community-74415.appspot.com/o/group%2Fdefault_study.jpg?alt=media&token=b2417269-320e-4576-b5a6-0e8fe42fd564";
          break;

        case "게임/오락":
          storageUrl =
            "https://firebasestorage.googleapis.com/v0/b/community-74415.appspot.com/o/group%2Fdefault_game.jpg?alt=media&token=6203fed6-29ca-4dd3-be02-2fde1c854a4a";
          break;
        case "운동/스포츠":
          storageUrl =
            "https://firebasestorage.googleapis.com/v0/b/community-74415.appspot.com/o/group%2Fdefault_sport.jpg?alt=media&token=0240874a-f103-400d-8a85-ddbf37ad9f7a";
          break;

        case "공연/축제":
          storageUrl =
            "https://firebasestorage.googleapis.com/v0/b/community-74415.appspot.com/o/group%2Fdefault_festival.jpg?alt=media&token=5341dd15-a251-4efc-9c28-515fb3ae2084";
          break;

        case "봉사활동":
          storageUrl =
            "https://firebasestorage.googleapis.com/v0/b/community-74415.appspot.com/o/group%2Fdefault_volunteer.jpg?alt=media&token=1753bbb4-e660-4fc6-9d8e-eebc6e92156e";
          break;

        case "사교/인맥":
          storageUrl =
            "https://firebasestorage.googleapis.com/v0/b/community-74415.appspot.com/o/group%2Fdefault_socializing.jpg?alt=media&token=6fe50ef7-65a8-4f8d-80e2-6f9beae57677";
          break;

        case "기타취미":
          storageUrl =
            "https://firebasestorage.googleapis.com/v0/b/community-74415.appspot.com/o/group%2Fdefault_etc.jpg?alt=media&token=fd3706a7-571b-4818-a4c9-37ce80ba791e";
          break;
      }
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
      content: value.content,
      createdAt: serverTimestamp(),
      postId: randomId,
      postImage: storageUrl,
      userList: [{ uid, manager: true }],
      messages: [],
      joinType: value.joinType,
      joinWaiting: [],
      writingBoard: [],
      notice: [],
      album: [],
    };
    await setDoc(doc(this.db, "group", randomId), item);
  }

  // 내 게시글 가져오기
  async getMyGroup(uid) {
    const q = query(
      collection(this.db, "group"),

      where("userList", "array-contains-any", [
        { uid: uid, manager: false },
        { uid: uid, manager: true },
      ])
    );
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

    return data;
  }

  // 선택한 게시글 가져오기
  async getSelectedGroup(postId, uid) {
    const q = query(
      collection(this.db, "group"),
      where("postId", "==", postId)
    );
    const data = [];
    const userInfo = [];
    const joinWaitingInfo = [];
    let userCheck = false;
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => data.push(doc.data()));

    for (let item of data[0].userList) {
      let {
        name,
        intro,
        profileImg,
        uid: userUid,
      } = await this.getUserInfo(item.uid);
      userInfo.push({
        name,
        intro,
        profileImg,
        manager: item.manager,
        uid: userUid,
      });

      if (item.uid === uid) {
        userCheck = true;
        if (data[0].userList.indexOf(item) == 0) {
          for (let i of data[0].joinWaiting) {
            let profile = await this.getUserInfo(i);
            joinWaitingInfo.push({
              name: profile.name,
              intro: profile.intro,
              profileImg: profile.profileImg,
              uid: i,
            });
          }
        }
      }
    }

    const value = { ...data[0], userInfo, userCheck, joinWaitingInfo };

    value.notice.sort(function (a, b) {
      return b.key - a.key;
    });

    value.writingBoard.sort(function (a, b) {
      return b.key - a.key;
    });

    return value;
  }

  // 그룹 가입
  async groupJoin(uid, selected) {
    const updateRef = doc(this.db, "group", selected.postId);

    if (selected.joinType === "자동 가입") {
      await updateDoc(updateRef, {
        currentPersonnel: selected.currentPersonnel + 1,
        userList: [...selected.userList, { uid, manager: false }],
      });
    } else {
      await updateDoc(updateRef, {
        joinWaiting: [...selected.joinWaiting, uid],
      });
    }
  }

  // 가입 승인
  approvalJoin(uid, selected, approval) {
    const updateRef = doc(this.db, "group", selected.postId);
    const index = selected.joinWaiting.indexOf(uid);
    selected.joinWaiting.splice(index, 1);
    switch (approval) {
      case "승인":
        updateDoc(updateRef, {
          joinWaiting: selected.joinWaiting,
          userList: [...selected.userList, { uid, manager: false }],
          currentPersonnel: selected.currentPersonnel + 1,
        });

      case "거절":
        updateDoc(updateRef, {
          joinWaiting: selected.joinWaiting,
        });
    }
  }

  // 게시글 수정
  async modifyGroup(value, imgFile, postId) {
    const updateRef = doc(this.db, "group", postId);
    if (imgFile) {
      const storageRef = ref(this.storage, `group/${postId}/background.png`);
      await uploadBytes(storageRef, imgFile);
      const storageUrl = await getDownloadURL(storageRef);

      updateDoc(updateRef, {
        name: value.name,
        category: value.category,
        area: value.area,
        personnel: value.personnel,
        content: value.content,
        joinType: value.joinType,
        postImage: storageUrl,
      });
    } else {
      updateDoc(updateRef, {
        name: value.name,
        category: value.category,
        area: value.area,
        personnel: value.personnel,
        content: value.content,
        joinType: value.joinType,
      });
    }
  }

  // 게시글 삭제

  async deleteGroup(postId) {
    await deleteDoc(doc(this.db, "group", postId));

    this.deleteStorage(`group/${postId}`);
  }
  // 스토리지 삭제
  deleteStorage(path) {
    const listRef = ref(this.storage, path);

    listAll(listRef).then((res) => {
      res.prefixes.forEach((folderRef) => {
        this.deleteStorage(folderRef.fullPath);
      });
      res.items.forEach((itemRef) => {
        const storageDeleteRef = ref(this.storage, itemRef.fullPath);
        deleteObject(storageDeleteRef);
      });
    });
  }

  // 그룹 내 게시글 작성
  async writingBoard(notice, title, content, postId, userInfo) {
    const q = query(
      collection(this.db, "group"),
      where("postId", "==", postId)
    );

    const randomId =
      Math.random().toString(36).substring(2, 12) +
      Math.random().toString(36).substring(2, 12);

    const data = [];
    let today = new Date();

    let month = today.getMonth() + 1;
    let date = today.getDate();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (month < 10) month = `0${month}`;
    if (date < 10) date = `0${date}`;

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => data.push(doc.data()));
    const updateRef = doc(this.db, "group", postId);

    if (notice) {
      data[0].notice.unshift({
        key: today.getTime(),
        title,
        content,
        comment: [],
        createTime: `${hours}:${minutes}`,
        createDate: `${month}/${date}`,
        userInfo,
        postId: randomId,
      });

      updateDoc(updateRef, {
        notice: data[0].notice,
      });
    } else {
      data[0].writingBoard.unshift({
        key: today.getTime(),
        title,
        content,
        comment: [],
        createTime: `${hours}:${minutes}`,
        createDate: `${month}/${date}`,
        userInfo,
        postId: randomId,
      });

      updateDoc(updateRef, {
        writingBoard: data[0].writingBoard,
      });
    }
  }

  // 그룹 탈퇴
  async groupLeave(postId, uid) {
    const q = query(
      collection(this.db, "group"),
      where("postId", "==", postId)
    );
    const data = [];
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => data.push(doc.data()));
    const userList = data[0].userList.filter((item) => item.uid !== uid);
    const updateRef = doc(this.db, "group", postId);

    updateDoc(updateRef, {
      userList,
      currentPersonnel: data[0].currentPersonnel - 1,
    });
  }

  // 앨범 추가
  async albumAdd(imgFile, userInfo, postId) {
    const q = query(
      collection(this.db, "group"),
      where("postId", "==", postId)
    );
    const data = [];
    const randomId =
      Math.random().toString(36).substring(2, 12) +
      Math.random().toString(36).substring(2, 12);

    let today = new Date();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let hours = today.getHours();
    let minutes = today.getMinutes();

    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (month < 10) month = `0${month}`;
    if (date < 10) date = `0${date}`;

    const storageRef = ref(
      this.storage,
      `group/${postId}/album/${randomId}/albumImg.png`
    );
    await uploadBytes(storageRef, imgFile);
    const storageUrl = await getDownloadURL(storageRef);

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => data.push(doc.data()));

    data[0].album.unshift({
      key: today.getTime(),
      imgUrl: storageUrl,
      postId: randomId,
      userInfo,
      comment: [],
      createTime: `${hours}:${minutes}`,
      createDate: `${month}/${date}`,
    });

    const updateRef = doc(this.db, "group", postId);

    updateDoc(updateRef, {
      album: data[0].album,
    });
  }

  // 유저 정보 가져오기
  async getUserInfo(uid) {
    const q = query(collection(this.db, "users"), where("uid", "==", uid));
    const data = [];
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => data.push(doc.data()));

    return data[0];
  }
}
