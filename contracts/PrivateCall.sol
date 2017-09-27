pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/*
 * PrivateCall
 * An extension for a contract taht provides the necessary methods to allow
 * execution and record of private data in the contract methods.
 */
contract PrivateCall is Ownable {

  // The address with encrypted data that are waiting to be confirmed by owner
  mapping(bytes32 => CallPending) public callsPending;

  bool public waitConfirmation;

  modifier fromSelf(){
    require(msg.sender == address(this));
    _;
  }

  struct CallPending {
    bytes callData;
    address sender;
    bool approved;
    bool success;
  }

  function PrivateCall(){
    waitConfirmation = false;
  }

  function changeConfirmation(bool _waitConfirmation) onlyOwner() {
    waitConfirmation = _waitConfirmation;
  }

  event CallStarted(address from, bytes32 dataHash);
  event CallFinish(address from, bytes32 dataHash);

  function beginCall(bytes publicCallData, bytes privateData) returns (bool) {

    bytes32 msgDataHash = sha3(msg.data);

    if (callsPending[msgDataHash].sender == address(0)) {
      callsPending[msgDataHash] = CallPending(
        publicCallData,
        tx.origin,
        !waitConfirmation,
        false
      );
      CallStarted( tx.origin, msgDataHash);
      if (!waitConfirmation){
        if (this.call(callsPending[msgDataHash].callData))
          callsPending[msgDataHash].success = true;
        CallFinish(callsPending[msgDataHash].sender, msgDataHash);
        return true;
      } else {
        return true;
      }
    } else {
      return false;
    }

  }

  function continueCall(bytes32 msgDataHash) onlyOwner() {

    require(callsPending[msgDataHash].sender != address(0));

    callsPending[msgDataHash].approved = true;

    if (this.call(callsPending[msgDataHash].callData))
      callsPending[msgDataHash].success = true;

    CallFinish(callsPending[msgDataHash].sender, msgDataHash);

  }

}
