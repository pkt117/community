import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import {
  query,
  getFirestore,
  collection,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

const Chat = ({ selected, userInfo }) => {
  const inputRef = useRef();
  const scrollRef = useRef();

  const [disabled, setDisabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const db = getFirestore();

  const sendMessage = (event) => {
    event.preventDefault();
    const message = inputRef.current.value;

    const updateRef = doc(db, "group", selected.postId);
    let today = new Date();

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    updateDoc(updateRef, {
      messages: [
        ...messages,
        {
          message,
          timestamp: `${hours}:${minutes}:${seconds}`,
          uid: userInfo.uid,
          name: userInfo.name,
          key: today.getTime(),
        },
      ],
    });

    inputRef.current.value = "";
  };

  const onChange = (event) => {
    if (event.target.value === "") setDisabled(false);
    else setDisabled(true);
  };

  const scrollToBottom = () => {
    if (selected.userCheck) {
      scrollRef.current.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "group"),
      where("postId", "==", selected.postId)
    );

    onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data().messages);
      });
      setMessages(data[0]);
      scrollToBottom();
    });

    return () => setMessages([]);
  }, []);

  return (
    <form className={styles.chat}>
      {!selected.userCheck ? (
        <h1 className={styles.warn}>그룹 가입 후 이용 가능합니다.</h1>
      ) : (
        <>
          <div className={styles.messageForm}>
            {messages.length !== 0 ? (
              messages.map((item) => (
                <div
                  className={
                    item.uid === userInfo.uid
                      ? `${styles.message} ${styles.myMessage}`
                      : styles.message
                  }
                  key={item.key}
                >
                  <h1 className={styles.message__name}>{item.name}</h1>
                  <p className={styles.message__text}>{item.message}</p>
                  <p className={styles.message__time}>{item.timestamp}</p>
                </div>
              ))
            ) : (
              <></>
            )}
            <div ref={scrollRef}></div>
          </div>
          <div className={styles.sendForm}>
            <textarea
              type="text"
              autoFocus
              ref={inputRef}
              onChange={onChange}
              className={styles.sendInput}
              wrap="hard"
            />
            <button
              className={
                disabled
                  ? styles.sendBtn
                  : `${styles.sendBtn} ${styles.disabled}`
              }
              onClick={sendMessage}
            >
              전송
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default Chat;
