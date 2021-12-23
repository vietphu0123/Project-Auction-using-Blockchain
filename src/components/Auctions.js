import React from "react";
import { Link } from "react-router-dom";

import LoadScreen from "./LoadScreen";
import web3 from "../ethereum/web3";

const Auctions = ({ auctionSummaries,userAccount, loading }) => {
  console.log(auctionSummaries);
  return (
    <div>
      {loading ? (
        <LoadScreen msg={"Loading..."} />
      ) : (
        <>
          <div class="container-link">
          <Link to={`/newAuction`}>
            <button style={{ marginTop: "20px", marginLeft: "10px" }}>
              Tạo Phiên Đấu giá
            </button>
          </Link>
          <Link to={`/myAuction/${userAccount}`}>
            <button style={{ marginTop: "20px", marginLeft: "10px" }}>
              Phiên Đấu Gía Của Tôi
            </button>
          </Link>
          <Link to={`/myBet/${userAccount}`}>
            <button style={{ marginTop: "20px", marginLeft: "10px" }}>
              Phiên Đã Đấu Gía
            </button>
          </Link>
          <Link to={`/activate`}>
            <button style={{ marginTop: "20px", marginLeft: "10px" }}>
              Phiên Đấu Giá Còn Hoạt Động
            </button>
          </Link>
          <Link to={`/closed`}>
            <button style={{ marginTop: "20px", marginLeft: "10px" }}>
            Phiên Đấu Giá Đã Kết Thúc
            </button>
          </Link>
          </div>
          <h1 style={{ color: "#17a2b8", marginLeft: "10px" }}>
            Các phiên đấu giá hiện có
          </h1>
          <div className="auctionList">
            {auctionSummaries.map(
              ({
                manager,
                itemName,
                itemDescription,
                minimumBid,
                biddersCount,
                status,
                highest,
                deployedAddress,
              }) => (
                <div className="auction" key={deployedAddress}>
                  <Link
                    to={`/item/${deployedAddress}`}
                    style={{ color: "inherit", textDecoration: "inherit" }}
                  >
                    <div className="auctionDetails">
                      <h3>
                        {status ? (
                          <p className="active">Active</p>
                        ) : (
                          <p className="closed">Closed</p>
                        )}
                      </h3>
                      {/* <h3>{itemImageUrl}</h3> */}
                    </div>
                    <h3>Tên Vật Phẩm: {itemName}</h3>
            
                    
                    <div className="auctionDetails">
                      <h3>
                        Số tiền tối thiểu: {web3.utils.fromWei(minimumBid, "ether")}{" "}
                        Ether
                      </h3>
                      
                      <h3>Số người đã đặt cược: {biddersCount}</h3>
                      <h3>Gía cược cao nhất:{highest}</h3>
                      <h3>Mô tả về sản phẩm :{itemDescription}</h3>
                      <h3>Phiên đấu giá được tạo bởi: {manager}</h3>
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

export default Auctions;
