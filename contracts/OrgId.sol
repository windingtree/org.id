pragma solidity >=0.5.16;

import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165Checker.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "./OrgIdInterface.sol";

/**
 * @title OrgId contract
 * @dev A contract that represents an OrgId registry
 */
contract OrgId is Ownable, OrgIdInterface, ERC165, Initializable {

    using SafeMath for uint256;

    /// @dev Organization structure
    struct Organization {
        bytes32 orgId;
        string orgJsonUri;
        bytes32 orgJsonHash;
        bytes32 parentEntity;
        address owner;
        address director;
        bool state;
        bool directorConfirmed;
        bytes32[] subsidiaries;
    }

    // Mapped list of Organizations
    mapping (bytes32 => Organization) internal organizations;

    // List of organizations orgIds
    bytes32[] internal orgIds;

    /**
     * @dev Event triggered when organization is created
     */
    event OrganizationCreated(
        bytes32 indexed orgId,
        address indexed owner
    );

    /**
     * @dev Event triggered when new subsidiary has been created
     */
    event SubsidiaryCreated(
        bytes32 indexed parentOrgId,
        bytes32 indexed subOrgId,
        address indexed director
    );

    /**
     * @dev Event triggered when a subsidiary state has been toggled
     */
    event OrganizationToggled(
        bytes32 indexed orgId,
        bool previousState,
        bool newState
    );

    /**
     * @dev Event triggered when entitiy director ownership has been confirmed
     */
    event DirectorOwnershipConfirmed(
        bytes32 indexed orgId,
        address indexed director
    );

    /**
     * @dev Event triggered when subsidiary director ownership 
     * has been transferred
     */
    event DirectorOwnershipTransferred(
        bytes32 indexed orgId,
        address indexed previousDirector,
        address indexed newDirector
    );

    /**
     * @dev Event triggered when organization ownership has been transferred
     */
    event OrganizationOwnershipTransferred(
        bytes32 indexed orgId,
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Event triggered when orgJsonUri of the organization is changed.
     */
    event OrgJsonUriChanged(
        bytes32 indexed orgId,
        string previousOrgJsonUri, 
        string newOrgJsonUri
    );

    /**
     * @dev Event triggered when orgJsonHash of the organization is changed.
     */
    event OrgJsonHashChanged(
        bytes32 indexed orgId,
        bytes32 indexed previousOrgJsonHash,
        bytes32 indexed newOrgJsonHash
    );

    /**
     * @dev Throws if organization not found
     */
    modifier existedOrganization(bytes32 orgId) {
        require(
            orgId != bytes32(0) &&
            organizations[orgId].orgId == orgId,
            "OrgId: Organization with given orgId not found"
        );
        _;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOrganizationOwner(bytes32 orgId) {
        require(
            organizations[orgId].owner == msg.sender,
            "OrgId: Only organization owner can call this method"
        );
        _;
    }

    /**
     * @dev Throws if called by any account other than the owner or entity director.
     */
    modifier onlyOrganizationOwnerOrDirector(bytes32 orgId) {
        require(
            organizations[orgId].owner == msg.sender || 
            organizations[orgId].director == msg.sender, 
            "OrgId: Only organization owner or entity director can call this method"
        );
        _;
    }

    /**
     * @dev Initializer for upgradeable contracts
     * @param __owner The address of the contract owner
     */
    function initialize(
        address payable __owner
    ) public initializer {
        _transferOwnership(__owner);
        setInterfaces(); 
    }

    /**
     * @dev Create organization
     * @param orgId The organization Id
     * @param orgJsonUri orgJsonUri pointer
     * @param orgJsonHash keccak256 hash of the new ORG.JSON contents
     * @return {
         "id": "The organization orgId"
     }
     */
    function createOrganization(
        bytes32 orgId,
        string calldata orgJsonUri,
        bytes32 orgJsonHash
    ) external returns (bytes32 id) {

        id = _createOrganization(
            orgId,
            bytes32(0),
            address(0),
            orgJsonUri,
            orgJsonHash
        );
        emit OrganizationCreated(id, msg.sender);
    }

    /**
     * @dev Create subsidiary
     * @param orgId The organization Id
     * @param subOrgId The subsidiary organization Id
     * @param subsidiaryDirector Subsidiary director address
     * @param orgJsonUri orgJsonUri pointer
     * @param orgJsonHash keccak256 hash of the new ORG.JSON contents
     */
    function createSubsidiary(
        bytes32 orgId,
        bytes32 subOrgId,
        address subsidiaryDirector,
        string calldata orgJsonUri,
        bytes32 orgJsonHash
    ) 
        external 
        existedOrganization(orgId)
        onlyOrganizationOwnerOrDirector(orgId) 
        returns (bytes32 id) 
    {
        id = _createOrganization(
            subOrgId,
            orgId,
            subsidiaryDirector,
            orgJsonUri,
            orgJsonHash
        );
        emit SubsidiaryCreated(orgId, id, subsidiaryDirector);

        if (subsidiaryDirector == msg.sender) {
            emit DirectorOwnershipConfirmed(id, msg.sender);
        }
    }

    /**
     * @dev Toggle the organization state
     * @param orgId The organization orgId
     */
    function toggleOrganization(bytes32 orgId)
        external 
        existedOrganization(orgId)
        onlyOrganizationOwner(orgId)
    {
        emit OrganizationToggled(
            orgId,
            organizations[orgId].state,
            !organizations[orgId].state
        );
        organizations[orgId].state = !organizations[orgId].state;        
    }

    /**
     * @dev Confirmation of the organization director ownership
     * @param orgId The organization orgId
     */
    function confirmDirectorOwnership(bytes32 orgId)
        external
        existedOrganization(orgId)
    {
        require(
            organizations[orgId].director == msg.sender,
            "OrgId: Only subsidiary director can call this method"
        );

        organizations[orgId].directorConfirmed = true;
        emit DirectorOwnershipConfirmed(orgId, msg.sender);
    }

    /**
     * @dev Transfer subsidiary director ownership
     * @param orgId The organization orgId
     * @param newDirector New subsidiary director address
     */
    function transferDirectorOwnership(
        bytes32 orgId,
        address newDirector
    )
        external 
        existedOrganization(orgId)
        onlyOrganizationOwner(orgId)
    {
        require(
            newDirector != address(0),
            "OrgId: Invalid subsidiary director address"
        );

        emit DirectorOwnershipTransferred(
            orgId,
            organizations[orgId].director,
            newDirector
        );
        organizations[orgId].director = newDirector; 

        if (newDirector == msg.sender) {
            emit DirectorOwnershipConfirmed(orgId, newDirector);
        } else {
            organizations[orgId].directorConfirmed = false;
        }      
    }

    /**
     * @dev Transfer organization ownership
     * @param orgId The organization orgId
     * @param newOwner New subsidiary director address
     */
    function transferOrganizationOwnership(
        bytes32 orgId,
        address newOwner
    )
        external 
        existedOrganization(orgId)
        onlyOrganizationOwner(orgId)
    {
        require(
            newOwner != address(0),
            "OrgId: Invalid owner address"
        );

        emit OrganizationOwnershipTransferred(
            orgId,
            organizations[orgId].owner,
            newOwner
        );
        organizations[orgId].owner = newOwner;        
    }

    /**
     * @dev Shorthand method to change ORG.JSON uri and hash at the same time
     * @param orgId The organization orgId
     * @param orgJsonUri New orgJsonUri pointer of this Organization
     * @param orgJsonHash keccak256 hash of the new ORG.JSON contents.
     */
    function changeOrgJsonUriAndHash(
        bytes32 orgId,
        string calldata orgJsonUri,
        bytes32 orgJsonHash
    ) 
        external
        existedOrganization(orgId)
        onlyOrganizationOwnerOrDirector(orgId) 
    {
        changeOrgJsonUri(orgId, orgJsonUri);
        changeOrgJsonHash(orgId, orgJsonHash);
    }

    /**
     * @dev Return an array of active organizations orgIds
     * @return {
         "organizationsList": "Array of active organizations orgIds"
     }
     */
    function getOrganizations()
        external 
        view 
        returns (bytes32[] memory) 
    {
        return _getOrganizations(bytes32(0));
    }

    /**
     * @dev Return an array of active subsidiaries orgIds
     * @return {
         "organizationsList": "Array of active subsidiaries orgIds"
     }
     */
    function getSubsidiaries(bytes32 orgId)
        external
        view 
        existedOrganization(orgId) 
        returns (bytes32[] memory) 
    {
        return _getOrganizations(orgId);
    }

    /**
     * @dev Get organization by orgId
     * @param _orgId The organization Id
     * @return {
         "orgId": "The organization orgId",
         "orgJsonUri": "orgJsonUri pointer of this Organization",
         "orgJsonHash": "keccak256 hash of the new ORG.JSON contents",
         "parentEntity": "The parent organization orgId",
         "owner": "The organization owner",
         "director": "The organization director",
         "state": "State of the organization",
         "directorConfirmed": "Flag is director ownership is confirmed"
     }
     */
    function getOrganization(bytes32 _orgId) 
        external 
        view 
        existedOrganization(_orgId) 
        returns (
            bytes32 orgId,
            string memory orgJsonUri,
            bytes32 orgJsonHash,
            bytes32 parentEntity,
            address owner,
            address director,
            bool state,
            bool directorConfirmed
        )
    {   
        Organization storage org = organizations[_orgId];
        orgId = org.orgId;
        orgJsonUri = org.orgJsonUri;
        orgJsonHash = org.orgJsonHash;
        parentEntity = org.parentEntity;
        owner = org.owner;
        director = org.director;
        state = org.state;
        directorConfirmed = org.directorConfirmed;
    }

    /**
     * @dev Allows owner to change Organization"s orgJsonUri
     * @param orgId The organization OrgId
     * @param orgJsonUri New orgJsonUri pointer of this Organization
     */
    function changeOrgJsonUri(
        bytes32 orgId,
        string memory orgJsonUri
    ) 
        public
        existedOrganization(orgId)
        onlyOrganizationOwnerOrDirector(orgId) 
    {
        require(
            bytes(orgJsonUri).length != 0,
            "OrgId: orgJsonUri cannot be an empty string"
        );

        emit OrgJsonUriChanged(
            orgId,
            organizations[orgId].orgJsonUri,
            orgJsonUri
        );
        organizations[orgId].orgJsonUri = orgJsonUri;
    }

    /**
     * @dev Allows owner to change Organization"s orgJsonHash
     * @param orgId The organization OrgId
     * @param orgJsonHash keccak256 hash of the new ORG.JSON contents
     */
    function changeOrgJsonHash(
        bytes32 orgId,
        bytes32 orgJsonHash
    ) 
        public
        existedOrganization(orgId)
        onlyOrganizationOwnerOrDirector(orgId) 
    {
        require(
            orgJsonHash != bytes32(0),
            "OrgId: orgJsonHash cannot be an empty"
        );

        emit OrgJsonHashChanged(
            orgId,
            organizations[orgId].orgJsonHash,
            orgJsonHash
        );
        organizations[orgId].orgJsonHash = orgJsonHash;
    }

    /**
     * @dev Set the list of contract interfaces supported
     */
    function setInterfaces() public {
        OrgIdInterface org;
        Ownable own;
        bytes4[4] memory interfaceIds = [
            // ERC165 interface: 0x01ffc9a7
            bytes4(0x01ffc9a7),

            // ownable interface: 0x7f5828d0
            own.owner.selector ^ 
            own.transferOwnership.selector, 

            // ORG.ID interface: 0x36b78f0f
            org.createOrganization.selector ^
            org.toggleOrganization.selector ^
            org.transferOrganizationOwnership.selector ^
            org.changeOrgJsonUri.selector ^ 
            org.changeOrgJsonHash.selector ^
            org.getOrganizations.selector ^
            org.getOrganization.selector,

            // hierarchy interface: 0x3a3bc250
            org.createSubsidiary.selector ^ 
            org.confirmDirectorOwnership.selector ^
            org.transferDirectorOwnership.selector ^
            org.getSubsidiaries.selector
        ];
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            _registerInterface(interfaceIds[i]);
        }
    }

    /**
     * @dev Create new organization and add it to the storage
     * @param orgId The organization Id
     * @param parentEntity Parent organization Id
     * @param subsidiaryDirector Subsidiary director address
     * @param orgJsonUri orgJsonUri pointer
     * @param orgJsonHash keccak256 hash of the new ORG.JSON contents
     * @return {
         "orgId": "Created organization orgId"
     }
     */
    function _createOrganization(
        bytes32 orgId,
        bytes32 parentEntity,
        address subsidiaryDirector,
        string memory orgJsonUri,
        bytes32 orgJsonHash
    ) internal returns (bytes32) {

        // If orgId not been provided
        if (orgId == bytes32(0)) {
            
            orgId = keccak256(
                abi.encodePacked(
                    msg.sender,
                    blockhash(block.number.sub(1))
                )
            ); 
        }

        require(
            organizations[orgId].orgId == bytes32(0),
            "OrgId: An organization with given orgId already exists"
        );

        // Subsidiary requirements
        if (parentEntity != bytes32(0)) {
            
            require(
                organizations[parentEntity].orgId == parentEntity,
                "OrgId: Parent organization not found"
            );

            require(
                subsidiaryDirector != address(0),
                "OrgId: Invalid subsidiary director address"
            );
        }

        organizations[orgId] = Organization(
            orgId,
            orgJsonUri,
            orgJsonHash,
            parentEntity,
            msg.sender,
            subsidiaryDirector,
            true,
            subsidiaryDirector == msg.sender,
            new bytes32[](0)
        );
        orgIds.push(orgId);

        if (parentEntity != bytes32(0)) {
            organizations[parentEntity].subsidiaries.push(orgId);
        }

        return orgId;
    }

    /**
     * @dev Return an array of active organizations orgIds
     * @return {
         "organizationsList": "Array of active organizations orgIds"
     }
     */
    function _getOrganizations(bytes32 orgId)
        internal 
        view 
        returns (bytes32[] memory organizationsList) 
    {
        bytes32[] memory source = 
            orgId == bytes32(0) 
            ? orgIds 
            : organizations[orgId].subsidiaries;
        organizationsList = new bytes32[](_getOrganizationsCount(source));
        uint256 index;

        for (uint256 i = 0; i < source.length; i++) {

            if (organizations[source[i]].state &&
                ((organizations[source[i]].parentEntity != bytes32(0) && 
                organizations[source[i]].directorConfirmed) ||
                !organizations[source[i]].directorConfirmed)) {

                organizationsList[index] = source[i];
                index += 1;
            }
        }
    }

    /**
     * @dev Get count of active organizations
     * @param source The list of organization
     * @return {
         "count": "Count of active and confirmed subsidiaries"
     }
     */
    function _getOrganizationsCount(bytes32[] memory source) 
        internal 
        view 
        returns (uint256 count) 
    {
        for (uint256 i = 0; i < source.length; i++) {

            if (organizations[source[i]].state &&
                ((organizations[source[i]].parentEntity != bytes32(0) && 
                organizations[source[i]].directorConfirmed) ||
                !organizations[source[i]].directorConfirmed)) {
                
                count += 1;
            }
        }
    }
}
