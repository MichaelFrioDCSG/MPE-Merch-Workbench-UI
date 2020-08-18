module.exports = {
  name: 'sgm',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/sgm',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
