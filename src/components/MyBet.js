import React from "react";
import { Link } from "react-router-dom";

import LoadScreen from "./LoadScreen";
import web3 from "../ethereum/web3";

const MyBet = ({loading , myBet }) => {
  return (
    <div>
      {loading ? (
        <LoadScreen msg={"Loading..."} />
      ) : (
        <>
          <Link to={`/`}>
              <button id="back" style={{ marginTop: "20px" }}>
               Trở về
              </button>
          </Link>  
          <h1 style={{ color: "#17a2b8", marginLeft: "10px" }}>
            Đấu Gía Hiện Có
          </h1>
          <div className="auctionList">
          {myBet.map(
              ({
                manager,
                itemName,
                itemImageUrl,
                minimumBid,
                biddersCount,
                status,
                deployedAddress,
              }) => (
                <div className="auction" key={deployedAddress}>
                  <Link
                    to={`/item/${deployedAddress}`}
                    style={{ color: "inherit", textDecoration: "inherit" }}
                  >
                    <h3>Owner: {manager}</h3>
                    <div className="auctionDetails">
                      <h3>Vật phẩm: {itemName}</h3>
                      <h3>
                        {status ? (
                          <p className="active">Active</p>
                        ) : (
                          <p className="closed">Closed</p>
                        )}
                      </h3>
                      {/* <h3>{itemImageUrl}</h3> */}
                    </div>
                    <div className="auctionDetails">
                      <h3>
                        Số tiền đặt cược tối thiểu: {web3.utils.fromWei(minimumBid, "ether")}{" "}
                        Ether
                      </h3>
                      <h3>Số người đấu giá: {biddersCount}</h3>
                    </div>
                  </Link>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyBet;
