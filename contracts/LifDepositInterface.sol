pragma solidity >=0.5.16;

/**
 * @title LifDeposit contract interface
 * @dev A contract that manages deposits in Lif tokens 
 */
contract LifDepositInterface {

    /**
     * @dev Returns Lif token address
     * @return {
         "lifToken": "Address of the Lif token"
     }
     */
    function getLifTokenAddress() external view returns (address lifToken);

    /**
     * @dev Returns withdrawDelay value
     * @return {
         "delay": "Delay time in seconds before the requested withdrawal will be possible"
     }
     */
    function getWithdrawDelay() external view returns (uint256 delay);

    /**
     * @dev Changing withdrawDelay value
     * @param _withdrawDelay New withdrawDelay value in seconds
     */
    function setWithdrawDelay(uint256 _withdrawDelay) external;

    /**
     * @dev Makes deposit of Lif tokens
     * @param organization The organization Id
     * @param value The value to be deposited
     */
    function addDeposit(
        bytes32 organization,
        uint256 value
    ) external;

    /**
     * @dev Submits withdrawal request
     * @param organization The organization Id
     * @param value The value to withdraw
     */
    function submitWithdrawalRequest(
        bytes32 organization,
        uint256 value
    ) external;

    /**
     * @dev Returns information about deposit withdrawal request
     * @param organization The organization Id
     * @return {
         "existed": "The request existence flag",
         "value": "Deposit withdrawal value",
         "withdrawTime": "Withraw time on seconds"
     }
     */
    function getWithdrawalRequest(bytes32 organization)
        external
        view 
        returns (
            bool existed,
            uint256 value,
            uint256 withdrawTime
        );

    /**
     * @dev Trunsfers deposited tokens to the sender
     * @param organization The organization OrgId
     */
    function withdrawDeposit(
        bytes32 organization
    ) external;
}
