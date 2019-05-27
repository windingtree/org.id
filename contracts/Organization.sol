pragma solidity ^0.5.6;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "./OrganizationInterface.sol";

/**
 * @title Organization
 * @dev A contract that represents an Organization in the Windign Tree network.
 */
contract Organization is OrganizationInterface, ERC165, Ownable {

    // Arbitrary locator of the off-chain stored Organization data
    // This might be an HTTPS resource, IPFS hash, Swarm address...
    // This is intentionally generic.
    string public dataUri;

    // Number of a block when the Organization was created
    uint public created;

    /**
     * @dev Event triggered when owner of the organization is changed.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Event triggered when dataUri of the organization is changed.
     */
    event DataUriChanged(string indexed previousDataUri, string indexed newDataUri);

    /**
     * @dev Constructor.
     * @param _dataUri pointer to Organization data
     */
    constructor(string memory _dataUri) public {
        require(bytes(_dataUri).length != 0, 'dataUri cannot be an empty string');
        dataUri = _dataUri;
        created = block.number;
        OrganizationInterface i;
        _registerInterface(i.owner.selector ^ i.getDataUri.selector);
    }

    /**
     * @dev `changeDataUri` Allows owner to change Organization's dataUri.
     * @param  _dataUri New dataUri pointer of this Organization
     */
    function changeDataUri(string memory _dataUri) public onlyOwner {
        bytes memory tempStringRepr = bytes(_dataUri);
        require(tempStringRepr.length != 0, 'dataUri cannot be an empty string');
        emit DataUriChanged(dataUri, _dataUri);
        dataUri = _dataUri;
    }

    /**
     * @dev Returns current dataUri
     * @return {" ": "Current dataUri."}
     */
    function getDataUri() external view returns (string memory) {
        return dataUri;
    }
}
