# Winding Tree Smart Contracts

The core of the Winding Tree platform are these smart contracts written in solidity language and deployed on the Ethereum blockchain.

## Contracts

### WTContracts

This contract will list and provide each important contract of the platform, saving its name, address and version and it will be owned by the DAO.

### WTIndex

This contract will index and list every hotel and airline of the platform, it will index hotels by geolocation, country, city and name. And it will index all airlines by their name and flight routes.

### PrivateCall

The PrivateCall smart contract allows to have pending transactions on smart contracts, with data stored, that would be encrypted/decrypted using public/private key encryption. To obtain the encrypted data the receiver will need to decode the transaction data using the abi decoder.By using the `WTKey.js` (from our [example javascript library](https://github.com/windingtree/wt-js-libs/blob/master/libs/WTKey.js)) it is easy to decrypt the data and check the integrity. If the data is correct it is possible to continue the call and execute the publicCall the user sent at the beginning.

Steps when user Augusto wants to book a Room published by `WTHotel`:

1. Augusto receives the public key of `WTHotel`.
2. Augusto encrypts the data using multiple key encryption (adding `WTHotel` as owner of the data too) and sign it.
3. Augusto wants to call the method booking() on one of the rooms of `WTHotel`, so he builds the data to execute that call.
4. Augusto creates the pending transaction on the `WTHotel` room by sending his public data to execute the booking() and his personal data encrypted.
5. `WTHotel` receives the transactions alongside with Augusto's public key and decrypts the data using `WTHotel`'s private key and verify with Augusto's public key.
6. If all the data that Augusto sent is correct, `WTHotel` allow the execution of the booking call sending a continueCall() transaction.

## Platform

![WT Platform](img/WT%20Platform.png)

#### Hotel

Every Hotel registered on Winding Tree will be on a Hotel contract, this contract has the hotel information, address, location, and a list of all the differnet types of accomodations the hotel provides, these are called Unit Types, for example a `BASIC_ROOM`, `CABIN`, `PREMIUM_ROOM`, etc. The hotel will provide a certain amount of its UnitTypes for rent.

#### Hotel Unit Type

The `UnitType` contract have the description, amenities, minimun and maximun amount of guests, price and a total amount of units.

#### Hotel Unit

The `Unit` contract have the avaliability and price. The users will make the bookings and reservations directly to this contract, which also supports PrivateCalls.