module.exports = {
  name: 'home',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/home',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
