const constituencyCenter = artifacts.require("constituencyCenter");

module.exports = function (deployer) {
  deployer.deploy(constituencyCenter);
};
