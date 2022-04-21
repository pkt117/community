import React, { useEffect, useState } from "react";
import styles from "./post_view.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getSelectedGroupAsync,
  groupJoinAsync,
  approvalJoinAsync,
} from "redux/board/actions";
import { Info, Chat, Board, Album } from "components/post_view";
import WarningPopup from "components/warning_popup/warning_popup";

const PostView = () => {
  const { selected, userInfo } = useSelector(
    ({ selectedBoardReducer, loginReducer }) => ({
      selected: selectedBoardReducer.selected,
      userInfo: loginReducer.userInfo,
    })
  );

  const params = useParams();
  const dispatch = useDispatch();

  let localSelected = localStorage.getItem("selected");
  localSelected = JSON.parse(localSelected);
  const [selectedButton, setSelectedButton] = useState(localSelected);
  const [warning, setWarning] = useState(false);

  const groupJoin = () => {
    dispatch(groupJoinAsync(userInfo.uid, selected));
    dispatch(getSelectedGroupAsync(params.id));
  };

  const acceptJoin = (value) => {
    if (selected.currentPersonnel >= selected.personnel) {
      setWarning(true);
      let timeout;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setWarning(false);
      }, 1400);
    } else {
      dispatch(approvalJoinAsync(value, selected, "승인"));
      dispatch(getSelectedGroupAsync(params.id));
    }
  };

  const rejectJoin = (value) => {
    dispatch(approvalJoinAsync(value, selected, "거절"));
    dispatch(getSelectedGroupAsync(params.id));
  };

  // useEffect(() => {
  //   dispatch(getSelectedGroupAsync(params.id));
  // }, []);

  // useEffect(() => {
  //   let localSelected = localStorage.getItem("selected");

  //   if (localSelected != null) {
  //     localSelected = JSON.parse(localSelected);
  //     console.log(localSelected);
  //     setSelectedButton(localSelected);
  //   }

  //   // return () => localStorage.setItem("selected", JSON.stringify("정보"));
  // }, []);

  return (
    <div className={styles.postView}>
      <div className={styles.navWrap}>
        <h1 className={styles.title}>{selected.name}</h1>
        <nav className={styles.navbar}>
          <button
            onClick={() => {
              setSelectedButton("정보");
              localStorage.setItem("selected", JSON.stringify("정보"));
            }}
            className={
              selectedButton === "정보"
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            정보
          </button>

          <button
            onClick={() => {
              setSelectedButton("게시판");
              dispatch(getSelectedGroupAsync(params.id));
              localStorage.setItem("selected", JSON.stringify("게시판"));
            }}
            className={
              selectedButton === "게시판"
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            게시판
          </button>

          <button
            onClick={() => {
              setSelectedButton("앨범");
              localStorage.setItem("selected", JSON.stringify("앨범"));
            }}
            className={
              selectedButton === "앨범"
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            앨범
          </button>
          <button
            onClick={() => {
              setSelectedButton("채팅");
              localStorage.setItem("selected", JSON.stringify("채팅"));
            }}
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
          <Info
            selected={selected}
            groupJoin={groupJoin}
            uid={userInfo.uid}
            acceptJoin={acceptJoin}
            rejectJoin={rejectJoin}
          />
        )}
        {selectedButton === "게시판" && <Board selected={selected} />}
        {selectedButton === "앨범" && <Album selected={selected} />}
        {selectedButton === "채팅" && (
          <Chat selected={selected} userInfo={userInfo} />
        )}
      </div>
      {warning && <WarningPopup text="모집 정원 초과" />}
    </div>
  );
};

export default PostView;
