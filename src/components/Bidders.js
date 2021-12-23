import React from "react";
import web3 from "../ethereum/web3";

const Bidders = ({ bidders }) => {
  
  return (
    <div className="bidders check">
      {bidders.length > 0 ? (
        <>
          <h1>Existing Bidders</h1>
          <table>
            <thead>
              <tr>
                <th>{""}</th>
                <th>Tài khoản người đáu giá</th>
                <th>bid</th>
              </tr>
            </thead>
            <tbody>
              {bidders.map(({ bidder, bid }) => (
                <tr key={bid}>
                  <td>
                    {/* <Icon address={bidder} width={25} /> */}
                  </td>
                  <td>{bidder}</td>
                  <td>{web3.utils.fromWei(bid, "ether")} Ether </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <h1>Chưa có người đấu giá</h1>
      )}
    </div>
  );
};

export default Bidders;
