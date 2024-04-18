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
describe("GET Comments by Article ID", () => {
  test("Returns a status 200 and an array containing comment objects when requested by article ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { commentData } = body;
        expect(commentData.length).toBe(11);
        expect(commentData).toBeSortedBy("created_at", { descending: true });
        commentData.forEach((comment) => {
          expect.objectContaining({
            comment_id: expect.any(String),
            votes: expect.any(String),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(String),
          });
        });
      });
  });
  test("Returns error 400 'Bad Request' when given an invalid request", () => {
    return request(app)
      .get("/api/articles/ilovecommentsme/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("Returns error 404 'Not Found' when given a valid request type which doesn't exists", () => {
    return request(app)
      .get("/api/article/100000/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
});

describe("POST comment by article ID", () => {
  test("Responds with object containing a username and comment when a comment is posted", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "lurker", body: "This is a Test Comment" })
      .expect(201)
      .then(({ body }) => {
        const { commentData } = body;
        expect(commentData).toMatchObject({
          comment_id: 19,
          article_id: 2,
          votes: 0,
          author: "lurker",
          body: "This is a Test Comment",
        });
      });
  });
  test("Responds with 400 bad request when posting a comment from an unknown user", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "senordingdong", body: "ay ay ay senor dingdong!" })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("Responds with 400 bad request when posting a comment to an article which doesn't exist, where the path is a correct datatype (ie. a number)", () => {
    return request(app)
      .post("/api/articles/31416/comments")
      .send({
        username: "lurker",
        body: "I ain't the sharpest tool in the shed",
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("Responds with 400 Bad Request when posting a comment to an article where the path is an invalid data type (eg. a string)", () => {
    return request(app)
      .post("/api/articles/pi/comments")
      .send({
        username: "lurker",
        body: "Bought a pirate copy of Bohemian Rhapsody the other day. Must've been shot in a cinema because every few minutes I see a silhouette of a man.",
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});
describe("PATCH - Increases votes by article_id", () => {
  test("When given a request body with a key of inc_votes and an INT, updates the vote count and returns the updated article with increased vote count", () => {
    return request(app)
      .patch("/api/articles/2")
      .expect(202)
      .send({ inc_votes: 1 })
      .then(({ body }) => {
        const { articleData } = body;
        expect(articleData).toMatchObject({
          votes: 1,
        });
      });
  });
  test("When given a patch request with an incorrect data type to increase votes (a string for example), responds with 400, bad request",()=>{
    return request(app)
  .patch("/api/articles/2")
  .expect(400)
  .send({ inc_votes: "vegetables"})
  .then(({ body }) => {
    const { msg } = body;
    expect(msg).toBe("Bad Request")
  })

})
});
