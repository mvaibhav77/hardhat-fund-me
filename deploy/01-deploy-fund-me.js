// const deployFunc = () => {
//   console.log("Hiiii");
// };

const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
// module.exports.default = deployFunc;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // what happends when we want to change the chains??
  // this is how we change
  const ethUsdPriceFeedAddress =
    networkConfig[chainId]["ethUsdPriceFeedAddress"];

  // when doing for localhost or hardhat we want to use a mock

  //

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
  });
};
