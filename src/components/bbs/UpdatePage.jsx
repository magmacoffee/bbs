import { useEffect, useState } from "react";
import { app } from "../../firebaseInit";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

const UpdatePage = () => {
  const [form, setForm] = useState({
    contents: "",
    title: "",
    email: "",
    date: "",
  });
  const { contents, title } = form;
  const db = getFirestore(app);
  const { id } = useParams();

  const callApi = async () => {
    const res = await getDoc(doc(db, `posts/${id}`));
    setForm({ ...res.data() });
  };

  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onClickUpdate = async () => {
    if (!window.confirm(`${id}번 게시글을 수정하시겠습니까?`)) return;
    await updateDoc(doc(db, `/posts/${id}`), form);
    window.location.href = `/bbs/read/${id}`;
  };

  useEffect(() => {
    callApi();
  }, []);

  return (
    <Row className="my-5 justify-content-center">
      <Col xs={12} md={10} lg={8}>
        <h1>글수정</h1>
        <div className="mt-5">
          <Form.Control
            name="title"
            value={title}
            className="mb-2"
            placeholder="제목을 입력하세요"
            onChange={onChangeForm}
          />
          <Form.Control
            name="contents"
            value={contents}
            as="textarea"
            placeholder="내용을 입력하세요"
            rows={10}
            onChange={onChangeForm}
          />
          <div className="text-center mt-3">
            <Button className="px-5 me-2" onClick={onClickUpdate}>
              수정
            </Button>
            <Button className="px-5" variant="secondary">
              취소
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default UpdatePage;
