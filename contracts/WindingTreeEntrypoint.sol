pragma solidity ^0.5.6;

import "zos-lib/contracts/Initializable.sol";

/**
 * @title WindingTreeEntrypoint
 * @dev This smart contract is meant as an entrypoint to Winding Tree
 * ecosystem and holds addresses of all relevant Segment Directories.
 */
contract WindingTreeEntrypoint is Initializable {
    // Address of the contract owner
    address _owner;

    mapping(bytes32 => address) public directories;
    mapping(bytes32 => uint) public segmentIndex;
    string[] public segments;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event SegmentSet(bytes32 indexed segment, address indexed oldAddress, address indexed newAddress);

    function initialize(address payable __owner) public initializer {
        require(__owner != address(0), 'Cannot set owner to 0x0 address');
        _owner = __owner;
        segments.length++;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    function setSegment(string memory segment, address addr) public onlyOwner {
        require(addr != address(0), 'Cannot set segment addr to 0x0 address');
        bytes memory segmentBytes = bytes(segment);
        require(segmentBytes.length != 0, 'Segment cannot be empty');
        bytes32 segmentHash = keccak256(segmentBytes);
        if (segmentIndex[segmentHash] == 0) {
            segmentIndex[segmentHash] = segments.length;
            segments.push(segment);
        }
        emit SegmentSet(segmentHash, directories[segmentHash], addr);
        directories[segmentHash] = addr;
    }

    function removeSegment(string memory segment) public onlyOwner {
        bytes memory segmentBytes = bytes(segment);
        require(segmentBytes.length != 0, 'Segment cannot be empty');
        bytes32 segmentHash = keccak256(segmentBytes);
        delete segments[segmentIndex[segmentHash]];
        delete segmentIndex[segmentHash];
        emit SegmentSet(segmentHash, directories[segmentHash], address(0));
        directories[segmentHash] = address(0);
    }

    function getSegment(string memory segment) public view returns(address) {
        bytes memory segmentBytes = bytes(segment);
        if(segmentBytes.length == 0) {
            return address(0);
        }
        bytes32 segmentHash = keccak256(segmentBytes);
        return directories[segmentHash];
    }

    function getSegmentsLength() public view returns(uint) {
        return segments.length;
    }

    function getSegmentIndex(string memory segment) public view returns(uint) {
        bytes memory segmentBytes = bytes(segment);
        bytes32 segmentHash = keccak256(segmentBytes);
        return segmentIndex[segmentHash];
    }

    function getSegmentName(uint index) public view returns(string memory) {
        return segments[index];
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

}