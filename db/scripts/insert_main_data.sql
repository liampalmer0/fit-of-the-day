INSERT INTO "user" (email, username, fname, lname, "password", zipcode) 
VALUES 
('liam@test.com','lamp','liam','palmleaf','12453afdg', '45220'),
('test@test.test','tester','test','user','$2a$10$ujEgiUKLcErm3AVD/QzXbOw8WC5nk.19DklnGqm74FKVejJ5U1Z5C', '60605')

INSERT INTO closet ("user_id", "name", "desc")
VALUES
(1, 'Liam Closet', 'Liam Dev Closet');
(2, 'Test Closet', 'A test closet for demonstration');

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

INSERT INTO article (closet_id, "name", "desc", dirty, garment_type_id, color, dress_code_id, rating_id, temp_min, temp_max, filepath)
VALUES 
(1, 'Green Shirt', 'A very good green shirt', 'f', 1, 'green', 1, 5, 60, 80, 's-green.png'),
(1, 'Black Jeans', 'Very black jeans', 'f', 2, 'black', 1, 5, 20, 75, 'p-j-black.png'),
(1, 'Blue Shirt', 'A very good blue shirt', 'f', 1, 'blue', 1, 5, 60, 80, 's-blue.png'),
(1, 'Brown Pants', 'Very good khakis', 'f', 2, 'brown', 1, 5, 20, 75, 'p-brown.png'),
(1, 'Yellow Shirt', 'A very good yellow shirt', 'f', 1, 'yellow', 1, 5, 60, 80, 's-yellow.png'),
(1, 'Orange Shirt', 'A very good orange shirt', 'f', 1, 'orange', 1, 5, 60, 80, 's-orange.png'),
(1, 'Red Shirt', 'A very good red shirt', 'f', 1, 'red', 1, 5, 60, 80, 's-red.png'),
(1, 'Black Shirt', 'A very good black shirt', 'f', 1, 'black', 1, 5, 60, 80, 's-black.png'),
(1, 'Blue Jeans', 'Very good blue jeans', 'f', 2, 'blue', 1, 5, 20, 75, 'p-j-blue.png'),
(1, 'White Shirt', 'A very good white shirt', 'f', 1, 'white', 1, 5, 60, 80, 's-white.png'),
(1, 'Blue Chino', 'Very good blue chinos', 'f', 2, 'blue', 1, 5, 20, 75, 'p-c-blue.png'),
(1, 'Black Chino', 'Very good black chinos', 'f', 2, 'black', 1, 5, 20, 75, 'p-c-black.png'),
(1, 'Overcoat', 'A collared winter Coat', 'f', 1, 'black', 2, 5, 0, 45, 's-null.png'),
(1, 'Long Sleeve', 'A long sleeve shirt', 'f', 1, 'tan', 1, 5, 40, 65, 's-null.png'),
(1, 'Hoodie', 'A pullover hoodie', 'f', 1, 'grey', 1, 5, 40, 65, 's-null.png'),
(1, 'Sweater', 'Knit sweater', 'f', 1, 'red', 1, 5, 35, 55, 's-null.png'),
(1, 'Coat', 'A lightweight coat', 'f', 1, 'blue', 1, 5, 20, 55, 's-null.png'),
(1, 'Shorts', 'Cotton shorts', 'f', 2, 'tan', 1, 5, 70, 100, 'p-null.png'),
(1, 'Track pants', 'black track pants', 'f', 2, 'black', 1, 5, 35, 75, 'p-null.png'),
(2, 'Green Shirt', 'A very good green shirt', 'f', 1, 'green', 1, 5, 60, 80, 's-green.png'),
(2, 'Black Jeans', 'Very black jeans', 'f', 2, 'black', 1, 5, 20, 75, 'p-j-black.png'),
(2, 'Blue Shirt', 'A very good blue shirt', 'f', 1, 'blue', 1, 5, 60, 80, 's-blue.png'),
(2, 'Brown Pants', 'Very good khakis', 'f', 2, 'brown', 1, 5, 20, 75, 'p-brown.png'),
(2, 'Yellow Shirt', 'A very good yellow shirt', 'f', 1, 'yellow', 1, 5, 60, 80, 's-yellow.png'),
(2, 'Orange Shirt', 'A very good orange shirt', 'f', 1, 'orange', 1, 5, 60, 80, 's-orange.png'),
(2, 'Red Shirt', 'A very good red shirt', 'f', 1, 'red', 1, 5, 60, 80, 's-red.png'),
(2, 'Black Shirt', 'A very good black shirt', 'f', 1, 'black', 1, 5, 60, 80, 's-black.png'),
(2, 'Blue Jeans', 'Very good blue jeans', 'f', 2, 'blue', 1, 5, 20, 75, 'p-j-blue.png'),
(2, 'White Shirt', 'A very good white shirt', 'f', 1, 'white', 1, 5, 60, 80, 's-white.png'),
(2, 'Blue Chino', 'Very good blue chinos', 'f', 2, 'blue', 1, 5, 20, 75, 'p-c-blue.png'),
(2, 'Black Chino', 'Very good black chinos', 'f', 2, 'black', 1, 5, 20, 75, 'p-c-black.png'),
(2, 'Overcoat', 'A collared winter Coat', 'f', 1, 'black', 2, 5, 0, 45, 's-null.png'),
(2, 'Long Sleeve', 'A long sleeve shirt', 'f', 1, 'tan', 1, 5, 40, 65, 's-null.png'),
(2, 'Hoodie', 'A pullover hoodie', 'f', 1, 'grey', 1, 5, 40, 65, 's-null.png'),
(2, 'Sweater', 'Knit sweater', 'f', 1, 'red', 1, 5, 35, 55, 's-null.png'),
(2, 'Coat', 'A lightweight coat', 'f', 1, 'blue', 1, 5, 20, 55, 's-null.png'),
(2, 'Shorts', 'Cotton shorts', 'f', 2, 'tan', 1, 5, 70, 100, 'p-null.png'),
(2, 'Track pants', 'black track pants', 'f', 2, 'black', 1, 5, 35, 75, 'p-null.png');
/*------------------------------------------*\
|*             TEST STATEMENT               *|
\*------------------------------------------*/
SELECT u.username AS "Owner", 
  c.name AS "Closet",
  a.name AS "Article Name", 
  a.dirty AS "Is Dirty",
  gt.name AS "Garment Type", 
  dc.name AS "Dress Code", 
  rt.rating_value AS "Rating",
  a.temp_min,
  a.temp_max,
  a.filepath as "File Name"
FROM article AS a
JOIN garment_type AS gt ON a.garment_type_id = gt.garment_type_id
JOIN dress_code AS dc ON a.dress_code_id = dc.dress_code_id
JOIN rating AS rt ON a.rating_id = rt.rating_id
JOIN closet AS c ON c.closet_id = a.closet_id
JOIN "user" AS u ON c.user_id = u.user_id
WHERE u.username = 'lamp'
ORDER BY c.closet_id;