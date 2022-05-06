import React, { useState } from "react";
import styles from "./info.module.css";
import { FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "components/confirm_popup/confirm_popup";
import { useDispatch } from "react-redux";
import { groupLeaveAsync } from "redux/board/actions";

const Info = ({ postId, selected, groupJoin, uid, acceptJoin, rejectJoin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const onModify = () => {
    navigate("modify");
  };

  const confirmCheck = () => {
    dispatch(groupLeaveAsync(postId, uid));
    setConfirmOpen(false);
  };

  const confirmCancel = () => {
    setConfirmOpen(false);
  };

  return (
    <div className={styles.info}>
      <img src={selected.postImage} className={styles.image} />

      <div className={styles.contentWrap}>
        <h1 className={styles.title}>{selected.name}</h1>
        <p className={styles.content}>{selected.content}</p>
      </div>

      {!selected.userCheck &&
        (selected.joinWaiting.includes(uid) ? (
          <div className={styles.joinWrap}>
            <button className={`${styles.join} ${styles.joinDisabled}`}>
              승인 대기중
            </button>
          </div>
        ) : (
          <div className={styles.joinWrap}>
            {selected.currentPersonnel >= selected.personnel ? (
              <button className={`${styles.join} ${styles.joinDisabled}`}>
                정원초과
              </button>
            ) : (
              <button className={styles.join} onClick={groupJoin}>
                가입하기
              </button>
            )}
          </div>
        ))}

      <div className={styles.count}>
        <h1 className={styles.count__title}>
          참여자 ({selected.currentPersonnel}/{selected.personnel})
        </h1>
        {selected.userInfo ? (
          selected.userInfo.map((item) => (
            <div className={styles.userList} key={item.uid}>
              <div className={styles.profileImgWrap}>
                <img src={item.profileImg} className={styles.profileImg} />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{item.name}</span>
                <span className={styles.userIntro}>{item.intro}</span>
              </div>
              {item.manager && <FaCrown className={styles.icon} />}
            </div>
          ))
        ) : (
          <></>
        )}
      </div>

      {selected.userCheck && selected.userList[0].uid === uid && (
        <>
          {selected.joinWaitingInfo.length !== 0 && (
            <div className={styles.count}>
              <h1 className={styles.count__title}>가입 승인 대기</h1>
              {selected.joinWaitingInfo.map((item) => (
                <div className={styles.userList} key={item.uid}>
                  <img src={item.profileImg} className={styles.profileImg} />
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{item.name}</span>
                    <span className={styles.userIntro}>{item.intro}</span>
                  </div>
                  <div className={styles.buttonWrap}>
                    <button
                      className={styles.button}
                      onClick={() => acceptJoin(item.uid)}
                    >
                      승인
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => rejectJoin(item.uid)}
                    >
                      거절
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className={styles.modify}>
            <button className={styles.modifyBtn} onClick={onModify}>
              게시글 수정
            </button>
          </div>
        </>
      )}

      {selected.userCheck && selected.userList[0].uid !== uid && (
        <>
          <div className={styles.leave}>
            <button
              className={styles.leaveBtn}
              onClick={() => setConfirmOpen(true)}
            >
              그룹 탈퇴
            </button>
          </div>
        </>
      )}

      <ConfirmPopup
        open={confirmOpen}
        confirmCheck={confirmCheck}
        confirmCancel={confirmCancel}
        text="그룹 탈퇴 하시겠습니까?"
      />
    </div>
  );
};
export default Info;
