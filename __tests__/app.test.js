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
  test("200: Responds with an article object, along with the comment_count for the article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toMatchObject([
          {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            comment_count: '11'
          }
        ])
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
  test("200: Responds with an array of articles sorted by created_at (descending) by default", () => {
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
            comment_count: expect.any(Number),
          })
        })
        expect(articles).toBeSortedBy('created_at', {
          descending: true
        })
      })
  });
  test("200: Responds with an array of articles sorted by article_id (descending by default)", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
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
            comment_count: expect.any(Number),
          })
        })
        expect(articles).toBeSortedBy('article_id', {
          descending: true
        })
      })
  });
  test("200: Responds with an array of articles sorted by article_id in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
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
            comment_count: expect.any(Number),
          })
        })
        expect(articles).toBeSortedBy('article_id', {
          descending: false
        })
      })
  });
  test("200: Responds with an array of articles sorted by votes (descending by default)", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy('votes', {
          descending: true
        })
      })
  });
  test("200: Responds with an array of articles sorted by comment_count (descending by default)", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy('comment_count', {
          descending: true
        })
      })
  });
  test("400: Responds with an error message when sort_by query is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_field")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query")
      })
  })
  test("400: Responds with an error message when sort_by query is valid but order query is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=not_valid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query")
      })
  })
  test("200: Responds with an array of articles with the topic entered as a query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(1);
        expect(articles[0]).toMatchObject({
          article_id: 5,
          title: 'UNCOVERED: catspiracy to bring down democracy',
          topic: 'cats',
          author: 'rogersop',
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 0,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          comment_count: 2
        })
      })
  })
  test("200: Responds with an array of articles with the topic entered as a query, checking that they array is ordered by default", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(12);
        expect(articles).toBeSortedBy('created_at', {
          descending: true
        })
      })
  })
  test("200: Responds with an array of articles with the topic entered as a query, checking that they array is ordered by 'article_id'", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(12);
        expect(articles).toBeSortedBy('article_id', {
          descending: true
        })
      })
  })
  test("200: Responds with an array of articles with the topic entered as a query, checking that they array is ordered by 'article_id'", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(12);
        expect(articles).toBeSortedBy('article_id', {
          descending: false
        })
      })
  })
  test("404: Responds with message 'No articles found with this topic' when no articles found for topic", () => {
    return request(app)
      .get("/api/articles?topic=not_a_topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No articles found with this topic");
      })
  })
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
  test('200: Responds with an empty array when given a valid, existent article_id, but there are no comments for said article', () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the information that was posted", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "icellusedkars",
        body: "Test comment"
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.response).toMatchObject(
          {
            username: "icellusedkars",
            body: "Test comment"
          }
        );
      });
  });
  test("201: Checks that the comment was posted to the article", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "icellusedkars",
        body: "Test comment"
      })
      .expect(201)
      .then(() => {
        return db.query(`
          SELECT *
          FROM comments
          WHERE author = 'icellusedkars' AND body = 'Test comment'`
        );
      })
      .then(({ rows }) => {
        expect(rows[0]).toMatchObject({
          comment_id: 19,
          body: 'Test comment',
          article_id: 1,
          author: 'icellusedkars',
          votes: 0,
          // created_at: expect.any(String),
        })
      });
  });
  test("400: Responds with error message 'No body provided'", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "icellusedkars",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('No body provided');
      })
  });
  test("400: Responds with error message 'Username not provided'", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "Test comment"
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Username not provided');
      })
  });
  test("404: Responds with error message 'Article does not exist'", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({
        username: "icellusedkars",
        body: "Test comment"
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist');
      })
  });
  test("400: Responds with error message 'Bad Request: article_id must be a number'", () => {
    return request(app)
      .post("/api/articles/not_a_number/comments")
      .send({
        username: "icellusedkars",
        body: "Test comment"
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: article_id must be a number');
      })
  });
  test("400: Responds with error message 'Bad Request: Username does not exist'", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "John",
        body: "Test comment"
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: Username does not exist');
      })
  });
})

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article, including the new number of votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject([{ "article_id": 1, "title": 'Living in the shadow of a great man', "topic": 'mitch', "author": 'butter_bridge', "body": 'I find this existence challenging', "created_at": "2020-07-09T20:11:00.000Z", "votes": 101, "article_img_url": 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700' }])
      })
  });
  test("200: Responds with the updated article when inc_votes value is negative", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject([{ "article_id": 1, "title": 'Living in the shadow of a great man', "topic": 'mitch', "author": 'butter_bridge', "body": 'I find this existence challenging', "created_at": "2020-07-09T20:11:00.000Z", "votes": 99, "article_img_url": 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700' }])
      })
  });
  test("400: Responds with error message 'Bad Request: article_id must be a number'", () => {
    return request(app)
      .patch("/api/articles/not_a_number")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: article_id must be a number');
      })
  });
  test("404: Responds with error message 'Article does not exist'", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist');
      })
  });
  test("400: Responds with error message 'Votes must be an integer'", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "hello" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Votes must be an integer');
      })
  });
  test("400: Responds with error message 'Votes must be an integer'", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1.5 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Votes must be an integer');
      })
  });
})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with the updated article, including the new number of votes", () => {
    return request(app)
      .delete("/api/comments/11")
      .expect(204)
  });
  test("404: Responds with error message 'Comment does not exist' if the comment does not exist", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment does not exist');
      })
  });
  test("400: Responds with errormessage 'Bad Request: comment_id must be an integer'", () => {
    return request(app)
      .delete("/api/comments/not_a_number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request: comment_id must be an integer');
      })
  });
})

describe("GET /api/users", () => {
  test("200: Responds with the updated article, including the new number of votes", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toMatchObject(
          [
            {
              username: 'butter_bridge',
              name: 'jonny',
              avatar_url:
                'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            },
            {
              username: 'icellusedkars',
              name: 'sam',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
            },
            {
              username: 'rogersop',
              name: 'paul',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
            },
            {
              username: 'lurker',
              name: 'do_nothing',
              avatar_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
            }
          ]
        );
      })
  });
})