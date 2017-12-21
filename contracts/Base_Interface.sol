pragma solidity ^0.4.18;

/**
   @title Base_Interface

   The basic interface that every contract in the WT platform should have.
   The version and contract type are used to identify the correct interface
   for each WT contract

 */
contract Base_Interface {

  // The hex-encoded version, follows the semantic standard MAJOR.MINOR.PATCH-EXTENSION
  bytes32 public version;

  //The hex encoded type of the contract, in all lowercase letters without any spaces
  bytes32 public contractType;

}
