const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const endPoints = require("../endpoints.json")

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("Should return a 200 status code and an array of topic objects when passed a request for topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topicData } = body;
        expect(topicData.length).toBe(3);
        topicData.forEach((topic) => {
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test('Should return an error 404 and "Not Found" message when passed an invalid query', () => {
    return request(app)
      .get("/api/tropics")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
});
describe("GET /api/", () => {
    test("When requesting the API, simply responds with the details of the various endpoints", () => {
        return request(app)
        .get("/api/")
        .expect(200)
        .then(({ body }) => {
            const apiData  = body;
            console.log(apiData, endPoints)

            expect(apiData).toEqual( endPoints );
        })
    })
})
