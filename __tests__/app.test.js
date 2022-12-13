const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("3. GET /api/topics", () => {
  it("status:200, should responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);

        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });

  it("status:404, should responds with error message when the path is not found", () => {
    return request(app)
      .get("/api/topicsssssssss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Route not found");
      });
  });
});

describe("4. GET /api/articles", () => {
  it("status:200, should responds with an array of articles with the creation date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        expect(articles).toBeSorted("created_at", { descending: true });

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });

  it("status:404, should responds with error message when the path is not found", () => {
    return request(app)
      .get("/api/articlesssssssss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Route not found");
      });
  });
});

describe("5. GET /api/articles/:article_id", () => {
  it("status:200, should responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });

  it("status:404, should responds with error message when the path is not found", () => {
    return request(app)
      .get("/api/articlessss/1")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Route not found");
      });
  });

  it("status:400, should responds with error message when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/1e4e")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  it("status:404, should responds with error message when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/12345")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article Not Found");
      });
  });

  it("status:400, should responds with error message when article_id is out of range of type integer", () => {
    return request(app)
      .get("/api/articles/1234523423432423")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Out Of Range For Type Integer");
      });
  });
});

describe("6. GET /api/articles/:article_id/comments", () => {
  it("status:200, should responds with an array of comment objects sorted by most recent comment", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toHaveLength(11);
        expect(comments).toBeSorted("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  it("status:200, should responds with an empty array when article_id exist but without comment", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
      });
  });

  it("status:404, should responds with error message when the path is not found", () => {
    return request(app)
      .get("/api/articles/1/commentsssssss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Route not found");
      });
  });

  it("status:400, should responds with error message when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/54etr4e/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  it("status:404, should responds with error message when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/12345/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article Not Found");
      });
  });

  it("status:400, should responds with error message when article_id is out of range of type integer", () => {
    return request(app)
      .get("/api/articles/1234523423432423/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Out Of Range For Type Integer");
      });
  });
});

describe("7. POST /api/articles/:article_id/comments/", () => {
  it("status:200, should responds with the new comment objects if user exists", () => {
    const newPost = {
      username: "butter_bridge",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newPost)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: 1,
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });

  it("status:404, should responds with error message when user does not exists in database but still post comment", () => {
    const newPost = {
      username: "some_random_dude",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newPost)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("User Not Found");
      });
  });

  it("status:400, should responds with error message when req body missing some data", () => {
    const newPost = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newPost)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Null Violation");
      });
  });

  it("status:400, should responds with error message when article_id is invalid", () => {
    const newPost = {
      username: "butter_bridge",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/54etr4e/comments")
      .send(newPost)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });

  it("status:404, should responds with error message when article_id does not exist", () => {
    const newPost = {
      username: "butter_bridge",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/12345/comments")
      .send(newPost)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Article Not Found");
      });
  });

  it("status:400, should responds with error message when article_id is out of range of type integer", () => {
    const newPost = {
      username: "butter_bridge",
      body: "test body",
    };
    return request(app)
      .post("/api/articles/1234523423432423/comments")
      .send(newPost)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Out Of Range For Type Integer");
      });
  });
});

describe("9. GET /api/users", () => {
  it("status:200, should responds with an array of topics", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);

        users.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });

  it("status:404, should responds with error message when the path is invalid", () => {
    return request(app)
      .get("/api/usersssssssss")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Route not found");
      });
  });
});
