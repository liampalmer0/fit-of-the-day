var assert = require('assert');
var rec = require('../../api/recommender');

const username = 'lamp';

describe('Recommender', function () {
  describe('#getRandomRecommendations(username)', function () {
    it("should return array of 3 outfits for the user 'lamp'", async function () {
      let outfits = await rec.recRand(username);
      assert.strictEqual(outfits.length, 3);
      assert.ok(outfits[0].top, 'index 0 missing top');
      assert.ok(outfits[0].bottom, 'index 0 missing bottom');
    });
  });
});
