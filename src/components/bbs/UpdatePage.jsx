import { useEffect, useState } from "react";
import { app } from "../../firebaseInit";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

const UpdatePage = () => {
  const navi = useNavigate();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const res = await getDoc(doc(db, `posts/${id}`));
    setForm({ ...res.data() });
    setLoading(false);
  };

  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onClickUpdate = async () => {
    const loginEmail = sessionStorage.getItem("email");
    if (loginEmail !== form.email) {
      alert(
        `수정할 수 없습니다.\n작성자와 현재 로그인한 이메일이 일치하지 않습니다.\n(작성자 : ${form.email}, 현재 로그인 : ${loginEmail})`
      );
      return;
    }
    if (!window.confirm(`${id}번 게시글을 수정하시겠습니까?`)) return;
    setLoading(true);
    await updateDoc(doc(db, `/posts/${id}`), form);
    setLoading(false);
    alert("수정을 완료하였습니다.");
    window.location.href = `/bbs/read/${id}`;
  };

  const onClickCancel = () => {
    window.location.href = `/bbs/read/${id}`;
  };

  useEffect(() => {
    callApi();
  }, []);

  if (loading) return <h1 className="my-5">로딩중입니다...</h1>;

  return (
    <Row className="my-5 justify-content-center">
      <Col xs={12} md={10} lg={8}>
        <h1>게시글 수정</h1>
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
            <Button
              className="px-5"
              variant="secondary"
              onClick={onClickCancel}
            >
              취소
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default UpdatePage;
