import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./board.module.css";
import { BsThreeDotsVertical } from "react-icons/bs";
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
import Loading from "components/loading/loading";
import BoardModify from "components/board_modify/board_modify";

const Board = (props) => {
  const item = useLocation().state.item;
  const type = useLocation().state.type;
  const inputRef = useRef();
  const listRef = useRef();
  const boardRef = useRef();
  const db = getFirestore();
  const params = useParams();
  const updateRef = doc(db, "group", params.id);

  const [board, setBoard] = useState(item);
  const [settingOpen, setSettingOpen] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { userInfo } = useSelector(({ loginReducer }) => ({
    userInfo: loginReducer.userInfo,
  }));

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

      const prevBoard = board;
      const nextBoard = {
        ...board,
        comment: [
          {
            key: today.getTime(),
            content: comment,
            createTime: `${hours}:${minutes}`,
            createDate: `${month}/${date}`,
            userInfo,
            postId: randomId,
          },
          ...board.comment,
        ],
      };

      if (type === "notice") {
        updateDoc(updateRef, {
          notice: arrayUnion(nextBoard),
        });

        updateDoc(updateRef, {
          notice: arrayRemove(prevBoard),
        });
      } else if (type === "writingBoard") {
        updateDoc(updateRef, {
          writingBoard: arrayUnion(nextBoard),
        });

        updateDoc(updateRef, {
          writingBoard: arrayRemove(prevBoard),
        });
      }
    }
    inputRef.current.value = "";
    boardRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const onCloseList = (event) => {
    if (event.target.dataset.auth !== "settingBtn") {
      setSettingOpen(false);
    }
  };

  const confirmCheck = () => {
    if (type === "notice") {
      updateDoc(updateRef, {
        notice: arrayRemove(board),
      });
    } else if (type === "writingBoard") {
      updateDoc(updateRef, {
        writingBoard: arrayRemove(board),
      });
    }

    dispatch(getSelectedGroupAsync(params.id));
    setDeleteOpen(false);
    navigate(-1);
  };
  const confirmCancel = () => {
    setDeleteOpen(false);
  };

  const modifyAgree = (modifyTitle, modifyContent) => {
    const prevBoard = board;
    const nextBoard = {
      ...board,
      title: modifyTitle,
      content: modifyContent,
    };

    if (type === "notice") {
      updateDoc(updateRef, {
        notice: arrayUnion(nextBoard),
      });

      updateDoc(updateRef, {
        notice: arrayRemove(prevBoard),
      });
    } else if (type === "writingBoard") {
      updateDoc(updateRef, {
        writingBoard: arrayUnion(nextBoard),
      });

      updateDoc(updateRef, {
        writingBoard: arrayRemove(prevBoard),
      });
    }

    setModifyOpen(false);
  };

  const modifyCancel = () => {
    setModifyOpen(false);
  };

  const deleteComment = (commentId) => {
    const prevBoard = board;
    const nextBoard = {
      ...board,
      comment: board.comment.filter((item) => item.postId !== commentId),
    };

    if (type === "notice") {
      updateDoc(updateRef, {
        notice: arrayUnion(nextBoard),
      });

      updateDoc(updateRef, {
        notice: arrayRemove(prevBoard),
      });
    } else if (type === "writingBoard") {
      updateDoc(updateRef, {
        writingBoard: arrayUnion(nextBoard),
      });

      updateDoc(updateRef, {
        writingBoard: arrayRemove(prevBoard),
      });
    }
  };

  useEffect(() => {
    const q = query(collection(db, "group"), where("postId", "==", params.id));

    onSnapshot(q, (querySnapshot) => {
      const data = [];
      if (type === "notice") {
        querySnapshot.forEach((doc) => {
          data.push(doc.data().notice);
        });
        const result = data[0].filter(
          (item) => item.postId === params.board_id
        )[0];

        setBoard(result);
      } else if (type === "writingBoard") {
        querySnapshot.forEach((doc) => {
          data.push(doc.data().writingBoard);
        });
        const result = data[0].filter(
          (item) => item.postId === params.board_id
        )[0];

        setBoard(result);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("click", onCloseList);
    return () => {
      window.removeEventListener("click", onCloseList);
    };
  }, []);

  return (
    <>
      {board ? (
        <>
          <div className={styles.board}>
            <header className={styles.header}>
              <h1 className={styles.header__title}>게시글</h1>
            </header>

            <section className={styles.body}>
              <div className={styles.profile}>
                <img
                  src={board.userInfo.profileImg}
                  className={styles.profileImg}
                />
                <div className={styles.subProfile}>
                  <h1 className={styles.profileName}>{board.userInfo.name}</h1>
                  {getTime(item)}
                </div>
                {userInfo.uid === board.userInfo.uid ? (
                  <button
                    className={styles.control}
                    onClick={() => setSettingOpen((prev) => !prev)}
                    data-auth="settingBtn"
                  >
                    <BsThreeDotsVertical
                      className={styles.control__icon}
                      data-auth="settingBtn"
                    />
                  </button>
                ) : (
                  <></>
                )}
                {settingOpen && (
                  <div className={styles.list}>
                    <button
                      className={styles.setting}
                      onClick={() => setModifyOpen(true)}
                    >
                      게시글 수정
                    </button>
                    <button
                      className={styles.setting}
                      onClick={() => setDeleteOpen(true)}
                    >
                      게시글 삭제
                    </button>
                  </div>
                )}
              </div>
              <h1 className={styles.title}>{board.title}</h1>
              <p className={styles.content} ref={boardRef}>
                {board.content}
              </p>
            </section>
            <section className={styles.comment}>
              <h1 className={styles.comment__title}>
                댓글 {board.comment.length}
              </h1>
              {board.comment.map((value) => (
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
            text="게시글을 삭제하시겠습니까?"
          />

          <BoardModify
            open={modifyOpen}
            modifyAgree={modifyAgree}
            modifyCancel={modifyCancel}
            modifyTitle={board.title}
            modifyContent={board.content}
          />
        </>
      ) : (
        <div className={`${styles.board} ${styles.emptyBoard}`}>
          <header className={styles.header}>
            <h1 className={styles.header__title}>게시글</h1>
          </header>
          <Loading />
        </div>
      )}
    </>
  );
};

export default Board;
