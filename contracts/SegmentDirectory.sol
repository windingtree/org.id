pragma solidity ^0.5.6;

import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165Checker.sol";
import "@ensdomains/ens/contracts/ENS.sol";
import "@ensdomains/resolver/contracts/Resolver.sol";
import "./OrganizationInterface.sol";
import "./Organization.sol";
import "./AbstractSegmentDirectory.sol";

/**
 * A SegmentDirectory that can handle a list of organizations sharing a 
 * common segment such as hotels, airlines etc.
 */
contract SegmentDirectory is Initializable, AbstractSegmentDirectory {
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
     * @dev `addOrganization` Add new organization in the directory.
     * Only organizations that conform to OrganizationInterface can be added.
     * ERC165 method of interface checking is used.
     * 
     * Emits `OrganizationAdded` on success.
     * @param  organization Organization's address
     * @return {" ": "Address of the organization."}
     */
    function addOrganization(address organization) internal returns (address) {
        // this is intentionally not part of the state variables as we expect it to change in time.
        require(_organizationsIndex[organization] == 0, 'Cannot add organization twice');
        bytes4 _INTERFACE_ID_ORGANIZATION = 0x1c3af5f4;
        require(
            ERC165Checker._supportsInterface(organization, _INTERFACE_ID_ORGANIZATION),
            'Organization has to support _INTERFACE_ID_ORGANIZATION'
        );
        OrganizationInterface org = OrganizationInterface(organization);
        require(org.owner() == msg.sender, 'Only organization owner can register the organization');
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
        require(organization != address(0), 'Cannot remove organization on 0x0 address');
        // Ensure we know about the organization at all
        require(_organizationsIndex[organization] != uint(0), 'Cannot remove unknown organization');
        // Ensure that the caller is the organization's rightful owner
        // Organization might have changed hands without the index taking notice
        OrganizationInterface org = OrganizationInterface(organization);
        require(org.owner() == msg.sender);
        uint allIndex = _organizationsIndex[organization];
        delete _organizations[allIndex];
        delete _organizationsIndex[organization];
        emit OrganizationRemoved(organization);
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
        require(__owner != address(0), 'Cannot set owner to 0x0 address');
        require(bytes(__segment).length != 0, 'Segment cannot be empty');
        _owner = __owner;
        _lifToken = __lifToken;
        _organizations.length++;
        _segment = __segment;
    }

    function resolveLifTokenFromENS(address _ENS) public onlyOwner {
        ENS registry = ENS(_ENS);
        address resolverAddress = registry.resolver(tokenNamehash);
        require(resolverAddress != address(0), 'Resolver not found');
        Resolver resolver = Resolver(resolverAddress);
        address tokenAddress = resolver.addr(tokenNamehash);
        require(tokenAddress != address(0), 'Token not found');
        _lifToken = tokenAddress;
    }

    /**
     * @dev `getOrganizationsLength` get the length of the `organizations` array
     * @return {" ": "Length of the organizations array. Might contain zero addresses."}
     */
    function getOrganizationsLength() public view returns (uint) {
        return _organizations.length;
    }

    /**
     * @dev `getOrganizations` get `organizations` array
     * @return {" ": "Array of organization addresses. Might contain zero addresses."}
     */
    function getOrganizations() public view returns (address[] memory) {
        return _organizations;
    }

    /**
     * @dev `organizationsIndex` get index of Organization
     * @return {" ": "Organization index."}
     */
    function organizationsIndex(address organization) public view returns (uint) {
        return _organizationsIndex[organization];
    }

    /**
     * @dev `organizations` get Organization address on an index
     * @return {" ": "Organization address."}
     */
    function organizations(uint index) public view returns (address) {
        return _organizations[index];
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    /**
     * @dev `getLifToken` Returns address of set Lif token
     * @return {" ": "LifToken address."}
     */
    function getLifToken() public view returns (address) {
        return _lifToken;
    }

    /**
     * @dev `setSegment` allows the owner of the contract to change the
     * segment name.
     * @param __segment The new segment name
     */
    function setSegment(string memory __segment) public onlyOwner {
        require(bytes(__segment).length != 0, 'Segment cannot be empty');
        _segment = __segment;
    }

    /**
     * @dev `getSegment` Returns segment name
     * @return {" ": "Segment name."}
     */
    function getSegment() public view returns (string memory) {
        return _segment;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function _transferOwnership(address payable newOwner) internal {
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
