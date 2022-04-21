import React, { useState, useEffect, useRef } from "react";
import styles from "./modify.module.css";

import Select from "components/select_box/select_box";
import AreaSearch from "components/search_popup/search_popup";
import { useDispatch, useSelector } from "react-redux";
import { deleteGroupAsync, modifyGroupAsync } from "redux/board/actions";
import { useNavigate } from "react-router-dom";
import ConfirmPopup from "components/confirm_popup/confirm_popup";

const Modify = (props) => {
  const { selected, userInfo } = useSelector(
    ({ selectedBoardReducer, loginReducer }) => ({
      selected: selectedBoardReducer.selected,
      userInfo: loginReducer.userInfo,
    })
  );

  const category = [
    { value: "스터디" },
    { value: "게임/오락" },
    { value: "운동/스포츠" },
    { value: "공연/축제" },
    { value: "봉사활동" },
    { value: "사교/인맥" },
    { value: "기타취미" },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(selected.name);
  const [personnelSetting, setPersonnelSetting] = useState([]);
  const [categoryValue, setCategoryValue] = useState(selected.category);
  const [areaValue, setAreaValue] = useState(selected.area);
  const [personnelValue, setPersonnelValue] = useState(selected.personnel);
  const [imgFile, setImgFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(selected.postImage);
  const [check, setCheck] = useState(false);
  const [checkText, setCheckText] = useState("");
  const [joinType, setJoinType] = useState(selected.joinType);
  const [content, setContent] = useState(selected.content);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fileRef = useRef();

  const getCategory = (value) => setCategoryValue(value);
  const getArea = (value) => setAreaValue(value);
  const getPersonnel = (value) =>
    setPersonnelValue(parseInt(value.replace("명", "")));

  const onClickButton = async () => {
    if (name.trim() === "") {
      setCheck(true);
      setCheckText("모임 이름을 입력해주세요");
    } else if (categoryValue === null) {
      setCheck(true);
      setCheckText("카테고리를 선택해주세요");
    } else if (areaValue === null) {
      setCheck(true);
      setCheckText("지역을 입력해주세요");
    } else if (personnelValue === null) {
      setCheck(true);
      setCheckText("모집인원을 선택해주세요");
    } else {
      const value = {
        name,
        category: categoryValue,
        area: areaValue,
        personnel: personnelValue,
        content,
        joinType,
      };
      await dispatch(modifyGroupAsync(value, imgFile, selected.postId));
      navigate(-1);
    }
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setImgFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImgSrc(reader.result);
        resolve();
      };
    });
  };

  const onImgButton = (event) => {
    fileRef.current.click();
  };

  const onJoinType = (event) => {
    setJoinType(event.target.value);
  };

  const onDelete = () => {
    setConfirmOpen(true);
  };

  const confirmCheck = async () => {
    await dispatch(deleteGroupAsync(selected.postId));
    navigate(-2);
  };

  const confirmCancel = () => {
    setConfirmOpen(false);
  };

  useEffect(() => {
    if (personnelSetting == "") {
      for (let i = 2; i <= 100; i++)
        setPersonnelSetting((prev) => [...prev, { value: `${i}명` }]);
    }
  }, []);

  return (
    <div className={styles.createGroup}>
      <h1 className={styles.title}>게시글 수정</h1>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className={styles.input__file}
        onChange={onFileChange}
      />

      <button className={styles.imgButton} onClick={onImgButton}>
        {imgSrc && (
          <img src={imgSrc} className={styles.img} alt="preview-img" />
        )}
      </button>
      <div className={styles.wrap}>
        <h2 className={styles.input__title}>모임 이름</h2>
        <input
          type="text"
          placeholder="모임 이름"
          value={name}
          className={styles.input}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>

      <div className={styles.wrap}>
        <h2 className={styles.input__title}>카테고리</h2>
        <Select
          options={category}
          placeholder="카테고리 선택"
          getSelectValue={getCategory}
          defaultValue={categoryValue}
        />
      </div>

      <div className={styles.wrap}>
        <h2 className={styles.input__title}>모임 지역</h2>
        <AreaSearch getSelectValue={getArea} selectedValue={areaValue} />
      </div>

      <div className={styles.wrap}>
        <h2 className={styles.input__title}>모집 인원</h2>
        <Select
          options={personnelSetting}
          placeholder="인원 선택"
          getSelectValue={getPersonnel}
          defaultValue={personnelValue}
        />
      </div>

      <div className={styles.wrap}>
        <h2 className={styles.input__title}>가입 방식</h2>
        <div className={styles.joinWrap}>
          <label htmlFor="자동 가입" className={styles.radio}>
            <input
              type="radio"
              value="자동 가입"
              id="자동 가입"
              checked={joinType === "자동 가입"}
              onChange={onJoinType}
              className={styles.radio__button}
            />
            자동 가입
          </label>
          <label htmlFor="승인 가입" className={styles.radio}>
            <input
              type="radio"
              value="승인 가입"
              id="승인 가입"
              checked={joinType === "승인 가입"}
              onChange={onJoinType}
              className={styles.radio__button}
            />
            승인 가입
          </label>
        </div>
      </div>

      <div className={styles.contentWrap}>
        <h2 className={styles.input__title}>모집 내용</h2>
        <textarea
          className={styles.content}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="모임 내용을 적어주세요"
          wrap="hard"
        />
      </div>
      <div className={styles.buttonWrap}>
        <p
          className={
            check ? `${styles.activeCheck} ${styles.check}` : styles.check
          }
        >
          {checkText}
        </p>
        <button className={styles.button} onClick={onClickButton}>
          게시글 수정
        </button>

        <button
          className={`${styles.button} ${styles.delete}`}
          onClick={onDelete}
        >
          게시글 삭제
        </button>
      </div>
      <ConfirmPopup
        open={confirmOpen}
        confirmCheck={confirmCheck}
        confirmCancel={confirmCancel}
        text="게시글을 삭제하시겠습니까?"
      />
    </div>
  );
};

export default Modify;
