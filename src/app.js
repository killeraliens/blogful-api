require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const { NODE_ENV } = require('./config')

const app = express()
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev'

const articlesRouter = require('./articles/articlesRouter')

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use('/api/articles', articlesRouter)
app.get('/xss', xssExample)
app.use(errorHandler)


function xssExample(req, res) {
    res.cookie('secretToken', '1234567890');
    res.sendFile(__dirname + '/xss-example.html');
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
