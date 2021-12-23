   
import React, { useState } from "react";

const NewBid = ({ makeNewBid }) => {
  const [amount, setAmount] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    await makeNewBid(amount);
    setAmount("");
  };

  return (
    <div className="newBid check">
      <h1>Đặt Lệnh</h1>
      <form onSubmit={onSubmit}>
        <div className="row">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
          <span>Ether</span>
        </div>
        <button style={{ marginTop: "20px" }}>Submit</button>
      </form>
    </div>
  );
};

export default NewBid;