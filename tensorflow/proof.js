const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * Read rated data csv file
 * Return array of relevant data
 */
async function cleanData() {
  return new Promise((resolve, reject) => {
    const results = [];
    try {
      fs.createReadStream(path.join(__dirname, '/data/rated-data.csv'))
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          const cleaned = results.map((d) => [
            parseFloat(d.TopId),
            parseFloat(d.BottomId),
            parseFloat(d.DayTemp),
            parseFloat(d.MaxOutfitTemp),
            parseFloat(d.MinOutfitTemp),
            parseFloat(d.Chosen)
          ]);
          resolve(cleaned);
        });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Convert the input data to tensors that we can use for machine
 * learning. Also Shuffle and Normalize.
 * Return train/test input & label tensors & min/max bounds
 * @param {*} data
 */
function convertToTensor(data) {
  return tf.tidy(() => {
    // shuffle
    tf.util.shuffle(data);
    // Separate inputs and labels
    const inputs = data.map((d) => [d[0], d[1], d[2], d[3], d[4]]);
    const labels = data.map((d) => d[5]);
    // Convert to tensors
    const inputTensor = tf.tensor2d(inputs);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
    // Normalize data to range from 0 - 1
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));

    // 80/20 Train/Test Split
    const ct = 5600;
    const trainct = 5600 * 0.8;
    const [trainx, testx] = tf.split(normalizedInputs, [trainct, ct - trainct]);
    const [trainy, testy] = tf.split(normalizedLabels, [trainct, ct - trainct]);
    return {
      inputs: trainx,
      labels: trainy,
      testData: {
        inputs: testx,
        labels: testy
      },
      inputMax,
      inputMin,
      labelMax,
      labelMin
    };
  });
}

/**
 * Create the model architecture to handle the data
 */
function createModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [5] }));
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'relu' }));
  return model;
}

/**
 * Trains the model with the given training data
 * @param {tf.Sequential} model
 * @param {Tensor} inputs
 * @param {Tensor} labels
 */
async function train(model, inputs, labels) {
  const config = {
    shuffle: true,
    batchSize: 200,
    epochs: 5
  };
  // Train
  for (let i = 0; i < 100; i += 1) {
    await model.fit(inputs, labels, config);
  }
}

function run() {
  cleanData()
    .then(async (cleaned) => {
      const tensors = convertToTensor(cleaned);
      const model = createModel();
      model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError
      });
      console.log(tf.memory().numTensors);
      await train(model, tensors.inputs, tensors.labels);
      return { model, testData: tensors.testData };
    })
    .then(async (result) => {
      const { model } = result;
      const { testData } = result;
      const preds = model.predict(testData.inputs);
      const predAr = await preds.data();
      const labelAr = await testData.labels.data();
      let right = 0;
      let wrong = 0;
      let total = 0;
      for (let i = 0; i < labelAr.length; i++) {
        if (
          (labelAr[i] === 1 && predAr[i] > 0.8) ||
          (labelAr[i] === 0 && predAr[i] < 0.2)
        ) {
          right++;
        } else {
          wrong++;
        }
        total++;
      }
      console.log(
        'Prediction Results:\n' +
          `Right:${Math.round((right / total) * 100)}%\n` +
          `Wrong:${Math.round((wrong / total) * 100)}%`
      );
      await model.save(path.join('file:///', __dirname, '/robo-cher'));
    })
    .catch((err) => {
      console.log(err);
    });
}
tf.setBackend('cpu');
tf.tidy(() => {
  run();
});
