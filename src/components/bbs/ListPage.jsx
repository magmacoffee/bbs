import React, { useState, useEffect } from "react";
import { Row, Col, Button, Table } from "react-bootstrap";
import { app } from "../../firebaseInit";
import {
  getFirestore,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Pagination from "react-js-pagination";
import "../Paging.css";

const ListPage = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState(0);

  const db = getFirestore(app);
  const email = sessionStorage.getItem("email");
  const uid = sessionStorage.getItem("uid");
  const [posts, setPosts] = useState([]);

  const callAPI = () => {
    setLoading(true);
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    onSnapshot(q, (snapshot) => {
      let rows = [];
      let no = 0;
      snapshot.forEach((row) => {
        no++;
        rows.push({
          no,
          id: row.id,
          ...row.data(),
        });
      });
      // console.log(rows);

      const start = (page - 1) * size + 1;
      const end = page * size;
      let data = rows.map((row, index) => row && { seq: no - index, ...row });
      data = data.filter((row) => row.no >= start && row.no <= end);
      console.log(data);
      setCount(no);
      setPosts(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {
    callAPI();
  }, [page]);

  if (loading) return <h1 className="my-5">로딩중입니다...</h1>;
  return (
    <Row className="my-5 justify-content-center">
      <Col xs={12} md={10} lg={8}>
        <h1 className="mb-5">게시글 목록</h1>
        {uid && (
          <div className="text-end">
            <a href="/bbs/insert">
              <Button className="px-5">글쓰기</Button>
            </a>
          </div>
        )}
        <Table>
          <thead>
            <tr>
              <td>No.</td>
              <td>Title</td>
              <td>Writter</td>
              <td>Date</td>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.key}>
                <td className="text-center">{post.seq}</td>
                <td>
                  <a href={`/bbs/read/${post.id}`}>{post.title}</a>
                </td>
                <td>{post.email}</td>
                <td>{post.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          className="pagination"
          activePage={page}
          itemsCountPerPage={size}
          totalItemsCount={count}
          pageRangeDisplayed={5}
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={(e) => setPage(e)}
        />
      </Col>
    </Row>
  );
};

export default ListPage;
