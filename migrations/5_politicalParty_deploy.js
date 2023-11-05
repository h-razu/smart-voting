const politicalParty = artifacts.require("politicalParty");

module.exports = async function (deployer) {
  try {
    // Deploy the contract
    await deployer.deploy(politicalParty);

    // Get the deployed instance
    const politicalPartyInstance = await politicalParty.deployed();

    console.log("politicalParty contract deployed at:", politicalPartyInstance.address);
  } catch (error) {
    console.error("Error deploying the contract:", error);
  }
};
