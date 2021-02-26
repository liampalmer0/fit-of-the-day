//-- removed from package.json ---------------//
const tf = require('@tensorflow/tfjs'); //
require('@tensorflow/tfjs-node'); //
//---------------------------------------//

const prep = require('./data/prepare');
const path = require('path');

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
    const inputs = data.map((d) => [d[2], d[3], d[4], d[5], d[6], d[8]]);
    const labels = data.map((d) => d[12]);
    // Convert to tensors
    const inputTensor = tf.tensor2d(inputs);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);
    // // Normalize data to range from 0 - 1
    // const inputMax = inputTensor.max();
    // const inputMin = inputTensor.min();
    // const labelMax = labelTensor.max();
    // const labelMin = labelTensor.min();
    // const normalizedInputs = inputTensor;
    // const normalizedLabels = labelTensor;
    // normalize each feature between min and max
    // const normalizedInputs = inputTensor
    //   .sub(inputMin)
    //   .div(inputMax.sub(inputMin));
    // const normalizedLabels = labelTensor
    //   .sub(labelMin)
    //   .div(labelMax.sub(labelMin));

    // 80/20 Train/Test Split
    const ct = 23072;
    const trainct = Math.ceil(ct * 0.8);
    const [trainx, testx] = tf.split(inputTensor, [trainct, ct - trainct]);
    const [trainy, testy] = tf.split(labelTensor, [trainct, ct - trainct]);
    return {
      inputs: trainx,
      labels: trainy,
      testData: {
        inputs: testx,
        labels: testy
      }
      // inputMax,
      // inputMin,
      // labelMax,
      // labelMin
    };
  });
}

/**
 * Create the model architecture to handle the data
 */
function createModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, inputShape: [6] }));
  model.add(tf.layers.dense({ units: 5 }));
  model.add(tf.layers.dense({ units: 1 }));
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
    batchSize: 32,
    epochs: 85
  };
  // Train
  await model.fit(inputs, labels, config);
}

function run() {
  prep(path.join(__dirname, '/data/rated-data.csv'))
    .then(async function (cleaned) {
      const tensors = convertToTensor(cleaned);
      const model = createModel();
      model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['accuracy']
      });
      console.log(tf.memory().numTensors);
      tensors.inputs.print();
      // throw new Error("Stops");
      await train(model, tensors.inputs, tensors.labels);
      // return { model, testData: tensors.testData };
      // const { model } = result;
      // const { testData } = result;
      const testData = tensors.testData;
      const preds = model.predict(testData.inputs);
      preds.print();
      const evaluations = model.evaluate(testData.inputs, testData.labels);
      // const predAr = await preds.data();
      // const labelAr = await testData.labels.data();
      console.log('Evaluating Test Data');
      console.log(`Loss: ${evaluations[0].print()}`);
      console.log(`Accuracy: ${evaluations[1].print()}`);
      for (let i = 0; i < 100; i++) {
        console.log('Comparison of 0-99');
        console.log(
          `Label: ${testData.inputs[i].print()}\nPred:  ${preds[i].print()}`
        );
      }
      await model.save('file:///' + __dirname + '/robo-cher');
    })
    .catch((err) => {
      console.log(err);
    });
}
// tf.setBackend('cpu');
tf.tidy(() => {
  run();
});
