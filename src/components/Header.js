import React from "react";

// import Icon from "./Icon";

const Header = ({ userAccount, loading }) => {
  console.log(userAccount);
  return (
    <div>
      <div className="header">
        <div>
          <h1>ĐẤU GIÁ ONLINE</h1>
        </div>
        <div>
          <p>Tài Khoản: {userAccount}</p>
          {/* {!loading && <Icon address={userAccount} width={50} />} */}
        </div>
      </div>
    </div>
  );
};

export default Header;
