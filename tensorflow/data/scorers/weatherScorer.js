module.exports = (dayTemp, minTemp, maxTemp) => {
  // const avgFitTemp = (maxTemp + minTemp) / 2;
  // const diff = Math.abs(maxTemp - minTemp);
  // if day temp is between min and max
  if (dayTemp <= maxTemp && dayTemp >= minTemp) {
    // // and day temp is within the +/- 1/2 max-min
    // if (dayTemp > avgFitTemp - diff / 2 && dayTemp < avgFitTemp + diff / 2) {
    //   if (dayTemp > avgFitTemp - diff / 3 && dayTemp < avgFitTemp + diff / 3) {
    //     return 1;
    //   } else {
    //     return 0.9;
    //   }
    // } else {
    //   return 0.75;
    // }
    return 1;
  } else {
    return 0;
  }
};
