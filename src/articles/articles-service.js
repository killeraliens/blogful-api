
const ArticlesService = {
  getAllArticles(knex) {
    return knex
    .select('*')
    .from('blogful_articles')
  },

  insertArticle(knex, newArticle) {
    return knex
    .insert(newArticle)
    .into('blogful_articles')
    .returning('*')
    .then(rows => rows[0])
  },

  getById(knex, id) {
    return knex
    .select('*')
    .from('blogful_articles')
    .where('id', id)
    .first()
  },

  deleteArticle(knex, id) {
    return knex
    .where('id', id)
    .from('blogful_articles')
    .delete()
  },

  updateArticle(knex, id, newData) {
    return knex
    .where('id', id)
    .from('blogful_articles')
    .update(newData)
  },


  // getArticleCategories(knex) {
  //   return knex
  //    .select('enum_range')
  // }
}

module.exports = ArticlesService;
