import AlbumAdd from "components/album_add/album_add";
import Loading from "components/loading/loading";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { albumAddAsync } from "redux/board/actions";
import styles from "./album.module.css";

const Album = ({ selected, userInfo, postId }) => {
  const [writing, setWriting] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const add = async (ImgFile) => {
    setWriting(false);
    setLoading(true);
    await dispatch(albumAddAsync(ImgFile, userInfo, postId));
    setLoading(false);
  };

  const cancel = () => {
    setWriting(false);
  };

  const onAlbum = (item) => {
    if (selected.userCheck)
      navigate(`album/${item.postId}`, { state: { item } });
  };

  return (
    <>
      <div className={styles.album}>
        {selected.album.map((item) => (
          <div
            className={
              selected.userCheck
                ? styles.list
                : `${styles.list} ${styles.disabledList}`
            }
            key={item.key}
            onClick={() => onAlbum(item)}
          >
            <img src={item.imgUrl} className={styles.listImg} />
          </div>
        ))}
        {loading && <Loading />}
      </div>

      {selected.userCheck && (
        <button className={styles.writing} onClick={() => setWriting(true)}>
          +
        </button>
      )}

      <AlbumAdd open={writing} add={add} cancel={cancel} />
    </>
  );
};

export default Album;
