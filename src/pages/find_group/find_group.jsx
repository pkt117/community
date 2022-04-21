import React, { useEffect, useRef, useState } from "react";
import styles from "./find_group.module.css";
import { useSelector, useDispatch } from "react-redux";
import GroupList from "components/group_list/group_list";
import { getTotalGroupAsync } from "redux/board/actions";
import Search from "components/search/search";

const FindGroup = (props) => {
  const dispatch = useDispatch();
  const { totalGroups } = useSelector(({ boardReducer }) => ({
    totalGroups: boardReducer.totalGroups,
  }));

  const [filterValue, setFilterValue] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchValue, setSearchValue] = useState([]);
  const [reset, setReset] = useState(false);
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
    setSearchValue([]);
    setReset(true);
    if (value === "전체") {
      setFilterValue(totalGroups);
      setSelectedCategory("전체");
    } else {
      setFilterValue(totalGroups.filter((item) => item.category === value));
      setSelectedCategory(value);
    }
  };

  const onSearch = (event, value) => {
    event.preventDefault();
    setReset(false);
    setSearchValue(
      totalGroups.filter((item) => item.name.replace(/ /g, "").includes(value))
    );
    setSelectedCategory("전체");
  };

  useEffect(() => {
    dispatch(getTotalGroupAsync());
  }, []);

  return (
    <div className={styles.findGroup}>
      <div className={styles.search}>
        <Search
          placeholder="그룹 검색"
          onSearchClick={onSearch}
          reset={reset}
        />
      </div>
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
      {searchValue.length !== 0
        ? searchValue.map((item) => (
            <GroupList item={item} key={item.createdAt} joinType={true} />
          ))
        : selectedCategory === "전체"
        ? totalGroups.map((item) => (
            <GroupList item={item} key={item.createdAt} joinType={true} />
          ))
        : filterValue.map((item) => (
            <GroupList item={item} key={item.createdAt} joinType={true} />
          ))}
    </div>
  );
};

export default FindGroup;
