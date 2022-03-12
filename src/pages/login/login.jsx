import React from "react";
import styles from "./login.module.css";

const Login = (props) => {
  return (
    <div className={styles.login}>
      <input type="email" placeholder="email" className={styles.input} />
      <input type="password" placeholder="password" className={styles.input} />

      <div className={styles.buttonBox}>
        <button className={styles.button}>로그인</button>
        <button className={styles.button}>회원가입</button>
      </div>
    </div>
  );
};

export default Login;
