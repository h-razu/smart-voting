const presidingOfficerData = artifacts.require("presidingOfficerData");

module.exports = async function (deployer) {
  try {
    // Deploy the contract
    await deployer.deploy(presidingOfficerData);

    // Get the deployed instance
    const presidingOfficerDataInstance = await presidingOfficerData.deployed();

    console.log("presidingOfficerData contract deployed at:", presidingOfficerDataInstance.address);
  } catch (error) {
    console.error("Error deploying the contract:", error);
  }
};
