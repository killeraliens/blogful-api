const CommentsService = {
  getAllComments(knex) {
    return knex
      .select('*')
      .from('blogful_comments')
  },

  insertComment(knex, postBody) {
    return knex
      .insert(postBody)
      .into('blogful_comments')
      .returning('*')
      .then(rows => rows[0])
  },

  getById(knex, id) {
    return knex
      .select('*')
      .from('blogful_comments')
      .where('id', id)
      .first()
  },

  updateComment(knex, id, postBody) {
    return knex
      .where('id', id)
      .from('blogful_comments')
      .update(postBody)
  },

  deleteComment(knex, id) {
    return knex
      .where('id', id)
      .from('blogful_comments')
      .delete()
  },
}

module.exports = CommentsService;
