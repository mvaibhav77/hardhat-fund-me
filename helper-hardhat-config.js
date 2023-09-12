const networkConfig = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  137: {
    name: "mumbai",
    ethUsdPriceFeedAddress: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
  },
  // for hardhat??
};

const developmentChain = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ASNWER = 200000000000;

module.exports = {
  networkConfig,
  developmentChain,
  DECIMALS,
  INITIAL_ASNWER,
};
