import React from "react";
import styles from "./warning_popup.module.css";

const WarningPopup = ({ text }) => {
  return (
    <div className={styles.warn}>
      <header className={styles.header}>
        <span className={styles.title}>알림</span>
      </header>
      <section className={styles.textWrap}>
        <p className={styles.text}>{text}</p>
      </section>
    </div>
  );
};

export default WarningPopup;
