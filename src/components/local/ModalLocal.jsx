import React from "react";
import { useState } from "react";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const ModalLocal = ({ local, show, onClose }) => {
  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={onClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{local?.place_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Row>주소 : {local?.address_name}</Row>
            <Map
              center={{ lat: local?.y, lng: local?.x }}
              style={{ width: "100%", height: "360px" }}
            >
              <MapMarker position={{ lat: local?.y, lng: local?.x }}>
                <div style={{ color: "#000" }}>
                  {local?.phone || "연락처 없음."}
                </div>
              </MapMarker>
            </Map>
          </Row>
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

export default ModalLocal;
