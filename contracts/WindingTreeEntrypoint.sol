pragma solidity ^0.5.6;

import "zos-lib/contracts/Initializable.sol";
import "@ensdomains/ens/contracts/ENS.sol";
import "@ensdomains/resolver/contracts/Resolver.sol";

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

    // Address of Organization Factory
    address public organizationFactory;

    // hashed 'token.windingtree.eth' using eth-ens-namehash
    bytes32 private constant tokenNamehash = 0x30151473c3396a0cfca504fc0f1ebc0fe92c65542ad3aaf70126c087458deb85;

    /**
     * @dev Event triggered when owner of the entrypoint is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Event triggered when a segment address is changed.
     */
    event SegmentSet(bytes32 indexed segment, address indexed oldAddress, address indexed newAddress);

    /**
     * @dev Event triggered when the organization factory address is changed.
     */
    event OrganizationFactorySet(address indexed oldAddress, address indexed newAddress);

    /**
     * @dev Initializer for upgradeable contracts.
     * @param __owner The address of the contract owner
     * @param __lifToken The LifToken contract address
     * @param _organizationFactory The OrganizationFactory contract address
     */
    function initialize(address payable __owner, address __lifToken, address _organizationFactory) public initializer {
        require(__owner != address(0), 'WindingTreeEntrypoint: Cannot set owner to 0x0 address');
        _owner = __owner;
        _lifToken = __lifToken;
        organizationFactory = _organizationFactory;
        segments.length++;
    }

    
    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner, 'WindingTreeEntrypoint: Only owner can call this method');
        _;
    }

    function resolveLifTokenFromENS(address _ENS) public onlyOwner {
        ENS registry = ENS(_ENS);
        address resolverAddress = registry.resolver(tokenNamehash);
        require(resolverAddress != address(0), 'WindingTreeEntrypoint: Resolver not found');
        Resolver resolver = Resolver(resolverAddress);
        address tokenAddress = resolver.addr(tokenNamehash);
        require(tokenAddress != address(0), 'WindingTreeEntrypoint: Token not found');
        _lifToken = tokenAddress;
    }

    /**
     * @dev Sets an address for a segment. Overwrites existing value. Can
     * be called only by the contract owner.
     * @param segment Segment name
     * @param addr New segment directory address
     */
    function setSegment(string memory segment, address addr) public onlyOwner {
        require(addr != address(0), 'WindingTreeEntrypoint: Cannot set segment addr to 0x0 address');
        bytes memory segmentBytes = bytes(segment);
        require(segmentBytes.length != 0, 'WindingTreeEntrypoint: Segment cannot be empty');
        bytes32 segmentHash = keccak256(segmentBytes);
        if (segmentsIndex[segmentHash] == 0) {
            segmentsIndex[segmentHash] = segments.length;
            segments.push(segment);
        }
        emit SegmentSet(segmentHash, directories[segmentHash], addr);
        directories[segmentHash] = addr;
    }

    /**
     * @dev Sets an address for the organization factory. Overwrites existing
     * value. Can be called only by the contract owner.
     * @param addr New organization factory address
     */
    function setOrganizationFactory(address addr) public onlyOwner {
        require(addr != address(0), 'WindingTreeEntrypoint: Cannot set factory addr to 0x0 address');
        emit OrganizationFactorySet(organizationFactory, addr);
        organizationFactory = addr;
    }

    /**
     * @dev Returns Organization Factory address.
     * @return {" ": "Address of the organization factory"}
     */
    function getOrganizationFactory() public view returns(address) {
        return organizationFactory;
    }

    /**
     * @dev Sets an address for a segment to 0x0 address. Can be called
     * only by the contract owner
     * @param segment Segment name
     */
    function removeSegment(string memory segment) public onlyOwner {
        bytes memory segmentBytes = bytes(segment);
        require(segmentBytes.length != 0, 'WindingTreeEntrypoint: Segment cannot be empty');
        bytes32 segmentHash = keccak256(segmentBytes);
        delete segments[segmentsIndex[segmentHash]];
        delete segmentsIndex[segmentHash];
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
     * @dev `getSegmentsIndex` get index of the segment by such name. On that
     * index, segment's name is stored.
     * @param segment Segment name
     * @return {" ": "Index of the segment in segments array."}
     */
    function getSegmentsIndex(string memory segment) public view returns(uint) {
        bytes memory segmentBytes = bytes(segment);
        bytes32 segmentHash = keccak256(segmentBytes);
        return segmentsIndex[segmentHash];
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
        require(newOwner != address(0), 'WindingTreeEntrypoint: Cannot transfer to 0x0 address');
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev `getLifToken` Returns address of set Lif token
     * @return {" ": "LifToken address."}
     */
    function getLifToken() public view returns (address) {
        return _lifToken;
    }

}