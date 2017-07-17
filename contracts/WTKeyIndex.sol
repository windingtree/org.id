pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/*
 * WTKeyIndex
 * Public resgitry of user public keys.
 * The public keys are indexed by address and id.
 */

contract WTKeyIndex is Ownable {

  // User ID => Public Key
	mapping (string => string) keys;

  // User Address => User ID
	mapping (address => string) ids;

	function register(string id, string key) external {
		if ((stringEmpty(keys[id])) && (stringEmpty(ids[msg.sender]))) {
			keys[id] = key;
			ids[msg.sender] = id;
		}
	}

	function edit(string _newKey) external {
		if (!stringEmpty(ids[msg.sender])) {
			keys[ids[msg.sender]] = _newKey;
		}
	}

	function stringEmpty(string storage _a) internal returns (bool) {
		bytes storage a = bytes(_a);
		if (a.length == 0)
			return true;
		else
			return false;
	}

	function getKey(string id) constant returns(string){
		return keys[id];
	}

	function getId(address owner) constant returns(string){
		return ids[owner];
	}

	function getKeyByAddr(address owner) constant returns(string){
		return keys[ ids[owner] ];
	}

}
