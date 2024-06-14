import axios from "axios";
import React, { useState, useEffect } from "react";
import { Row, Col, Card, InputGroup, Button, Form } from "react-bootstrap";
import { FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { app } from "../../firebaseInit";
import { getDatabase, ref, set, get } from "firebase/database";
import ModalBooks from "./ModalBooks";

const LOAD_COUNT = 12;

const Books = () => {
  const db = getDatabase(app);
  const navi = useNavigate();
  const uid = sessionStorage.getItem("uid");
  const [end, setEnd] = useState(false);
  const [lastPage, setLastPage] = useState(0);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("리액트");
  const [page, setPage] = useState(1);
  const [isShowModal, setShowModal] = useState(false);
  const [book, setBook] = useState();

  const callAPI = async () => {
    setLoading(true);
    const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=${LOAD_COUNT}&page=${page}`;
    const config = {
      headers: { Authorization: "KakaoAK 43675bcacbbf840f8cb7086db5734d03" },
    };
    const res = await axios.get(url, config);
    setBooks(res.data.documents);
    setLastPage(Math.ceil(res.data.meta.pageable_count / LOAD_COUNT));
    setLoading(false);
    setEnd(res.data.meta.is_end);
  };

  useEffect(() => {
    callAPI();
    setShowModal(false);
  }, [page]);

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    callAPI();
  };

  const onClickCart = (book) => {
    if (uid) {
      //장바구니에 넣는 작업
      if (
        window.confirm(`"${book.title}"\n도서를 장바구니에 넣으시겠습니까?`)
      ) {
        // 장바구니에 있는지부터 확인
        get(ref(db, `cart/${uid}/${book.isbn}`)).then((snapshot) => {
          if (snapshot.exists()) {
            alert("이미 장바구니에 등록되어 있는 도서입니다.");
          } else {
            set(ref(db, `cart/${uid}/${book.isbn}`), { ...book });
            alert(`"${book.title}" 도서가 장바구니에 담겼습니다.`);
          }
        });
      }
    } else {
      sessionStorage.setItem("target", "/books");
      navi("/login");
    }
  };

  const onClickBook = (book) => {
    setBook(book);
    console.log(book);
    setShowModal(true);
  };

  const onCloseModal = () => {
    setBook(undefined);
    setShowModal(false);
  };

  if (loading) return <h1 className="my-5">로딩중입니다...</h1>;
  return (
    <div>
      <ModalBooks book={book} show={isShowModal} onClose={onCloseModal} />
      <h1 className="my-5">도서검색</h1>
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
      <Row>
        {books.map((book) => (
          <Col key={book.isbn} xs={6} md={3} lg={2} className="mb-2">
            <Card>
              <Card.Body
                className="justify-content-center d-flex"
                style={{ cursor: "pointer" }}
                onClick={() => onClickBook(book)}
              >
                <img
                  src={book.thumbnail || "http://via.placeholder.com/120x170"}
                  width="90%"
                />
              </Card.Body>
              <Card.Footer>
                <div
                  className="ellipsis"
                  onClick={() => onClickBook(book)}
                  style={{ cursor: "pointer" }}
                >
                  {book.title}
                </div>
                <FaCartPlus
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                    color: "green",
                  }}
                  onClick={() => onClickCart(book)}
                />
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
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

export default Books;
