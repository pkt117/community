import React, { useRef, useState } from "react";
import styles from "./login.module.css";
import { MdEmail, MdPassword } from "react-icons/md";
import { AiOutlineGoogle, AiFillSmile } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading/loading";
import { stateLogin } from "../../redux/authState/actions";

const Login = ({ authService, dbService }) => {
  const [activeButton, setActiveButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const checkEmail =
    /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

  const handleInput = () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (checkEmail.test(email) && password.length >= 6) {
      setActiveButton(true);
    } else {
      setActiveButton(false);
    }
  };

  const login = async (event, option) => {
    event.preventDefault();
    let user;
    setLoading(true);

    switch (option) {
      case "email":
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        user = await authService.defaultLogin(email, password);
        break;

      case "google":
        user = await authService.googleLogin();
        await dbService.userRegister(
          user.uid,
          user.email,
          user.displayName,
          "google"
        );
        break;
    }

    if (user === "error") {
      setLoading(false);
      setLoginCheck(true);
    } else {
      const { email, displayName, uid } = user;
      const userInfo = { email, displayName, uid };

      dispatch(stateLogin(userInfo));
      setLoading(false);
      navigate("/");
    }
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
      <span
        className={
          loginCheck
            ? styles.checkMessage
            : `${styles.checkMessage}  ${styles.disabledMessage}`
        }
      >
        아이디 또는 비밀번호를 잘못 입력했습니다.
      </span>
      <button
        className={
          activeButton ? styles.button : `${styles.button} ${styles.disabled}`
        }
        onClick={(event) => login(event, "email")}
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
        <button
          className={`${styles.etc__login} ${styles.etc__google}`}
          onClick={(event) => login(event, "google")}
        >
          <AiOutlineGoogle className={styles.etc__icon} />
          <span className={styles.etc__text}>구글 아이디로 시작하기</span>
        </button>
        <button className={`${styles.etc__login} ${styles.etc__test}`}>
          <AiFillSmile className={styles.etc__icon} />
          <span className={styles.etc__text}>로그인 없이 테스트</span>
        </button>
      </div>
      {loading && <Loading />}
    </form>
  );
};

export default Login;
