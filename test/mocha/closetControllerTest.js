const { expect } = require('chai');
const controller = require('../../controller/closetController');

const username = 'tester';
// describe('Closet Controller', function () {});

describe('#getCloset', function () {
  it("should return the closet for user 'tester'", async function () {
    const closet = await controller.getCloset(username);
    expect(closet).to.be.an('object');
    expect(closet).to.have.property('dataValues');
    expect(closet.dataValues.closetId).to.be.equal(1);
  });
});

describe('#createWhere', function () {
  it('should create an empty where clause from empty filters', function () {
    const where = controller.createWhere({});
    expect(Object.keys(where)).to.have.lengthOf(0);
  });

  it('should create an empty where clause from default filters', function () {
    const where = controller.createWhere({
      color: '',
      type: '',
      dresscode: '',
      dirty: '',
      tempMin: '-15',
      tempMax: '120'
    });
    expect(Object.keys(where)).to.have.lengthOf(2);
    expect(where).to.have.all.keys(['tempMin', 'tempMax']);
  });

  it('should create a where clause', function () {
    const color = 'red';
    const type = '1';
    const dresscode = '3';
    const dirty = 't';
    const tempMin = '50';
    const tempMax = '100';
    const where = controller.createWhere({
      color: color,
      type: type,
      dresscode: dresscode,
      dirty: dirty,
      tempMin: tempMin,
      tempMax: tempMax
    });
    expect(Object.keys(where)).to.have.lengthOf(6);
    expect(where).to.deep.property('color', color);
    expect(where).to.deep.property('garmentTypeId', type);
    expect(where).to.deep.property('dressCodeId', dresscode);
    expect(where).to.deep.property('dirty', dirty);
    expect(where).to.have.property('tempMin');
    expect(where).to.have.property('tempMax');
  });
});
