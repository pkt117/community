import React, { useEffect, useRef, useState } from "react";
import styles from "./join.module.css";
import { MdEmail, MdPerson, MdPassword } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userJoinAsync } from "../../redux/authState/joinActions";

const Join = () => {
  const [activeButton, setActiveButton] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const rePasswordRef = useRef();
  const nameRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, joinState } = useSelector(({ joinReducer }) => ({
    error: joinReducer.error,
    joinState: joinReducer.joinState,
  }));

  const checkEmail =
    /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

  const handleInput = () => {
    const email = emailRef.current.value;
    const name = nameRef.current.value;
    const password = passwordRef.current.value;
    const rePassword = rePasswordRef.current.value;

    if (checkEmail.test(email) && name !== "") {
      if (password.length >= 6 && password === rePassword) {
        setActiveButton(true);
      } else {
        setActiveButton(false);
      }
    } else {
      setActiveButton(false);
    }
  };

  //  비밀번호가 서로 맞게 입력되었는지 체크
  const onCheckPassword = () => {
    const password = passwordRef.current.value;
    const rePassword = rePasswordRef.current.value;

    if (password !== rePassword && password !== "" && rePassword !== "")
      setPasswordCheck(true);
    else setPasswordCheck(false);
  };

  //  비밀번호 길이 체크
  const onCheckPasswordLength = () => {
    const password = passwordRef.current.value;

    if (password.length < 6 && password.length > 0) setPasswordLength(true);
    else setPasswordLength(false);
  };

  // 가입버튼 눌렀을때, 파이어베이스에 등록
  const onJoin = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;

    dispatch(userJoinAsync(email, password, name));
  };

  //  회원가입 상태
  useEffect(() => {
    if (joinState === "success") navigate("/login");
    else if (error === "auth/email-already-in-use") setEmailCheck(true);
    else if (error !== null) alert(error);
  }, [error, joinState]);

  return (
    <form className={styles.join}>
      <h1 className={styles.title}>회원가입</h1>

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
        <span className={emailCheck ? styles.checkTrue : styles.checkFalse}>
          중복된 이메일 주소입니다.
        </span>
      </div>

      <div className={styles.inputWrap}>
        <input
          ref={nameRef}
          id="name"
          type="text"
          name="name"
          placeholder="닉네임"
          className={styles.input}
          onChange={handleInput}
        />
        <label htmlFor="name" className={styles.label}>
          닉네임
        </label>
        <MdPerson className={styles.icon} />
      </div>

      <div className={styles.inputWrap}>
        <input
          ref={passwordRef}
          id="password"
          type="password"
          name="password"
          placeholder="비밀번호"
          className={styles.input}
          onChange={() => {
            handleInput();
            onCheckPassword();
            onCheckPasswordLength();
          }}
          autoComplete="on"
        />
        <label htmlFor="password" className={styles.label}>
          비밀번호
        </label>
        <MdPassword className={styles.icon} />
        <span className={passwordLength ? styles.checkTrue : styles.checkFalse}>
          비밀번호는 6자 이상 입력해주세요.
        </span>
      </div>
      <div className={styles.inputWrap}>
        <input
          ref={rePasswordRef}
          id="rePassword"
          type="password"
          name="rePassword"
          placeholder="비밀번호 확인"
          className={styles.input}
          onChange={() => {
            handleInput();
            onCheckPassword();
          }}
          autoComplete="on"
        />
        <label htmlFor="rePassword" className={styles.label}>
          비밀번호 확인
        </label>
        <MdPassword className={styles.icon} />
        <span className={passwordCheck ? styles.checkTrue : styles.checkFalse}>
          비밀번호가 일치하지 않습니다.
        </span>
      </div>

      <button
        className={
          activeButton ? styles.button : `${styles.button} ${styles.disabled}`
        }
        onClick={onJoin}
      >
        가입하기
      </button>
    </form>
  );
};

export default Join;
