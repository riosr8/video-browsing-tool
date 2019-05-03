const _ = require('underscore');
const databaseService = require('./dataBaseService');

module.exports = {
  addOrUpdateAlgorithmToBeProcessed: async (email, videoUuid, algorithmUpdate) => {
    const findResult = await databaseService.findAlgorithmFromDb(videoUuid);
    return new Promise(async (resolve, reject) => {
      if (findResult) {
        const toBeProcessedArray = Array.from(findResult.toBeProcessed);
        algorithmUpdate.forEach(algo => {
          if (
            // eslint-disable-next-line prettier/prettier
            !(
              // eslint-disable-next-line operator-linebreak
              findResult.toBeProcessed.includes(algo) ||
              // eslint-disable-next-line operator-linebreak
              findResult.processed.includes(algo) ||
              findResult.processing.includes(algo)
            )
          ) {
            toBeProcessedArray.push(algo);
          }
        });
        if (!_.isEqual(toBeProcessedArray.sort(), findResult.toBeProcessed.sort())) {
          const updateValue = await databaseService.updateAlgorithmToBeProcessed(
            videoUuid,
            toBeProcessedArray,
          );
          if (updateValue.nModified) {
            resolve({ message: 'Updated the Algorithms to be processed' });
          }
        } else {
          resolve({ message: 'Algos already being processed' });
        }
      } else {
        const saveResult = await databaseService.saveAlgorithmToDb(
          email,
          videoUuid,
          algorithmUpdate,
        );
        if (saveResult.videoUuid === videoUuid) {
          resolve({ message: 'Video sent for processing' });
        }
        reject(new Error('Could not send video for processing, Please try again'));
      }
    });
  },
};
