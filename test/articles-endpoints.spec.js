const knex = require('knex')
const app = require('../src/app')

describe('Articles Endpoints', () => {
  let db

  before('create knex instance',() => {
    db = knex({
      "client": "pg",
      "connection": process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  before('clear blogful_articles table of data', () => {
    return db('blogful_articles').truncate()
  })

  after('disconnect from db destroy knex instance', () => {
    return db.destroy()
  })

  context('given that there are blogful_articles', () => {
    const testArticles = [
      {
        id: 1, title: 'First post!', style: 'Interview',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?'
      },
      {
        id: 2, date_published: '1919-12-22T16:28:32.615Z', title: 'Second post!', style: 'How-to',
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
      },
      {
        id: 3, title: 'Third post!', style: 'News',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
      },
    ];

    beforeEach('insert articles into blogful_articles table', () => {
      return db
        .into('blogful_articles')
        .insert(testArticles)
    })

    it('GET /articles returns all the articles', () => {
      return supertest(app)
        .get('/articles')
        .expect('content-type', /json/)
        .expect(200)
    })

  })

})
