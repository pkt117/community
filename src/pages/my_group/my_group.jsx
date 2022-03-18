import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GroupList from "../../components/group_list/group_list";
// import { getMyGroupAsync } from "../../redux/board/actions";
import styles from "./my_group.module.css";

const MyGroup = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myGroups } = useSelector(({ boardReducer }) => ({
    myGroups: boardReducer.myGroups,
  }));

  const onCreateButton = () => {
    navigate("/create_group");
  };

  // useEffect(() => {
  //   dispatch(getMyGroupAsync());
  // }, [dispatch]);

  return (
    <div className={styles.myGroup}>
      {myGroups.map((item) => (
        <GroupList item={item} key={item.timestamp} />
      ))}

      <button className={styles.createGroup} onClick={onCreateButton}>
        모임 개설
      </button>
    </div>
  );
};

export default MyGroup;
