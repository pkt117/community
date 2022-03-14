import React from "react";
import styles from "./loading.module.css";

const Loading = (props) => {
  return (
    <div className={styles.loading}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loading;
