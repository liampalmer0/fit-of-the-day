const fs = require('fs');
const csv = require('csv-parser');

module.exports = function (filepath) {
  /**
   * Read rated data csv file
   * Return array of relevant data
   */
  return new Promise((resolve, reject) => {
    const results = [];
    try {
      fs.createReadStream(filepath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          const cleaned = results.map((d) => [
            parseFloat(d.Id), //[0]
            parseFloat(d.PartnerId),
            parseFloat(d.DayTemp), //[2]
            parseFloat(d.TempMax),
            parseFloat(d.TempMin),
            parseFloat(d.EventDressCode),
            parseFloat(d.DressCode), //[6]
            parseFloat(d.Favorite),
            parseFloat(d.Dirty), //[8]
            parseFloat(d.Red),
            parseFloat(d.Green),
            parseFloat(d.Blue), //[11]
            // parseFloat(d.PartnerRed),
            // parseFloat(d.PartnerGreen),
            // parseFloat(d.PartnerBlue),
            parseFloat(d.Chosen) //[14]
          ]);
          resolve(cleaned);
        });
    } catch (err) {
      reject(err);
    }
  });
};
