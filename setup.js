// faker/setup.js
const faker = require('faker');

// Set Faker seed to ensure consistent data
faker.seed(123);

// Optionally, you can configure other Faker settings here

// Export Faker to make it available in your tests
global.faker = faker;