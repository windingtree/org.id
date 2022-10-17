// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.17;

/**
 * @dev Library for managing a set of strings
 */
library StringsSet {

  struct Set {
    // Storage of strings
    string[] _values;

    // Mapping of hashed string to boolean flag
    mapping(bytes32 => bool) _hashTable;

    // Mapping of string hash to its index in the _values array
    mapping(bytes32 => uint256) _indexes;
  }

  /**
   * @dev Adds new element to a strings set
   * @param set An instance of Set structure
   * @param value A string value
   * @return bool A flag that indicates that is element has been added or not
   */
  function add(Set storage set, string memory value)
    internal
    returns (bool)
  {
    if (bytes(value).length == 0) {
      return false;
    }

    bytes32 hashValue = getHash(value);

    if (!set._hashTable[hashValue]) {
      set._hashTable[hashValue] = true;
      set._indexes[hashValue] = set._values.length;
      set._values.push(value);
      return true;
    } else {
      return contains(set, hashValue);
    }
  }

  /**
   * @dev Removes an element from a strings set
   * @param set An instance of Set structure
   * @param value A string value to remove
   * @return bool A flag that indicates that is element has been removed or not
   */
  function remove(Set storage set, string memory value)
    internal
    returns (bool)
  {
    if (bytes(value).length == 0) {
      return false;
    }

    bytes32 hashValue = getHash(value);

    if (set._hashTable[hashValue]) {
      uint256 valueIndex = set._indexes[hashValue];
      uint256 lastIndex = set._values.length - 1;

      if (lastIndex != valueIndex) {
        string memory lastValue = set._values[lastIndex];
        set._values[valueIndex] = lastValue;
        set._indexes[getHash(lastValue)] = valueIndex;
      }

      set._values.pop();

      // Delete indexes for the deleted slot
      delete set._indexes[hashValue];
      delete set._hashTable[hashValue];

      return true;
    } else {
      return !contains(set, hashValue);
    }
  }

  /**
   * @dev Removes all elements from a strings set
   * @param set An instance of Set structure
   * @return bool A flag that indicates that is element has been removed or not
   */
  function removeAll(Set storage set)
    internal
    returns (bool)
  {
    if (set._values.length > 0) {
      bytes32 hashValue;

      for (uint256 i = 0; i < set._values.length; i++) {
        hashValue = getHash(set._values[i]);
        delete set._indexes[hashValue];
        delete set._hashTable[hashValue];
      }

      delete set._values;

      return true;
    } else {
      return false;
    }
  }

  /**
   * @dev Checking if a value in the set
   * @param set An instance of Set structure
   * @param hashValue A hashed value to check
   * @return bool Check result
   */
  function contains(Set storage set, bytes32 hashValue)
    internal
    view
    returns (bool)
  {
    return set._hashTable[hashValue];
  }

  /**
   * @dev Removes an element from a strings set
   * @param set An instance of Set structure
   * @return string[] Registered strings
   */
  function get(Set storage set)
    internal
    view
    returns (string[] memory)
  {
    return set._values;
  }

  /**
   * @dev Generates bytes32 hash of the string
   * @param value A string value to hash
   * @return bytes32 A string hash
   */
  function getHash(string memory value)
    private
    pure
    returns (bytes32)
  {
    return keccak256(abi.encodePacked(value));
  }
}
