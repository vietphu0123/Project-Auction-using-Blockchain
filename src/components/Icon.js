import React from "react";
import Identicon from "identicon.js";

const Icon = ({ address, compare, width }) => {
  return (
    <>
      {address === "None. Please install metamask, log in and reload" ? null : (
        <img
          width={width}
          height={width}
          src={`data:image/png;base64,${new Identicon(
            address,
            width
          ).toString()}`}
          alt="No Avatar..."
          style={{ margin: "auto", border: "solid 1px #000" }}
        />
      )}
    </>
  );
};

export default Icon;
