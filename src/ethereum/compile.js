const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// Delete existing build folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// Get the contract source code and compile it
const contractPath = path.resolve(__dirname, "contracts", "Auction.sol");
const source = fs.readFileSync(contractPath, "utf8");
var input = {
  language: "Solidity",
  sources: {
    "Auction.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

// Make build folder
fs.ensureDirSync(buildPath);

// console.log(output);
// For each contract, make a json file in build folder
for (let contractFileName in output) {
  for (let contractName in output[contractFileName]) {
    console.log("Writing: ", contractName + ".json");
    fs.outputJsonSync(
      path.resolve(buildPath, contractName + ".json"),
      output[contractFileName][contractName]
    );
  }
}
