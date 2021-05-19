// SPDX-License-Identifier: MIT;
pragma solidity 0.5.17;

/**
 * @dev Custom implementation of the {IERC165} interface.
 * This is contract implemented by OpenZeppelin but extended with
 * _removeInterface function
 */
contract ERC165 {
    /*
     * bytes4(keccak256('supportsInterface(bytes4)')) == 0x01ffc9a7
     */
    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

    /**
     * @dev Mapping of interface ids to whether or not it's supported.
     */
    mapping(bytes4 => bool) private _supportedInterfaces;

    constructor () internal {
        // Derived contracts need only register support for their own interfaces,
        // we register support for ERC165 itself here
        _registerInterface(_INTERFACE_ID_ERC165);
    }

    /**
     * @dev Interface of the ERC165 standard, as defined in the
     * https://eips.ethereum.org/EIPS/eip-165[EIP].
     * @param interfaceId Interface Id
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return _supportedInterfaces[interfaceId];
    }

    /**
     * @dev Registers the contract as an implementer of the interface defined by
     * `interfaceId`. Support of the actual ERC165 interface is automatic and
     * registering its interface id is not required.
     * @param interfaceId Interface Id
     */
    function _registerInterface(bytes4 interfaceId) internal {
        require(interfaceId != 0xffffffff, "ERC165: invalid interface id");
        _supportedInterfaces[interfaceId] = true;
    }

    /**
     * @dev Removes support of the interface
     * @param interfaceId Interface Id
     */
    function _removeInterface(bytes4 interfaceId) internal {
        if (_supportedInterfaces[interfaceId]) {
            delete _supportedInterfaces[interfaceId];
        }
    }
}
