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

describe("GET /api", () => {
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
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
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
            expect.objectContaining({ comment_count: expect.any(Number) })
          );
        });
      });
  });
  test("When given a sort_by query for comment_count, returns all articles sorted by most comments", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        const { articleData } = body;
        expect(articleData).toBeSortedBy("comment_count", {
          descending: true,
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
      .expect(200)
      .send({ inc_votes: 1 })
      .then(({ body }) => {
        const { articleData } = body;
        expect(articleData).toMatchObject({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 1,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("When given a patch request with an incorrect data type to increase votes (a string for example), responds with 400, bad request", () => {
    return request(app)
      .patch("/api/articles/2")
      .expect(400)
      .send({ inc_votes: "vegetables" })
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  test("When given a patch request for an invalid or non-existant article id, returns 400, bad request", () => {
    return request(app)
      .patch("/api/articles/1000000000000000")
      .expect(400)
      .send({ inc_votes: 1 })
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});
describe("PATCH - Increase votes by comment_id", () => {
  test("When given a request body with a key of inc_votes and an INT, updates the vote count and returns the updated comment with increased vote count", () => {
    return request(app)
    .patch("/api/comments/1")
    .expect(200)
    .send({ inc_votes: 1 })
    .then(({ body }) => {
      const { commentData } = body;
      expect(commentData).toMatchObject({
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 17,
        author: "butter_bridge",
        article_id: 9,
        created_at: "2020-04-06T12:17:00.000Z",
      });
    });
  });
  test("When given a request body with a key of inc_votes and a String, returns 400, bad request", () => {
    return request(app)
    .patch("/api/comments/1")
    .expect(400)
    .send({ inc_votes: "dennis" })
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Bad Request");
    });
  });
  test("When given a request body with a key of inc_votes and a String, but comment_id is incorrect data, returns 400, Bad Request", () => {
    return request(app)
    .patch("/api/comments/vegetables")
    .expect(400)
    .send({ inc_votes: 1 })
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Bad Request");
    });
  });
  test("When given a request body with a key of inc_votes and a String, but comment_id doesn't exist , returns 404, Not Found", () => {
    return request(app)
    .patch("/api/comments/1000000000")
    .expect(404)
    .send({ inc_votes: 1 })
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("comment not found");
    });
  });
});
describe("GET API Users", () => {
  test("Should return status 200 and an array containing all user objects", () => {
    return request(app)
    .get("/api/users/")
    .expect(200)
    .then(({ body }) => {
      const { userData } = body;
      expect(userData.length).toBe(4);
      userData.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
    });
  });
});

describe("GET API Articles by id Comment count", () => {
  test("Adds a comment count to articles by id request", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body }) => {
      const { article } = body;
      expect.objectContaining({
        comment_count: "11",
      });
    });
  });
  test("Receives error 404 not found when given an incorrect article id number", () => {
    return request(app)
    .get("/api/articles/100")
    .expect(404)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Article ID Not Found");
    });
  });
  test("Receives error 400 bad request when given an incorrect article id number", () => {
    return request(app)
    .get("/api/articles/dennis")
    .expect(400)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Bad Request");
    });
  });
});
describe("GET user by username", () => {
  test("When given a request for a user profile by username, responds with user object", () => {
    return request(app)
    .get("/api/users/lurker")
    .expect(200)
    .then(({ body }) => {
      const { userData } = body;
      expect(userData).toMatchObject({
        username: "lurker",
        name: "do_nothing",
        avatar_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      });
    });
  });
  test("When given a request for a non-existent user, returns 404 not found", () => {
    return request(app)
    .get("/api/users/tomflippantname")
    .expect(404)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("User Not Found");
    });
  });
});
describe("POST new article", () => {
  test("When a user posts a new article, returns an object containing article, article_id, topic, votes, comments and user", () => {
    return request(app)
    .post("/api/articles/")
    .send({
      author: "lurker",
      title: "Eddie is a good boy",
      body: "A very good boy, indeed. He is, however, a non-cat",
      article_img_url: "https://i.imgur.com/jsvTeiP.jpeg",
      topic: "cats",
    })
    .expect(201)
    .then(({ body }) => {
      const { articleData } = body;
      expect(articleData).toMatchObject({
        article_id: expect.any(Number),
        title: "Eddie is a good boy",
        author: "lurker",
        topic: "cats",
        body: "A very good boy, indeed. He is, however, a non-cat",
        votes: 0,
        article_img_url: "https://i.imgur.com/jsvTeiP.jpeg",
      });
      expect(new Date(articleData.created_at).toString()).not.toBe(
        "Invalid Date"
      );
    });
  });
  test("When a user posts a new article with no body, returns error", () => {
    return request(app)
    .post("/api/articles/")
    .send({
      author: "lurker",
      title: "Mr No Body",
      body: null,
      article_img_url: null,
      topic: "cooking",
    })
    .expect(400)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Bad Request");
    });
  });
  test("When a user posts a new article with an non-existent topic, returns error", () => {
    return request(app)
    .post("/api/articles/")
    .send({
      author: "lurker",
      title: "Caaats. What arre thheyy?",
      body: "I'm affrraaid this is going to faaaail",
      article_img_url: null,
      topic: "crats",
    })
    .expect(400)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Bad Request");
    });
  });
});
describe("GET API Articles, limited by query", () => {
  test("When GET request made for articles, with pagination limits set in query, responds with that number of articles", () => {
    return request(app)
    .get("/api/articles?limit=10")
    .expect(200)
    .then(({ body }) => {
      const { articleData } = body;
      expect(articleData.length).toBe(10);
      expect(articleData[0].total_count).toBe("13");
    });
  });
  test("When GET request made for articles, with pagination limits set in query, AND p specified as 1, returns page 2 of test articles", () => {
    return request(app)
    .get("/api/articles?limit=10&p=2")
    .expect(200)
    .then(({ body }) => {
      const { articleData } = body;
      expect(articleData.length).toBe(3);
    });
  });
  test("When GET request made for articles, with pagination query set as incorrect data format, gives 400, bad request", () => {
    return request(app)
    .get("/api/articles?limit=dennis")
    .expect(400)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Bad Request");
    });
  });
  test("When GET request made for articles, with pagination query set to a later page than exists, gives 404, not found", () => {
    return request(app)
    .get("/api/articles?limit=10&p=4")
    .expect(404)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Not Found");
    });
  });
});
describe("GET API Comments by Article ID, limited by query", () => {
  test("When GET request made for comments, with pagination limits set in query, responds with that number of comments", () => {
    return request(app)
    .get("/api/articles/1/comments?limit=10")
    .expect(200)
    .then(({ body }) => {
      const { commentData } = body;
      expect(commentData.length).toBe(10);
    });
  });
  test("When GET request made for API Comments by Article ID, with pagination limits set in query, AND p specified as 1, returns page 2 of test comments", () => {
    return request(app)
    .get("/api/articles/1/comments?limit=10&p=2")
    .expect(200)
    .then(({ body }) => {
      const { commentData } = body;
      expect(commentData.length).toBe(1);
    });
  });
  test("When GET request made for API Comments by Article ID, with pagination query set as incorrect data format, gives 400, bad request", () => {
    return request(app)
    .get("/api/articles/1/comments?limit=dennis")
    .expect(400)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Bad Request");
    });
  });
  test("When GET request made for API Comments by Article ID, with pagination query set to a later page than exists, gives 404, not found", () => {
    return request(app)
    .get("/api/articles/1/comments?limit=10&p=4")
    .expect(404)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Not Found");
    });
  });
});
describe("POST new topic",()=>{
  test("When POST request made for a new topic, returns status 200 and a topic object",()=>{
    return request(app)
    .post(`/api/topics/`)
    .send({
      slug: "Dogs",
      description : "Not Cats"
    })
    .expect(201)
    .then(({body})=>{
      const {topicData} = body;
      expect(topicData).toMatchObject({
        slug: "Dogs",
        description : "Not Cats"
      })
    })
  })
  test("When POST request made for new topic with blank object, returns 400 Bad Request",()=>{
    return request(app)
    .post(`/api/topics/`)
    .send({})
    .expect(400)
    .then(({body})=>{
      const {msg} = body;
      expect(msg).toBe("Bad Request")
    })
  })
  test("When POST request made for new topic which matches existing topic (regardless of case), returns 409, Conflict", ()=>{
    return request(app)
    .post(`/api/topics/`)
    .send({
      slug: "Cats",
      description: "Not dogs"
    })
    .expect(409)
    .then(({body})=>{
      const {msg} = body;
      expect(msg).toBe("Conflict")
    })
  })
})
describe("DELETE comment by comment id", () => {
  test("When given a delete request and a comment_id, deletes that comment", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("When given a delete request for a comment id which doesn't exist, returns 404 Not Found", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("comment not found");
      });
  });
  test("When given an invalid id, returns 400, Bad Request", () => {
    return request(app)
      .delete("/api/comments/NaN")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});
