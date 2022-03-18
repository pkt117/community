import React, { useRef } from "react";
import styles from "./search.module.css";

const Search = ({ onSearchClick, placeholder }) => {
  const searchRef = useRef();

  return (
    <form
      className={styles.inputWrap}
      onSubmit={(event) => onSearchClick(event, searchRef.current.value)}
    >
      <input
        type="text"
        ref={searchRef}
        className={styles.input}
        placeholder={placeholder}
      />
    </form>
  );
};

export default Search;
