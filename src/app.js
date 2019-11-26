require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const { NODE_ENV } = require('./config')

const app = express()
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev'
const ArticlesService = require('./articles-service')

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello boilerplate')
})
app.get('/articles', getArticles)
app.get('/articles/:article_id', getArticle)
app.use(errorHandler)

function getArticle(req, res, next) {
  const { article_id } = req.params
  const knexI = req.app.get('db')
  ArticlesService.getById(knexI, article_id)
    .then(article => {
      res.json(article)
    })
    .catch(next)
}

function getArticles(req, res, next) {
  const knexI = req.app.get('db')
  ArticlesService.getAllArticles(knexI)
    .then(articles => {
      res.json(articles)
    })
    .catch(next)
}

function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === "production") {
    response = { error: { message: "Server Error" } }
  } else {
    console.log(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
}

module.exports = app
