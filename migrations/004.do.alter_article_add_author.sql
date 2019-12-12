ALTER TABLE blogful_articles
  ADD COLUMN
    author INT REFERENCES blogful_users(id)
    ON DELETE SET NULL;
