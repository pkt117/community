import React, { useState, useRef, useEffect } from "react";
import styles from "./create_group.module.css";
import Select from "../../components/select_box/select_box";
import AreaSearch from "../../components/search_popup/search_popup";
import { useDispatch } from "react-redux";
import { createGroupAsync } from "../../redux/board/actions";
import { useNavigate } from "react-router-dom";

const CreateGroup = (props) => {
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

  const [personnelSetting, setPersonnelSetting] = useState([]);
  const [categoryValue, setCategoryValue] = useState(null);
  const [areaValue, setAreaValue] = useState(null);
  const [personnelValue, setPersonnelValue] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);
  const [check, setCheck] = useState(false);
  const [checkText, setCheckText] = useState("");
  const nameRef = useRef();
  const contentRef = useRef();
  const fileRef = useRef();

  const getCategory = (value) => setCategoryValue(value);
  const getArea = (value) => setAreaValue(value);
  const getPersonnel = (value) =>
    setPersonnelValue(parseInt(value.replace("명", "")));

  const onClickButton = () => {
    const name = nameRef.current.value;
    const content = contentRef.current.value;

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
      };
      dispatch(createGroupAsync(value, imageFile));
      navigate("/my_group");
    }
  };

  const onFileChange = (event) => {
    setImageFileName(event.target.files[0].name);
    setImageFile(event.target.files[0]);
  };

  const onClickFile = () => {
    fileRef.current.click();
  };

  useEffect(() => {
    if (personnelSetting == "") {
      for (let i = 2; i <= 100; i++)
        setPersonnelSetting((prev) => [...prev, { value: `${i}명` }]);
    }
  }, []);
  return (
    <div className={styles.createGroup}>
      <h1 className={styles.title}>모임 개설</h1>
      <div className={styles.wrap}>
        <h2 className={styles.input__title}>모임 이름</h2>
        <input
          ref={nameRef}
          type="text"
          placeholder="모임 이름"
          className={styles.input}
        />
      </div>

      <div className={styles.wrap}>
        <h2 className={styles.input__title}>카테고리</h2>
        <Select
          options={category}
          placeholder="카테고리 선택"
          getSelectValue={getCategory}
        />
      </div>

      <div className={styles.wrap}>
        <h2 className={styles.input__title}>모임 지역</h2>
        <AreaSearch getSelectValue={getArea} />
      </div>

      <div className={styles.wrap}>
        <h2 className={styles.input__title}>모집 인원</h2>
        <Select
          options={personnelSetting}
          placeholder="인원 선택"
          getSelectValue={getPersonnel}
        />
      </div>

      <div className={styles.wrap}>
        <h2 className={styles.input__title}>사진 첨부</h2>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className={styles.input__file}
          onChange={onFileChange}
        />

        <input
          type="text"
          className={styles.button__file}
          placeholder="사진 첨부"
          value={imageFileName === null ? "" : imageFileName}
          readOnly
          onClick={onClickFile}
        />
      </div>

      <div className={styles.contentWrap}>
        <h2 className={styles.input__title}>모집 내용</h2>
        <textarea
          ref={contentRef}
          className={styles.content}
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
          모임 만들기
        </button>
      </div>
    </div>
  );
};
export default CreateGroup;
