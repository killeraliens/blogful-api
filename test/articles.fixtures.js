function makeArticlesArray() {
  return [
    {
      id: 1,
      date_published: '2018-08-10T08:20:41.000Z',
      title: 'First post!',
      style: 'Interview',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?'
    },
    {
      id: 2,
      date_published: '1919-12-22T16:28:32.615Z',
      title: 'Second post!',
      style: 'How-to',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
    },
    {
      id: 3, date_published: '2015-07-20T08:34:55.000Z',
      title: 'Third post!',
      style: 'News',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
    },
  ]
}

const makeArticle = {
  good() {
    return {
      title: 'Test new article',
      style: 'Listicle',
      content: 'Test new article content...'
    }
  },

  missingTitle() {
    return {
      style: 'Listicle',
      content: 'Test new article content...'
    }
  }
}

module.exports = {
  makeArticlesArray,
  makeArticle
}
