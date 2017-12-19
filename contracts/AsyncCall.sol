pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

 /**
   @title AsyncCall, a contract to execute calls with private data

   A contract that can receive requests to execute calls on itself.
   Every request can store encrypted data as a parameter, which can later be
   retrieved and decoded via web3.
   Requests may or may not require approval from the owner before execution.

   Inherits from OpenZeppelin's `Ownable`
 */
contract AsyncCall is Ownable {

  bytes32 public version = bytes32("0.0.1-alpha");
  bytes32 public contractType = bytes32("privatecall");

  // The calls requested to be executed indexed by `sha3(data)`
  mapping(bytes32 => PendingCall) public pendingCalls;

  // If the contract will require the owner's confirmation to execute the call
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

  /**
     @dev Event triggered when a call is requested
  **/
  event CallStarted(address from, bytes32 dataHash);

  /**
     @dev Event triggered when a call is finished
  **/
  event CallFinish(address from, bytes32 dataHash);

  /**
     @dev `changeConfirmation` allows the owner of the contract to switch the
     `waitConfirmation` value

     @param _waitConfirmation The new `waitConfirmation` value
   */
  function changeConfirmation(bool _waitConfirmation) onlyOwner() {
    waitConfirmation = _waitConfirmation;
  }

  /**
     @dev `beginCall` requests the execution of a call by the contract

     @param publicCallData The call data to be executed
     @param privateData The extra, encrypted data stored as a parameter
     returns true if the call was requested succesfully
   */
  function beginCall(bytes publicCallData, bytes privateData) {

    bytes32 msgDataHash = keccak256(msg.data);

    require(pendingCalls[msgDataHash].sender == address(0));

    pendingCalls[msgDataHash] = PendingCall(
      publicCallData,
      tx.origin,
      !waitConfirmation,
      false
    );
    CallStarted( tx.origin, msgDataHash);
    if (!waitConfirmation){
      require(this.call(pendingCalls[msgDataHash].callData));
      pendingCalls[msgDataHash].success = true;
      CallFinish(pendingCalls[msgDataHash].sender, msgDataHash);
    }
  }

  /**
     @dev `continueCall` allows the owner to approve the execution of a call

     @param msgDataHash The hash of the call to be executed
   */
  function continueCall(bytes32 msgDataHash) onlyOwner() {

    require(pendingCalls[msgDataHash].sender != address(0));

    pendingCalls[msgDataHash].approved = true;

    require(this.call(pendingCalls[msgDataHash].callData));
    pendingCalls[msgDataHash].success = true;

    CallFinish(pendingCalls[msgDataHash].sender, msgDataHash);

  }

  /**
    @dev `getPublicCallData` returns the data to be executed of a pending call

    @param msgDataHash The hash of the pending call

    @return bytes The public call data
  */
  function getPublicCallData(bytes32 msgDataHash) constant returns (bytes) {
    return pendingCalls[msgDataHash].callData;
  }

}
