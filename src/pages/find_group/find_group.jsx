import React, { useEffect } from "react";
import styles from "./find_group.module.css";
import { useSelector, useDispatch } from "react-redux";
import GroupList from "../../components/group_list/group_list";
import { getTotalGroupAsync } from "../../redux/board/actions";

const FindGroup = (props) => {
  const dispatch = useDispatch();
  const { totalGroups } = useSelector(({ boardReducer }) => ({
    totalGroups: boardReducer.totalGroups,
  }));
  console.log(totalGroups);

  useEffect(() => {
    dispatch(getTotalGroupAsync());
  }, []);

  return (
    <div className={styles.findGroup}>
      {totalGroups.map((item) => (
        <GroupList item={item} key={item.createdAt} />
      ))}
    </div>
  );
};

export default FindGroup;
