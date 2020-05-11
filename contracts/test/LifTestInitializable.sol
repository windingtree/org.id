pragma solidity >=0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract LifTestInitializable is ERC20Mintable, Initializable {

    string public name;
    string public symbol;
    uint public decimals;

    /**
     * @dev Initializer for upgradeable contracts
     * @param __owner The address of the tokens minter
     * @param _name Token name
     * @param _symbol Token symbol
     * @param _decimals Token decimals
     * @param _supply Total supply
     */
    function initialize(
        address payable __owner,
        string memory _name,
        string memory _symbol,
        uint _decimals,
        uint256 _supply
    ) public initializer {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        _addMinter(__owner);
        _mint(__owner, _supply); 
    }
}
