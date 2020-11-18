var assert = require('assert');
var rec = require('../../api/recommender');

const username = 'liam';

describe('Random Recommendation', function () {
  describe('#getRandomRecommendations', function () {
    it('should return array of 3 outfit objects', async function () {
      let outfits = await rec.recRand(username);
      assert.strictEqual(outfits.length, 3);
      assert.ok(outfits[0].top, 'index 0 missing top');
      assert.ok(outfits[0].bottom, 'index 0 missing bottom');
    });
  });
});
