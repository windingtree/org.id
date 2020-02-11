pragma solidity ^0.5.6;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

/**
 * @title WindingTreeEntrypoint
 * @dev This smart contract is meant as an entrypoint to Winding Tree
 * ecosystem and holds addresses of all relevant Segment Directories.
 * Segment directories are indexed by their hashed name.
 */
contract WindingTreeEntrypoint is Initializable {
    // Address of the contract owner
    address _owner;

    // Address of the LifToken contract
    // solhint-disable-next-line var-name-mixedcase
    address public _lifToken;

    // Mapping of keccak256(segment) => directory address
    mapping(bytes32 => address) public directories;

    // Mapping of keccak256(segment) => index in segments array
    mapping(bytes32 => uint) public segmentsIndex;

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
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner, 'WindingTreeEntrypoint: Only owner can call this method');
        _;
    }

    /**
     * @dev Initializer for upgradeable contracts.
     * @param __owner The address of the contract owner
     * @param __lifToken The LifToken contract address
     */
    function initialize(address payable __owner, address __lifToken) external initializer {
        require(__owner != address(0), 'WindingTreeEntrypoint: Cannot set owner to 0x0 address');
        _owner = __owner;
        _lifToken = __lifToken;
        segments.length++;
    }

    /**
     * @dev Sets an address for a segment. Overwrites existing value. Can
     * be called only by the contract owner.
     * @param segment Segment name
     * @param addr New segment directory address
     */
    function setSegment(string calldata segment, address addr) external onlyOwner {
        require(addr != address(0), 'WindingTreeEntrypoint: Cannot set segment addr to 0x0 address');
        bytes memory segmentBytes = bytes(segment);
        require(segmentBytes.length != 0, 'WindingTreeEntrypoint: Segment cannot be empty');
        // @todo Add condition about equality of Lif token addresses. 
        bytes32 segmentHash = keccak256(segmentBytes);
        if (segmentsIndex[segmentHash] == 0) {
            segmentsIndex[segmentHash] = segments.length;
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
    function removeSegment(string calldata segment) external onlyOwner {
        bytes memory segmentBytes = bytes(segment);
        require(segmentBytes.length != 0, 'WindingTreeEntrypoint: Segment cannot be empty');
        bytes32 segmentHash = keccak256(segmentBytes);
        delete segments[segmentsIndex[segmentHash]];
        delete segmentsIndex[segmentHash];
        emit SegmentSet(segmentHash, directories[segmentHash], address(0));
        directories[segmentHash] = address(0);
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) external onlyOwner {
        require(newOwner != address(0), 'WindingTreeEntrypoint: Cannot transfer to 0x0 address');
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    /**
     * @dev `getSegment` Returns address of a segment or a 0x0 address if segment
     * is unknown.
     * @param segment Segment name
     * @return {" ": "Address of a segment"}
     */
    function getSegment(string calldata segment) external view returns(address) {
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
    function getSegmentsLength() external view returns(uint) {
        return segments.length;
    }

    /**
     * @dev `getSegmentsIndex` get index of the segment by such name. On that
     * index, segment's name is stored.
     * @param segment Segment name
     * @return {" ": "Index of the segment in segments array."}
     */
    function getSegmentsIndex(string calldata segment) external view returns(uint) {
        bytes memory segmentBytes = bytes(segment);
        bytes32 segmentHash = keccak256(segmentBytes);
        return segmentsIndex[segmentHash];
    }

    /**
     * @dev `getSegmentName` get name of segment on given index
     * @param index Segment index
     * @return {" ": "Segment name."}
     */
    function getSegmentName(uint index) external view returns(string memory) {
        return segments[index];
    }

    /**
     * @dev `getLifToken` Returns address of set Lif token
     * @return {" ": "LifToken address."}
     */
    function getLifToken() external view returns (address) {
        return _lifToken;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() external view returns (address) {
        return _owner;
    }
}