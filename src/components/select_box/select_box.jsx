import React, { useEffect, useState } from "react";
import styles from "./select_box.module.css";

const SelectBox = ({ options, placeholder, getSelectValue }) => {
  const [selectValue, setSelectValue] = useState(null);
  const [onSelect, setOnSelect] = useState(false);
  const [close, setClose] = useState(false);

  const onWrapClick = (event) => {
    if (event.target.dataset.value === "wrap") setClose(true);
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
        setOnSelect(false);
        setClose(false);
      }, 400);
    }

    return () => {
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }
    };
  }, [close]);

  return (
    <>
      <input
        type="text"
        className={styles.button}
        placeholder={placeholder}
        value={selectValue ? selectValue : ""}
        readOnly
        onClick={() => setOnSelect(true)}
      />
      {onSelect && (
        <div
          className={
            close ? `${styles.close} ${styles.selectWrap}` : styles.selectWrap
          }
          onClick={onWrapClick}
          data-value="wrap"
        >
          <div className={styles.select}>
            {options.map((item) => (
              <div
                key={item.value}
                className={styles.list}
                onClick={() => onSelectValue(item.value)}
              >
                {item.value}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SelectBox;
