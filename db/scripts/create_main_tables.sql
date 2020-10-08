/*------------------------------------------*\
|*  DROP ANY EXISTING TABLES TO OVERWRITE   *|
\*------------------------------------------*/
DROP TABLE IF EXISTS article;
DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS dress_code;
DROP TABLE IF EXISTS garment_type;
DROP TABLE IF EXISTS closet;
DROP TABLE IF EXISTS account;


/*------------------------------------------*\
|*              CREATE TABLES               *|
\*------------------------------------------*/
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  email VARCHAR(50) NOT NULL,
  username VARCHAR(25) NOT NULL,
  fname VARCHAR(50) NULL,
  lname VARCHAR(50) NULL,
  secret_hash VARCHAR(25) NOT NULL
);
INSERT INTO account (email, username, fname, lname, secret_hash) 
VALUES 
('liam@test.com','lamp','liam','palmleaf','12453afdg'),
('cher@test.com','chor','cher','horowitz','894y5h34'),
('bobl@test.com','blaw','bob','loblaw','gkbg74jhb43'),
('tobi@test.com','inm8','tobias','fünke','lhta75hb83'),
('gob@test.com','gob','george oscar','bluth','o9ioasknd72'),
('mae@test.com','maeby','maeby','fünke','sfkgdjb729');

CREATE TABLE closet (
  closet_id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES account,
  "name" VARCHAR(50) NOT NULL,
  "desc" VARCHAR(500) NULL
);
INSERT INTO closet (account_id, "name", "desc")
VALUES
(2, 'My Closet', NULL),
(4, 'Jean Shorts Collection', NULL),
(5, 'Magician suits only', NULL);


/*------------------------------------------*\
|* LOOKUP TABLES FOR CONSTRAINED PROPERTIES *|
\*------------------------------------------*/
CREATE TABLE garment_type (
  garment_type_id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "desc" VARCHAR(100) NULL
);
INSERT INTO garment_type("name", "desc") 
VALUES 
('top', NULL), 
('bottom', NULL),
('one piece','worn as a whole outfit'),
('footwear', NULL);

CREATE TABLE dress_code (
  dress_code_id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "desc" VARCHAR(100) NULL
);
INSERT INTO dress_code("name", "desc") 
VALUES 
('casual', 'everyday clothing'),
('semi-formal', NULL),
('formal', NULL),
('very formal', NULL);

CREATE TABLE rating (
  rating_id SERIAL PRIMARY KEY,
  rating_value INTEGER NOT NULL
);
INSERT INTO rating(rating_value) 
VALUES (1),(2),(3),(4),(5);


/*------------------------------------------*\
|*   CREATE TABLES THAT REFERENCE LOOKUPS   *|
\*------------------------------------------*/
CREATE TABLE article (
  article_id SERIAL PRIMARY KEY,
  closet_id INTEGER REFERENCES closet,
  "name" VARCHAR(50) NOT NULL,
  "desc" VARCHAR(500) NULL,
  dirty boolean NOT NULL,
  garment_type_id INTEGER REFERENCES garment_type,
  color VARCHAR(50),
  dress_code_id INTEGER REFERENCES dress_code,
  rating_id INTEGER REFERENCES rating
);
INSERT INTO article (closet_id, "name", "desc", dirty, garment_type_id, color, dress_code_id, rating_id)
VALUES 
(1, 'Ed Hardy t-shirt','a t shirt', 'f', 1, 'grey', 1, 5),
(1, 'BAPE camo pants', NULL, 'f', 2, 'orange', 1, 5),
(1, 'Nike AF1s','a t shirt', 'f', 4, 'white', 1, 5),
(1, 'Mesh tank top','holy shirt', 'f', 1, 'black', 1, 1),
(2, 'Casual Jean Shorts', NULL, 'f', 2, 'blue', 1, 4),
(2, 'Nice Jean Shorts', NULL, 'f', 2, 'blue', 2, 3),
(2, 'Fancy Jean Shorts', NULL, 'f', 2, 'blue', 3, 5),
(3, 'Felt Vest', NULL, 'f', 1, 'red', 3, 4),
(3, 'Felt Pants', NULL, 'f', 2, 'black', 3, 2),
(3, 'Magic Shoes', NULL, 'f', 4, 'black', 3, 5),
(3, 'Dress shirt', NULL, 'f', 1, 'white', 3, 5);


/*------------------------------------------*\
|*             TEST STATEMENT               *|
\*------------------------------------------*/
SELECT ac.username AS "Owner", 
  c.name AS "Closet",
  a.name AS "Article Name", 
  a.dirty AS "Is Dirty",
  gt.name AS "Garment Type", 
  dc.name AS "Dress Code", 
  rt.rating_value AS "Rating"
FROM article AS a
JOIN garment_type AS gt ON a.garment_type_id = gt.garment_type_id
JOIN dress_code AS dc ON a.dress_code_id = dc.dress_code_id
JOIN rating AS rt ON a.rating_id = rt.rating_id
JOIN closet AS c ON c.closet_id = a.closet_id
JOIN account AS ac ON c.account_id = ac.account_id
ORDER BY c.closet_id;