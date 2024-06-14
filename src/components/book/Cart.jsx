import React, { useEffect, useState } from "react";
import { app } from "../../firebaseInit";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { Table, Button } from "react-bootstrap";
import ModalBooks from "./ModalBooks";

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const uid = sessionStorage.getItem("uid");
  const db = getDatabase(app);
  const [isShowModal, setShowModal] = useState(false);
  const [book, setBook] = useState();

  const callAPI = () => {
    setLoading(true);
    onValue(ref(db, `cart/${uid}`), (snapshot) => {
      const rows = [];
      snapshot.forEach((row) => {
        rows.push({ key: row.key, ...row.val() });
      });
      console.log(rows);
      setBooks(rows);
      setLoading(false);
    });
  };

  const onClickDelete = (e, book) => {
    e.stopPropagation();
    if (window.confirm(`${book.title}\n삭제하시겠습니까?`)) {
      remove(ref(db, `cart/${uid}/${book.isbn}`));
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

  useEffect(() => {
    callAPI();
  }, []);

  if (loading) return <h1 className="my-5">로딩중입니다....</h1>;
  return (
    <div>
      <ModalBooks book={book} show={isShowModal} onClose={onCloseModal} />
      <h1 className="my-5">장바구니</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <td>썸네일</td>
            <td>도서제목</td>
            <td>가격</td>
            <td>저자</td>
            <td>삭제</td>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr
              key={book.isbn}
              style={{ cursor: "pointer" }}
              onClick={() => onClickBook(book)}
            >
              <td>
                <img src={book.thumbnail} width="30px" />
              </td>
              <td>{book.title}</td>
              <td>{book.price}</td>
              <td>{book.authors}</td>
              <td>
                <Button
                  className="btn-sm"
                  variant="danger"
                  onClick={(e) => onClickDelete(e, book)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Cart;
