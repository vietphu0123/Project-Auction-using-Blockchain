import React from "react";

const ErrorBar = ({ error }) => {
  return <>{error === "" ? null : <h1 className="errorMsg">{error}</h1>}</>;
};

export default ErrorBar;
