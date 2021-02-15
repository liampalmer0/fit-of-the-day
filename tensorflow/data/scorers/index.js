// const scoreColor = require('./colorScorer');
const scoreWeather = require('./weatherScorer');

// const COLOR_WT = 2;
const TEMP_WT = 4;
// const FAV_WT = 2;
const DRESS_WT = 4;

const scoreDressCode = (diff) => {
  if (diff !== 0) {
    return 1 / diff;
  } else {
    return 1;
  }
};

module.exports = (outfit, details) => {
  // let colorScore = 0;
  let dcScore = scoreDressCode(
    Math.abs(outfit.dressCode - outfit.eventDressCode)
  );
  let tempScore = scoreWeather(
    details.dayTemp,
    details.minTemp,
    details.maxTemp
  );

  if (outfit.dirty === 1) {
    return 0;
  }

  //if not the same article (aka not a one piece outfit)
  // if (!outfit.id === outfit.partnerId) {
  //   //then score color
  //   colorScore = scoreColor.scoreAll(details.color, details.partnerColor);
  // } else {
  //   colorScore = 1;
  // }
  // Max score: 10
  return (
    // colorScore * COLOR_WT +
    tempScore * TEMP_WT +
    // outfit.fav * FAV_WT +
    dcScore * DRESS_WT
  );
};
