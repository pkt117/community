import React, { useState } from "react";
import styles from "./header.module.css";
import { AiOutlineUnlock, AiOutlineLock } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "../confirm_popup/confirm_popup";
import { logoutAsync } from "../../redux/authState/loginActions";

const Header = (props) => {
  const authState = useSelector((state) => state.loginReducer.currentState);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clickLoginButton = () => {
    if (authState === "login") {
      setConfirmOpen(true);
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
