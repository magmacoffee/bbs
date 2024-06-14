import { Row, Col, Button, Modal } from "react-bootstrap";

const ModalBooks = ({ book, show, onClose }) => {
  return (
    <>
      <Modal show={show} onHide={onClose} backdrop="static" size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>도서 상세 정보</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Row>
            <Col>
              <img
                src={book?.thumbnail || "http://via.placeholder.com/140x170"}
                style={{ width: "140px", height: "200px" }}
              />
            </Col>
            <Col
              height="100%"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Row>도서명 : {book?.title}</Row>
              <Row>ISBN : {book?.isbn}</Row>
              <Row>가격 : {book?.price}</Row>
              {book?.sale_price && book?.sale_price > 0 && (
                <Row>할인가 : {book?.sale_price}</Row>
              )}
              <Row className="mb-2">출판사 : {book?.publisher}</Row>
            </Col>
          </Row>
          <hr />
          <Row style={{ padding: "8px" }}>{book?.contents}...</Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalBooks;
