import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./writing.module.css";
import { AiFillNotification } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { writingBoardAsync } from "redux/board/actions";

const Writing = (props) => {
  const { selected, userInfo } = useSelector(
    ({ selectedBoardReducer, loginReducer }) => ({
      selected: selectedBoardReducer.selected,
      userInfo: loginReducer.userInfo,
    })
  );

  const titleRef = useRef();
  const contentRef = useRef();

  const [noticeCheck, setNoticeCheck] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async () => {
    const title = titleRef.current.value;
    const content = contentRef.current.value;

    await dispatch(
      writingBoardAsync(noticeCheck, title, content, selected.postId, userInfo)
    );

    navigate(-1);
  };

  return (
    <div className={styles.writing}>
      <h1 className={styles.title}>게시글 작성</h1>
      <div className={styles.wrap}>
        <input
          type="text"
          placeholder="제목을 입력해 주세요."
          className={styles.input}
          ref={titleRef}
        />
        {selected.userCheck && selected.userList[0].uid === userInfo.uid ? (
          <div className={styles.buttonWrap}>
            <button
              className={
                noticeCheck
                  ? `${styles.checkTrue} ${styles.check}`
                  : styles.check
              }
              onClick={() => setNoticeCheck((prev) => !prev)}
            >
              <AiFillNotification
                className={
                  noticeCheck
                    ? `${styles.checkIcon} ${styles.icon}`
                    : styles.icon
                }
              />
            </button>
            <span className={styles.buttonText}>공지 설정</span>
          </div>
        ) : (
          <></>
        )}
      </div>
      <textarea
        className={styles.content}
        placeholder="내용을 입력해 주세요."
        wrap="hard"
        ref={contentRef}
      />

      <button className={styles.submit} onClick={onSubmit}>
        게시글 등록
      </button>
    </div>
  );
};

export default Writing;
