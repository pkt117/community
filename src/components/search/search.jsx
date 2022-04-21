import React, { useRef, useState } from "react";
import styles from "./search.module.css";

const Search = ({ onSearchClick, placeholder, reset = false }) => {
  const searchRef = useRef();

  const [text, setText] = useState("");

  return (
    <form
      className={styles.inputWrap}
      onSubmit={(event) => onSearchClick(event, searchRef.current.value)}
    >
      <input
        type="text"
        ref={searchRef}
        className={styles.input}
        value={reset ? "" : text}
        placeholder={placeholder}
        onChange={(event) => {
          setText(searchRef.current.value);
          onSearchClick(event, searchRef.current.value);
        }}
      />
    </form>
  );
};

export default Search;
