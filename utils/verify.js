const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
  console.log("Verifying Contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArgument: args,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { verify };
