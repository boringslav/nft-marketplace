require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

const MUMBAI_URL = process.env.POLYGON_MUMBAI_URL;
const MAINNET_URL = process.env.POLYGON_MAINNET_URL;
const METAMASK_ACCOUNT = process.env.METAMASK_PRIVATE_KEY;

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: MUMBAI_URL,
      accounts: [METAMASK_ACCOUNT],
    },
    mainnet: {
      url: MAINNET_URL,
      accounts: [METAMASK_ACCOUNT],
    },
  },
  solidity: "0.8.4",
};
