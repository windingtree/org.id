pragma solidity >=0.5.16;

import "@openzeppelin/contracts/introspection/ERC165.sol";
import "@openzeppelin/contracts/introspection/ERC165Checker.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "./LifDepositInterface.sol";
import "./OrgIdInterface.sol";

/**
 * @title LifDeposit contract
 * @dev A contract that manages deposits in Lif tokens
 */
contract LifDeposit is LifDepositInterface, Ownable, ERC165, Initializable {

    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /// @dev Withdrawal request structure
    struct WithdrawalRequest {
        uint256 value;
        uint256 withdrawTime;
    }

    /// @dev OrgId instance
    OrgIdInterface internal orgId;

    /// @dev Lif token instance
    IERC20 internal lif;

    /// @dev Delay in seconds between withdrawal request and withdrawal
    uint256 internal withdrawDelay;

    /// @dev Mapped list of deposits
    mapping (bytes32 => uint256) internal deposits;

    /// @dev Deposits wiwdrawal requests
    mapping (bytes32 => WithdrawalRequest) internal withdrawalRequests;

    /**
     * @dev Event emitted when Lif deposit has been added
     */
    event LifDepositAdded(
        bytes32 indexed organization,
        address indexed sender,
        uint256 value
    );

    /**
     * @dev Event emitted when withdrawDelay has been changed
     */
    event WithdrawDelayChanged(
        uint256 previousWithdrawDelay,
        uint256 newWithdrawDelay
    );

    /**
     * @dev Event emitted when withdrawal requested has been sent
     */
    event WithdrawalRequested(
        bytes32 indexed organization,
        address indexed sender,
        uint256 value,
        uint256 withdrawTime
    );

    /**
     * @dev Event emitted when deposit has been withdrawn
     */
    event DepositWithdrawn(
        bytes32 indexed organization,
        address indexed sender,
        uint256 value
    );

    /**
     * @dev Throws if called by any account other than the owner or entity director.
     */
    modifier onlyOrganizationOwnerOrDirector(bytes32 organization) {
        (
            bool exist,
            ,
            ,
            ,
            ,
            address organizationOwner,
            address organizationDirector,
            bool state,
            bool directorConfirmed
        ) = orgId.getOrganization(organization);
        require(exit, "LifDeposit: Organization not found");
        require(
            organizationOwner == msg.sender || 
            (
                organizationDirector == msg.sender &&
                directorConfirmed
            ), 
            "LifDeposit: Only organization owner or entity director can call this method"
        );
        require(state, "LifDeposit: Organization is disabled");
        _;
    }

    /**
     * @dev Initializer for upgradeable contracts
     * @param __owner The address of the contract owner
     * @param _orgId Address of the OrgId contract
     * @param _lif Address of the Lif token
     */
    function initialize(
        address payable __owner,
        address _orgId,
        address _lif
    ) public initializer {
        _transferOwnership(__owner);
        require(
            ERC165Checker._supportsInterface(_orgId, 0x36b78f0f),
            "LifDeposit: orgId has to support ORG.ID interface"
        );
        orgId = OrgIdInterface(_orgId);
        lif = IERC20(_lif);
        setInterfaces(); 
    }

    /**
     * @dev Returns Lif token address
     * @return {
         "lifToken": "Address of the Lif token"
     }
     */
    function getLifTokenAddress() external view returns (address lifToken) {
        lifToken = address(lif);
    }

    /**
     * @dev Returns withdrawDelay value
     * @return {
         "delay": "Delay time in seconds before the requested withdrawal will be possible"
     }
     */
    function getWithdrawDelay() external view returns (uint256 delay) {
        delay = withdrawDelay;
    }

    /**
     * @dev Changing withdrawDelay value
     * @param _withdrawDelay New withdrawDelay value in seconds
     */
    function setWithdrawDelay(uint256 _withdrawDelay) external onlyOwner {
        emit WithdrawDelayChanged(withdrawDelay, _withdrawDelay);
        withdrawDelay = _withdrawDelay;
    }

    /**
     * @dev Makes deposit of Lif tokens
     * @param organization The organization OrgId
     * @param value The value to be deposited
     */
    function addDeposit(
        bytes32 organization,
        uint256 value
    )
        external 
        onlyOrganizationOwnerOrDirector(organization)
    {
        require(value > 0, "LifDeposit: Invalid deposit value");
        lif.safeTransferFrom(msg.sender, address(this), value);
        deposits[organization] = deposits[organization].add(value);
        emit LifDepositAdded(organization, msg.sender, value);
    }

    /**
     * @dev Submits withdrawal request
     * @param organization The organization OrgId
     * @param value The value to withdraw
     */
    function submitWithdrawalRequest(
        bytes32 organization,
        uint256 value
    )
        external 
        onlyOrganizationOwnerOrDirector(organization)
    {
        require(value > 0, "LifDeposit: Invalid withdrawal value");
        require(
            value <= organizations[organization],
            "LifDeposit: Insufficient balance"
        );
        uint256 withdrawTime = time().add(withdrawDelay);
        withdrawalRequests[organization] = WithdrawalRequest(value, withdrawTime);
        emit WithdrawalRequested(organization, msg.sender, value, withdrawTime);
    }

    /**
     * @dev Returns information about deposit withdrawal request
     * @param organization The organization Id
     * @return {
         "exist": "The request existence flag",
         "value": "Deposit withdrawal value",
         "withdrawTime": "Withraw time on seconds"
     }
     */
    function getWithdrawalRequest(bytes32 organization)
        external
        view 
        returns (
            bool exist,
            uint256 value,
            uint256 withdrawTime
        )
    {
        exist = 
            organization != bytes32(0) &&
            deposits[organization] > 0 &&
            withdrawalRequests[organization].value != 0;
        value = withdrawalRequests[organization].value;
        withdrawTime = withdrawalRequests[organization].withdrawTime;
    }

    /**
     * @dev Trunsfers deposited tokens to the sender
     * @param orgId The organization OrgId
     */
    function withdrawDeposit(
        bytes32 organization
    )
        external 
        onlyOrganizationOwnerOrDirector(organization)
    {
        require(
            withdrawalRequests[organization].value != 0,
            "LifDeposit: Withdrawal request not found"
        );
        require(
            withdrawalRequests[organization].withdrawTime <= time(),
            "LifDeposit: Withdrawal request delay period not passed"
        );
        uint256 withdrawalValue = withdrawalRequests[organization].value;
        deposits[organization] = deposits[organization].sub(withdrawalValue);
        delete withdrawalRequests[organization];
        lif.safeTransfer(msg.sender, withdrawalValue);
        emit DepositWithdrawn(organization, msg.sender, withdrawalValue);
    }

    /**
     * @dev Set the list of contract interfaces supported
     */
    function setInterfaces() public {
        LifDepositInterface ldp;
        Ownable own;
        bytes4[3] memory interfaceIds = [
            // ERC165 interface: 0x01ffc9a7
            bytes4(0x01ffc9a7),

            // ownable interface: 0x7f5828d0
            own.owner.selector ^ 
            own.transferOwnership.selector, 

            // Lif deposit interface: 0xe936be58
            ldp.getLifTokenAddress.selector ^
            ldp.getWithdrawDelay.selector ^
            ldp.setWithdrawDelay.selector ^
            ldp.addDeposit.selector ^
            ldp.submitWithdrawalRequest.selector ^
            ldp.getWithdrawalRequest.selector ^
            ldp.withdrawDeposit.selector
        ];
        for (uint256 i = 0; i < interfaceIds.length; i++) {
            _registerInterface(interfaceIds[i]);
        }
    }

    /**
     * @dev Get current time
     *  
     * This function can be overriden for testing purposes
     * 
     * @return uint256 Current block time
     */
    function time() internal view returns (uint256) {
        return now;// solhint-disable-line not-rely-on-time
    }
}
