'use strict';


var chai = require('chai');
var assert = chai.assert;

var WTKeysRegistry = artifacts.require('../contracts/WTKeysRegistry.sol');

var augustoKey, hotelKey;

const DEBUG = true;

contract('WTKeysRegistry', function(accounts) {

  var keysRegistry;

  beforeEach( async function() {

    keysRegistry = await WTKeysRegistry.new();
    augustoKey = {
      userId: "augusto@windingtree.com",
      publicKey: "pubKey111"
    };
    hotelKey = {
      userId: "wthotel@windingtree.com",
      publicKey: "pubKey222"
    };

  });

  it('Should register new keys and edit one of them.', async function() {

    var oldPubKey;

    await keysRegistry.register(augustoKey.userId, augustoKey.publicKey, {from: accounts[1]});
    await keysRegistry.register(hotelKey.userId, hotelKey.publicKey, {from: accounts[2]});

    assert.equal(augustoKey.publicKey, await keysRegistry.getKey(augustoKey.userId));
    assert.equal(hotelKey.publicKey, await keysRegistry.getKey(hotelKey.userId));
    oldPubKey = hotelKey.publicKey;
    hotelKey = {
      userId: "wthotel@windingtree.com",
      publicKey: "pubKey333"
    };
    assert.notEqual(oldPubKey, hotelKey.publicKey);
    await keysRegistry.edit(hotelKey.publicKey, {from: accounts[2]});

    assert.equal(augustoKey.publicKey, await keysRegistry.getKey(augustoKey.userId));
    assert.equal(hotelKey.publicKey, await keysRegistry.getKey(hotelKey.userId));

  });

});
