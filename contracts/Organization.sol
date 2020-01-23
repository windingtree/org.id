pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "./OrganizationInterface.sol";
import "./AbstractOrganizationFactory.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

/**
 * @title Organization
 * @dev A contract that represents an Organization in the Winding Tree platform,
 * commonly referred to as 0xORG. This is a reference implementation that is
 * created by the OrganizationFactory. You cn implement your own logic if it
 * adheres to the `OrganizationInterface`.
 */
contract Organization is OrganizationInterface, ERC165, Initializable {
    // Address of the contract owner
    address _owner;

    // Arbitrary locator of the off-chain stored Organization data
    // This might be an HTTPS resource, IPFS hash, Swarm address...
    // This is intentionally generic.
    string public orgJsonUri;

    // Number of a block when the Organization was created
    uint public created;

    // Index of associated addresses. These can be used
    // to operate on behalf of this organization, typically sign messages.
    mapping(address => uint) public associatedKeysIndex;

    // List of associatedKeys. These addresses (i. e. public key
    // fingerprints) can be used to associate signed content with this
    // organization.
    address[] public associatedKeys;

    // keccak256 hash of the ORG.JSON file contents. This should
    // be used to verify that the contents of ORG.JSON has not been tampered
    // with. It is a responsibility of the Organization owner to keep this
    // hash up to date.
    bytes32 public orgJsonHash;

    // Address of the organization factory.
    // Can be used for creating of upgradable instances of organizations
    address public organizationFactory;

    // Address of the parent organization.
    // Should be set if the organization is subsidiary 
    address public parentEntity;

    // Address of th director account.
    // Should be set if the organization is subsidiary
    address public entityDirector;

    // List of subsidiaries 
    mapping (address => Subsidiary) internal subsidiaries;

    /**
     * @dev Event triggered when owner of the organization is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Event triggered when orgJsonUri of the organization is changed.
     */
    event OrgJsonUriChanged(string previousOrgJsonUri, string newOrgJsonUri);

    /**
     * @dev Event triggered when orgJsonHash of the organization is changed.
     */
    event OrgJsonHashChanged(bytes32 indexed previousOrgJsonHash, bytes32 indexed newOrgJsonHash);

    /**
     * @dev Event triggered when new associatedKey is added.
     */
    event AssociatedKeyAdded(address indexed associatedKey, uint index);

    /**
     * @dev Event triggered when a associatedKey is removed.
     */    
    event AssociatedKeyRemoved(address indexed associatedKey);

    /**
     * @dev Event triggered when new subsidiary has been created
     */
    event SubsidiaryCreated(address indexed owner, address indexed director, address indexed subsidiary);

    /**
     * @dev Event triggered when a subsidiary state has been toggled
     */
    event SubsidiaryToggled(address indexed subsidiary, bool previousState, bool newState);

    /**
     * @dev Event triggered when entitiy director ownership has been confirmed
     */
    event DirectorOwnershipConfirmed(address indexed subsidiary, address indexed director);

    /**
     * @dev Event triggered when entity director ownership has been transferred
     */
    event DirectorOwnershipTransferred(address indexed subsidiary, address indexed previousDirector, address indexed newDirector);

    /**
     * @dev Register subsidiary in the storage
     * @param subsidiaryAddress Subsidiary organization address
     * @param state Subsidiary state
     * @param confirmed Subsidiary director ownership confirmation status
     * @param director Subsidiary director address
     */
    function registerSubsidiary(
        address subsidiaryAddress,
        bool state,
        bool confirmed,
        address director
    ) internal {
        subsidiaries[subsidiaryAddress] = Subsidiary(
            subsidiaryAddress,
            state,
            confirmed,
            director
        );
        emit SubsidiaryCreated(msg.sender, director, subsidiaryAddress);
    }

    /**
     * @dev Initializer for upgradeable contracts.
     * @param __owner The address of the contract owner
     * @param _orgJsonUri pointer to Organization data
     * @param _orgJsonHash keccak256 hash of the new ORG.JSON contents.
     * @param _organizationFactory Organizations factory address
     * @param _parentEntity Parent organization address
     * @param _entityDirector Entity director address
     */
    function initialize(
        address payable __owner, 
        string memory _orgJsonUri, 
        bytes32 _orgJsonHash, 
        address _organizationFactory,
        address _parentEntity,
        address _entityDirector
    ) public initializer {
        require(__owner != address(0), 'Organization: Cannot set owner to 0x0 address');
        require(bytes(_orgJsonUri).length != 0, 'Organization: orgJsonUri cannot be an empty string');
        require(_orgJsonHash != 0, 'Organization: orgJsonHash cannot be empty');
        emit OwnershipTransferred(_owner, __owner);
        _owner = __owner;        
        orgJsonUri = _orgJsonUri;
        orgJsonHash = _orgJsonHash;
        organizationFactory = _organizationFactory;
        parentEntity = _parentEntity;
        entityDirector = _entityDirector;
        created = block.number;
        associatedKeys.length++;
        OrganizationInterface i;
        _registerInterface(0x01ffc9a7);//_INTERFACE_ID_ERC165
        bytes4 associatedKeysInterface = i.hasAssociatedKey.selector ^ i.getAssociatedKeys.selector; // 0xfed71811
        bytes4 orgJsonInterface = i.getOrgJsonUri.selector ^ i.getOrgJsonHash.selector; // 0x6f4826be
        _registerInterface(orgJsonInterface);
        _registerInterface(associatedKeysInterface);
        _registerInterface(i.owner.selector); // 0x8da5cb5b
        _registerInterface(
            i.owner.selector ^
            orgJsonInterface ^
            associatedKeysInterface
        ); // 0x1c3af5f4
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner, 'Organization: Only owner can call this method');
        _;
    }

    /**
     * @dev `changeOrgJsonUri` Allows owner to change Organization's orgJsonUri.
     * @param  _orgJsonUri New orgJsonUri pointer of this Organization
     */
    function changeOrgJsonUri(string memory _orgJsonUri) public onlyOwner {
        require(bytes(_orgJsonUri).length != 0, 'Organization: orgJsonUri cannot be an empty string');
        emit OrgJsonUriChanged(orgJsonUri, _orgJsonUri);
        orgJsonUri = _orgJsonUri;
    }

    /**
     * @dev Returns current orgJsonUri
     * @return {" ": "Current orgJsonUri."}
     */
    function getOrgJsonUri() external view returns (string memory) {
        return orgJsonUri;
    }

    /**
     * @dev `changeOrgJsonHash` Allows owner to change Organization's orgJsonHash.
     * @param _orgJsonHash keccak256 hash of the new ORG.JSON contents.
     */
    function changeOrgJsonHash(bytes32 _orgJsonHash) public onlyOwner {
        require(_orgJsonHash != 0, 'Organization: orgJsonHash cannot be empty');
        emit OrgJsonHashChanged(orgJsonHash, _orgJsonHash);
        orgJsonHash = _orgJsonHash;
    }

    /**
     * @dev Create subsidiary
     * @param _orgJsonUri orgJsonUri pointer
     * @param _orgJsonHash keccak256 hash of the new ORG.JSON contents
     * @param subsidiaryDirector Subsidiary director address
     */
    function createSubsidiary(
        string calldata _orgJsonUri,
        bytes32 _orgJsonHash,
        address subsidiaryDirector
    ) external onlyOwner {
        require(subsidiaryDirector != address(0), "Organization: Invalid entity director address");
        address subsidiaryAddress = AbstractOrganizationFactory(organizationFactory).create(
            _orgJsonUri,
            _orgJsonHash,
            address(this),
            subsidiaryDirector
        );
        registerSubsidiary(
            subsidiaryAddress,
            true,
            false,
            subsidiaryDirector
        );
    }

    /**
     * @dev Create subsidiary and add it to a segment directory
     * @param _orgJsonUri orgJsonUri pointer
     * @param _orgJsonHash keccak256 hash of the new ORG.JSON contents
     * @param subsidiaryDirector Subsidiary director address
     * @param directory Segment directory address
     */
    function createSubsidiaryAndAddToDirectory(
        string calldata _orgJsonUri,
        bytes32 _orgJsonHash,
        address subsidiaryDirector,
        address directory
    ) external onlyOwner {
        require(subsidiaryDirector != address(0), "Organization: Invalid entity director address");
        address subsidiaryAddress = AbstractOrganizationFactory(organizationFactory).createAndAddToDirectory(
            _orgJsonUri,
            _orgJsonHash,
            directory,
            address(this),
            subsidiaryDirector
        );
        registerSubsidiary(
            subsidiaryAddress,
            true,
            false,
            subsidiaryDirector
        );
    }

    /**
     * @dev Toggle subsidiary state
     * @param subsidiaryAddress Subsidiary organization address
     */
    function toggleSubsidiary(address subsidiaryAddress) external onlyOwner {
        require(subsidiaryAddress != address(0), "Organization: Invalid subsidiary address");
        require(subsidiaries[subsidiaryAddress].id == subsidiaryAddress, "Organization: Subsidiary not found");
        bool newState = !subsidiaries[subsidiaryAddress].state;
        emit SubsidiaryToggled(
            subsidiaryAddress,
            subsidiaries[subsidiaryAddress].state,
            newState
        );
        subsidiaries[subsidiaryAddress].state = newState;        
    }

    /**
     * @dev Confirm subsidiary director ownership
     * @param subsidiaryAddress Subsidiary organization address
     */
    function confirmSubsidiaryDirectorOwnership(address subsidiaryAddress) external {
        require(subsidiaryAddress != address(0), "Organization: Invalid subsidiary address");
        require(subsidiaries[subsidiaryAddress].id == subsidiaryAddress, "Organization: Subsidiary not found");
        require(subsidiaries[subsidiaryAddress].director == msg.sender, "Organization: Only subsidiary director can call this method");
        subsidiaries[subsidiaryAddress].confirmed = true;
        emit DirectorOwnershipConfirmed(subsidiaryAddress, msg.sender);
    }

    /**
     * @dev Return subsidiary organization parmeters
     * @param subsidiaryAddress Subsidiary organization address
     * @return address id Subsidiary address
     * @return bool state Subsidiary state
     * @return bool confirmed Subsidiary director ownership confirmation state
     * @return address director Entity director address
     */
    function getSubsidiary(address subsidiaryAddress) external view returns (
        address id,
        bool state,
        bool confirmed,
        address director
    ) {
        require(subsidiaryAddress != address(0), "Organization: Invalid subsidiary address");
        require(subsidiaries[subsidiaryAddress].id == subsidiaryAddress, "Organization: Subsidiary not found");
        id = subsidiaries[subsidiaryAddress].id;
        state = subsidiaries[subsidiaryAddress].state;
        confirmed = subsidiaries[subsidiaryAddress].confirmed;
        director = subsidiaries[subsidiaryAddress].director;
    }

    /**
     * @dev Returns keccak256 hash of raw ORG.JSON contents. This should
     * be used to verify that the contents of ORG.JSON has not been tampered
     * with. It is a responsibility of the Organization owner to keep this
     * hash up to date.
     * @return {" ": "Current ORG.JSON hash."}
     */
    function getOrgJsonHash() external view returns (bytes32) {
        return orgJsonHash;
    }

    /**
     * @dev Shorthand method to change ORG.JSON uri and hash at the same time
     * @param  _orgJsonUri New orgJsonUri pointer of this Organization
     * @param  _orgJsonHash keccak256 hash of the new ORG.JSON contents.
     */
    function changeOrgJsonUriAndHash(string memory _orgJsonUri, bytes32 _orgJsonHash) public onlyOwner {
        changeOrgJsonUri(_orgJsonUri);
        changeOrgJsonHash(_orgJsonHash);
    }

    /**
     * @dev Adds another associated key. Only owner can call this.
     * @param addr Associated Ethereum address
     * @return {" ": "Address of the added associatedKey"}
     */
    function addAssociatedKey(address addr) public onlyOwner returns(address) {
        require(addr != address(0), 'Organization: Cannot add associatedKey with 0x0 address');
        require(associatedKeysIndex[addr] == 0, 'Organization: Cannot add associatedKey twice');
        associatedKeysIndex[addr] = associatedKeys.length;
        associatedKeys.push(addr);
        emit AssociatedKeyAdded(addr, associatedKeysIndex[addr]);
        return addr;
    }

    /**
     * @dev Removes an associated key. Only owner can call this.
     * @param addr Associated Ethereum address
     */
    function removeAssociatedKey(address addr) public onlyOwner {
        require(addr != address(0), 'Organization: Cannot remove associatedKey with 0x0 address');
        require(associatedKeysIndex[addr] != uint(0), 'Organization: Cannot remove unknown organization');
        delete associatedKeys[associatedKeysIndex[addr]];
        delete associatedKeysIndex[addr];
        emit AssociatedKeyRemoved(addr);
    }

    /**
     * @dev Is an address considered as associated for this organization?
     * @return {" ": "True if address is considered as associatedKey, false otherwise"}
     */
    function hasAssociatedKey(address addr) external view returns(bool) {
        return associatedKeys[associatedKeysIndex[addr]] != address(0);
    }

    /**
     * @dev Returns all addresses associated with this organization.
     * @return {" ": "List of associated keys"}
     */
    function getAssociatedKeys() external view returns (address[] memory) {
        return associatedKeys;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != address(0), 'Organization: Cannot transfer to 0x0 address');
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
     * @dev A synchronization method that should be kept up to date with 
     * the list of interfaces set during initialization. It should also be called
     * everytime the implementation gets updated. If the interface list gets out of
     * sync with the implementation at anytime, it is possible that some integrations
     * will stop working. Since this method is not destructive, no access restriction
     * is in place. It's supposed to be called by the proxy admin anyway.
     */
    function setInterfaces() public {
        // OrganizationInterface i;
        bytes4[5] memory interfaceIds = [
            bytes4(0x01ffc9a7), // _INTERFACE_ID_ERC165
            bytes4(0x8da5cb5b), // i.owner.selector
            bytes4(0xfed71811), // i.hasAssociatedKey.selector ^ i.getAssociatedKeys.selector
            bytes4(0x6f4826be), // i.getOrgJsonUri.selector ^ i.getOrgJsonHash.selector
            bytes4(0x1c3af5f4)  // 0x8da5cb5b ^ 0xfed71811 ^ 0x6f4826be
        ];
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            if (!this.supportsInterface(interfaceIds[i])) {
                _registerInterface(interfaceIds[i]);
            }
        }
    }
}
