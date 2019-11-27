const express = require('express')
const ArticlesService = require('./articles-service')

const articlesRouter = express.Router()
const xss = require('xss')
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

      res.json({
        id: article.id,
        title: xss(article.title),
        style: article.style,
        content: xss(article.content),
        date_published: article.date_published
      })
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
