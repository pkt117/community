import { useEffect, useState } from "react";
import styles from "./app.module.css";
import { Route, Routes, useLocation } from "react-router-dom";
import {
  Login,
  FindGroup,
  MyGroup,
  CreateGroup,
  FreeBoard,
  Join,
} from "./pages";
import Header from "./components/header/header";
import Navbar from "./components/navbar/navbar";
import Loading from "./components/loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { loginCheck } from "./redux/authState/loginActions";
import { getMyGroupAsync } from "./redux/board/actions";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { loadingState } = useSelector(({ loadingReducer }) => ({
    loadingState: loadingReducer.loadingState,
  }));

  // 로그인 상태 체크
  useEffect(() => {
    dispatch(loginCheck());
  }, []);

  //  로딩
  useEffect(() => {
    if (loadingState) setLoading(true);
    else setLoading(false);
  }, [loadingState]);

  return (
    <div className={styles.app}>
      {loading && <Loading />}
      {location.pathname === "/" ||
      location.pathname === "/join" ||
      location.pathname === "/create_group" ? (
        <></>
      ) : (
        <>
          <Header />
          <Navbar />
        </>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/my_group" element={<MyGroup />} />
        <Route path="/create_group" element={<CreateGroup />} />
        <Route path="/find_group" element={<FindGroup />} />
        <Route path="/free_board" element={<FreeBoard />} />
      </Routes>
    </div>
  );
}

export default App;
