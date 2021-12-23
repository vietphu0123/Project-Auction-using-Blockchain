import React from "react";

const LoadScreen = ({ msg }) => {
  return (
    <div className="loadScreen">
      <h1>{msg}</h1>
      <div className="loadGif"></div>
    </div>
  );
};

export default LoadScreen;
