pragma solidity ^0.4.11;

/*
 * Indexed
 * An extencion of a contract that allow teh execution of calls inspecting
 * the origin and sender of the method.
 */
contract Indexed {

	address public owner;
	address public index;

	modifier troughIndex() {
		if (msg.sender != index) {
			throw;
		}
		_;
	}

	modifier onlyOwner() {
		if (tx.origin != owner) {
			throw;
		}
		_;
	}

	function Indexed() {
		owner = tx.origin;
		index = msg.sender;
	}

	function transferOwnership(address newOwner) troughIndex() onlyOwner() {
		if (newOwner != address(0)) {
			owner = newOwner;
		}
	}

	function getOwner() constant returns (address) { return owner; }

}
