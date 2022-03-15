import React, { useEffect, useState } from "react";
import styles from "./confirm_popup.module.css";

const ConfirmPopup = ({ open, confirmCheck, confirmCancel, text }) => {
  const [visible, setVisible] = useState(false);

  // fade-out 시 애니메이션을 주기위해 설정
  useEffect(() => {
    let timeout;

    if (open) {
      setVisible(true);
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
            <span className={styles.title}>알림</span>
          </header>
          <section className={styles.textWrap}>
            <p className={styles.text}>{text}</p>
          </section>
          <section className={styles.buttonWrap}>
            <button className={styles.button} onClick={confirmCancel}>
              취소
            </button>
            <button className={styles.button} onClick={confirmCheck}>
              확인
            </button>
          </section>
        </section>
      </div>
    </div>
  );
};

export default ConfirmPopup;
