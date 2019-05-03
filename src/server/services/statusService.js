const databaseService = require('./dataBaseService');

module.exports = {
  getStatus: async userEmail => {
    const algoAppliedVideos = await databaseService.AlgoProcessVideosOfUser(userEmail);
    const statusResult = await Promise.all(
      algoAppliedVideos.map(async eachVideo => {
        const videoInfo = await databaseService.getVideoInformation(eachVideo.videoUuid);
        const copyResult = JSON.parse(JSON.stringify(eachVideo));
        copyResult.videoName = videoInfo.videoName;
        return copyResult;
      }),
    );
    return statusResult;
  },
};
