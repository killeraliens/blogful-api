function makeArticlesArray() {
  return [
    {
      id: 1,
      date_published: '2018-08-10T08:20:41.000Z',
      title: 'First post!',
      style: 'Interview',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non. Adipisci, pariatur. Molestiae, libero esse hic adipisci autem neque?',
      author: 1
    },
    {
      id: 2,
      date_published: '1919-12-22T16:28:32.615Z',
      title: 'Second post!',
      style: 'How-to',
      content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.',
      author: 1
    },
    {
      id: 3, date_published: '2015-07-20T08:34:55.000Z',
      title: 'Third post!',
      style: 'News',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.',
      author: 2
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
  },

  missingContent() {
    return {
      style: 'Listicle',
      title: 'some title'
    }
  },

  missingStyle() {
    return {
      title: 'some title',
      content: 'awesome content'
    }
  },

  wrongStyle() {
    return {
      title: 'some title',
      content: 'awesome content',
      style: 'NotAStyle'
    }
  },

  withXss() {
    return {
      id: 666,
      title: 'Naughty naughty very naughty <script>alert("xss");</script>',
      style: 'How-to',
      content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
      author: 1
    }
  },

  cleanXss() {
    return {
      id: 666,
      title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      style: 'How-to',
      content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      author: 1
    }
  }
}

module.exports = {
  makeArticlesArray,
  makeArticle
}
