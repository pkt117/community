import { useEffect } from "react";
import styles from "./app.module.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { Login, FindGroup, MyGroup, MakeGroup, FreeBoard, Join } from "./pages";
import Header from "./components/header/header";
import Navbar from "./components/navbar/navbar";
import { useDispatch } from "react-redux";
import { stateLogin } from "./redux/authState/actions";

function App({ authService, dbService }) {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    authService.onAuthChange((user) => {
      const { email, displayName, uid } = user;
      const userInfo = { email, displayName, uid };
      dispatch(stateLogin(userInfo));
    });
  });

  return (
    <div className={styles.app}>
      {location.pathname === "/login" || location.pathname === "/join" ? (
        <></>
      ) : (
        <>
          <Header />
          <Navbar />
        </>
      )}

      <Routes>
        <Route path="/" element={<MyGroup />} />
        <Route
          path="/login"
          element={<Login authService={authService} dbService={dbService} />}
        />
        <Route
          path="/join"
          element={<Join authService={authService} dbService={dbService} />}
        />
        <Route path="/make_group" element={<MakeGroup />} />
        <Route path="/find_group" element={<FindGroup />} />
        <Route path="/free_board" element={<FreeBoard />} />
      </Routes>
    </div>
  );
}

export default App;
