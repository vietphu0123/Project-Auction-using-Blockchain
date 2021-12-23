import React from "react";
import web3 from "../ethereum/web3";

const Winner = ({ winner }) => {
  return (
    <div className="winner row">
      <div>
        <h1>Winner: </h1>
        <p>{winner.bidder}</p>,,
        {/* <Icon address={winner.bidder} width={50} /> */}
      </div>
      <div>
        <h1>Winning Bid: </h1>
        <p>{web3.utils.fromWei(winner.bid, "ether")} Ether</p>
      </div>
    </div>
  );
};

export default Winner;
