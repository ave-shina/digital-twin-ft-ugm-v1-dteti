const scenesArray = [
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0002.JPG',
    hotSpotsArr: [{ pitch: -9.06119427236566, yaw: -92.7752861238165, transition: '1' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0003.JPG',
    hotSpotsArr: [
      { pitch: -50.943576619160616, yaw: -174.6239076277068, transition: '0' },
      { pitch: -20.48368170929848, yaw: -10.26897749453302, transition: '2' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0004.JPG',
    hotSpotsArr: [
      { pitch: -51.354378017934465, yaw: -114.99647316748677, transition: '1' },
      { pitch: -32.04864037095439, yaw: 105.75612299400693, transition: '3' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0005.JPG',
    hotSpotsArr: [
      { pitch: -61.515517638156936, yaw: -89.62933053936968, transition: '2' },
      { pitch: -44.340189935473624, yaw: 114.24810880578256, transition: '4' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0006.JPG',
    hotSpotsArr: [
      { pitch: -50.60547826403342, yaw: -68.50578897358503, transition: '3' },
      { pitch: -21.445411866038445, yaw: 18.734768298585195, transition: '14' },
      { pitch: -25.396550463052737, yaw: -159.43136599930847, transition: '5' },
      { pitch: -36.54149207590692, yaw: 114.36635832002642, transition: '11' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0007.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: 160, transition: '4' },
      { pitch: -17.5, yaw: 125, transition: '6' },
      { pitch: -17.5, yaw: -22.5, transition: '8' },
      { pitch: -17.5, yaw: 45, transition: '9' },
      { pitch: -17.5, yaw: -80, transition: '10' },
      { pitch: -17.5, yaw: 90, transition: '7' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0008.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: -60, transition: '5' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0009.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: -105, transition: '5' },
      { pitch: -17.5, yaw: 100, transition: '72' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0010.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: -157.5, transition: '5' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0011.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: -165, transition: '5' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0012.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: -145, transition: '5' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0013.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: -90, transition: '4' },
      { pitch: -17.5, yaw: 22.5, transition: '15' },
      { pitch: -17.5, yaw: 100, transition: '12' },
      { pitch: -17.5, yaw: 65, transition: '14' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0014.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: 10, transition: '11' },
      { pitch: -17.5, yaw: 112.5, transition: '13' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0015.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: -170, transition: '12' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0016.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: 160, transition: '11' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0017.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: 112.5, transition: '11' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0018.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: -160, transition: '4' },
      { pitch: -17.5, yaw: -67, transition: '30' },
      { pitch: -17.5, yaw: 95, transition: '17' },
      { pitch: -17.5, yaw: 15, transition: '22' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0019.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: -90, transition: '16' },
      { pitch: -17.5, yaw: -180, transition: '18' },
      { pitch: -17.5, yaw: 50, transition: '20' },
      { pitch: -17.5, yaw: 112.5, transition: '19' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0020.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: -67, transition: '17' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0021.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: -135, transition: '17' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0022.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: -120, transition: '17' },
      { pitch: -17.5, yaw: 135, transition: '21' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0023.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: -90, transition: '19' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0024.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: -70, transition: '29' },
      { pitch: -17.5, yaw: -160, transition: '16' },
      { pitch: -17.5, yaw: -20, transition: '27' },
      { pitch: -17.5, yaw: 22.5, transition: '26' },
      { pitch: -17.5, yaw: 45, transition: '23' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0025.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: -130, transition: '22' },
      { pitch: -17.5, yaw: -67, transition: '27' },
      { pitch: -17.5, yaw: -22.5, transition: '26' },
      { pitch: -17.5, yaw: 112.5, transition: '24' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0026.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: -110, transition: '23' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0027.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: -90, transition: '23' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0028.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: -90, transition: '22' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0029.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: 0, transition: '28' },
      { pitch: -17.5, yaw: -157.5, transition: '22' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0030.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: 90, transition: '27' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0031.JPG',
    hotSpotsArr: [{ pitch: -17.5, yaw: 70, transition: '22' }],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0032.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: 45, transition: '16' },
      { pitch: -17.5, yaw: -165, transition: '31' },
      { pitch: -17.5, yaw: 165, transition: '73' },
    ],
  },
  {
    sceneName: 'smallRoom',
    scenePanoImg: 'https://fridayphotos.s3.eu-central-1.amazonaws.com/test_photoset/0033.JPG',
    hotSpotsArr: [
      { pitch: -17.5, yaw: -110, transition: '30' },
      { pitch: -17.5, yaw: 40, transition: '74' },
    ],
  },
]

export default scenesArray
