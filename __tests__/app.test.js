const endpointsJson = require("../endpoints.json");
const app = require('../app');
const request = require('supertest');
// const seed = require('../db/seeds/seed');
// const testData = require('../db/data/test-data/index');
// const db = require('../db/connection');

// beforeEach(() => {
//   return seed(testData); // re-seed testData before each test.
// });

// afterAll(() => {
//   return db.end(); // close the database connection after all tests.
// });

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});