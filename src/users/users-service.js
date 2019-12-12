const UsersService = {
  getAllUsers(knex) {
    return knex
      .select('*')
      .from('blogful_users')
  },

  getById(knex, id) {
    return knex
      .select('*')
      .from('blogful_users')
      .where('id', id)
      .first()
  },

  insertUser(knex, postBody) {
    return knex
      .insert(postBody)
      .into('blogful_users')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  updateUser(knex, id, postBody) {
    return knex
      .from('blogful_users')
      .where('id', id)
      .update(postBody)
  },

  deleteUser(knex, id) {
    return knex
      .from('blogful_users')
      .where('id', id)
      .delete()
  },

  checkDuplicates(knex, field, value) {
    return knex
      .select('*')
      .from('blogful_users')
      .where(`${field}`, 'ilike', `${value}`)
  }
}

module.exports = UsersService;
