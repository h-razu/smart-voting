const votersInfo = artifacts.require("votersInfo");

module.exports = async function (deployer) {
  try {
    // Deploy the contract
    await deployer.deploy(votersInfo);

    // Get the deployed instance
    const votersInfoInstance = await votersInfo.deployed();

    console.log("votersInfo contract deployed at:", votersInfoInstance.address);
  } catch (error) {
    console.error("Error deploying the contract:", error);
  }
};
