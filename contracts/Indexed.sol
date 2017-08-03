pragma solidity ^0.4.11;

/*
 * Indexed
 * An extension of a contract that allow the execution of calls checking
 * the origin and sender of the method.
 */
contract Indexed {

  address owner;
  address index;

  modifier throughIndex() {
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

  function transferOwnership(address newOwner) throughIndex() onlyOwner() {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }

  function getOwner() constant returns (address) { return owner; }

  function getIndex() constant returns (address) { return index; }

}