describe("DELETE article by article ID",()=>{
  test("When given a delete request for articles by article id, removes the article and sends 204 status",()=>{
    return request(app)
    .delete("/api/articles/1").expect(204);
  })
  test("When given a delete request for an article id which doesn't exist, returns 404 Not Found", () => {
    return request(app)
      .delete("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("article not found");
      });
  });
  test("When given an invalid id, returns 400, Bad Request", () => {
    return request(app)
      .delete("/api/articles/NaN")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
})
describe("GET API Articles by topic query", () => {
  test("Responds with 200 and an array of all articles, filtered by topic query", () => {
    return request(app)
    .get("/api/articles?topic=cats")
    .expect(200)
    .then(({ body }) => {
      const { articleData } = body;
      expect(articleData.length).toBe(1);
      articleData.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
    });
  });
  test("Responds with 404 - Not Found when given an invalid query", () => {
    return request(app)
    .get("/api/articles?topic=match")
    .expect(404)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("Not Found");
    });
  });
  test("Responds with 200 and empty array if given a valid topic with no articles", () => {
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then(({ body }) => {
      const { articleData } = body;
      expect(articleData.length).toBe(0);
    });
  });
});
describe("GET topic articles", () => {
  test("When given a request for all articles by topic, responds with all articles by topic", () => {
    return request(app)
    .get("/api/topics/cats/articles")
    .expect(200)
    .then(({ body }) => {
      const { articleData } = body;
      expect.objectContaining({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: "cats",
        author: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      });
    });
  });
  test("When articles requested by topic and given query to sort by votes, returns 200 and an array of articles sorted by votes.",()=>{
    return request(app)
    .get("/api/topics/mitch/articles?sort_by=votes")
    .expect(200)
    .then(({body})=>{
      const { articleData } = body;
      expect(articleData).toBeSortedBy(articleData.votes)
    })
  })
  test("When articles requested by topic and given query to limit articles to 10, returns 200 and an array of 10 articles",()=>{
    return request(app)
    .get("/api/topics/mitch/articles?limit=10")
    .expect(200)
    .then(({body})=>{
      const {articleData} = body;
      expect(articleData.length).toBe(10)
    })
  })
});
