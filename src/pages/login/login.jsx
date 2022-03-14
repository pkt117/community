import React, { useRef, useState } from "react";
import styles from "./login.module.css";
import { MdEmail, MdPassword } from "react-icons/md";
import { AiOutlineGoogle, AiFillSmile } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [activeButton, setActiveButton] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();

  // const firebase = useSelector((state) => state.firebaseReducer.getFirebase);
  const navigate = useNavigate();

  const handleInput = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (password !== "" && email !== "") {
      setActiveButton(true);
    } else {
      setActiveButton(false);
    }
  };

  const emailLogin = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    // firebase.defaultLogin();
  };

  const onJoin = () => {
    navigate("/join");
  };

  return (
    <form className={styles.login}>
      <h1 className={styles.title}>로그인</h1>
      <div className={styles.inputWrap}>
        <input
          ref={emailRef}
          id="email"
          type="email"
          name="email"
          placeholder="이메일"
          className={styles.input}
          onChange={handleInput}
        />
        <label htmlFor="email" className={styles.label}>
          이메일
        </label>
        <MdEmail className={styles.icon} />
      </div>
      <div className={styles.inputWrap}>
        <input
          ref={passwordRef}
          id="password"
          type="password"
          name="password"
          className={styles.input}
          placeholder="비밀번호"
          autoComplete="on"
          onChange={handleInput}
        />
        <label htmlFor="password" className={styles.label}>
          비밀번호
        </label>
        <MdPassword className={styles.icon} />
      </div>

      <button
        className={
          activeButton ? styles.button : `${styles.button} ${styles.disabled}`
        }
        onClick={emailLogin}
      >
        로그인
      </button>
      <div className={styles.join}>
        <span className={styles.join__item}>비밀번호 찾기</span>
        <span className={styles.join__item} onClick={onJoin}>
          회원가입
        </span>
      </div>

      <div className={styles.sns}>
        <div className={styles.sns__line}></div>
        <p className={styles.sns__text}>continue with Social account</p>
        <div className={styles.sns__line}></div>
      </div>

      <div className={styles.etc}>
        <button className={`${styles.etc__login} ${styles.etc__google}`}>
          <AiOutlineGoogle className={styles.etc__icon} />
          <span className={styles.etc__text}>구글 아이디로 시작하기</span>
        </button>
        <button className={`${styles.etc__login} ${styles.etc__test}`}>
          <AiFillSmile className={styles.etc__icon} />
          <span className={styles.etc__text}>로그인 없이 테스트</span>
        </button>
      </div>
    </form>
  );
};

export default Login;
