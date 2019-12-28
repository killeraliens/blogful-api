const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')
const knex = require('knex')
const knexInstance = knex({
  client: 'pg',
  connection: DATABASE_URL
})

app.set('db', knexInstance)
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
