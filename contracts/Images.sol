pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
   @title Images, contract for managing images

   A contract that allows an owner to add/remove image urls in a array.
   Allows anyone to read the image urls.

   Inherits from OpenZeppelin's `Ownable`
 */
contract Images is Ownable {

  bytes32 public version = bytes32("0.0.1-alpha");
  bytes32 public contractType = bytes32("images");

  // Array of image urls
  string[] public images;

  /**
     @dev `addImage` allows the owner to add an image

     @param url The url of the image
   */
  function addImage(string url) onlyOwner() {
    images.push(url);
  }

  /**
     @dev `removeImage` allows the owner to remove an image

     @param index The image's index in the `images` array
   */
  function removeImage(uint index) onlyOwner() {
    delete images[index];
  }

  /**
     @dev `getImagesLength` get the length of the `images` array

     @return uint Length of the `images` array
   */
  function getImagesLength() constant returns (uint) {
    return images.length;
  }

}
