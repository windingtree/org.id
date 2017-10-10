const assert = require('chai').assert;
const help = require('./helpers/index.js');
const abiDecoder = require('abi-decoder');

const Images = artifacts.require('Images.sol');

contract('Images', function(accounts) {
  let images;
  const nonOwnerAccount = accounts[1];

  beforeEach(async function() {
    images = await Images.new();
  })

  describe('addImage / removeImage', function(){
    const image1 = 'http://wthotel.com/image1';
    const image2 = 'http://wthotel.com/image2';
    const image3 = 'http://wthotel.com/image1';

    it('should add and remove images', async function() {
      await images.addImage(image1);
      await images.addImage(image2);

      let imagesLength = await images.getImagesLength();
      let imagesArray = await help.jsArrayFromSolidityArray(images.images, parseInt(imagesLength), help.isZeroString);

      const found1 = imagesArray.findIndex(item => item === image1);
      const found2 = imagesArray.findIndex(item => item === image2);
      assert.notEqual(found1, -1);
      assert.notEqual(found2, -1);

      await images.removeImage(1);

      imagesLength = await images.getImagesLength();
      imagesArray = await help.jsArrayFromSolidityArray(images.images, parseInt(imagesLength), help.isZeroString);

      const notFound = imagesArray.findIndex(item => item === image2);
      assert.equal(notFound, -1);
    });

    it('should throw if non-owner adds and removes images', async function() {
      // Add one image legitimately
      await images.addImage(image1);

      let imagesLength = await images.getImagesLength();
      let imagesArray = await help.jsArrayFromSolidityArray(images.images, parseInt(imagesLength), help.isZeroString);
      const found1 = imagesArray.findIndex(item => item === image1);
      assert.notEqual(found1, -1);

      // Non-owner add
      try{
        await images.addImage(image1, {from: nonOwnerAccount});
        assert(false);
      } catch(e){
        assert(help.isInvalidOpcodeEx(e));
      }

      // Non-owner remove at index 0
      try {
        await images.removeImage(0, {from: nonOwnerAccount})
        assert(false);
      } catch(e){
        assert(help.isInvalidOpcodeEx(e));
      }
    });
  });
})
