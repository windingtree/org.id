var Indexed = artifacts.require("./Indexed.sol");
var WTKeyIndex = artifacts.require("./WTKeyIndex.sol");
var WTContracts = artifacts.require("./WTContracts.sol");
var WTHotel = artifacts.require("./WTHotel.sol");
var WTAirline = artifacts.require("./WTAirline.sol");
var WTAirRoute = artifacts.require("./WTAirRoute.sol");
var WTIndex = artifacts.require("./WTIndex.sol");
var LifToken = artifacts.require("./LifToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Indexed);
  deployer.deploy(WTKeyIndex);
  deployer.deploy(WTContracts);
  deployer.deploy(WTHotel);
  deployer.deploy(WTAirline);
  deployer.deploy(WTAirRoute);
  deployer.deploy(WTIndex);
  deployer.deploy(LifToken);
};
