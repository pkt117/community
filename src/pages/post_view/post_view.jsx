import React, { useEffect, useState } from "react";
import styles from "./post_view.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSelectedGroupAsync } from "../../redux/board/actions";
import { Info, Chat, Board, Album } from "../../components/post_view";

const PostView = () => {
  const { selected, uid } = useSelector(({ boardReducer, loginReducer }) => ({
    selected: boardReducer.selected,
    uid: loginReducer.userInfo.uid,
  }));
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedButton, setSelectedButton] = useState("정보");

  const groupJoin = () => {};

  useEffect(() => {
    dispatch(getSelectedGroupAsync(params.id));
  }, []);

  return (
    <div className={styles.postView}>
      <div className={styles.navWrap}>
        <h1 className={styles.title}>{selected.name}</h1>
        <nav className={styles.navbar}>
          <button
            onClick={() => setSelectedButton("정보")}
            className={
              selectedButton === "정보"
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            정보
          </button>

          <button
            onClick={() => setSelectedButton("게시판")}
            className={
              selectedButton === "게시판"
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            게시판
          </button>

          <button
            onClick={() => setSelectedButton("앨범")}
            className={
              selectedButton === "앨범"
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            앨범
          </button>
          <button
            onClick={() => setSelectedButton("채팅")}
            className={
              selectedButton === "채팅"
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            채팅
          </button>
          <div className={styles.underline}></div>
        </nav>
      </div>
      <div className={styles.wrap}>
        {selectedButton === "정보" && (
          <Info selected={selected} groupJoin={groupJoin} />
        )}
        {selectedButton === "게시판" && <Board selected={selected} uid={uid} />}
        {selectedButton === "앨범" && <Album selected={selected} uid={uid} />}
        {selectedButton === "채팅" && <Chat selected={selected} uid={uid} />}
      </div>
    </div>
  );
};

export default PostView;
