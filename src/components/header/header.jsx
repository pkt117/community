import React, { useEffect, useRef, useState } from "react";
import styles from "./header.module.css";
import { AiOutlineLock } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "components/confirm_popup/confirm_popup";
import ProfileChange from "components/profile_change/profile_change";
import { logoutAsync, profileChangeAsync } from "redux/authState/loginActions";

const Header = (props) => {
  const { authState, userInfo } = useSelector(({ loginReducer }) => ({
    authState: loginReducer.currentState,
    userInfo: loginReducer.userInfo,
  }));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const listRef = useRef();

  const clickLoginButton = () => {
    if (authState === "login") {
      setSettingOpen((prev) => !prev);
    } else if (authState === "logout") {
      navigate("/");
    }
  };

  const confirmCheck = () => {
    dispatch(logoutAsync());
    setConfirmOpen(false);
    navigate("/");
  };
  const confirmCancel = () => {
    setConfirmOpen(false);
  };

  const changeAgree = (imgFile, name, intro) => {
    dispatch(profileChangeAsync(imgFile, name, intro));
    setProfileOpen(false);
  };

  const changeCancel = () => {
    setProfileOpen(false);
  };

  const onCloseList = (event) => {
    if (event.target.dataset.auth !== "authBtn") {
      setSettingOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", onCloseList);
    return () => {
      window.removeEventListener("click", onCloseList);
    };
  }, []);

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.logo}>
          <img src="favicon.png" className={styles.logo__icon} />
          group catch
        </h1>
        <button
          className={styles.button}
          onClick={clickLoginButton}
          data-auth="authBtn"
        >
          {authState === "login" ? (
            <img
              src={userInfo.profileImg}
              alt="profile_img"
              className={styles.img}
              data-auth="authBtn"
            />
          ) : (
            <AiOutlineLock className={styles.authIcon} />
          )}
        </button>

        {settingOpen && (
          <div className={styles.list} ref={listRef}>
            <button
              className={styles.setting}
              onClick={() => setProfileOpen(true)}
            >
              프로필 수정
            </button>
            <button
              className={styles.setting}
              onClick={() => setConfirmOpen(true)}
            >
              로그아웃
            </button>
          </div>
        )}
      </div>

      <ConfirmPopup
        open={confirmOpen}
        confirmCheck={confirmCheck}
        confirmCancel={confirmCancel}
        text="로그아웃 하시겠습니까?"
      />

      <ProfileChange
        open={profileOpen}
        changeAgree={changeAgree}
        changeCancel={changeCancel}
      />
    </>
  );
};

export default Header;
