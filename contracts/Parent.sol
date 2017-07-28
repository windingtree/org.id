pragma solidity ^0.4.11;

/*
 * Parent
 * A contract that can have child contracts,
 * and allow functions only to be called by them.
 */
contract Parent {

	mapping(address => bool) childs;

	modifier onlyChild() {
		if (childs[msg.sender]) {
			throw;
		}
		_;
	}

	function addChild(address _child) internal {
		childs[_child] = true;
	}

  function removeChild(address _child) internal {
		delete childs[_child];
	}

}
