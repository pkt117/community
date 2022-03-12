import React from "react";
import styles from "./search.module.css";
import { AiOutlineSearch } from "react-icons/ai";

const Search = (props) => {
  return (
    <input type="text">
      <AiOutlineSearch />
    </input>
  );
};

export default Search;
