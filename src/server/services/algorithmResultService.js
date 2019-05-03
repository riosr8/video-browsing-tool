const dataBaseService = require('../services/dataBaseService');

const results = [
  {
    key: 'Algorithm 1',
    value: '1',
    text: 'Algorithm 1',
    id: '1',
    result: 'noAuth/algorithmVideo/OutputVideo1.mp4',
    type: 'video',
  },
  {
    key: 'Algorithm 2',
    value: '2',
    text: 'Algorithm 2',
    id: '2',
    result: [
      ['x', ''],
      [0, 0],
      [1, 10],
      [2, 23],
      [3, 17],
      [4, 18],
      [5, 9],
      [6, 11],
      [7, 27],
      [8, 33],
      [9, 40],
      [10, 32],
      [11, 35],
    ],
    type: '2Ddata',
  },
  {
    key: 'Algorithm 3',
    value: '3',
    text: 'Algorithm 3',
    id: '3',
    result: [['Intesity', 'Pixel Count'], [0, 100], [60, 30], [240, 60], [255, 125]],
    type: 'histogram',
  },
];

module.exports = {
  getResults: async videoUUid => {
    const algorithmResult = await dataBaseService.findAlgorithmFromDb(videoUUid);
    if (algorithmResult) {
      const resultArray = algorithmResult.processed.map(element => results[element - 1]);
      return {
        videoUuid: videoUUid,
        results: resultArray,
      };
    }
    return {
      videoUuid: videoUUid,
      results: [],
    };
  },
};
