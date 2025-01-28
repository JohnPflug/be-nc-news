const endpointsJson = require("../endpoints.json");
const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');

beforeEach(() => {
  return seed(testData); // re-seed testData before each test.
});

afterAll(() => {
  return db.end(); // close the database connection after all tests.
});

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

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toEqual(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          })
        })
      });
  });
});

describe("GET /api/not_an_endpoint", () => {
  test("404: Responds with message 'Endpoint not found'.", () => {
    return request(app)
      .get("/api/not_an_endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint not found");
      });
  });
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toMatchObject([{ "article_id": 1, "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700", "author": "butter_bridge", "body": "I find this existence challenging", "created_at": "2020-07-09T20:11:00.000Z", "title": "Living in the shadow of a great man", "topic": "mitch", "votes": 100 }])
      })
  });
  test("400: Responds with message 'Bad Request: article_id must be a number' if article_id is not a number,", () => {
    return request(app)
      .get("/api/articles/not_a_number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: article_id must be a number');
      })
  })
  test('404: Responds with error message when given a valid but non-existent article_id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist');
      });
  });
})

describe("GET /api/articles", () => {
  test("200: Responds with an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          })
        })
        expect(articles).toBeSortedBy('created_at', {
          descending: true
        })
      })
  });
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(11);
        expect(comments).toBeSortedBy('created_at', {
          descending: true
        })
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        })
      })
  });
  test("400: Responds with message 'Bad Request: article_id must be a number' if article_id is not a number,", () => {
    return request(app)
      .get("/api/articles/not_a_number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: article_id must be a number');
      })
  })
  test('404: Responds with error message when given a valid but non-existent article_id', () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist');
      });
  });
})