/**
 *  ML Data Creator
 *
 *  Currently matches each row of temp data with each of the
 *  possible top/bottom outfit combos. Then it
 *  assigns a binary rating based on :
 *     - Day temperature vs outfit temperature rating
 *     - Dress Code cohesion
 *     - Dress code vs event dress code
 *
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sequelize = require('../../sequelize');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const scoreOutfit = require('./scorers');
const { intToRGB } = require('./scorers/colorScorer');

const csvWriter = createCsvWriter({
  path: path.join(__dirname, '/rated-data.csv'),
  header: [
    { id: 'id', title: 'Id' },
    { id: 'partnerId', title: 'PartnerId' },
    { id: 'dayTemp', title: 'DayTemp' },
    { id: 'tempMax', title: 'TempMax' },
    { id: 'tempMin', title: 'TempMin' },
    { id: 'eventDressCode', title: 'EventDressCode' },
    { id: 'dressCode', title: 'DressCode' },
    { id: 'fav', title: 'Favorite' },
    { id: 'dirty', title: 'Dirty' },
    { id: 'r', title: 'Red' },
    { id: 'g', title: 'Green' },
    { id: 'b', title: 'Blue' },
    // { id: 'pr', title: 'PartnerRed' },
    // { id: 'pg', title: 'PartnerGreen' },
    // { id: 'pb', title: 'PartnerBlue' },
    { id: 'chosen', title: 'Chosen' }
  ]
});

function normalize(val, max, min) {
  if (min === undefined || max === undefined) {
    return val;
  } else {
    return (val - min) / (max - min);
  }
}

async function getOutfits() {
  try {
    return await sequelize.models.article.findAll({
      include: {
        model: sequelize.models.article,
        as: 'partner',
        include: {
          model: sequelize.models.closet,
          required: true,
          where: { closetId: 2 }
        },
        required: true
      }
      // where: { closetId: 2 }
    });
  } catch (err) {
    console.log(err);
  }
}

function run() {
  getOutfits()
    .then(function (outfitData) {
      // console.log(outfitData[0].partner[0]);
      ///////////////////////
      // throw new Error('stop');
      ///////////////////////
      const weather = [];
      const results = { weather, outfits: outfitData.slice(0) };
      return new Promise((resolve, reject) => {
        try {
          fs.createReadStream(path.join(__dirname, '/temperatures.csv'))
            .pipe(csv())
            .on('data', (data) => weather.push(data))
            .on('end', () => {
              resolve(results);
            });
        } catch (err) {
          reject(err);
        }
      });
    })
    .then(function (results) {
      ////////////////////////
      // throw new Error('stop');
      ///////////////////////
      const combined = [];
      results.weather.slice(0).forEach((day) => {
        const date = day['Measurement Timestamp'];
        const dayTemp = (parseFloat(day['Air Temperature']) * 9) / 5 + 32;
        results.outfits.forEach((outfit) => {
          outfit.partner.forEach((partner) => {
            let o = {};
            let dets = { date, dayTemp };

            // Supporting detail data
            dets.maxTemp =
              (outfit.dataValues.tempMax + partner.dataValues.tempMax) / 2;
            dets.minTemp =
              (outfit.dataValues.tempMax + partner.dataValues.tempMin) / 2;
            dets.color = outfit.dataValues.color;
            dets.partnerColor = partner.dataValues.color;
            dets.xname = `${outfit.dataValues.name} X ${partner.dataValues.name}`;

            // Outfit & Day Data
            o.dayTemp = normalize(Math.floor(dayTemp), 125, -25);
            o.tempMax = normalize(Math.floor(dets.maxTemp), 125, -25);
            o.tempMin = normalize(Math.floor(dets.minTemp), 125, -25);
            o.eventDressCode = Math.floor(Math.random() * 3) + 1;
            o.dressCode = Math.min(
              outfit.dataValues.dressCodeId,
              partner.dataValues.dressCodeId
            );
            o.fav = outfit.dataValues.favorite ? 1 : 0;
            o.dirty =
              outfit.dataValues.dirty === 't' ||
              partner.dataValues.dirty === 't'
                ? 1
                : 0;
            o.id = outfit.dataValues.articleId;
            o.partnerId = partner.dataValues.articleId;

            let color = intToRGB(dets.color);
            let pcolor = intToRGB(dets.partnerColor);
            o.r = Math.abs(
              normalize(color.r, 255, 0) - normalize(pcolor.r, 255, 0)
            );
            o.g = Math.abs(
              normalize(color.g, 255, 0) - normalize(pcolor.g, 255, 0)
            );
            o.b = Math.abs(
              normalize(color.b, 255, 0) - normalize(pcolor.b, 255, 0)
            );
            // o.pr = normalize(pcolor.r, 255, 0);
            // o.pg = normalize(pcolor.g, 255, 0);
            // o.pb = normalize(pcolor.b, 255, 0);

            // Score Outfit
            o.chosen = scoreOutfit(o, dets) >= 8 ? 1 : 0;
            combined.push(o);
          });
        });
      });
      // console.log(combined[40]);
      csvWriter.writeRecords(combined);
    })
    .then(function () {
      console.log(
        '..............................................\n' +
          '......______....______...._______....______...\n' +
          '...../  __  \\../  __  \\../  ___  \\../  __  \\..\n' +
          '..../  / /  /./  / /  /./  /../  /./  /_/  /..\n' +
          '.../  /_/  /./  /_/  /./  /../  /./  _____/...\n' +
          '../_______/..\\______/./__/../__/..\\_____/.....\n' +
          '..............................................'
      );
    })
    .catch((err) => {
      console.log(err);
    });
}
run();
