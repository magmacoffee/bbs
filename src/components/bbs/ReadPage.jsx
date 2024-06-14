import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { app } from "../../firebaseInit";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import { Row, Col, Button, Card } from "react-bootstrap";
import Comments from "./Comments";

const ReadPage = () => {
  const loginEmail = sessionStorage.getItem("email");
  const [post, setPost] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const db = getFirestore(app);
  const [loading, setLoading] = useState(false);

  const callAPI = async () => {
    setLoading(true);
    const res = await getDoc(doc(db, `posts/${id}`));
    setPost(res.data());
    setLoading(false);
  };

  const { email, date, title, contents } = post;

  const onClickUpdate = () => {
    navigate(`/bbs/update/${id}`);
  };

  const onClickDelete = async () => {
    if (!window.confirm(`${id}번 게시글을 삭제하시겠습니까?`)) return;
    setLoading(true);
    await deleteDoc(doc(db, `/posts/${id}`));
    setLoading(false);
    alert("삭제가 완료되었습니다.");
    window.location.href = "/bbs";
  };

  useEffect(() => {
    callAPI();
  }, []);

  if (loading) return <h1 className="my-5">로딩중입니다...</h1>;

  return (
    <Row className="my-5 justify-content-center">
      <Col xs={12} md={10} lg={8}>
        <h1>게시글 정보</h1>
        {loginEmail === email && (
          <div className="text-end mb-2">
            <Button
              className="mx-1"
              variant="success"
              size="sm"
              onClick={onClickUpdate}
            >
              수정
            </Button>
            <Button variant="danger" size="sm" onClick={onClickDelete}>
              삭제
            </Button>
          </div>
        )}
        <Card>
          <Card.Body>
            <h5>{title}</h5>
            <div className="text-muted">
              <span className="me-3">{date}</span>
              <span>{email}</span>
            </div>
            <hr />
            <div style={{ whiteSpace: "pre-wrap" }}>{contents}</div>
          </Card.Body>
        </Card>
        <hr style={{ marginTop: "32px", marginBottom: "32px" }} />
        <Comments />
      </Col>
    </Row>
  );
};

export default ReadPage;
