const intToRGB = (intColor) => {
  let hex = intColor.toString(16).padStart(6, '0');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  };
};
const withinRange = (base, range, test) => {
  let low = base - range;
  let high = base + range;
  if (test <= high && test >= low) {
    return true;
  } else {
    return false;
  }
};
const isNeutral = (r, g, b) => {
  if (r === g && g === b) {
    //true neutral
    return true;
  } else {
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let diff = max - min;
    if (diff < min / 8) {
      //close to neutral
      return true;
    } else {
      return false;
    }
  }
};
// calculate luma of rgb using bitwise operation
const getLuma = (r, g, b) => (r + r + r + b + g + g + g + g) >> 3;

// normalized difference of two luma values
const scoreContrast = (a, b) =>
  Math.abs(getLuma(a.r, a.g, a.b) - getLuma(b.r, b.g, b.b)) / 255;

const scoreComplement = (a, b) => {
  let score = 0;
  let aInverse = [255 - a.r, 255 - a.g, 255 - a.b];
  if (
    withinRange(aInverse[0], 64, b.r) &&
    withinRange(aInverse[0], 64, b.g) &&
    withinRange(aInverse[0], 64, b.b)
  ) {
    // 20%
    score++;
    if (
      withinRange(aInverse[0], 32, b.r) &&
      withinRange(aInverse[0], 32, b.g) &&
      withinRange(aInverse[0], 32, b.b)
    ) {
      // 40%
      score++;
      if (
        withinRange(aInverse[0], 16, b.r) &&
        withinRange(aInverse[0], 16, b.g) &&
        withinRange(aInverse[0], 16, b.b)
      ) {
        // 60%
        score++;
        if (
          withinRange(aInverse[0], 8, b.r) &&
          withinRange(aInverse[0], 8, b.g) &&
          withinRange(aInverse[0], 8, b.b)
        ) {
          // 80%
          score++;
          if (
            aInverse[0] === b.r &&
            aInverse[0] === b.g &&
            aInverse[0] === b.b
          ) {
            // 100% Exact match
            score++;
          }
        }
      }
    }
  }
  return score / 5;
};

const scoreSimilarity = (a, b) => {
  if (a.r === b.r && a.g === b.g && a.b === b.b) {
    // is same color
    return 1;
  } else {
    // percent matching for each color
    let rErr = 1 - (a.r - b.r) / b.r;
    let gErr = 1 - (a.g - b.g) / b.g;
    let bErr = 1 - (a.b - b.b) / b.b;
    return (rErr + gErr + bErr) / 3;
  }
};
const scoreAll = (aColor, bColor) => {
  let a = intToRGB(aColor);
  let b = intToRGB(bColor);
  let contrast = scoreContrast(a, b);
  let sim = scoreSimilarity(a, b);
  let comp = scoreComplement(a, b);

  // Return whichever score is higher
  return Math.max(comp, sim, contrast);
};
module.exports = {
  intToRGB,
  scoreAll,
  scoreComplement,
  scoreSimilarity,
  scoreContrast,
  getLuma,
  isNeutral
};
