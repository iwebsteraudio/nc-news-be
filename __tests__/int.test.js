const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const endPoints = require("../endpoints.json");

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
        expect(body).toEqual(endPoints);
      });
  });
});

describe("GET Article by ID", () => {
  test("When requesting an article by its ID, returns status code 200 and an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });
  test("When requesting an article by an ID num which doesn't exist, returns status 404 and message 'Not Found'", () => {
    return request(app)
      .get("/api/articles/45")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article ID Not Found");
      });
  });
  test("When requesting an article by an incorrect data type (eg, a string), returns status 400 and message 'Bad Request'", () => {
    return request(app)
      .get("/api/articles/two")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});
describe("GET API Articles", () => {
  test("Returns status 200 and all articles when requested", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articleData } = body;
        expect(articleData.length).toBe(13);
        articleData.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
      });
  });
  test("Returns status 200 and all articles, with body omitted)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articleData } = body;
        expect(articleData.length).toBe(13);
        articleData.forEach((article) => {
          expect(article).not.toEqual(
            expect.objectContaining({
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("Checks that articles are sorted by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articleData } = body;
        expect(articleData).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("Returns the articles including comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articleData } = body;
        articleData.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({ comment_count: expect.any(String) })
          );
        });
      });
  });
  
});
