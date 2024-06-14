import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { app } from "../../firebaseInit";
import { getDatabase, ref, set, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import ModalLocal from "./ModalLocal";

const LOAD_SIZE = 10;

const Locals = () => {
  const navi = useNavigate();

  const db = getDatabase(app);
  const uid = sessionStorage.getItem("uid");

  const [end, setEnd] = useState(false);
  const [lastPage, setLastPage] = useState();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("동탄고등학교");
  const [page, setPage] = useState(1);
  const [locals, setLocals] = useState([]);
  const [local, setLocal] = useState();
  const [isShowModal, setShowModal] = useState(false);

  const callAPI = async () => {
    setLoading(true);
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?target=title&query=${query}&size=${LOAD_SIZE}&page=${page}`;
    const config = {
      headers: { Authorization: "KakaoAK 43675bcacbbf840f8cb7086db5734d03" },
    };
    const res = await axios.get(url, config);
    setLocals(res.data.documents);
    setLastPage(Math.ceil(res.data.meta.pageable_count / LOAD_SIZE));
    setEnd(res.data.meta.is_end);
    setLoading(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (query === "") {
      alert("검색어를 입력해주세요.");
    } else {
      callAPI();
      setPage(1);
    }
  };

  const onClickFavorite = async (e, local) => {
    e.preventDefault();
    if (!uid) {
      navi("/login");
      sessionStorage.setItem("target", "/locals");
      return;
    }
    if (window.confirm("즐겨찾기에 추가하시겠습니까?")) {
      setLoading(true);
      await get(ref(db, `favorite/${uid}/${local.id}`)).then(
        async (snapshot) => {
          if (snapshot.exists()) {
            alert("즐겨찾기에 이미 등록되어 있습니다.");
          } else {
            await set(ref(db, `favorite/${uid}/${local.id}`), local);
            alert("즐겨찾기에 등록되었습니다.");
          }
          setLoading(false);
        }
      );
    }
  };

  const onClickShowMapDialog = (local) => {
    setLocal(local);
    setShowModal(true);
  };

  const onCloseMapDialog = () => {
    setLocal(local);
    setShowModal(false);
  };

  useEffect(() => {
    callAPI();
  }, [page]);

  if (loading) return <h1 className="my-5">로딩중입니다...</h1>;
  return (
    <div>
      <ModalLocal show={isShowModal} local={local} onClose={onCloseMapDialog} />
      <h1 className="my-5">지역검색</h1>
      <Row className="mb-2">
        <Col xs={8} md={6} lg={4}>
          <form onSubmit={onSubmit}>
            <InputGroup>
              <Form.Control
                placeholder="검색어"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit">검색</Button>
            </InputGroup>
          </form>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <td>ID</td>
            <td>장소명</td>
            <td>주소</td>
            <td>전화</td>
            <td>지도보기</td>
            <td>즐겨찾기</td>
          </tr>
        </thead>
        <tbody>
          {locals.map((local) => (
            <tr key={local.id}>
              <td>{local.id}</td>
              <td>{local.place_name}</td>
              <td>{local.road_address_name}</td>
              <td>{local.phone}</td>
              <td>
                <Button onClick={() => onClickShowMapDialog(local)}>
                  보기
                </Button>
              </td>
              <td>
                <Button onClick={(e) => onClickFavorite(e, local)}>
                  즐겨찾기
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-center my-3">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          이전
        </Button>
        <span className="mx-2">
          {page} / {lastPage}
        </span>
        <Button onClick={() => setPage(page + 1)} disabled={end}>
          다음
        </Button>
      </div>
    </div>
  );
};

export default Locals;
