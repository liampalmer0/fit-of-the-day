INSERT INTO "user" (email, username, fname, lname, "password") 
VALUES 
('liam@test.com','lamp','liam','palmleaf','12453afdg'),
('cher@test.com','chor','cher','horowitz','894y5h34'),
('bobl@test.com','blaw','bob','loblaw','gkbg74jhb43'),
('tobi@test.com','inm8','tobias','fünke','lhta75hb83'),
('gob@test.com','gob','george oscar','bluth','o9ioasknd72'),
('mae@test.com','maeby','maeby','fünke','sfkgdjb729');

INSERT INTO closet ("user_id", "name", "desc")
VALUES
(2, 'Cher Closet', NULL),
(4, 'Tobias Closet', NULL),
(5, 'GOB Closet', NULL),
(1, 'Test Closet', 'A test closet for demonstration');

INSERT INTO garment_type("name", "desc") 
VALUES 
('top', NULL), 
('bottom', NULL),
('one piece','worn as a whole outfit'),
('footwear', NULL);

INSERT INTO dress_code("name", "desc") 
VALUES 
('casual', 'everyday clothing'),
('semi-formal', NULL),
('formal', NULL),
('very formal', NULL);

INSERT INTO rating(rating_value) 
VALUES (1),(2),(3),(4),(5);

INSERT INTO article (closet_id, "name", "desc", dirty, garment_type_id, color, dress_code_id, rating_id, filepath)
VALUES 
(1, 'Ed Hardy t-shirt','a t shirt', 'f', 1, 'grey', 1, 5, NULL),
(1, 'BAPE camo pants', NULL, 'f', 2, 'orange', 1, 5, NULL),
(1, 'Nike AF1s', NULL, 'f', 4, 'white', 1, 5, NULL),
(1, 'Mesh tank top','holy shirt', 'f', 1, 'black', 1, 1, NULL),
(2, 'Casual Jean Shorts', NULL, 'f', 2, 'blue', 1, 4, NULL),
(2, 'Nice Jean Shorts', NULL, 'f', 2, 'blue', 2, 3, NULL),
(2, 'Fancy Jean Shorts', NULL, 'f', 2, 'blue', 3, 5, NULL),
(3, 'Felt Vest', NULL, 'f', 1, 'red', 3, 4, NULL),
(3, 'Felt Pants', NULL, 'f', 2, 'black', 3, 2, NULL),
(3, 'Magic Shoes', NULL, 'f', 4, 'black', 3, 5, NULL),
(3, 'Dress shirt', NULL, 'f', 1, 'white', 3, 5, NULL),
(4, 'Green Shirt', 'A very good green shirt', 'f', 1, 'green', 1, 5, 's-green.png'),
(4, 'Black Jeans', 'Very black jeans', 'f', 2, 'black', 1, 5, 'p-j-black.png'),
(4, 'Blue Shirt', 'A very good blue shirt', 'f', 1, 'blue', 1, 5, 's-blue.png'),
(4, 'Brown Pants', 'Very good khakis', 'f', 2, 'brown', 1, 5, 'p-brown.png'),
(4, 'Yellow Shirt', 'A very good yellow shirt', 'f', 1, 'yellow', 1, 5, 's-yellow.png'),
(4, 'Orange Shirt', 'A very good orange shirt', 'f', 1, 'orange', 1, 5, 's-orange.png'),
(4, 'Red Shirt', 'A very good red shirt', 'f', 1, 'red', 1, 5, 's-red.png'),
(4, 'Black Shirt', 'A very good black shirt', 'f', 1, 'black', 1, 5, 's-black.png'),
(4, 'Blue Jeans', 'Very good blue jeans', 'f', 2, 'blue', 1, 5, 'p-j-blue.png'),
(4, 'White Shirt', 'A very good white shirt', 'f', 1, 'white', 1, 5, 's-white.png'),
(4, 'Blue Chino', 'Very good blue chinos', 'f', 2, 'blue', 1, 5, 'p-c-blue.png'),
(4, 'Black Chino', 'Very good black chinos', 'f', 2, 'black', 1, 5, 'p-c-black.png'),
(4, 'M. Meyers Coveralls', 'ULINE had a sale :^)', 'f', 3, 'blue', 1, 5, NULL);

/*------------------------------------------*\
|*             TEST STATEMENT               *|
\*------------------------------------------*/
SELECT ac.username AS "Owner", 
  c.name AS "Closet",
  a.name AS "Article Name", 
  a.dirty AS "Is Dirty",
  gt.name AS "Garment Type", 
  dc.name AS "Dress Code", 
  rt.rating_value AS "Rating",
  a.filepath as "File Name"
FROM article AS a
JOIN garment_type AS gt ON a.garment_type_id = gt.garment_type_id
JOIN dress_code AS dc ON a.dress_code_id = dc.dress_code_id
JOIN rating AS rt ON a.rating_id = rt.rating_id
JOIN closet AS c ON c.closet_id = a.closet_id
JOIN "user" AS ac ON c.user_id = ac.user_id
WHERE ac.username = 'lamp'
ORDER BY c.closet_id;