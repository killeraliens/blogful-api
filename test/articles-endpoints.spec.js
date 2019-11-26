const knex = require('knex')
const app = require('../src/app')
const { makeArticlesArray } = require('./articles.fixtures')

describe('Articles Endpoints', () => {
  let db

  before('create knex instance',() => {
    db = knex({
      "client": "pg",
      "connection": process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  before('clean blogful_articles table data', () => {
    return db('blogful_articles').truncate()
  })

  afterEach('cleanup', () => {
    return db('blogful_articles').truncate()
  })

  after('disconnect from db, destroy knex instance', () => {
    return db.destroy()
  })


  describe('GET /articles', () => {

    context('given that there are blogful_articles', () => {
      const testArticles = makeArticlesArray()

      beforeEach('insert articles into blogful_articles table', () => {
        return db
          .into('blogful_articles')
          .insert(testArticles)
      })

      it('responds with 200 and all the articles', () => {
      return supertest(app)
        .get('/articles')
        .expect('content-type', /json/)
        .expect(200, testArticles)
      })
    })

    context('given that there are no articles in the blogful_articles table', () => {
      it('returns 200 and an empty array', () => {
        return supertest(app)
          .get('/articles')
          .expect(200, [])
      })
    })
  })

  describe('GET /articles/:article_id', () => {

    context('given that there are blogful_articles', () => {
      const testArticles = makeArticlesArray()

      beforeEach('insert articles into blogful_articles table', () => {
        return db
          .into('blogful_articles')
          .insert(testArticles)
      })

      it('returns 200 and correct article if exists', () => {
        const articleId = 2
        const expectedArticle = testArticles[articleId - 1]
        return supertest(app)
          .get(`/articles/${articleId}`)
          .expect(200, expectedArticle)
      })
    })

    context('given that there are no articles', () => {
      it('returns 400 and error', () => {
        const badId = 12345
        return supertest(app)
          .get(`/articles/${badId}`)
          .expect(404, { error: { message: `Article doesn't exist`}})
      })
    })
  })


})
