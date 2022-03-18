import React from "react";
import styles from "./group_list.module.css";
import { BsPerson } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";

const GroupList = ({ item }) => {
  return (
    <div className={styles.list}>
      <div className={styles.imageWrap}></div>
      <div className={styles.infoWrap}>
        <div className={styles.area}>
          <IoLocationOutline className={styles.area__icon} />
          <span className={styles.area__text}>{item.area}</span>
        </div>
        <h1 className={styles.title}>{item.name}</h1>
        <div className={styles.personnel}>
          <BsPerson
            className={
              item.personnelFull
                ? `${styles.personnel__icon} ${styles.personnel__full}`
                : styles.personnel__icon
            }
          />
          <span
            className={
              item.personnelFull
                ? `${styles.personnel__text} ${styles.personnel__full}`
                : styles.personnel__text
            }
          >
            {item.currentPersonnel} / {item.personnel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GroupList;
