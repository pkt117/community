import React, { useEffect, useRef, useState } from "react";
import styles from "./find_group.module.css";
import { useSelector, useDispatch } from "react-redux";
import GroupList from "components/group_list/group_list";
import { getTotalGroupAsync } from "redux/board/actions";

const FindGroup = (props) => {
  const dispatch = useDispatch();
  const { totalGroups } = useSelector(({ boardReducer }) => ({
    totalGroups: boardReducer.totalGroups,
  }));

  const [filterValue, setFilterValue] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const filterList = [
    "전체",
    "스터디",
    "게임/오락",
    "운동/스포츠",
    "공연/축제",
    "봉사활동",
    "사교/인맥",
    "기타취미",
  ];

  // 가로 스크롤 드래그로 가능하게 구현
  const scrollRef = useRef();
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState();

  const onDragStart = (event) => {
    event.preventDefault();
    setIsDrag(true);
    setStartX(event.pageX + scrollRef.current.scrollLeft);
  };

  const onDragEnd = () => {
    setIsDrag(false);
  };

  const onDragMove = (event) => {
    if (isDrag) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
      scrollRef.current.scrollLeft = startX - event.pageX;
      if (scrollLeft === 0) {
        setStartX(event.pageX);
      } else if (scrollWidth <= clientWidth + scrollLeft) {
        setStartX(event.pageX + scrollLeft);
      }
    }
  };
  const throttle = (func, ms) => {
    let throttled = false;
    return (...args) => {
      if (!throttled) {
        throttled = true;
        setTimeout(() => {
          func(...args);
          throttled = false;
        }, ms);
      }
    };
  };

  // 가로 스크롤 딜레이 시간
  const delay = 10;
  const onThrottleDragMove = throttle(onDragMove, delay);

  const clickFilter = (value) => {
    if (value === "전체") {
      setFilterValue(totalGroups);
      setSelectedCategory("전체");
    } else {
      setFilterValue(totalGroups.filter((item) => item.category === value));
      setSelectedCategory(value);
    }
  };

  useEffect(() => {
    dispatch(getTotalGroupAsync());
  }, []);

  return (
    <div className={styles.findGroup}>
      <div
        className={styles.filter}
        ref={scrollRef}
        onMouseDown={onDragStart}
        onMouseMove={isDrag ? onThrottleDragMove : null}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        {filterList.map((item) => {
          return (
            <button
              key={item}
              className={
                selectedCategory === item
                  ? `${styles.button} ${styles.selectedButton}`
                  : styles.button
              }
              onClick={() => clickFilter(item)}
            >
              {item}
            </button>
          );
        })}
      </div>
      {selectedCategory === "전체"
        ? totalGroups.map((item) => (
            <GroupList item={item} key={item.createdAt} />
          ))
        : filterValue.map((item) => (
            <GroupList item={item} key={item.createdAt} />
          ))}
    </div>
  );
};

export default FindGroup;
