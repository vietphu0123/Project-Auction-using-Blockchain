import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import web3 from "../ethereum/web3";

import Auction from "../ethereum/auction";
import AuctionHead from "./AuctionHead";
import Bidders from "./Bidders";
import NewBid from "./NewBid";
import Winner from "./Winner";
import LoadScreen from "./LoadScreen";
import ErrorBar from "./ErrorBar";

const AuctionItem = ({ match, userAccount }) => {
  const [summary, setSummary] = useState({});
  const [bidders, setBidders] = useState([]);
  const [winner, setWinner] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadMessage, setLoadMessage] = useState("Loading...");
  const [error, setError] = useState("");

  let AuctionInstance = Auction(match.params.deployedAddress);
  useEffect(() => {
    getDetails();
    // eslint-disable-next-line
  }, []);

  const getDetails = async () => {
    let tempBidder = [];
    let tempSummary = await AuctionInstance.methods.getSummary().call();
    if (!tempSummary.status) {
      const winner = await AuctionInstance.methods.winner().call();
      setWinner(winner);
    }
    for (var i = 1; i <= tempSummary[4]; i++) {
      tempBidder.push(await AuctionInstance.methods.bidders(i).call());
    }
    setSummary(getFormatted(tempSummary));
    setBidders(tempBidder);
    setLoading(false);
  };

  const getFormatted = (summary) => {
    return {
      manager: summary[0],
      itemName: summary[1],
      itemDescription: summary[2],
      minimumBid: summary[3],
      biddersCount: summary[4],
      status: summary[5],
    };
  };

  const makeNewBid = async (amount) => {
    if (
      amount === "" ||
      parseInt(amount) <
        parseInt(web3.utils.fromWei(summary.minimumBid, "ether"))
    ) {
      makeError(
        `Insufficient bid. Please enter an amount greater than ${web3.utils.fromWei(
          summary.minimumBid,
          "ether"
        )} Ether`
      );
      return;
    }
    setLoadMessage("Processing Transaction...");
    setLoading(true);
    try {
      await AuctionInstance.methods
        .newBid()
        .send({
          from: userAccount,
          value: web3.utils.toWei(amount, "ether"),
        })
        .once("receipt", (receipt) => {
          window.location.reload();
        });
    } catch (err) {
      setLoadMessage("Loading...");
      setLoading(false);
      if (
        err.message ===
        `Provided address "None. Please install metamask, log in and reload" is invalid, the capitalization checksum test failed, or its an indrect IBAN address which can't be converted.`
      )
        makeError(
          "No account detected. Please install metamask, log in and reload..."
        );
      else makeError(err.message);
    }
  };

  const makeError = async (msg) => {
    setError(msg);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  const pickAWinner = async () => {
    setLoadMessage("Processing Transaction...");
    setLoading(true);
    try {
      await AuctionInstance.methods
        .pickWinner()
        .send({
          from: userAccount,
        })
        .once("receipt", (receipt) => {
          window.location.reload();
        });
    } catch (err) {
      setLoadMessage("Loading...");
      setLoading(false);
      makeError(err.message);
    }
  };

  return (
    <div className="auctionItem">
      <ErrorBar error={error} />
      {loading ? (
        <LoadScreen msg={loadMessage} />
      ) : (
        <>
          <Link to={`/`}>
            <button id="back" style={{ marginBottom: "20px" }}>
              Trở về
            </button>
          </Link>
          <AuctionHead
            match={match}
            userAccount={userAccount}
            pickAWinner={pickAWinner}
            summary={summary}
          />
          {summary.status ? (
            <div className="auctionBiddingArea ">
              <NewBid makeNewBid={makeNewBid} />
              <Bidders bidders={bidders} />
            </div>
          ) : (
            <Winner winner={winner} summary={summary} />
          )}
        </>
      )}
    </div>
  );
};

export default AuctionItem;
