pragma solidity ^0.4.8;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/*
 * WTContracts
 * A public registry of all important contracts in the WT platform.
 */
contract WTContracts is Ownable {

	uint public total;
	mapping (uint => Contract) contracts;
	mapping (string => uint) names;
	mapping (address => uint) addrs;

	struct Contract {
		string name;
		address addr;
		string url;
		string version;
	}

	function register(
    string _name,
    address _addr,
    string _url,
    string _version
  ) onlyOwner() external {
		if ((names[_name] == 0) && (addrs[_addr] == 0)){
			total ++;
			contracts[total] = Contract(_name, _addr, _url, _version);
			names[_name] = total;
			addrs[_addr] = total;
		}
	}

	function edit(
    string _name,
    address _addr,
    string _url,
    string _version
  ) onlyOwner() external {
		if (names[_name] > 0){
			contracts[names[_name]].addr = _addr;
			contracts[names[_name]].url = _url;
			contracts[names[_name]].version = _version;
		}
	}

	function getContract(
    uint _pos
  ) constant returns(string, address, string, string){
		if (_pos < total)
			return (
        contracts[_pos].name,
        contracts[_pos].addr,
        contracts[_pos].url,
        contracts[_pos].version
      );
		else
			return ("", address(0), "", "");
	}

	function getByAddr(
    address _addr
  ) constant returns(string, address, string, string){
		if (addrs[_addr] > 0)
			return (
				contracts[ addrs[_addr] ].name,
				contracts[ addrs[_addr] ].addr,
				contracts[ addrs[_addr] ].url,
				contracts[ addrs[_addr] ].version
			);
		else
			return ("", address(0), "", "");
	}

	function getByName(
    string _name
  ) constant returns(string, address, string, string){
		if (names[_name] > 0)
			return (
				contracts[ names[_name] ].name,
				contracts[ names[_name] ].addr,
				contracts[ names[_name] ].url,
				contracts[ names[_name] ].version
			);
		else
			return ("", address(0), "", "");
	}

}
