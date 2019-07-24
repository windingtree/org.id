[![Build Status](https://travis-ci.org/windingtree/wt-contracts.svg?branch=master)](https://travis-ci.org/windingtree/wt-contracts)
[![Coverage Status](https://coveralls.io/repos/github/windingtree/wt-contracts/badge.svg?branch=master)](https://coveralls.io/github/windingtree/wt-contracts?branch=master&v=2.0) [![Greenkeeper badge](https://badges.greenkeeper.io/windingtree/wt-contracts.svg)](https://greenkeeper.io/)

# WT Smart Contracts

Smart contracts of the Winding Tree platform.


## Documentation

![](https://raw.githubusercontent.com/windingtree/wt-contracts/8fddef99ef09d099f3fd3721680f54129fd742d1/assets/contracts-schema.png)

Generated documentation is in the [`docs`](https://github.com/windingtree/wt-contracts/tree/master/docs)
folder and can be generated by running `npm run soldoc`.

There are two main groups of users in the Winding Tree platform - content producers (e. g. Hotels, Airlines)
and content consumers (e. g. OTAs (Online Travel Agencies)).

### Content producers

When a producer wants to participate, they have to do the following:

1. Locate Winding Tree Entrypoint address
1. Prepare off-chain data conforming to the [specification](https://github.com/windingtree/wt-organization-schemas)
1. Create their organization smart contract (commonly referred to as 0xORG)
    1. Fully custom
        1. Create an implementation of `OrganizationInterface` smart contract.
        1. Deploy the custom implementation.
    1. Assisted
        1. Locate Organization Factory address from Winding Tree Entrypoint
        1. Call `create` method on the Organization Factory with the URI of off-chain data and a keccak256 hash of its contents.
        Organization smart contract that belongs to the transaction sender is created.
1. Locate the appropriate Segment Directory address
1. Add their newly created 0xORG to the segment directory by calling the `add` method

The Organization created in `OrganizationFactory` uses the
[Upgradeability Proxy pattern](https://docs.zeppelinos.org). In short, the Factory owner will keep
the ownership of the contract logic (proxy), whereas the transaction sender will keep the ownership of the
data. Thus the Factory owner is responsible for the code. It is possible to transfer the proxy ownership
to another account if need be.

In any case, every Organization can have many *associated keys*. An *associated key* is an Ethereum address
registered in the Organization that can operate on behalf of the organization. That means
that for example, the associated key can **sign messages on behalf** of the Organization. This
is handy when providing guarantees, proving data integrity or disclosing identity.

### Content consumers

When a consumer wants to participate, they have to do the following:

1. Locate Winding Tree Entrypoint address
1. Locate the appropriate Segment Directory address
1. Call `getOrganizations` on the Segment Directory.
1. Call `getOrgJsonUri` on every non-zero address returned as an instance of `OrganizationInterface` and crawl the off-chain data
for more information.
1. Call `getOrgJsonHash` on every non-zero address returned as an instance of `OrganizationInterface` and verify that the current 
off-chain data contents hash matches the hash published in the smart contract.

If a signed message occurs somewhere in the platform, a content consumer might want to decide
if it was signed by an account associated with the declared Organization. That's when they would 
first verify the signature and obtain an address of the signer. In the next step, they have to verify
that the actual signer is registered as an `associatedKey` with the Organization by checking its smart contract.

### Working with content hashes

In order to reduce the attack surface, we require a hash of the off-chain stored data. We assume that it
will not change very frequently, so updating the hash every-so-often won't add a significant cost to the whole operation.
So, how does the hash actually look like? It is a `keccak256` (an Ethereum flavour of `sha3`) of the stringified ORG.JSON.
Let's try an example:

```js
const web3utils = require('web3-utils');
const stringOrgJsonContents = `{
  "dataFormatVersion": "0.2.3",
  "updatedAt": "2019-06-04T11:10:00.000Z",
  "legalEntity": {
    "name": "Acme Corp, Inc.",
    "address": {
      "road": "5th Avenue",
      "houseNumber": "123",
      "city": "New York",
      "countryCode": "US"
    },
    "contact": {
      "email": "ceo@acmecorpz.com"
    }
  }
}`;
// It is important to work with a textual ORG.JSON and *not* a JSON-parsed and re-serialized form.
// JSON serializers might be producing different outcomes which would result in different hashes.
const hashedOrgJson = web3utils.soliditySha3(stringOrgJsonContents);
console.log(`Put me into 0xORG: ${hashedOrgJson}`);
```

You can also produce `keccak256` hashes in a myriad of other tools, such as
[this one](https://emn178.github.io/online-tools/keccak_256.html).

## Requirements

Node 10 is required for running the tests and contract compilation.

## Installation

```sh
npm install @windingtree/wt-contracts
```

```js
import Organization from '@windingtree/wt-contracts/build/contracts/Organization.json';
// or
import { OrganizationInterface, AbstractSegmentDirectory } from '@windingtree/wt-contracts';
```

## Development

```sh
git clone https://github.com/windingtree/wt-contracts
nvm install
npm install
npm test
```

You can run a specific test with `npm test -- test/segment-directory.js`
or you can generate a coverage report with `npm run coverage`.

**Warning:** We are **not** using the `zos.json` in tests, rather `zos.test.json`. If you are
getting the `Cannot set a proxy implementation to a non-contract address` error, its probably
because the contract is not in`zos.test.json`.

### Flattener

A flattener script is also available. `npm run flattener` command
will create a flattened version without imports - one file per contract.
This is needed if you plan to use tools like [etherscan verifier](https://etherscan.io/verifyContract)
or [securify.ch](https://securify.ch/).

## Deployment

We are using the upgradeability proxy from [zos](https://docs.zeppelinos.org/)
and the deployment pipeline is using their system as well. You can read more
about the [publishing process](https://docs.zeppelinos.org/docs/deploying) and
[upgrading](https://docs.zeppelinos.org/docs/upgrading.html) in `zos`
documentation.

In order to interact with "real" networks such as `mainnet`, `ropsten` or others,
you need to setup a `keys.json` file used by [truffle](https://truffleframework.com/)
that does the heavy lifting for zos.

```json
{
  "mnemonic": "<SEED_PHRASE>",
  "infura_projectid": "<PROJECT_ID>"
}
```

### Upgradeability FAQ

**What does upgradeability mean?**

We can update the logic of Entrypoint, Segment Directory or Organization while keeping their
public address the same and **without touching any data**.

**Can you change the Organization data structure?**

The Organization Factory owner can, yes. As long as we adhere to
[zos recommendations](https://docs.zeppelinos.org/docs/writing_contracts.html#modifying-your-contracts),
it should be safe. The same applies for Segment Directory, Entrypoint and Factory.

**Can I reclaim the proxy ownership of an Organization?**
If your Organization is created via the Factory, the proxy is owned by the Factory `owner`
(i. e. only the `owner` can upgrade your Organization). You can, however, ask the `owner`
to transfer the proxy admin to a different account by calling `changeAdmin` on the Organization
itself. The new proxy admin can then upgrade the Organization implementation.

**Can I switch to the new Organization version?**

If you created your Organization via Organization Factory, no. The Organization Factory
owner has to do that for you. If you deployed the (upgradeable) Organization yourself or reclaimed the
proxy ownership from the Factory owner, you can do it yourself. If you used a non-upgradeable
smart contract implementation, then no.

**Why do I keep getting "revert Cannot call fallback function from the proxy admin" when interacting with Organization?**

This is a documented behaviour of [zos upgradeability](https://docs.zeppelinos.org/docs/faq.html#why-are-my-getting-the-error-cannot-call-fallback-function-from-the-proxy-admin).
You need to call the proxied Organization contract from a different account than is the proxy owner.

**What happens when you upgrade a Segment Directory?**

The Directory address stays the same, the client software has to
interact with the Directory only with the updated ABI which is distributed
via NPM (under the new version number). No data is lost.

**How do I work with different organization versions on the client?**
That should be possible by using an ABI of `OrganizationInterface` on the client side.

### Contract upgrade process

1. Run `npm version` and release on NPM. This will also bump the version in `zos.json` file.
1. Deploy upgraded contracts with `./node_modules/.bin/zos push --network development` (use the network which you need).
**The `Organization` implementation used by the Factory is changed in this step**.
1. Upgrade contracts with `./node_modules/.bin/zos upgrade --network development` (use the network which you need). This
will interactively ask you which contracts to upgrade. If you have changed the interface of Organization, make sure to
upgrade `OrganizationFactory` as well.
1. Upgrade Organization contracts with `node management/upgrade-organizations.js`. Make sure that its setup in a proper way.
You can check the `Organization` implementation address in `zos.<network>.json` file. Also, use the account set as Organization
Factory owner. Only that account can change Organizations' implementation.


### Local testing

You don't need `keys.json` file for local testing of deployment and interaction
with the contracts.

1. Start a local Ethereum network.
    ```bash
    > npm run dev-net
    ```
2. Start a zos session.
    ```bash
    > ./node_modules/.bin/zos session --network development --from 0x87265a62c60247f862b9149423061b36b460f4BB --expires 3600
    ```
3. Deploy your contracts. This only uploads the logic, the contracts are not meant to be directly
interacted with.
    ```bash
    > ./node_modules/.bin/zos push --network development
    ```
4. Create the proxy instances of deployed contracts you can interact with. The `args`
attribute is passed to the initializer function. See documentation of the appropriate contracts
for details. The zos app might differ for each deployment. You don't need a deployed Lif token
to play with this locally.
    ```bash
    > ./node_modules/.bin/zos create OrganizationFactory --network development --init initialize --args 0x87265a62c60247f862b9149423061b36b460f4BB,0x988f24d8356bf7e3D4645BA34068a5723BF3ec6B
    > ./node_modules/.bin/zos create WindingTreeEntrypoint --network development --init initialize --args 0x87265a62c60247f862b9149423061b36b460f4BB,0xB6e225194a1C892770c43D4B529841C99b3DA1d7,0x602a8c3F536b1a50F3b22c0C1024104265F694C6
    > ./node_modules/.bin/zos create SegmentDirectory --network development --init initialize --args 0x87265a62c60247f862b9149423061b36b460f4BB,hotels,0xB6e225194a1C892770c43D4B529841C99b3DA1d7
    ```
These commands will return a network address where you can actually interact with the contracts.
For a quick test, you can use the truffle console. We also need to use a different account than the
owner of the `OrganizationFactory` to pose as the `Organization` owner.
```bash
> ./node_modules/.bin/truffle console --network development
truffle(development)> account = (await web3.eth.getAccounts())[1]
truffle(development)> entrypoint = await WindingTreeEntrypoint.at('0x1B369F9fe2E2f6728Bf96487d0d7950c97417643')
truffle(development)> entrypoint.setSegment('hotels', '0xde06f481353be1233d41f52bC215f337E7641976')
truffle(development)> factory = await OrganizationFactory.at(await entrypoint.getOrganizationFactory({ from: account}))
truffle(development)> factory.create('https://windingtree.com', '0xd1e15bcea4bbf5fa55e36bb5aa9ad5183a4acdc1b06a0f21f3dba8868dee2c99', { from: account })
truffle(development)> factory.getCreatedOrganizations()
truffle(development)> directory = await SegmentDirectory.at(await entrypoint.getSegment('hotels', { from: account}))
truffle(development)> directory.getOrganizations()
truffle(development)> directory.add('0xa8c4cbB500da540D9fEd05BE7Bef0f0f5df3e2cc', { from: account })
truffle(development)> directory.getOrganizations()
[ '0x0000000000000000000000000000000000000000',
  '0xa8c4cbB500da540D9fEd05BE7Bef0f0f5df3e2cc' ]
truffle(development)> organization = await OrganizationInterface.at('0xa8c4cbB500da540D9fEd05BE7Bef0f0f5df3e2cc')
truffle(development)> organization.getOrgJsonUri({ from: account })
truffle(development)> organization.getOrgJsonHash({ from: account })
```
