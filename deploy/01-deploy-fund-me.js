// const deployFunc = () => {
//   console.log("Hiiii");
// };

const { network } = require("hardhat");
const { networkConfig, developmentChain } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
// module.exports.default = deployFunc;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // what happends when we want to change the chains??
  // this is how we change

  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
  let ethUsdPriceFeedAddress;
  if (developmentChain.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
  }

  // when doing for localhost or hardhat we want to use a mock
  const args = [ethUsdPriceFeedAddress];

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (!developmentChain.includes(network.name) && process.env.ETHERSCAN_API) {
    await verify(fundMe.address, args);
  }
  log("-----------------------------------------------");
};

module.exports.tags = ["all", "FundMe"];
