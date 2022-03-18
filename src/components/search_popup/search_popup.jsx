import React, { useState, useEffect } from "react";
import styles from "./search_popup.module.css";
import areaData from "../../data/area_data";
import Search from "../search/search";

const SearchPopup = ({ getSelectValue }) => {
  const [data, setData] = useState([]);
  const [selectValue, setSelectValue] = useState(null);
  const [onSearch, setOnSearch] = useState(false);
  const [close, setClose] = useState(false);
  const [searchList, setSearchList] = useState([]);

  const loadData = () => {
    areaData.map((item) => setData((prev) => [...prev, item.area_title]));
  };

  const onWrapClick = (event) => {
    if (event.target.dataset.value === "wrap") setClose(true);
  };

  const onSearchClick = (event, value) => {
    event.preventDefault();
    const getData = data.filter(function (item) {
      return item.includes(value);
    });

    setSearchList(getData);
  };

  const onSelectValue = (value) => {
    setSelectValue(value);
    getSelectValue(value);
    setClose(true);
  };

  useEffect(() => {
    let timeout;
    if (close) {
      timeout = setTimeout(() => {
        setOnSearch(false);
        setClose(false);
        setSearchList([]);
      }, 400);
    }

    return () => {
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }
    };
  }, [close]);

  useEffect(() => {
    if (data == "") loadData();
  }, []);

  return (
    <>
      <input
        type="text"
        className={styles.button}
        placeholder="지역 검색"
        value={selectValue ? selectValue : ""}
        readOnly
        onClick={() => setOnSearch(true)}
      />
      {onSearch && (
        <div
          className={
            close ? `${styles.close} ${styles.selectWrap}` : styles.selectWrap
          }
          onClick={onWrapClick}
          data-value="wrap"
        >
          <div className={styles.search}>
            <Search onSearchClick={onSearchClick} placeholder="주소 검색" />
            <div className={styles.listWrap}>
              {searchList == "" ? (
                <></>
              ) : (
                searchList.map((item) => (
                  <div
                    key={item}
                    className={styles.list}
                    onClick={() => onSelectValue(item)}
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default SearchPopup;
