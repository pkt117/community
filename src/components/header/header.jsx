import React, { useState } from "react";
import styles from "./header.module.css";
import { AiOutlineUnlock, AiOutlineLock } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "../confirm_popup/confirm_popup";

const Header = (props) => {
  const authState = useSelector((state) => state.authStateReducer.currentState);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const clickLoginButton = () => {
    if (authState === "login") {
      setConfirmOpen(true);
    } else if (authState === "logout") {
      navigate("/login");
    }
  };

  const confirmCheck = () => {
    console.log("check");
  };
  const confirmCancel = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.logo}>사이트이름</h1>
        <button className={styles.button} onClick={clickLoginButton}>
          {authState === "login" ? (
            <AiOutlineUnlock className={styles.authIcon} />
          ) : (
            <AiOutlineLock className={styles.authIcon} />
          )}
        </button>
      </div>

      <ConfirmPopup
        open={confirmOpen}
        confirmCheck={confirmCheck}
        confirmCancel={confirmCancel}
        text="로그아웃 하시겠습니까?"
      />
    </>
  );
};

export default Header;
