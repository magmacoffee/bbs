import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { app } from "../../firebaseInit";
import {
  getFirestore,
  collection,
  addDoc,
  where,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const Comments = () => {
  const db = getFirestore(app);
  const [comments, setComments] = useState([]);
  const [contents, setContents] = useState("");
  const email = sessionStorage.getItem("email");
  const { id } = useParams();

  const callAPI = () => {
    const q = query(
      collection(db, "comments"),
      where("pid", "==", id),
      orderBy("date", "desc")
    );

    onSnapshot(q, (snapshot) => {
      let rows = [];
      snapshot.forEach((row) => {
        rows.push({
          ...row.data(),
          id: row.id,
        });
      });
      const data = rows.map(
        (row) =>
          row && {
            ...row,
            ellip: false,
            isEdit: false,
            originContents: row.contents,
          }
      );
      setComments(data);
    });
  };

  const onClickDelete = async (id) => {
    if (!window.confirm(`${id}번 댓글을 삭제하시겠습니까?`)) return;
    await deleteDoc(doc(db, `/comments/${id}`));
  };

  const onClickLogin = () => {
    sessionStorage.setItem("target", `/bbs/read/${id}`);
    window.location.href = "/login";
  };

  const onClickContents = (id) => {
    const data = comments.map((com) =>
      com.id === id ? { ...com, ellip: !com.ellip } : com
    );
    setComments(data);
  };

  const onInsert = async () => {
    if (contents === "") {
      alert("댓글 내용을 작성해주세요");
      return;
    }
    const data = {
      pid: id,
      email,
      contents,
      date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    };
    await addDoc(collection(db, "comments"), data);
    alert("댓글이 등록되었습니다.");
    setContents("");
  };

  const onClickUpdate = (id) => {
    const data = comments.map((com) =>
      com.id === id ? { ...com, isEdit: true } : com
    );
    setComments(data);
  };

  const onClickSave = async (com) => {
    if (com.originContents === com.contents) {
      onClickCancel(com);
      return;
    }
    if (!window.confirm("변경하시겠습니까?")) return;
    await updateDoc(doc(db, `/comments/${com.id}`), com);
  };

  const onClickCancel = (com) => {
    if (com.contents !== com.originContents) {
      if (!window.confirm("바뀐 내용이 있습니다. 취소하시겠습니까?")) {
        return;
      }
    }
    const data = comments.map((c) =>
      c.id === com.id ? { ...c, isEdit: false, contents: c.originContents } : c
    );
    setComments(data);
  };

  const onChangeContents = (e, id) => {
    const data = comments.map((com) =>
      com.id === id ? { ...com, contents: e.target.value } : com
    );
    setComments(data);
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <div className="my-5">
      {!email ? (
        <div className="text-end">
          <Button className="px-6" onClick={onClickLogin}>
            댓글 등록
          </Button>
        </div>
      ) : (
        <div>
          <Form.Control
            className="mb-2"
            as="textarea"
            rows={5}
            placeholder="댓글 내용을 입력하세요."
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />
          <div className="text-end">
            <Button className="px-3" onClick={onInsert}>
              등록
            </Button>
          </div>
        </div>
      )}
      <div className="my-5">
        {comments.map((com) => (
          <div key={com.id}>
            <Row>
              <Col className="text-muted">
                <span className="me-2">{com.email}</span>
                <span>{com.date}</span>
              </Col>
              {email === com.email && !com.isEdit && (
                <Col className="text-end">
                  <Button
                    className="me-2"
                    size="sm"
                    onClick={() => onClickUpdate(com.id)}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onClickDelete(com.id)}
                  >
                    삭제
                  </Button>
                </Col>
              )}
              {email === com.email && com.isEdit && (
                <Col className="text-end">
                  <Button
                    className="me-2"
                    size="sm"
                    variant="success"
                    onClick={() => onClickSave(com)}
                  >
                    저장
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onClickCancel(com)}
                  >
                    취소
                  </Button>
                </Col>
              )}
            </Row>
            {com.isEdit ? (
              <Form.Control
                className="mt-2"
                value={com.contents}
                as="textarea"
                rows={5}
                onChange={(e) => onChangeContents(e, com.id)}
              />
            ) : (
              <div
                className={com.ellip && "ellipsis"}
                style={{ whiteSpace: "pre-wrap", cursor: "pointer" }}
                onClick={() => onClickContents(com.id)}
              >
                {com.contents}
              </div>
            )}

            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
