const algorithmUpdateService = require('./services/algorithmUpdateService');

module.exports = {
  generateAlgorithmOutput: algorithmResult => {
    // console.log(algorithmResult);
    if (algorithmResult.length !== 0) {
      algorithmResult.forEach(async video => {
        video.processed = Array.from(video.toBeProcessed).concat(Array.from(video.processed));
        video.toBeProcessed = [];
        await algorithmUpdateService.updateAlgorithmsFromProcessingServer(
          video.videoUuid,
          [],
          [],
          video.processed,
        );
      });
    }
  },
};
