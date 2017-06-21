# WT Smart Contracts

The core of the Winding Tree platform are this smart contracts written in solidity language and deployed on the Etherum public blockchain.

What we try to achieve here is to index only the necessary information in so its easily accessible by any member of the network, using blockchain as a database and record of every change of all Winding Tree contracts in our DB.

## Install

```sh
git clone https://github.com/windingtree/wt-contracts --recursive
npm install
```

## Test

To run unit tests on the contracts:
```sh
npm test
```

## The Contracts

### Contract Registry

This contract will list and provide each important contract of the platform, saving his name, address and version and it will be only accessible by the WT founding team.

#### WT Index

This contract will index and list every hotel and airline of the platform, it will index hotels by geological location, country, city and name. And it will index all airlines by their name and flight routes.

#### WT Keys Registry

On WT the users will eb available to send value and data using Líf tokens. The users can send data beetwen each otehr without spending Líf and only paying the mining fee of the Etehreum network. They can register a public key on the WT-Keys-Registry that will be used by another users to send encrypted data between them.
In short terms: this contract will allow the sending of encrypted data between users.

### PrivateCall

The PrivateCall smart contract allows to have pendingTxs on smart contracts, with data stored that would be encrypted/decrypted using the WT Key Registry. To obtain the data encrypted the ureceiver will need to decode the tx data using the abi decoder, now using the WTKey library he easily decrypt teh data and verify that the information on his side. If the data is correct he continue the call and execute the publicCall the user sent at the beginning.

Steps Augusto wants to make a booking on a Flight published by WTAir:

1. Augusto looks for the WTAir publick key on WTKeysRegistry.
2. Augusto encrypts the data using multiple key encryption (adding WTAir as owner of the data too), and sign it.
3. Augusto wants to call the method booking() on ones of the routes of WTAir, so he builds the data to execute that call.
4. Augusto creates the pending tx on the WTAir route by sending his public data to execute the booking() and his personal data encrypted.
5. WTAir receive the txs, looks for Augusto public key on WTKeysRegistry and decryps the data using his private key and Augusto's public key.
6. All the data that augusto sent is correct, WTAir allow the execution of the booking call sending a continueCall() tx.

## Platform

![WT Platform](http://i67.tinypic.com/2wc40lw.png)

### Hotels

WT Index -> WTHotels -> WTHotelUnitTypes -> Units

#### WT Hotel

Every Hotel registered on Winding Tree will be on a WTHotel contract, this contract has the hotel information, address, location, and a list of all the differnet types of accomodations the hotel provides, this are called Unit Types, for example a BASIC_ROOM, CABIN, PREMIUM_ROOM, etc. The hotel will provide a certain amount of this UnitTypes for rent.

#### WT Hotel Unit Type

Each WTHotelUnit type will have a quantity of their type, description, amenities, minnimun and maximun amount of guests, price, and the avaliability of each Unit for rent. The users will make the bookings and reservations directly to this contract, which also supports PrivateCalls.

### Airlines

WT Platform -> WTAirlines -> WTRoute -> Flights

#### WT Airline

Every airline that is registered on WT will have a WTAirline smart contract where they will save their name, legal address, country, and website. From here they can create new routes, if they have a flight plan from Madrid to Barcelona they can create a route between MAD->BCN and BCN->MAD.

#### WT Air Route

This smart contract will be owned by airlines, they would be able to upload all their flight plan for the route. The users will be making the bookings on this contracts using the PrivateCall strategy.
