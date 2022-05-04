import React, { useState, useEffect, useRef } from "react";
import styles from "./album.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBinLine } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import {
  query,
  getFirestore,
  collection,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import ConfirmPopup from "components/confirm_popup/confirm_popup";
import { getSelectedGroupAsync } from "redux/board/actions";
import { deleteObject, getStorage, ref } from "firebase/storage";

const Album = (props) => {
  const item = useLocation().state.item;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const db = getFirestore();
  const storage = getStorage();
  const updateRef = doc(db, "group", params.id);

  const [album, setAlbum] = useState(item);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { userInfo } = useSelector(({ loginReducer }) => ({
    userInfo: loginReducer.userInfo,
  }));

  const inputRef = useRef();
  const albumRef = useRef();

  const getTime = (value) => {
    const milliSeconds = new Date() - value.key;
    const seconds = milliSeconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;

    if (seconds < 60) return <h2 className={styles.date}>방금 전</h2>;
    else if (minutes < 60)
      return <h2 className={styles.date}>{Math.floor(minutes)}분 전</h2>;
    else if (hours < 24)
      return <h2 className={styles.date}>{Math.floor(hours)}시간 전</h2>;
    else
      return (
        <h2 className={styles.date}>
          {value.createDate} {value.createTime}
        </h2>
      );
  };

  const confirmCheck = () => {
    updateDoc(updateRef, {
      album: arrayRemove(album),
    });
    const storageDeleteRef = ref(
      storage,
      `group/${params.id}/album/${params.album_id}/albumImg.png`
    );
    deleteObject(storageDeleteRef);

    dispatch(getSelectedGroupAsync(params.id));
    setDeleteOpen(false);
    navigate(-1);
  };
  const confirmCancel = () => {
    setDeleteOpen(false);
  };

  const onComment = async (event) => {
    event.preventDefault();
    const comment = inputRef.current.value;
    if (comment !== "") {
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

      const prevAlbum = album;
      const nextAlbum = {
        ...album,
        comment: [
          {
            key: today.getTime(),
            content: comment,
            createTime: `${hours}:${minutes}`,
            createDate: `${month}/${date}`,
            userInfo,
            postId: randomId,
          },
          ...album.comment,
        ],
      };

      updateDoc(updateRef, {
        album: arrayUnion(nextAlbum),
      });

      updateDoc(updateRef, {
        album: arrayRemove(prevAlbum),
      });
    }

    inputRef.current.value = "";
    albumRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const deleteComment = (commentId) => {
    const prevAlbum = album;
    const nextAlbum = {
      ...album,
      comment: album.comment.filter((item) => item.postId !== commentId),
    };

    updateDoc(updateRef, {
      album: arrayUnion(nextAlbum),
    });

    updateDoc(updateRef, {
      album: arrayRemove(prevAlbum),
    });
  };

  useEffect(() => {
    const q = query(collection(db, "group"), where("postId", "==", params.id));

    onSnapshot(q, (querySnapshot) => {
      const data = [];

      querySnapshot.forEach((doc) => {
        data.push(doc.data().album);
      });
      const result = data[0].filter(
        (item) => item.postId === params.album_id
      )[0];

      setAlbum(result);
    });
  }, []);

  return (
    <>
      {album ? (
        <>
          <div className={styles.album}>
            <header className={styles.header}>
              <h1 className={styles.header__title}>앨범</h1>
            </header>

            <section className={styles.body}>
              <div className={styles.profile}>
                <img
                  src={album.userInfo.profileImg}
                  className={styles.profileImg}
                />
                <div className={styles.subProfile}>
                  <h1 className={styles.profileName}>{album.userInfo.name}</h1>
                  {getTime(item)}
                </div>
                {userInfo.uid === album.userInfo.uid ? (
                  <button
                    className={styles.control}
                    onClick={() => setDeleteOpen((prev) => !prev)}
                    data-auth="settingBtn"
                  >
                    <RiDeleteBinLine
                      className={styles.control__icon}
                      data-auth="settingBtn"
                    />
                  </button>
                ) : (
                  <></>
                )}
              </div>

              <img src={album.imgUrl} className={styles.img} ref={albumRef} />
            </section>

            <section className={styles.comment}>
              <h1 className={styles.comment__title}>
                댓글 {album.comment.length}
              </h1>
              {album.comment.map((value) => (
                <div className={styles.comment__list} key={value.key}>
                  <header className={styles.comment__header}>
                    <div className={styles.comment__profile}>
                      <img
                        src={value.userInfo.profileImg}
                        className={styles.comment__profileImg}
                      />
                      <h1 className={styles.comment__profileName}>
                        {value.userInfo.name}
                      </h1>
                    </div>
                    {getTime(value)}
                  </header>
                  <section className={styles.comment__body}>
                    <p className={styles.comment__content}>{value.content}</p>
                  </section>
                  {value.userInfo.uid === userInfo.uid && (
                    <TiDeleteOutline
                      className={styles.comment__delete}
                      onClick={() => deleteComment(value.postId)}
                    />
                  )}
                </div>
              ))}
            </section>
          </div>
          <form className={styles.comment__inputWrap}>
            <input
              type="text"
              className={styles.comment__input}
              placeholder="댓글을 작성해주세요."
              ref={inputRef}
              maxLength="50"
            />
            <button className={styles.comment__button} onClick={onComment}>
              전송
            </button>
          </form>

          <ConfirmPopup
            open={deleteOpen}
            confirmCheck={confirmCheck}
            confirmCancel={confirmCancel}
            text="앨범을 삭제하시겠습니까?"
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Album;
