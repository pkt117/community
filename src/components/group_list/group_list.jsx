import React from "react";
import styles from "./group_list.module.css";
import { BsPerson } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getSelectedGroupAsync } from "redux/board/actions";

const GroupList = ({ item, joinType = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickList = async () => {
    await dispatch(getSelectedGroupAsync(item.postId));
    navigate(`/post_view/${item.postId}`);
  };

  return (
    <div className={styles.list} onClick={onClickList}>
      <div className={styles.imageWrap}>
        <img src={item.postImage} className={styles.image} />
      </div>
      <div className={styles.infoWrap}>
        <div className={styles.area}>
          <IoLocationOutline className={styles.area__icon} />
          <span className={styles.area__text}>{item.area}</span>
        </div>
        <h1 className={styles.title}>{item.name}</h1>
        <div className={styles.etcWrap}>
          <div className={styles.personnel}>
            <BsPerson
              className={
                item.currentPersonnel >= item.personnel
                  ? `${styles.personnel__icon} ${styles.personnel__full}`
                  : styles.personnel__icon
              }
            />
            <span
              className={
                item.currentPersonnel >= item.personnel
                  ? `${styles.personnel__text} ${styles.personnel__full}`
                  : styles.personnel__text
              }
            >
              {item.currentPersonnel} / {item.personnel}
            </span>
          </div>
          {joinType && <span className={styles.type}>{item.joinType}</span>}
        </div>
      </div>
    </div>
  );
};

export default GroupList;
