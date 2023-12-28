CREATE TABLE url (
  id SERIAL NOT NULL,
  origin_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE UNIQUE INDEX unique_id ON url(origin_url);

