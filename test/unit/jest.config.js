module.exports = {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.be.json',
      },
    ],
  },
}