import React from "react";
import styles from "./create_group.module.css";

const CreateGroup = (props) => {
  return (
    <div className={styles.createGroup}>
      <h1 className={styles.title}>모임 개설</h1>
      <div className={styles.wrap}>
        <h2 className={styles.input__title}>모임 이름</h2>
        <input type="text" placeholder="모임 이름" />
      </div>

      <div className={styles.wrap}>
        <h2 className={styles.input__title}>카테고리</h2>
      </div>
    </div>
  );
};
export default CreateGroup;
