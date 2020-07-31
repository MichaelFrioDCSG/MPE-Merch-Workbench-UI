module.exports = {
  name: 'assortment-management',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/assortment-management',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
