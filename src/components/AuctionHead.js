import React from "react";
import web3 from "../ethereum/web3";

const AuctionHead = ({ summary, match, userAccount, pickAWinner }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    pickAWinner();
  };
  return (
    <div className="auctionHead">
      <div className="row">
        {/* <p>
          {summary.manager && <Icon address={summary.manager} width={100} />}
        </p> */}
        <p>
          {/* {match.params.deployedAddress && (
            <Icon address={match.params.deployedAddress} width={100} />
          )} */}
        </p>
      </div>
      <div className="row">
        <p>Chủ phiên đấu giá: {summary.manager}</p>
        <p>Địa chỉ: {match.params.deployedAddress}</p>
      </div>
      <div className="row">
        <p>Vật phẩm: {summary.itemName}</p>
        <p>
          {summary.status ? (
            <>
              <span className="active">Active</span>
              {userAccount === summary.manager && (
                <span style={{ marginTop: "-5px", marginLeft: "20px" }}>
                  <form onSubmit={onSubmit}>
                    <button>Kết thúc phiên đấu giá</button>
                  </form>
                </span>
              )}
            </>
          ) : (
            <span className="closed">Closed</span>
          )}
        </p>
      </div>
      <div className="row">
        <p>
          Gía khởi điểm: {web3.utils.fromWei(summary.minimumBid, "ether")} Ether
        </p>
        <p>Số người đấu giá: {summary.biddersCount}</p>
      </div>
    </div>
  );
};

export default AuctionHead;
