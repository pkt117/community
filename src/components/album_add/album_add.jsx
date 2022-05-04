import React, { useEffect, useRef, useState } from "react";
import styles from "./album_add.module.css";

const AlbumAdd = ({ open, add, cancel }) => {
  const [visible, setVisible] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

  const fileRef = useRef();

  const onImgButton = (event) => {
    fileRef.current.click();
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setImgFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImgSrc(reader.result);
        resolve();
      };
    });
  };

  useEffect(() => {
    let timeout;
    if (open) {
      setVisible(true);
      setImgFile(null);
      setImgSrc(null);
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
            <span className={styles.title}>앨범 추가</span>
          </header>
          <section className={styles.textWrap}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className={styles.input__file}
              onChange={onFileChange}
            />

            <button className={styles.imgButton} onClick={onImgButton}>
              {imgSrc ? (
                <img src={imgSrc} alt="" className={styles.img} />
              ) : (
                <p className={styles.imgAdd}>앨범 추가</p>
              )}
            </button>
          </section>
          <section className={styles.buttonWrap}>
            <button className={styles.button} onClick={cancel}>
              취소
            </button>
            <button className={styles.button} onClick={() => add(imgFile)}>
              추가
            </button>
          </section>
        </section>
      </div>
    </div>
  );
};

export default AlbumAdd;
