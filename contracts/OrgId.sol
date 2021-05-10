// SPDX-License-Identifier: GPL-3.0-only;
pragma solidity 0.5.17;


/**
 * @title ORGiD Registry Smart Contract
 */
contract OrgId {

    /// @dev Mapped list of Organizations
    mapping (bytes32 => address) internal organizations;

    /// @dev List of ORGiD hashes
    bytes32[] internal orgIds;

    /**
     * @dev Emits when new organization created
     */
    event OrganizationCreated(
        bytes32 indexed orgId,
        address indexed owner
    );

    /**
     * @dev Emits when ORGiD owner changes
     */
    event OrganizationOwnershipTransferred(
        bytes32 indexed orgId,
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Emits when ORG.JSON changes
     */
    event OrgJsonChanged(
        bytes32 indexed orgId,
        string previousOrgJsonUri
    );

    /**
     * @dev Throws if ORGiD does not exist or called not by an owner
     */
    modifier changeAllowed(bytes32 orgId) {
        require(
            orgId != bytes32(0) &&
            organizations[orgId] == msg.sender,
            "OrgId: Change not allowed"
        );
        _;
    }

    /**
     * @dev Create organization Id
     * @param salt Unique hash required for identifier creation
     * @param orgJsonUri ORG.JSON URI (stored off-chain)
     * @return {
         "id": "ORGiD byte32 hash"
     }
     */
    function createOrgId(
        bytes32 salt,
        string calldata orgJsonUri
    ) external returns (bytes32 orgId) {
        // Organization unique Id creation
        orgId = keccak256(
            abi.encodePacked(
                msg.sender,
                salt
            )
        );

        require(
            organizations[orgId] == address(0),
            "OrgId: Organization already exists"
        );

        organizations[orgId] = msg.sender;
        orgIds.push(orgId);

        emit OrgJsonChanged(
            orgId,
            orgJsonUri
        );

        emit OrganizationCreated(orgId, msg.sender);
    }

    /**
     * @dev Ownership transfer
     * @param orgId ORGiD hash
     * @param newOwner New owner's address
     */
    function transferOrganizationOwnership(
        bytes32 orgId,
        address newOwner
    )
        external
        changeAllowed(orgId)
    {
        require(
            newOwner != address(0),
            "OrgId: Invalid owner address"
        );

        emit OrganizationOwnershipTransferred(
            orgId,
            organizations[orgId],
            newOwner
        );
        organizations[orgId] = newOwner;
    }

    /**
     * @dev Shorthand method to change ORG.JSON URI and hash at once
     * @param orgId ORGiD hash
     * @param orgJsonUri New ORG.JSON URI
     */
    function setOrgJson(
        bytes32 orgId,
        string calldata orgJsonUri
    )
        external
        changeAllowed(orgId)
    {
        require(
            bytes(orgJsonUri).length != 0,
            "OrgId: ORG.JSON URI cannot be empty"
        );

        emit OrgJsonChanged(
            orgId,
            orgJsonUri
        );
    }

    /**
     * @dev Get all active organizations' ORGiD hashes
     * @return {
         "organizationsList": "Array of all active organizations' ORGiD hashes"
     }
     */
    function getOrgIds()
        external
        view
        returns (bytes32[] memory)
    {
        return orgIds;
    }

    /**
     * @dev Check ORGiD existence
     * @param _orgId ORGiD hash
     * @dev Return parameters marked by (*) are only applicable to units
     * @return ORGiD existence
     */
    function getOrgId(bytes32 _orgId)
        external
        view
        returns (
            bool exists,
            address owner
        )
    {
        exists = _orgId != bytes32(0) && organizations[_orgId] != address(0);
        owner = organizations[_orgId];
    }
}
