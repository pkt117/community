import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styles from "./profile_change.module.css";
import { MdPerson, MdEmail, MdEdit } from "react-icons/md";

const ProfileChange = ({ open, changeCancel, changeAgree }) => {
  const { userInfo } = useSelector(({ loginReducer }) => ({
    userInfo: loginReducer.userInfo,
  }));

  const [visible, setVisible] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [name, setName] = useState(userInfo.name);
  const [intro, setIntro] = useState(userInfo.intro);
  const [imgSrc, setImgSrc] = useState(userInfo.profileImg);
  const [activeButton, setActiveButton] = useState(true);

  const fileRef = useRef(null);
  const nameRef = useRef();

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

  const onImgButton = (event) => {
    fileRef.current.click();
  };

  const handleInputName = (event) => {
    const nameValue = nameRef.current.value;
    setName(event.target.value);
    if (nameValue !== "") {
      setActiveButton(true);
    } else {
      setActiveButton(false);
    }
  };

  const handleInputIntro = (event) => {
    setIntro(event.target.value);
  };

  // fade-out 시 애니메이션을 주기위해 설정
  useEffect(() => {
    let timeout;
    if (open) {
      setVisible(true);
      setName(userInfo.name);
      setImgSrc(userInfo.profileImg);
      setImgFile(null);
      setIntro(userInfo.intro);
      setActiveButton(true);
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
            <span className={styles.title}>프로필 수정</span>
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
              {imgSrc && (
                <img src={imgSrc} className={styles.img} alt="preview-img" />
              )}
            </button>

            <div className={styles.inputWrap}>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="이메일"
                className={`${styles.input} ${styles.email}`}
                value={userInfo.email}
                readOnly
              />
              <label htmlFor="email" className={styles.label}>
                이메일
              </label>
              <MdEmail className={styles.icon} />
            </div>

            <div className={styles.inputWrap}>
              <input
                ref={nameRef}
                id="name"
                type="text"
                name="name"
                placeholder="닉네임"
                value={name}
                className={styles.input}
                onChange={handleInputName}
                autoComplete="off"
              />
              <label htmlFor="name" className={styles.label}>
                닉네임
              </label>
              <MdPerson className={styles.icon} />
            </div>
            <div className={styles.inputWrap}>
              <textarea
                className={styles.content}
                placeholder="한줄소개를 적어주세요"
                value={intro}
                onChange={handleInputIntro}
                wrap="hard"
                maxLength={20}
              />
              <MdEdit className={styles.icon} />
              <h1 className={styles.intro}>한줄 소개</h1>
            </div>
          </section>
          <section className={styles.buttonWrap}>
            <button className={styles.button} onClick={changeCancel}>
              취소
            </button>
            <button
              className={
                activeButton
                  ? styles.button
                  : `${styles.button} ${styles.disabled}`
              }
              onClick={() => changeAgree(imgFile, name, intro)}
            >
              수정
            </button>
          </section>
        </section>
      </div>
    </div>
  );
};

export default ProfileChange;
