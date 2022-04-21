import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./board.module.css";

const Board = ({ selected }) => {
  const navigate = useNavigate();

  const onWriting = () => {
    navigate("writing");
  };

  const onBoard = (item, type) => {
    navigate(`board/${item.postId}`, { state: { item, type } });
  };

  const getTime = (item) => {
    const milliSeconds = new Date() - item.key;
    const seconds = milliSeconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;

    if (seconds < 60) return <span className={styles.time}>방금 전</span>;
    else if (minutes < 60)
      return <span className={styles.time}>{Math.floor(minutes)}분 전</span>;
    else if (hours < 24)
      return <span className={styles.time}>{Math.floor(hours)}시간 전</span>;
    else
      return (
        <span className={styles.time}>
          {item.createDate} {item.createTime}
        </span>
      );
  };

  return (
    <div className={styles.wrap}>
      {selected.notice.map((item) => (
        <div
          className={styles.notice}
          key={item.key}
          onClick={() => onBoard(item, "notice")}
        >
          <h1 className={styles.title}>
            <span className={styles.notice__title}>[공지]</span> {item.title}
          </h1>
        </div>
      ))}
      {selected.writingBoard.map((item) => (
        <div
          className={styles.board}
          key={item.key}
          onClick={() => onBoard(item, "writingBoard")}
        >
          <header className={styles.header}>
            <div className={styles.profile}>
              <img
                src={item.userInfo.profileImg}
                className={styles.profileImg}
              />
              <h1 className={styles.profileName}>{item.userInfo.name}</h1>
            </div>
            {getTime(item)}
          </header>
          <section className={styles.body}>
            <h1 className={styles.title}>{item.title}</h1>
            <p className={styles.content}>{item.content}</p>
          </section>
        </div>
      ))}
      {selected.userCheck ? (
        <button className={styles.writing} onClick={onWriting}>
          글쓰기
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Board;
