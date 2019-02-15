module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverageFrom: [
        "src/**"
    ],
    setupFilesAfterEnv: [
        "<rootDir>/test/jest-setup.js"
    ]
};
