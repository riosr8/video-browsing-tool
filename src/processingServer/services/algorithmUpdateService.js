const Algorithm = require('../models/algorithm');

module.exports = {
  updateAlgorithmsFromProcessingServer: (
    videoUUid,
    toBeProcessedArray,
    processingArray,
    processedArray,
  ) => {
    return Algorithm.updateOne(
      { videoUuid: videoUUid },
      { toBeProcessed: toBeProcessedArray, processing: processingArray, processed: processedArray },
    );
  },
};
