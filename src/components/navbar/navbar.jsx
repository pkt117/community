import React from "react";
import styles from "./navbar.module.css";
import { NavLink } from "react-router-dom";

const Navbar = ({}) => {
  return (
    <nav className={styles.navbar}>
      <NavLink
        to="/my_group"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        내 모임
      </NavLink>

      <NavLink
        to="/find_group"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        모임 찾기
      </NavLink>
    </nav>
  );
};

export default Navbar;
