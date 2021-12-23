const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/AuctionFactory.json");
const compiledAuction = require("../ethereum/build/Auction.json");

let accounts, factory, auction, auctionAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "2000000" });

  await factory.methods
    .createAuction("test", "NA", "100")
    .send({ from: accounts[0], gas: "2000000" });

  [auctionAddress] = await factory.methods.getDeployedAuctions().call();

  auction = await new web3.eth.Contract(compiledAuction.abi, auctionAddress);
});

describe("Auctions", () => {
  it("deploys a factory and a auction", () => {
    assert.ok(factory.options.address);
    assert.ok(auction.options.address);
  });

  it("marks caller as manager", async () => {
    const manager = await auction.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("sets the name and link correctly", async () => {
    const name = await auction.methods.itemName().call();
    const url = await auction.methods.itemImageUrl().call();
    assert.equal(name, "test");
    assert.equal(url, "NA");
  });

  it("allows people to bid and add them to bidders", async () => {
    await auction.methods.newBid().send({
      value: "200",
      from: accounts[1],
    });
    const bidderJson = await auction.methods.bidders(1).call();
    assert.equal(accounts[1], bidderJson.bidder);
  });

  it("requires a minimum bid amount", async () => {
    try {
      await auction.methods.newBid().send({
        value: "10",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      let key = Object.keys(err.results)[0];
      let reason = err.results[key].reason;
      assert.equal(reason, "Bid amount insuffficient");
    }
  });

  it("requires manager to pick a winner", async () => {
    try {
      await auction.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      let key = Object.keys(err.results)[0];
      let reason = err.results[key].reason;
      assert.equal(reason, "Manager Restricted function");
    }
  });

  it("picks the correct winner", async () => {
    await bidAndPick();
    const winner = await auction.methods.winner().call();
    assert.equal(accounts[2], winner.bidder);
  });

  it("gives money back to losers", async () => {
    const bal1 = await web3.eth.getBalance(accounts[1]);
    const bal3 = await web3.eth.getBalance(accounts[3]);
    assert(web3.utils.fromWei(bal1, "ether") > 99);
    assert(web3.utils.fromWei(bal3, "ether") > 99);
  });

  it("does not give winner back its bid", async () => {
    let bal2 = await web3.eth.getBalance(accounts[2]);
    bal2 = web3.utils.fromWei(bal2, "ether");
    assert(bal2 < 95);
  });

  it("gives winning bid to manager", async () => {
    let bal0 = await web3.eth.getBalance(accounts[0]);
    bal0 = web3.utils.fromWei(bal0, "ether");
    assert(bal0 > 104);
  });

  it("shuts down auction after choosing winner", async () => {
    await bidAndPick();
    let status = await auction.methods.status().call();
    assert(!status);
    try {
      await auction.methods.newBid().send({
        value: "1000",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      let key = Object.keys(err.results)[0];
      let reason = err.results[key].reason;
      assert.equal(reason, "This auction is closed");
    }
  });
});

bidAndPick = async () => {
  await auction.methods.newBid().send({
    value: web3.utils.toWei("1", "ether"),
    from: accounts[1],
  });
  await auction.methods.newBid().send({
    value: web3.utils.toWei("5", "ether"),
    from: accounts[2],
  });
  await auction.methods.newBid().send({
    value: web3.utils.toWei("2", "ether"),
    from: accounts[3],
  });
  await auction.methods.pickWinner().send({
    from: accounts[0],
    gas: "2000000",
  });
};
