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
  //const { title, style, content } = req.body
  const knexI = req.app.get('db')
  ArticlesService.insertArticle(knexI, { ...req.body })
    .then(article => {
      if (!article.title || !article.style || !article.content) {
        return res.status(404).json({ error: { message: `Invalid data` } })
      }

      res
        .status(201)
        .location(`/articles/${article.id}`)
        .json(article)
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
