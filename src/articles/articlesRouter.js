const express = require('express')
const ArticlesService = require('./articles-service')

const articlesRouter = express.Router()
const bodyParser = express.json()

articlesRouter
  .route('/')
  .get(getArticles)
  .post(bodyParser, postArticle)

articlesRouter
  .route('/:article_id')
  .get(getArticle)



function postArticle(req, res, next) {
  const { title, style, content } = req.body
  const newArticle = { title, style, content }
  const knexI = req.app.get('db')

  if (!title) {
    return res.status(400).json({ error: { message: `Title required` } })
  }

  if (!style) {
    return res.status(400).json({ error: { message: `Style required` } })
  }

  if (!content) {
    return res.status(400).json({ error: { message: `Content required` } })
  }

  ArticlesService.insertArticle(knexI, newArticle)
    .then(newArticle => {
      res
        .status(201)
        .location(`/articles/${newArticle.id}`)
        .json(newArticle)
    })
    .catch(next)
}

function getArticle(req, res, next) {
  const { article_id } = req.params
  const knexI = req.app.get('db')
  ArticlesService.getById(knexI, article_id)
    .then(article => {
      if (!article) {
        return res.status(404).json({ error: { message: `Article doesn't exist` } })
      }
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

module.exports = articlesRouter
