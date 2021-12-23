import web3 from "./web3";
import factory from "./build/AuctionFactory.json";

const instance = new web3.eth.Contract(
  factory.abi,
  "0x3ED5b335A5d20a983D2b566E86e973B8f0431B73"
);

export default instance;
