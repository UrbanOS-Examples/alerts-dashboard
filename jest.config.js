module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testRegex: 'src/.*\\.test.ts$',
    coverageReporters: ['json', 'lcov', 'text'],
    reporters: ['default', ['jest-junit', { outputDirectory: 'jest_output' }]],
    setupFilesAfterEnv: ['./jest.setup.redis-mock.js'],
};
