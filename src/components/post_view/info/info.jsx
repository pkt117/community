import React from "react";
import styles from "./info.module.css";
import { FaCrown } from "react-icons/fa";

const Info = ({ selected, groupJoin }) => {
  return (
    <>
      <img src={selected.postImage} className={styles.image} />

      <div className={styles.contentWrap}>
        <h1 className={styles.title}>{selected.name}</h1>
        <p className={styles.content}>{selected.content}</p>
      </div>

      {!selected.userCheck && <button className={styles.join}>가입하기</button>}

      <div className={styles.count}>
        <h1 className={styles.count__title}>
          참여자 ({selected.currentPersonnel}/{selected.personnel})
        </h1>
        {selected.userList.map((item) => (
          <div className={styles.userList}>
            <span className={styles.userName}>{item.name}</span>
            {item.manager && <FaCrown />}
          </div>
        ))}
      </div>
    </>
  );
};
export default Info;
