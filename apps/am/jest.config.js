module.exports = {
  name: 'am',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/am',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
