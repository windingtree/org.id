pragma solidity ^0.5.6;

import "zos-lib/contracts/Initializable.sol";

/**
 * @title WindingTreeEntrypoint
 * @dev This smart contract is meant as an entrypoint to Winding Tree
 * ecosystem and holds addresses of all relevant Segment Directories.
 * Segment directories are indexed by their hashed name.
 */
contract WindingTreeEntrypoint is Initializable {
    // Address of the contract owner
    address _owner;

    // Mapping of keccak256(segment) => directory address
    mapping(bytes32 => address) public directories;
    // Mapping of keccak256(segment) => index in segments array
    mapping(bytes32 => uint) public segmentIndex;
    // List of registered segments
    string[] public segments;

    /**
     * @dev Event triggered when owner of the entrypoint is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Event triggered when a segment address is changed.
     */
    event SegmentSet(bytes32 indexed segment, address indexed oldAddress, address indexed newAddress);

    /**
     * @dev Initializer for upgradeable contracts.
     * @param __owner The address of the contract owner
     */
    function initialize(address payable __owner) public initializer {
        require(__owner != address(0), 'Cannot set owner to 0x0 address');
        _owner = __owner;
        segments.length++;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    /**
     * @dev Sets an address for a segment. Overwrites existing value. Can
     * be called only by the contract owner.
     * @param segment Segment name
     * @param addr New segment directory address
     */
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

    /**
     * @dev Sets an address for a segment to 0x0 address. Can be called
     * only by the contract owner
     * @param segment Segment name
     */
    function removeSegment(string memory segment) public onlyOwner {
        bytes memory segmentBytes = bytes(segment);
        require(segmentBytes.length != 0, 'Segment cannot be empty');
        bytes32 segmentHash = keccak256(segmentBytes);
        delete segments[segmentIndex[segmentHash]];
        delete segmentIndex[segmentHash];
        emit SegmentSet(segmentHash, directories[segmentHash], address(0));
        directories[segmentHash] = address(0);
    }

    /**
     * @dev `getSegment` Returns address of a segment or a 0x0 address if segment
     * is unknown.
     * @param segment Segment name
     * @return {" ": "Address of a segment"}
     */
    function getSegment(string memory segment) public view returns(address) {
        bytes memory segmentBytes = bytes(segment);
        if(segmentBytes.length == 0) {
            return address(0);
        }
        bytes32 segmentHash = keccak256(segmentBytes);
        return directories[segmentHash];
    }

    /**
     * @dev `getSegmentsLength` get the length of the `segments` array
     * @return {" ": "Length of the segments array. Might contain removed segments."}
     */
    function getSegmentsLength() public view returns(uint) {
        return segments.length;
    }

    /**
     * @dev `getSegmentIndex` get index of the segment by such name. On that
     * index, segment's name is stored.
     * @param segment Segment name
     * @return {" ": "Index of the segment in segments array."}
     */
    function getSegmentIndex(string memory segment) public view returns(uint) {
        bytes memory segmentBytes = bytes(segment);
        bytes32 segmentHash = keccak256(segmentBytes);
        return segmentIndex[segmentHash];
    }

    /**
     * @dev `getSegmentName` get name of segment on given index
     * @param index Segment index
     * @return {" ": "Segment name."}
     */
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