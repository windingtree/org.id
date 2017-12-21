pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

 /**
   @title AsyncCall_Interface, the interface of the AsyncCall Contract

   A contract that can receive requests to execute calls on itself.
   Every request can store encrypted data as a parameter, which can later be
   retrieved and decoded via web3.
   Requests may or may not require approval from the owner before execution.

   Inherits from OpenZeppelin's `Ownable`
 */
contract AsyncCall_Interface is Ownable {

  mapping(bytes32 => PendingCall) public pendingCalls;
  bool public waitConfirmation;

  modifier fromSelf(){
    require(msg.sender == address(this));
    _;
  }

  struct PendingCall {
    bytes callData;
    address sender;
    bool approved;
    bool success;
  }

  event CallStarted(address from, bytes32 dataHash);
  event CallFinish(address from, bytes32 dataHash);

  function changeConfirmation(bool _waitConfirmation) onlyOwner();
  function beginCall(bytes publicCallData, bytes privateData);
  function continueCall(bytes32 msgDataHash) onlyOwner();

}
