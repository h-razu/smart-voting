const candidatesInfo = artifacts.require("candidatesInfo");

module.exports = async function (deployer) {
  try {
    // Deploy the contract
    await deployer.deploy(candidatesInfo);

    // Get the deployed instance
    const candidatesInfoInstance = await candidatesInfo.deployed();

    console.log("constituencyCenter contract deployed at:", candidatesInfoInstance.address);
  } catch (error) {
    console.error("Error deploying the contract:", error);
  }
};
