import React from "react";
import styles from "./header.module.css";
import { AiOutlineUnlock, AiOutlineLock } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const authState = useSelector((state) => state.authStateReducer.currentState);
  const navigate = useNavigate();

  const clickLoginButton = () => {
    if (authState === "login") {
    } else if (authState === "logout") {
      navigate("/login");
    }
  };

  return (
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
  );
};

export default Header;
