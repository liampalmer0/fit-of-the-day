const { expect } = require('chai');
const rec = require('../../api/recommender');

const username = 'tester';

describe('Recommender', function () {
  describe('#getRandomRecommendations(username)', function () {
    it("should return array of 3 outfits for the user 'tester'", async function () {
      const outfits = await rec.recRand(username);
      expect(outfits).to.have.lengthOf(3);
      expect(outfits[0]).to.have.all.keys('top', 'bottom');
    });
  });
});
