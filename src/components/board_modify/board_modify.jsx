import React, { useState, useEffect } from "react";
import styles from "./board_modify.module.css";

const BoardModify = ({
  open,
  modifyAgree,
  modifyCancel,
  modifyTitle,
  modifyContent,
}) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState(modifyTitle);
  const [content, setContent] = useState(modifyContent);

  // fade-out 시 애니메이션을 주기위해 설정
  useEffect(() => {
    let timeout;
    if (open) {
      setVisible(true);
      setTitle(modifyTitle);
      setContent(modifyContent);
    } else {
      timeout = setTimeout(() => setVisible(false), 400);
    }

    return () => {
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }
    };
  }, [open]);

  return (
    <div
      className={visible ? `${styles.wrap} ${styles.openWrap}` : styles.wrap}
    >
      <div
        className={
          open
            ? `${styles.popupWrap} ${styles.openPopupWrap}`
            : `${styles.popupWrap} ${styles.closePopupWrap}`
        }
      >
        <section className={styles.popup}>
          <header className={styles.header}>
            <span className={styles.title}>게시글 수정</span>
          </header>
          <section className={styles.textWrap}>
            <input
              type="text"
              placeholder="제목을 입력해 주세요."
              className={styles.input}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              maxLength="30"
            />
            <textarea
              className={styles.content}
              placeholder="내용을 입력해 주세요."
              wrap="hard"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </section>
          <section className={styles.buttonWrap}>
            <button className={styles.button} onClick={modifyCancel}>
              취소
            </button>
            <button
              className={
                modifyTitle === title && modifyContent === content
                  ? `${styles.button} ${styles.disabled}`
                  : styles.button
              }
              onClick={() => modifyAgree(title, content)}
            >
              수정
            </button>
          </section>
        </section>
      </div>
    </div>
  );
};

export default BoardModify;
