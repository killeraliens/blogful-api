const express = require('express')
const path = require('path')
const CommentsService = require('./comments-service')

const commentsRouter = express.Router()
const bodyParser = express.json()
const xss = require('xss')
const sanitizeComment = comment => {
  return {
    id: comment.id,
    text: xss(comment.text),
    commented_at: comment.commented_at,
    article_id: comment.article_id,
    user_id: comment.user_id
  }
}

commentsRouter
  .route('/')
    .get(getComments)
    .post(bodyParser, postComment)

commentsRouter
  .route('/:comment_id')
    .all(checkExists)
    .get(getComment)
    .patch(bodyParser, patchComment)
    .delete(deleteComment)

function checkExists(req, res, next) {
  const { comment_id } = req.params
  const knexI = req.app.get('db')

  CommentsService.getById(knexI, comment_id)
    .then(comment => {
      if (!comment) {
        return res.status(404).json({ error: { message: `comment doesn't exist` } })
      }
      res.comment = comment
      next()
    })
    .catch(next)
}

function getComments(req, res, next) {
  const knexI = req.app.get('db')

  CommentsService
    .getAllComments(knexI)
    .then(all => {
      const sanitized = all.map(comment => sanitizeComment(comment))
      res.json(sanitized)
    })
    .catch(next)
}

function postComment(req, res, next) {
  const knexI = req.app.get('db')
  const { text, article_id, user_id, commented_at } = req.body
  const postBody = { text, article_id, user_id }

  for (const [key, value] of Object.entries(postBody)) {
    if(!value) {
      return res.status(400).json({error: {message: `${key} required in post body`}})
    }
  }

  postBody.commented_at = commented_at

  CommentsService
    .insertComment(knexI, postBody)
    .then(newComment => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${newComment.id}`))
        .json(sanitizeComment(newComment))
    })
}

function getComment(req, res, next) {
  res.json(sanitizeComment(res.comment))
}

function patchComment(req, res, next) {
  const knexI = req.app.get('db')
  const { comment_id } = req.params
  const { text, commented_at } = req.body
  const patchBody = { text, commented_at }

  const arrOfNotNulls = Object.values(patchBody).filter(val => val)
  if (arrOfNotNulls.length === 0) {
    return res.status(400).json({ error: { message: `Body must include one of text or commented_at fields`}})
  }

  CommentsService
    .updateComment(knexI, comment_id, patchBody)
    .then(numOfRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
}

function deleteComment(req, res, next) {
  const knexI = req.app.get('db')
  const { comment_id } = req.params

  CommentsService
    .deleteComment(knexI, comment_id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
}

module.exports = commentsRouter;

