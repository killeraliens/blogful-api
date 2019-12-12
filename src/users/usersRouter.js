const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const xss = require('xss');
const bodyParser = express.json()
const usersRouter = express.Router();
const sanitizeUser = (user) => {
  return {
    id: user.id,
    fullname: xss(user.fullname),
    username: xss(user.username),
    date_created: user.date_created,
    password: user.password,
    nickname: xss(user.nickname)
  }
}

usersRouter
  .route('/')
  .get(getUsers)
  .post(bodyParser, isUsernameDuplicate, postUser)

usersRouter
  .route('/:user_id')
  .all(checkExists)
  .get(getUser)
  .patch(bodyParser, patchUser)
  .delete(deleteUser)

function getUser(req, res) {
  res.json(sanitizeUser(res.user))
}

function patchUser(req, res, next) {
  const knexI = req.app.get('db')
  const { user_id } = req.params
  const { fullname, username, password, nickname } = req.body
  const postBody = { fullname, username, password, nickname }

  const anyNotNullArr = Object.values(postBody).filter(val => val)
  if (anyNotNullArr.length === 0) {
    return res.status(400).json({error: {message: `Body must include one of fullname, username, password, or nickname`}})
  }

  UsersService
    .updateUser(knexI, user_id, postBody)
    .then(numOfRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
}

function deleteUser(req, res, next) {
  const knexI = req.app.get('db')
  const { user_id } = req.params

  UsersService
    .deleteUser(knexI, user_id)
    .then(() => {
      res.status(204).end()
    })
    .catch(next)
}

function checkExists(req, res, next) {
  const { user_id } = req.params
  const knexI = req.app.get('db')
  UsersService.getById(knexI, user_id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: { message: `User doesn't exist` } })
      }
      res.user = user
      next()
    })
    .catch(next)

}

function getUsers(req, res, next) {
  const knexI = req.app.get('db')

  UsersService.getAllUsers(knexI)
    .then(users => {
      const sanitized = users.map(user => sanitizeUser(user))
      res.json(sanitized)
    })
    .catch(next)
}

function isUsernameDuplicate(req, res, next) {
  const knexI = req.app.get('db')
  const { username } = req.body

  UsersService.checkDuplicates(knexI, 'username', username)
    .then(result => {
      if (result.length > 0) {
        return res.status(400).json({ error: { message: `username already exists` } })
      }
      next()
    })
    .catch(next)
}

function postUser(req, res, next) {
  const knexI = req.app.get('db')
  //const username = res.user.username
  const { fullname, username, password, nickname } = req.body
  const newUser = { fullname, username, password }

  for (const [key, value] of Object.entries(newUser)) {
    if (value == null) {
      return res.status(400).json({ error: { message: `${key} required` } })
    }
  }

  newUser.nickname = nickname

  //where do we validate that the username is unique?
  // if (duplicateExists(knexI, 'username', username, next)) {
  //   return res.status(400).json({ error: { message: `username already exists` } })
  // }

  UsersService.insertUser(knexI, newUser)
    .then(newUser => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${newUser.id}`))
        .json(sanitizeUser(newUser))
    })
    .catch(next)
}



module.exports = usersRouter;
