const app = require('../src/app')

describe('App', () => {
  it('should exist', () => {
     expect(app).to.be.a('function')
  })

  it('GET / responds with 200 status and "Hello WORLD"', () => {
    return supertest(app)
      .get('/')
      .expect(200, "Hello boilerplate")
  })

})
