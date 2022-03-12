import React from "react";
import styles from "./header.module.css";
import { AiOutlineUnlock, AiOutlineLock } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { clickLogin } from "../../redux/navigation/actions";

const Header = (props) => {
  const path = useSelector((state) => state.navigationReducer.path);
  const authState = useSelector((state) => state.authStateReducer.currentState);
  const dispatch = useDispatch();

  const clickLoginButton = () => {
    if (authState === "login") {
    } else if (authState === "logout") {
      dispatch(clickLogin());
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
