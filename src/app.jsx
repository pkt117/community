import { useEffect, useState } from "react";
import styles from "app.module.css";
import { Route, Routes, useLocation } from "react-router-dom";
import {
  Login,
  FindGroup,
  MyGroup,
  CreateGroup,
  Join,
  PostView,
  Modify,
  Writing,
  Board,
} from "./pages";

import Header from "components/header/header";
import Navbar from "components/navbar/navbar";
import Loading from "components/loading/loading";
import { useDispatch, useSelector } from "react-redux";
import { loginCheck } from "redux/authState/loginActions";
import Album from "pages/post_view/album/album";

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
      {location.pathname === "/my_group" ||
      location.pathname === "/find_group" ||
      location.pathname === "/free_board" ? (
        <>
          <Header />
          <Navbar />
        </>
      ) : (
        <></>
      )}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="join" element={<Join />} />
        <Route path="my_group" element={<MyGroup />} />
        <Route path="create_group" element={<CreateGroup />} />
        <Route path="find_group" element={<FindGroup />} />
        <Route path="post_view/:id" element={<PostView />} />
        <Route path="post_view/:id/modify" element={<Modify />} />
        <Route path="post_view/:id/writing" element={<Writing />} />
        <Route path="post_view/:id/board/:board_id" element={<Board />} />
        <Route path="post_view/:id/album/:album_id" element={<Album />} />
      </Routes>
    </div>
  );
}

export default App;
