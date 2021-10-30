require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
console.log(process.env.POLYGON_MAINNET_URL);

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: process.env.POLYGON_MUMBAI_URL,
      accounts: [],
    },
    mainnet: {
      url: process.env.POLYGON_MAINNET_URL,
      accounts: [],
    },
  },
  solidity: "0.8.4",
};
