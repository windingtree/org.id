'use strict';


var chai = require('chai');
var assert = chai.assert;

var WTKeyIndex = artifacts.require('../contracts/WTKeyIndex.sol');

var augustoKey, hotelKey;

const DEBUG = true;

contract('WTKeyIndex', function(accounts) {

  var keyIndex;

  beforeEach( async function() {

    keyIndex = await WTKeyIndex.new();
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

    await keyIndex.register(augustoKey.userId, augustoKey.publicKey, {from: accounts[1]});
    await keyIndex.register(hotelKey.userId, hotelKey.publicKey, {from: accounts[2]});

    assert.equal(augustoKey.publicKey, await keyIndex.getKey(augustoKey.userId));
    assert.equal(hotelKey.publicKey, await keyIndex.getKey(hotelKey.userId));
    oldPubKey = hotelKey.publicKey;
    hotelKey = {
      userId: "wthotel@windingtree.com",
      publicKey: "pubKey333"
    };
    assert.notEqual(oldPubKey, hotelKey.publicKey);
    await keyIndex.edit(hotelKey.publicKey, {from: accounts[2]});

    assert.equal(augustoKey.publicKey, await keyIndex.getKey(augustoKey.userId));
    assert.equal(hotelKey.publicKey, await keyIndex.getKey(hotelKey.userId));

  });

});
