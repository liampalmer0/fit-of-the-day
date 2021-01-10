/**
 *  ML Data Creator
 *
 *  Currently matches each row of temp data with each of the
 *  possible top/bottom outfit combos. Then it
 *  assigns a binary rating based on :
 *    (avg_fit_temp - 10) < day_temp < (avg_fit_temp + 10)
 *
 *
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sequelize = require('../../sequelize');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: path.join(__dirname, '/rated-data.csv'),
  header: [
    { id: 'date', title: 'Date' },
    { id: 'topid', title: 'TopId' },
    { id: 'btmid', title: 'BottomId' },
    { id: 'xname', title: 'CrossName' },
    { id: 'daytemp', title: 'DayTemp' },
    { id: 'maxtemp', title: 'MaxOutfitTemp' },
    { id: 'mintemp', title: 'MinOutfitTemp' },
    { id: 'chosen', title: 'Chosen' }
  ]
});

async function getOutfits() {
  try {
    return await sequelize.query(
      'SELECT ' +
        'tops.article_id as "top_id", ' +
        'bottoms.article_id as "btm_id",' +
        'tops.name as "top_name", ' +
        'bottoms.name as "btm_name",' +
        'tops.temp_min as "t_temp_min",' +
        'tops.temp_max as "t_temp_max", ' +
        'bottoms.temp_min as "b_temp_min",' +
        'bottoms.temp_max as "b_temp_max" ' +
        'FROM article AS "tops" ' +
        'CROSS JOIN ' +
        '(SELECT article_id, "name", temp_min, temp_max, closet_id, garment_type_id FROM article) AS "bottoms" ' +
        'WHERE tops.closet_id=5 ' +
        'AND tops.garment_type_id=1 ' +
        'AND bottoms.closet_id=5 ' +
        'AND bottoms.garment_type_id=2;'
    );
  } catch (err) {
    console.log(err);
  }
}

function run() {
  getOutfits()
    .then((outfitData) => {
      const weather = [];
      const results = { weather, outfits: outfitData[0] };
      return new Promise((resolve, reject) => {
        try {
          fs.createReadStream(path.joing(__dirname, '/temperatures.csv'))
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
    .then(
      (results) =>
        new Promise((resolve) => {
          const combined = [];
          results.weather.forEach((day) => {
            const date = day['Measurement Timestamp'];
            const dayTemp =
              (parseFloat(day['Wet Bulb Temperature']) * 9) / 5 + 32;
            let name;
            let topid;
            let btmid;
            let maxTemp;
            let minTemp;
            let chosen = -1;
            results.outfits.forEach((outfit) => {
              topid = outfit.top_id;
              btmid = outfit.btm_id;
              name = `${outfit.top_name} X ${outfit.btm_name}`;
              maxTemp = (outfit.t_temp_max + outfit.b_temp_max) / 2;
              minTemp = (outfit.t_temp_min + outfit.b_temp_min) / 2;
              // Simple Rating based on avg +/-10 deg
              const avgFitTemp = (maxTemp + minTemp) / 2;
              if (dayTemp < avgFitTemp - 10 || dayTemp > avgFitTemp + 10) {
                chosen = 0;
              } else {
                chosen = 1;
              }
              combined.push({
                date,
                topid,
                btmid,
                xname: name,
                daytemp: dayTemp,
                maxtemp: maxTemp,
                mintemp: minTemp,
                chosen
              });
            });
          });
          resolve(combined);
        })
    )
    .then((data) => {
      csvWriter
        .writeRecords(data)
        .then(() =>
          console.log(
            '..............................................\n' +
              '......______....______...._______....______...\n' +
              '...../  __  \\../  __  \\../  ___  \\../  __  \\..\n' +
              '..../  / /  /./  / /  /./  /../  /./  /_/  /..\n' +
              '.../  /_/  /./  /_/  /./  /../  /./  _____/...\n' +
              '../_______/..\\______/./__/../__/..\\_____/.....\n' +
              '..............................................'
          )
        );
    })
    .catch((err) => {
      console.log(err);
    });
}
run();
