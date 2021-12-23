const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/AuctionFactory.json");

const provider = new HDWalletProvider(
  "option town advance together math put snow fat crouch six wave bird",
  "https://rinkeby.infura.io/v3/ec7bb2f72adc43ec904b28c27d27b755"
);

const web3 = new Web3(provider);
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deply from account ", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
    .send({ gas: "2000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
};

deploy();
