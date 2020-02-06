pragma solidity ^0.5.6;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165Checker.sol";
import "@ensdomains/ens/contracts/ENS.sol";
import "@ensdomains/resolver/contracts/Resolver.sol";
import "./OrganizationInterface.sol";
import "./Organization.sol";
import "./SegmentDirectoryInterface.sol";

/**
 * @title SegmentDirectory
 * @dev A SegmentDirectory that can handle a list of organizations sharing a 
 * common segment such as hotels, airlines etc.
 */
contract SegmentDirectory is Initializable, SegmentDirectoryInterface {
    // Address of the contract owner
    address _owner;

    // Segment name, i. e. hotel, airline
    string _segment;

    // Array of addresses of `Organization` contracts
    address[] _organizations;

    // Mapping of organizations position in the general organization index
    mapping(address => uint) _organizationsIndex;

    // Address of the LifToken contract
    address _lifToken;

    // hashed 'token.windingtree.eth' using eth-ens-namehash
    bytes32 private constant tokenNamehash = 0x30151473c3396a0cfca504fc0f1ebc0fe92c65542ad3aaf70126c087458deb85;

    /**
     * @dev Event triggered every time organization is added.
     */
    event OrganizationAdded(address indexed organization, uint256 index);

    /**
     * @dev Event triggered every time organization is removed.
     */
    event OrganizationRemoved(address indexed organization);

    /**
     * @dev Event triggered when owner of the directory is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner, 'SegmentDirectory: Only owner can call this method');
        _;
    }

    /**
     * @dev Initializer for upgradeable contracts.
     * @param __owner The address of the contract owner
     * @param __segment The segment name
     * @param __lifToken The Lif Token contract address
     */
    function initialize(
        address payable __owner,
        string memory __segment,
        address __lifToken)
    public initializer {
        require(__owner != address(0), 'SegmentDirectory: Cannot set owner to 0x0 address');
        require(bytes(__segment).length != 0, 'SegmentDirectory: Segment cannot be empty');
        _owner = __owner;
        _lifToken = __lifToken;
        _organizations.length++;
        _segment = __segment;
    }

    /**
     * @dev Updating the _lifToken link from the ENS registry
     * @param _ENS The address of the ENS registry
     */
    function resolveLifTokenFromENS(address _ENS) external onlyOwner {
        ENS registry = ENS(_ENS);
        address resolverAddress = registry.resolver(tokenNamehash);
        require(resolverAddress != address(0), 'SegmentDirectory: Resolver not found');
        Resolver resolver = Resolver(resolverAddress);
        address tokenAddress = resolver.addr(tokenNamehash);
        require(tokenAddress != address(0), 'SegmentDirectory: Token not found');
        _lifToken = tokenAddress;
    }

    /**
     * @dev `setSegment` allows the owner of the contract to change the
     * segment name.
     * @param __segment The new segment name
     */
    function setSegment(string calldata __segment) external onlyOwner {
        require(bytes(__segment).length != 0, 'SegmentDirectory: Segment cannot be empty');
        _segment = __segment;
    }

    /**
     * @dev `add` proxies and externalizes addOrganization
     * @param  organization Organization's address
     * @return {" ": "Address of the organization."}
     */
    function add(address organization) external returns (address) {
        return addOrganization(organization);
    }

    /**
     * @dev `remove` proxies and externalizes removeOrganization
     * @param  organization  Organization's address
     */
    function remove(address organization) external {
        removeOrganization(organization);
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) external onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev `getOrganizationsLength` get the length of the `organizations` array
     * @return {" ": "Length of the organizations array. Might contain zero addresses."}
     */
    function getOrganizationsLength() external view returns (uint256) {
        return _organizations.length;
    }

    /**
     * @dev `getOrganizations` get `organizations` array
     * @return {" ": "Array of organization addresses. Might contain zero addresses."}
     */
    function getOrganizations() external view returns (address[] memory) {
        return _organizations;
    }

    /**
     * @dev `organizationsIndex` get index of Organization
     * @return {" ": "Organization index."}
     */
    function organizationsIndex(address organization) external view returns (uint256) {
        return _organizationsIndex[organization];
    }

    /**
     * @dev `organizations` get Organization address on an index
     * @return {" ": "Organization address."}
     */
    function organizations(uint256 index) external view returns (address) {
        return _organizations[index];
    }

    /**
     * @dev `getLifToken` Returns address of set Lif token
     * @return {" ": "LifToken address."}
     */
    function getLifToken() external view returns (address) {
        return _lifToken;
    }

    /**
     * @dev `getSegment` Returns segment name
     * @return {" ": "Segment name."}
     */
    function getSegment() external view returns (string memory) {
        return _segment;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function _transferOwnership(address payable newOwner) internal {
        require(newOwner != address(0), 'SegmentDirectory: Cannot transfer to 0x0 address');
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    /**
     * @dev `addOrganization` Add new organization in the directory.
     * Only organizations that conform to OrganizationInterface can be added.
     * ERC165 method of interface checking is used.
     * 
     * Emits `OrganizationAdded` on success.
     * @param  organization Organization's address
     * @return {" ": "Address of the organization."}
     */
    function addOrganization(address organization) internal returns (address) {
        require(_organizationsIndex[organization] == 0, 'SegmentDirectory: Cannot add organization twice');
        // This is intentionally not part of the state variables as we expect it to change in time.
        // It should always be the latest xor of *all* methods in the OrganizationInterface.
        
        // This interface required for the organization to be compatible 
        // with other organizations in the directory
        require(
            ERC165Checker._supportsInterface(organization, 0xe9e17278),
            'SegmentDirectory: Organization has to support organization interface'
        );

        // This interface required for getting information about organization owner
        require(
            ERC165Checker._supportsInterface(organization, 0x7f5828d0),
            'SegmentDirectory: Organization has to support ownable interface'
        );

        // This interface required for getting information about organization hierarchy relations
        require(
            ERC165Checker._supportsInterface(organization, 0xc501232e),
            'SegmentDirectory: Organization has to support hierarchy interface'
        );
        
        OrganizationInterface org = OrganizationInterface(organization);

        if (org.parentEntity() == address(0)) {
            require(org.owner() == msg.sender, 'SegmentDirectory: Only organization owner can add the organization');
        } else {
            address entityDirector = org.entityDirector();
            require(org.owner() == msg.sender || entityDirector == msg.sender, 'SegmentDirectory: Only organization owner or entity director can add the organization');
        }
        
        _organizationsIndex[organization] = _organizations.length;
        _organizations.push(organization);
        emit OrganizationAdded(
            organization,
            _organizationsIndex[organization]
        );

        return organization;
    }

    /**
     * @dev `removeOrganization` Allows a owner to remove an organization
     * from the directory. Does not destroy the organization contract.
     * Emits `OrganizationRemoved` on success.
     * @param  organization  Organization's address
     */
    function removeOrganization(address organization) internal {
        // Ensure organization address is valid
        require(organization != address(0), 'SegmentDirectory: Cannot remove organization on 0x0 address');
        // Ensure we know about the organization at all
        require(_organizationsIndex[organization] != uint256(0), 'SegmentDirectory: Cannot remove unknown organization');
        
        // This interface required for the organization to be compatible 
        // with other organizations in the directory
        require(
            ERC165Checker._supportsInterface(organization, 0x7f5828d0),
            'SegmentDirectory: Organization has to support ownable interface'
        );

        // This interface required for getting information about organization hierarchy relations
        require(
            ERC165Checker._supportsInterface(organization, 0xc501232e),
            'SegmentDirectory: Organization has to support hierarchy interface'
        );
        
        OrganizationInterface org = OrganizationInterface(organization);

        if (org.parentEntity() == address(0)) {
            require(org.owner() == msg.sender, 'SegmentDirectory: Only organization owner can remove the organization');
        } else {
            address entityDirector = org.entityDirector();
            require(org.owner() == msg.sender || entityDirector == msg.sender, 'SegmentDirectory: Only organization owner or entity director can remove the organization');
        }

        uint256 allIndex = _organizationsIndex[organization];
        delete _organizations[allIndex];
        delete _organizationsIndex[organization];
        emit OrganizationRemoved(organization);
    }
}
