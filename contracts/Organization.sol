pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165Checker.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/upgrades/contracts/application/App.sol";
import "./OrganizationInterface.sol";
import "./SegmentDirectoryInterface.sol";

/**
 * @title Organization
 * @dev A contract that represents an Organization in the Winding Tree platform,
 * commonly referred to as 0xORG. This is a reference implementation that is
 * created by the OrganizationFactory. You cn implement your own logic if it
 * adheres to the `OrganizationInterface`.
 */
contract Organization is OrganizationInterface, ERC165, Initializable {

    /// @dev Subsidiary organization configuration structure
    struct Subsidiary {
        address id;
        bool state;
        bool confirmed;
        address director;
    }

    /// @dev Linked directory structure
    struct Directory {
        address directory;
        bool linked;
        uint256 index;
    }

    // Address of the contract owner
    address _owner;

    // ZeppelinOS App instance
    App public app;

    // Arbitrary locator of the off-chain stored Organization data
    // This might be an HTTPS resource, IPFS hash, Swarm address...
    // This is intentionally generic.
    string public orgJsonUri;

    // Number of a block when the Organization was created
    uint public created;

    // keccak256 hash of the ORG.JSON file contents. This should
    // be used to verify that the contents of ORG.JSON has not been tampered
    // with. It is a responsibility of the Organization owner to keep this
    // hash up to date.
    bytes32 public orgJsonHash;

    // Address of the parent organization.
    // Should be set if the organization is subsidiary 
    address public parentEntity;

    // Address of the director account.
    // Should be set if the organization is subsidiary
    address public entityDirector;

    // List of subsidiaries 
    mapping (address => Subsidiary) internal subsidiaries;

    // Subsidiaries addresses index (for iteration purposes)
    address[] public subsidiariesIndex;

    // Linked directories list
    mapping (address => Directory) directories;

    // Linked directories list (for iteration purposes)
    address[] public directoriesIndex;

    /**
     * @dev Event triggered when owner of the organization is changed.
     */
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Event triggered when orgJsonUri of the organization is changed.
     */
    event OrgJsonUriChanged(string previousOrgJsonUri, string newOrgJsonUri);

    /**
     * @dev Event triggered when orgJsonHash of the organization is changed.
     */
    event OrgJsonHashChanged(
        bytes32 indexed previousOrgJsonHash,
        bytes32 indexed newOrgJsonHash
    );

    /**
     * @dev Event triggered when new subsidiary has been created
     */
    event SubsidiaryCreated(
        address indexed owner,
        address indexed director,
        address indexed subsidiary
    );

    /**
     * @dev Event triggered when a subsidiary state has been toggled
     */
    event SubsidiaryToggled(
        address indexed subsidiary,
        bool previousState,
        bool newState
    );

    /**
     * @dev Event triggered when entitiy director ownership has been confirmed
     */
    event SubsidiaryDirectorOwnershipConfirmed(
        address indexed subsidiary,
        address indexed director
    );

    /**
     * @dev Event triggered when subsidiary director ownership 
     * has been transferred
     */
    event SubsidiaryDirectorOwnershipTransferred(
        address indexed subsidiary,
        address indexed previousDirector,
        address indexed newDirector
    );

    /**
     * @dev Event triggered when entity director ownership has been transferred
     */
    event EntityDirectorOwnershipChanged(
        address indexed previousDirector,
        address indexed newDirector
    );

    /**
     * @dev The event will be emitted when SegmentDirectory is 
     * linked with the organization
     */
    event DirectoryLinked(address indexed directory);

    /**
     * @dev The event will be emitted when SegmentDirectory is 
     * unlinked from the organization
     */
    event DirectoryUnlinked(address indexed directory);
    
    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(
            msg.sender == _owner,
            "Organization: Only owner can call this method"
        );
        _;
    }

    /**
     * @dev Throws if called by any account other than the owner or entity director.
     */
    modifier onlyOwnerOrDirector() {
        require(
            msg.sender == _owner || msg.sender == entityDirector, 
            "Organization: Only owner or entity director can call this method"
        );
        _;
    }

    /**
     * @dev Initializer for upgradeable contracts.
     * @param __owner The address of the contract owner
     * @param _orgJsonUri pointer to Organization data
     * @param _orgJsonHash keccak256 hash of the new ORG.JSON contents.
     * @param _app ZeppelinOS App address
     * @param _parentEntity Parent organization address
     * @param _entityDirector Entity director address
     */
    function initialize(
        address payable __owner, 
        string memory _orgJsonUri, 
        bytes32 _orgJsonHash, 
        address _app,
        address _parentEntity,
        address _entityDirector
    ) public initializer {
        require(
            __owner != address(0),
            "Organization: Cannot set owner to 0x0 address"
        );
        require(
            address(_app) != address(0),
            "Organization: Cannot set app to 0x0 address"
        );
        require(
            bytes(_orgJsonUri).length != 0,
            "Organization: orgJsonUri cannot be an empty string"
        );
        require(
            _orgJsonHash != 0,
            "Organization: orgJsonHash cannot be empty"
        );
        emit OwnershipTransferred(_owner, __owner);
        _owner = __owner;        
        orgJsonUri = _orgJsonUri;
        orgJsonHash = _orgJsonHash;
        app = App(_app);
        parentEntity = _parentEntity;
        entityDirector = _entityDirector;
        created = block.number;
        setInterfaces(); 
    }

    /**
     * @dev Shorthand method to change ORG.JSON uri and hash at the same time
     * @param  _orgJsonUri New orgJsonUri pointer of this Organization
     * @param  _orgJsonHash keccak256 hash of the new ORG.JSON contents.
     */
    function changeOrgJsonUriAndHash(
        string calldata _orgJsonUri,
        bytes32 _orgJsonHash
    ) external onlyOwnerOrDirector {
        changeOrgJsonUri(_orgJsonUri);
        changeOrgJsonHash(_orgJsonHash);
        sendUpdateReport();
    }

    /**
     * @dev Create subsidiary
     * @param _orgJsonUri orgJsonUri pointer
     * @param _orgJsonHash keccak256 hash of the new ORG.JSON contents
     * @param subsidiaryDirector Subsidiary director address
     * @param packageName Name of the package where the contract is contained. 
     * Will be "wt-contracts" if empty string provided
     * @param contractName Name of the organization contract. 
     * Will be "Organization" if empty string provided
     */
    function createSubsidiary(
        string calldata _orgJsonUri,
        bytes32 _orgJsonHash,
        address subsidiaryDirector,
        string calldata packageName,
        string calldata contractName
    ) external onlyOwnerOrDirector {
        require(
            subsidiaryDirector != address(0),
            "Organization: Invalid entity director address"
        );
        address subsidiaryAddress = createOrganization(
            _owner,
            _orgJsonUri,
            _orgJsonHash,
            subsidiaryDirector,
            packageName,
            contractName
        );
        registerSubsidiary(
            subsidiaryAddress,
            true,
            subsidiaryDirector == msg.sender,
            subsidiaryDirector
        );
    }

    /**
     * @dev Toggle subsidiary state
     * @param subsidiaryAddress Subsidiary organization address
     */
    function toggleSubsidiary(address subsidiaryAddress) external onlyOwner {
        require(
            subsidiaryAddress != address(0),
            "Organization: Invalid subsidiary address"
        );
        require(
            subsidiaries[subsidiaryAddress].id == subsidiaryAddress,
            "Organization: Subsidiary not found"
        );
        bool newState = !subsidiaries[subsidiaryAddress].state;
        emit SubsidiaryToggled(
            subsidiaryAddress,
            subsidiaries[subsidiaryAddress].state,
            newState
        );
        subsidiaries[subsidiaryAddress].state = newState;
        sendUpdateReport();
    }

    /**
     * @dev Change entity director
     * @param newEntityDirectorAddress New entity director address
     */
    function changeEntityDirector(
        address newEntityDirectorAddress
    ) external onlyOwner {
        require(
            newEntityDirectorAddress != address(0),
            "Organization: Invalid entity director address"
        );
        emit EntityDirectorOwnershipChanged(
            entityDirector,
            newEntityDirectorAddress
        );
        entityDirector = newEntityDirectorAddress;
        sendUpdateReport();
    }

    /**
     * @dev Transfer subsidiary director ownership
     * @param subsidiaryAddress Subsidiary organization address
     * @param newSubsidiaryDirector New subsidiary director address
     */
    function transferDirectorOwnership(
        address subsidiaryAddress,
        address newSubsidiaryDirector
    ) external onlyOwner {
        require(
            subsidiaryAddress != address(0),
            "Organization: Invalid subsidiary address"
        );
        require(
            subsidiaries[subsidiaryAddress].id == subsidiaryAddress,
            "Organization: Subsidiary not found"
        );
        require(
            newSubsidiaryDirector != address(0),
            "Organization: Invalid subsidiary director address"
        );
        emit SubsidiaryDirectorOwnershipTransferred(
            subsidiaryAddress,
            subsidiaries[subsidiaryAddress].director,
            newSubsidiaryDirector
        );
        subsidiaries[subsidiaryAddress].director = newSubsidiaryDirector;
        subsidiaries[subsidiaryAddress].confirmed = false;
        OrganizationInterface(subsidiaryAddress)
            .changeEntityDirector(newSubsidiaryDirector);
        sendUpdateReport();
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) external onlyOwner {
        require(
            newOwner != address(0),
            "Organization: Cannot transfer to 0x0 address"
        );
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
        sendUpdateReport();
    }

    /**
     * @dev Liking with SegmentDirectory. 
     * This function have to be called by SegmentDirectory contract only
     */
    function linkDirectory() external {
        require(
            Address.isContract(msg.sender),
            "Organization: Only contacts can call this method"
        );
        require(
            directories[msg.sender].linked == false,
            "Organization: Directory can be linked once only"
        );
        require(
            ERC165Checker._supportsInterface(msg.sender, 0xe4f00d44),
            "Organization: Caller contract has to support reportable interface"
        );

        SegmentDirectoryInterface dir = SegmentDirectoryInterface(msg.sender);
        require(
            dir.organizationsIndex(address(this)) != 0,
            "Organization: Only registered organizations can be linked"
        );

        if (directories[msg.sender].directory == address(0)) {
            // Add new link
            directories[msg.sender] = Directory(
                msg.sender,
                true,
                directoriesIndex.length
            );
            directoriesIndex.push(msg.sender);
        } else {
            // Enable existed link
            directories[msg.sender].linked = true;
        }

        emit DirectoryLinked(msg.sender);
    }

    /**
     * @dev Removes a link with SegmentDirectory. 
     * This function have to be called by SegmentDirectory contract only
     */
    function unlinkDirectory() external {
        require(
            Address.isContract(msg.sender),
            "Organization: Only contacts can call this method"
        );
        require(
            ERC165Checker._supportsInterface(msg.sender, 0xe4f00d44),
            "Organization: Caller contract has to support reportable interface"
        );

        SegmentDirectoryInterface dir = SegmentDirectoryInterface(msg.sender);
        require(
            dir.organizationsIndex(address(this)) == 0,
            "Organization: Only removed organizations can be unlinked"
        );

        directories[msg.sender].linked = false;
        emit DirectoryUnlinked(msg.sender);
    }

    /**
     * @dev Return subsidiary organization parmeters
     * @param subsidiaryAddress Subsidiary organization address
     * @return {
        "id": "Subsidiary address",
        "state": "Subsidiary state",
        "confirmed": "Subsidiary director ownership confirmation state",
        "director": "Entity director address"
     }     
     */
    function getSubsidiary(address subsidiaryAddress) external view returns (
        address id,
        bool state,
        bool confirmed,
        address director
    ) {
        require(
            subsidiaryAddress != address(0),
            "Organization: Invalid subsidiary address"
        );
        require(
            subsidiaries[subsidiaryAddress].id == subsidiaryAddress,
            "Organization: Subsidiary not found"
        );
        id = subsidiaries[subsidiaryAddress].id;
        state = subsidiaries[subsidiaryAddress].state;
        confirmed = subsidiaries[subsidiaryAddress].confirmed;
        director = subsidiaries[subsidiaryAddress].director;
    }

    /**
     * @dev Return an array of subsidiaries addresses
     * @return {
         "subsidiariesList": "Array of active subsidiaries"
     }
     */
    function getSubsidiaries() external view returns (
        address[] memory subsidiariesList
    ) {
        subsidiariesList = new address[](getConfirmedSubsidiariesCount());
        uint256 index;

        for (uint256 i = 0; i < subsidiariesIndex.length; i++) {

            if (subsidiaries[subsidiariesIndex[i]].state && 
                subsidiaries[subsidiariesIndex[i]].confirmed) {
                    
                subsidiariesList[index] = subsidiaries[subsidiariesIndex[i]].id;
                index += 1;
            }
        }
    }

    /**
     * @dev Returns current orgJsonUri
     * @return {" ": "Current orgJsonUri."}
     */
    function getOrgJsonUri() external view returns (string memory) {
        return orgJsonUri;
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
     * @dev Returns the address of the current owner.
     */
    function owner() external view returns (address) {
        return _owner;
    }

    /**
     * @dev Confirm subsidiary director ownership
     * @param subsidiaryAddress Subsidiary organization address
     */
    function confirmSubsidiaryDirectorOwnership(address subsidiaryAddress) public {
        require(
            subsidiaryAddress != address(0),
            "Organization: Invalid subsidiary address"
        );
        require(
            subsidiaries[subsidiaryAddress].id == subsidiaryAddress,
            "Organization: Subsidiary not found"
        );
        require(
            subsidiaries[subsidiaryAddress].director == msg.sender,
            "Organization: Only subsidiary director can call this method"
        );
        subsidiaries[subsidiaryAddress].confirmed = true;
        emit SubsidiaryDirectorOwnershipConfirmed(subsidiaryAddress, msg.sender);
    }

    /**
     * @dev `changeOrgJsonUri` Allows owner to change Organization"s orgJsonUri.
     * @param  _orgJsonUri New orgJsonUri pointer of this Organization
     */
    function changeOrgJsonUri(
        string memory _orgJsonUri
    ) public onlyOwnerOrDirector {
        require(
            bytes(_orgJsonUri).length != 0,
            "Organization: orgJsonUri cannot be an empty string"
        );
        emit OrgJsonUriChanged(orgJsonUri, _orgJsonUri);
        orgJsonUri = _orgJsonUri;
        sendUpdateReport();
    }

    /**
     * @dev `changeOrgJsonHash` Allows owner to change Organization's orgJsonHash.
     * @param _orgJsonHash keccak256 hash of the new ORG.JSON contents.
     */
    function changeOrgJsonHash(bytes32 _orgJsonHash) public onlyOwnerOrDirector {
        require(_orgJsonHash != 0, "Organization: orgJsonHash cannot be empty");
        emit OrgJsonHashChanged(orgJsonHash, _orgJsonHash);
        orgJsonHash = _orgJsonHash;
        sendUpdateReport();
    }

    /**
     * @dev A synchronization method that should be kept up to date with 
     * the list of interfaces set during initialization. It should also be called
     * everytime the implementation gets updated. If the interface list gets out of
     * sync with the implementation at anytime, it is possible that some integrations
     * will stop working. Since this method is not destructive, no access restriction
     * is in place. It"s supposed to be called by the proxy admin anyway.
     */
    function setInterfaces() public {
        OrganizationInterface org;
        bytes4[6] memory interfaceIds = [
            // ERC165 interface: 0x01ffc9a7
            bytes4(0x01ffc9a7),

            // ownable interface: 0x7f5828d0
            org.owner.selector ^ 
            org.transferOwnership.selector, 

            // organization interface: 0xe9e17278
            org.changeOrgJsonUri.selector ^ 
            org.changeOrgJsonHash.selector ^ 
            org.getOrgJsonUri.selector ^ 
            org.getOrgJsonHash.selector,

            // hierarchy interface: 0xc501232e
            org.entityDirector.selector ^ 
            org.parentEntity.selector,

            // linkable interface: 0xfa282a77
            org.linkDirectory.selector ^ 
            org.unlinkDirectory.selector, 

            // subsidiary interface: 0x9ff6f0b0
            org.createSubsidiary.selector ^ 
            org.toggleSubsidiary.selector ^ 
            org.entityDirector.selector ^ 
            org.parentEntity.selector ^
            org.changeEntityDirector.selector ^ 
            org.getSubsidiary.selector ^ 
            org.getSubsidiaries.selector ^ 
            org.transferDirectorOwnership.selector 
        ];
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            _registerInterface(interfaceIds[i]);
        }
    }

    /**
     * @dev Sending a report about contract storage updated
     * to the linked SegmentDirectory
     */
    function sendUpdateReport() internal {

        for (uint256 i = 0; i < directoriesIndex.length; i++) {

            if (directories[directoriesIndex[i]].linked) {                
                SegmentDirectoryInterface(directoriesIndex[i]).reportUpdate();
            }
        }
    }

    /**
     * @dev Organization factory
     * @param organizationOwner The address of the organization owner
     * @param _orgJsonUri orgJsonUri pointer
     * @param _orgJsonHash keccak256 hash of the new ORG.JSON contents
     * @param subsidiaryDirector Subsidiary director address
     * @param packageName Name of the package where the contract is contained.
     * Will be "wt-contracts" if empty string provided
     * @param contractName Name of the organization contract. 
     * Will be "Organization" if empty string provided
     */
    function createOrganization(
        address organizationOwner,
        string memory _orgJsonUri,
        bytes32 _orgJsonHash,
        address subsidiaryDirector,
        string memory packageName,
        string memory contractName
    ) internal returns (address) {
        return address(
            app.create(
                bytes(packageName).length == 0 ? "wt-contracts" : packageName, 
                bytes(contractName).length == 0 ? "Organization": contractName, 
                organizationOwner, // Owner of the current organization 
                                   // will be the owner of the created proxy
                abi.encodeWithSignature(
                    "initialize(address,string,bytes32,address,address,address)",
                    address(this),
                    _orgJsonUri,
                    _orgJsonHash,
                    address(app),
                    address(this),
                    subsidiaryDirector
                )
            )
        );
    }

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
        subsidiariesIndex.push(subsidiaryAddress);
        emit SubsidiaryCreated(msg.sender, director, subsidiaryAddress);

        if (confirmed) {
            confirmSubsidiaryDirectorOwnership(subsidiaryAddress);
        }

        sendUpdateReport();
    }

    /**
     * @dev Get count of confirmed subsidiaries
     * @return {
         "count": "Count of active and confirmed subsidiaries"
     }
     */
    function getConfirmedSubsidiariesCount() internal view returns(uint256 count) {
        
        for (uint256 i = 0; i < subsidiariesIndex.length; i++) {

            if (subsidiaries[subsidiariesIndex[i]].state && 
                subsidiaries[subsidiariesIndex[i]].confirmed) {
                
                count += 1;
            }
        }
    }
}
