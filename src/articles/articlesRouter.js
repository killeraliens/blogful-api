const express = require('express')
const ArticlesService = require('./articles-service')

const articlesRouter = express.Router()
const xss = require('xss')
const bodyParser = express.json()
const sanitizeArticle = article => {
  return {
      id: article.id,
      title: xss(article.title),
      style: article.style,
      content: xss(article.content),
      date_published: article.date_published
  }
}

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

  for(const [key, value] of Object.entries(newArticle)) {
    if(value == null) {
      return res.status(400).json({ error: { message: `${key} required` } })
    }
  }

  Object.keys(req.body).forEach(key => {
    if (!["id", "title", "style", "content"].includes(key)) {
      //logger.error(`Bad keys in ${JSON.stringify(req.body)}`)
      return res.status(400).send('Invalid Data')
    }
  })

  //dont you want to sanitize BEFORE storing?
  // newArticle.title = xss(newArticle.title)
  // newArticle.content = xss(newArticle.content)

  ArticlesService.insertArticle(knexI, newArticle)
    .then(newArticle => {

      res
        .status(201)
        .location(`/articles/${newArticle.id}`)
        .json(sanitizeArticle(newArticle))
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

      res.json(sanitizeArticle(article))
    })
    .catch(next)
}

function getArticles(req, res, next) {
  const knexI = req.app.get('db')
  ArticlesService.getAllArticles(knexI)
    .then(articles => {
      const sanitized = articles.map(article => sanitizeArticle(article))
      res.json(sanitized)
    })
    .catch(next)
}

module.exports = articlesRouter
