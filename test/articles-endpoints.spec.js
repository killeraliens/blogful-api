const knex = require('knex')
const app = require('../src/app')
const { makeArticlesArray, makeArticle } = require('./articles.fixtures')

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
      it('returns 404 and error', () => {
        const badId = 12345
        return supertest(app)
          .get(`/articles/${badId}`)
          .expect(404, { error: { message: `Article doesn't exist`}})
      })
    })

    context('given that there is an xss attack article', () => {
      const attackArticle = {
        id: 666,
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        style: 'How-to',
        content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
      }

      beforeEach('insert attackArticle', () => {
        return db
          .into('blogful_articles')
          .insert([attackArticle])
      })

      it('responds with 200 and article with XSS removed', () => {
         return supertest(app)
           .get(`/articles/${attackArticle.id}`)
           .expect(200)
           .expect(res => {
             expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
             expect(res.body.content).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
           })
      })
    })
  })

  describe.only('POST /articles', () => {
    context('given the post body is accurate', () => {
        it('creates new article and responds with 201 and new article', function() {
          this.retries(3)
          const goodArticle = makeArticle.good()

          return supertest(app)
            .post(`/articles`)
            .send(goodArticle)
            .expect(201)
            .expect(res => {
              expect(res.body.title).to.eql(goodArticle.title)
              expect(res.body.style).to.eql(goodArticle.style)
              expect(res.body.content).to.eql(goodArticle.content)
              expect(res.body).to.have.property('id')
              expect(res.headers.location).to.eql(`/articles/${res.body.id}`)
              const expectedDate = new Date().toLocaleString()
              const actualDate = new Date(res.body.date_published).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
            .then(postRes =>
              supertest(app)
                .get(`/articles/${postRes.body.id}`)
                .expect(200)
                .expect(postRes.body)
            )
        })
    })

    context('given the post body has errors', () => {
      const reqFields = ['title', 'content', 'style']
      reqFields.forEach(field => {
        const newArticle = makeArticle.good()
        it(`responds with 400 and error with missing ${field} field`, () => {
          delete newArticle[field]
          return supertest(app)
            .post('/articles')
            .send(newArticle)
            .expect(400)
            .expect(res => {
              expect(res.body).to.eql({error: {message: `${field} required`}})
            })
        })
      })
      it.skip('responds with 400 and error if Style field is wrong type', () => {
        const wrongStyleArticle = makeArticle.wrongStyle()
        return supertest(app)
          .post('/articles')
          .send(wrongStyleArticle)
          .expect(400)
      })
    })

    context('given the post title and content fields contain XSS', () => {
      const attackArticle = {
        id: 666,
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        style: 'How-to',
        content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
      }

      beforeEach('insert attackArticle', () => {
        return db
          .into('blogful_articles')
          .insert([attackArticle])
      })

      it('responds with 201 and creates article with XSS removed', () => {
        return supertest(app)
          .post('/articles')
          .send(attackArticle)
          .expect(201)
          .expect(res => {
            expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
            expect(res.body.content).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
          })

      })

    })

  })


})
