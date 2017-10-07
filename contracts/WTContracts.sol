pragma solidity ^0.4.15;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
   @title WTContracts, a registry of contracts

   A public registry of all important contracts on the WT platform

   Inherits from OpenZeppelin's `Ownable`
 */
contract WTContracts is Ownable {

  // Total amount of contracts stored
  uint public total;

  // Contracts index by position
  mapping (uint => Contract) contracts;

  // Contracts indexed by name
  mapping (string => uint) names;

  // Contracts indexed by address
  mapping (address => uint) addrs;

  struct Contract {
    string name;
    address addr;
    string version;
  }

  /**
     @dev `register` allows the owner to register a new contract

     @param _name The name of the contract to be registered
     @param _addr The contract's address
     @param _version The contract's version
   */
  function register(
    string _name,
    address _addr,
    string _version
  ) onlyOwner() external {
    if ((names[_name] == 0) && (addrs[_addr] == 0)){
      total ++;
      contracts[total] = Contract(_name, _addr, _version);
      names[_name] = total;
      addrs[_addr] = total;
    }
  }

  /**
     @dev `edit` allows an owner to edit a registered contract

     @param _name The name of the contract to edit
     @param _addr The contract's new address
     @param _version The contract's new version
   */
  function edit(
    string _name,
    address _addr,
    string _version
  ) onlyOwner() external {
    if (names[_name] > 0){
      contracts[names[_name]].addr = _addr;
      contracts[names[_name]].version = _version;
    }
  }

  /**
     @dev `getContract` get the info of a registered contract by index

     @param _pos The registered contract's index
     returns {name, address, url, version} The contract's information
   */
  function getContract(
    uint _pos
  ) constant returns(string, address, string){
    if (_pos < total)
      return (
        contracts[_pos].name,
        contracts[_pos].addr,
        contracts[_pos].version
      );
    else
      return ("", address(0), "");
  }

  /**
     @dev `getByAddr` get the info of a registered contract by address

     @param _addr The registered contract's address
     returns {name, address, url, version} The contract's information
   */
  function getByAddr(
    address _addr
  ) constant returns(string, address, string){
    if (addrs[_addr] > 0)
      return (
        contracts[ addrs[_addr] ].name,
        contracts[ addrs[_addr] ].addr,
        contracts[ addrs[_addr] ].version
      );
    else
      return ("", address(0), "");
  }

  /**
     @dev `getByName` get the info of a registered contract by name

     @param _name The registered contract's name
     returns {name, address, url, version} The contract's information
   */
  function getByName(
    string _name
  ) constant returns(string, address, string){
    if (names[_name] > 0)
      return (
        contracts[ names[_name] ].name,
        contracts[ names[_name] ].addr,
        contracts[ names[_name] ].version
      );
    else
      return ("", address(0), "");
  }

}
