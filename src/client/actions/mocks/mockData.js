const mockData = {
  authLoginResponse: {
    email: 'test@gmail.com',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3Q2QGdtYWlsLmNvbSIsInBhc',
    expiresIn: 3600000,
  },
  authErrorLoginResponse: {
    message: 'Something is not right',
    userData: false,
  },
  authData: {
    email: 'rukayat@gmail.com',
    password: 'oriyomi123',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3Q2QGdtYWlsLmNvbSIsInBhc',
  },
  testError: 'An error has happend',
  error: 'Request failed with status code 400',
  fetchVideosResponse: {
    totalCount: 1,
    results: [
      {
        _id: '5cc671dfdb58410011e13460',
        userId: 'test@gmail.com',
        videoName: 'g',
        videoUuid: '7f48a53a-f5a7-4c66-8011-3210f83009a1big_buck_bunny.mp4',
        videoLength: '60.095',
        videoThumbnail: '7f48a53a-f5a7-4c66-8011-3210f83009a1big_buck_bunny.png',
        videoDescription: '',
        __v: 0,
      },
    ],
  },
  uploadVideoResponse: {
    userId: 'test@gmail.com',
    videoName: 'cc123084-ada6-4440-b4f7-0ae73d04018bbig_buck_bunny.mp4',
    videoUuid: 'cc123084-ada6-4440-b4f7-0ae73d04018bbig_buck_bunny.mp4',
    videoLength: '60.095',
    videoThumbnail: 'cc123084-ada6-4440-b4f7-0ae73d04018bbig_buck_bunny.png',
  },
  fetchResultResponse: {
    results: [],
  },
  deleteVideoResponse: {
    message: 'message',
  },
  processingRequestResponse: {
    message: 'Success',
  },
  pollStatusResponse: [
    {
      toBeProcessed: [],
      processed: ['Algorithm 2', 'Algorithm 3', 'Algorithm 1'],
      processing: [],
      _id: '5ca43317e04d0b0037360113',
      videoUuid: '4bfe8a99-b6bc-44f0-b92d-9451dff10ca1big_buck_bunny.mp4',
      __v: 0,
    },
    {
      toBeProcessed: [],
      processed: ['Algorithm 1'],
      processing: [],
      _id: '5ca43349e04d0b0037360114',
      videoUuid: '11d775ee-e5f3-4f10-8e55-c7895d07cd68big_buck_bunny.ogv',
      __v: 0,
    },
  ],
  algorithmAvailableRespose: {
    algorithms: [
      {
        id: 1,
        name: 'Algorithm 1',
        description: 'Performs face detection on the Video',
      },
      {
        id: 2,
        name: 'Algorithm 2',
        description: 'Performs dog detection on the Video',
      },
      {
        id: 3,
        name: 'Algorithm 3',
        description: 'Detects objects with red color in the Video',
      },
    ],
  },
  resultsResponse: {
    videoUuid: 'e4b508db-5b7d-44f1-92d3-0aaa070bc510big_buck_bunny.mp4',
    results: [
      {
        key: 'Algorithm 3',
        value: '3',
        text: 'Algorithm 3',
        id: '3',
        result: [['Intesity', 'Pixel Count'], [0, 100], [60, 30], [240, 60], [255, 125]],
        type: 'histogram',
      },
    ],
  },
};

export default mockData;
