import React from "react";
import { useNavigate } from "react-router-dom";

const Top = () => {
  const navi = useNavigate();

  const onClickBanner = () => {
    navi("/");
  };

  return (
    <div>
      <img
        src="/images/header.jpeg"
        width="100%"
        style={{ height: "240px", objectFit: "cover", cursor: "pointer" }}
        onClick={onClickBanner}
      />
    </div>
  );
};

export default Top;
