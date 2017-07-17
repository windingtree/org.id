pragma solidity ^0.4.8;

/*
 * Father
 * A contract that can have child contracts,
 * and allow functions only to be called by them.
 */
contract Father {

	mapping(address => bool) private childs;

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
