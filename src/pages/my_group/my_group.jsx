import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./my_group.module.css";

const MyGroup = (props) => {
  const navigate = useNavigate();

  const onCreateButton = () => {
    navigate("/create_group");
  };
  return (
    <div className={styles.myGroup}>
      <button className={styles.createGroup} onClick={onCreateButton}>
        모임 개설
      </button>
    </div>
  );
};

export default MyGroup;
