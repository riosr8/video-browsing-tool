const Video = require('../models/video');
const User = require('../models/user');
const Algorithm = require('../models/algorithm');

module.exports = {
  saveFileToDb: (
    userID,
    fileInfo,
    uuidFileName,
    thumbnailName,
    vidLength,
    vidDescription,
    videoTimeStamp,
  ) => {
    const video = new Video({
      userId: userID,
      videoName: fileInfo,
      videoUuid: uuidFileName,
      videoLength: vidLength,
      videoThumbnail: thumbnailName,
      videoDescription: vidDescription,
      time: videoTimeStamp,
    });
    return video.save();
  },

  getVideoInformation: vidUuid => {
    return new Promise((resolve, reject) => {
      Video.findOne({ videoUuid: vidUuid }, (err, video) => {
        if (err) {
          reject(err);
        }
        if (video !== null) {
          resolve(video);
        } else {
          reject(new Error('Video Mismatched with algorithm process'));
        }
      });
    });
  },
  listAllVideosOfUser: userIdValue => {
    return Video.find({ userId: { $eq: userIdValue } });
  },

  listAllVideosOfUserPagination: async (userIdValue, size, pageNo, sortType, order) => {
    if (
      // eslint-disable-next-line operator-linebreak
      ['videoName', 'videoLength', 'time'].includes(sortType) &&
      ['asc', 'desc'].includes(order)
    ) {
      return {
        totalCount: Math.ceil(
          (await Video.countDocuments({ userId: { $eq: userIdValue } })) / size,
        ),
        results: await Video.find({ userId: { $eq: userIdValue } })
          .skip(size * (pageNo - 1))
          .limit(size)
          .sort({ [sortType]: order }),
      };
    }
    return {
      totalCount: Math.ceil((await Video.countDocuments({ userId: { $eq: userIdValue } })) / size),
      results: await Video.find({ userId: { $eq: userIdValue } })
        .skip(size * (pageNo - 1))
        .limit(size),
    };
  },

  AlgoProcessVideosOfUser: userIdValue => {
    return Algorithm.find({ userId: { $eq: userIdValue } });
  },

  deleteVideo: (userEmail, videoUuidofUser) => {
    return Video.deleteOne({ userId: userEmail, videoUuid: videoUuidofUser });
  },

  saveUserToDb: (emailOfUser, passwordOfUser) => {
    const user = new User({
      email: emailOfUser,
      password: passwordOfUser,
    });
    return user.save();
  },

  checkUserExists: emailOfUser => {
    return new Promise((resolve, reject) => {
      User.findOne({ email: emailOfUser }, (err, user) => {
        if (err) {
          reject(err);
        }
        if (user !== null) {
          resolve({ emailTaken: true });
        } else {
          resolve({ emailTaken: false });
        }
      });
    });
  },

  checkIfVideoBelongsToUser: (emailOfUser, videoId) => {
    return new Promise((resolve, reject) => {
      Video.findOne({ userId: emailOfUser, videoUuid: videoId }, (err, user) => {
        if (err) {
          reject(err);
        }
        if (user !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },

  saveAlgorithmToDb: (email, videoUUid, algorithmicInput) => {
    const algorithm = new Algorithm({
      userId: email,
      videoUuid: videoUUid,
      toBeProcessed: algorithmicInput,
      processed: [],
      processing: [],
    });
    return algorithm.save();
  },

  findAlgorithmFromDb: videoUUid => {
    return new Promise((resolve, reject) => {
      Algorithm.findOne({ videoUuid: videoUUid }, (err, algorithmResult) => {
        if (err) {
          reject(err);
        }
        if (algorithmResult) {
          resolve(algorithmResult);
        } else {
          resolve(null);
        }
      });
    });
  },

  updateAlgorithmToBeProcessed: (videoUUid, algorithmicInput) => {
    return Algorithm.updateOne({ videoUuid: videoUUid }, { toBeProcessed: algorithmicInput });
  },

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

  checkVideoforAlgorithmProcessing: videoUUid => {
    return new Promise((resolve, reject) => {
      Algorithm.findOne({ videoUuid: videoUUid }, (err, video) => {
        if (err) {
          reject(err);
        }
        if (video !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },

  deleteAlgorithmResult: videoUUid => {
    return Algorithm.deleteOne({ videoUuid: videoUUid });
  },
};
