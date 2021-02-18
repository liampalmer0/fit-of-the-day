INSERT INTO "user" (email, username, fname, lname, "password", zipcode) 
VALUES 
('test@test.test','tester','test','user','$2a$10$ujEgiUKLcErm3AVD/QzXbOw8WC5nk.19DklnGqm74FKVejJ5U1Z5C', '60605');

INSERT INTO closet ("userId", "name", "desc")
VALUES
(1, 'Test Closet', 'A test closet for testing');

INSERT INTO "garmentType"("name", "desc") 
VALUES 
('top', NULL), 
('bottom', NULL),
('one piece','worn as a whole outfit'),
('footwear', NULL);

INSERT INTO "dressCode"("name", "desc") 
VALUES 
('casual', 'everyday clothing'),
('semi-formal', NULL),
('formal', NULL),
('very formal', NULL);

-- INSERT INTO rating("ratingValue") 
-- VALUES (1),(2),(3),(4),(5);

INSERT INTO article ("closetId", "name", "desc", dirty, "garmentTypeId", "dressCodeId", "tempMin", "tempMax", filepath)
VALUES 
(1, 'Green Shirt', 'A very good green shirt', 'f', 1, 1, 60, 80, 's-green.png'),
(1, 'Black Jeans', 'Very black jeans', 'f', 2, 1, 20, 75, 'p-j-black.png'),
(1, 'Blue Shirt', 'A very good blue shirt', 'f', 1,  1, 60, 80, 's-blue.png'),
(1, 'Brown Pants', 'Very good khakis', 'f', 2, 1, 20, 75, 'p-brown.png'),
(1, 'Yellow Shirt', 'A very good yellow shirt', 'f', 1,  1, 60, 80, 's-yellow.png'),
(1, 'Orange Shirt', 'A very good orange shirt', 'f', 1, 1, 60, 80, 's-orange.png'),
(1, 'Red Shirt', 'A very good red shirt', 'f', 1, 1, 60, 80, 's-red.png'),
(1, 'Black Shirt', 'A very good black shirt', 'f', 1, 1, 60, 80, 's-black.png'),
(1, 'Blue Jeans', 'Very good blue jeans', 'f', 2, 1, 20, 75, 'p-j-blue.png'),
(1, 'White Shirt', 'A very good white shirt', 'f', 1, 1, 60, 80, 's-white.png'),
(1, 'Blue Chino', 'Very good blue chinos', 'f', 2, 1, 20, 75, 'p-c-blue.png'),
(1, 'Black Chino', 'Very good black chinos', 'f', 2, 1, 20, 75, 'p-c-black.png'),
(1, 'Overcoat', 'A collared winter Coat', 'f', 1,  2, 0, 45, 's-null.png'),
(1, 'Long Sleeve', 'A long sleeve shirt', 'f', 1, 1, 40, 65, 's-null.png'),
(1, 'Hoodie', 'A pullover hoodie', 'f', 1,  1, 40, 65, 's-null.png'),
(1, 'Sweater', 'Knit sweater', 'f', 1, 1, 35, 55, 's-null.png'),
(1, 'Coat', 'A lightweight coat', 'f', 1,  1, 20, 55, 's-null.png'),
(1, 'Shorts', 'Cotton shorts', 'f', 2,  1, 70, 100, 'p-null.png'),
(1, 'Track pants', 'black track pants', 'f', 2, 1, 35, 75, 'p-null.png'),
(1, 'OP1', 'one piece', 'f', 3, 1, 60, 95, 'p-null.png'),
(1, 'OP2', 'one piece', 'f', 3, 1, 60, 95, 'p-null.png'),
(1, 'OP3', 'one piece', 'f', 3, 1, 60, 95, 'p-null.png'),
(1, 'OP4', 'one piece', 'f', 3, 1, 60, 95, 'p-null.png');
-- (1, 'Green Shirt', 'A very good green shirt', 'f', 1, 'green', 1, 5, 60, 80, 's-green.png'),
-- (1, 'Black Jeans', 'Very black jeans', 'f', 2, 'black', 1, 5, 20, 75, 'p-j-black.png'),
-- (1, 'Blue Shirt', 'A very good blue shirt', 'f', 1, 'blue', 1, 5, 60, 80, 's-blue.png'),
-- (1, 'Brown Pants', 'Very good khakis', 'f', 2, 'brown', 1, 5, 20, 75, 'p-brown.png'),
-- (1, 'Yellow Shirt', 'A very good yellow shirt', 'f', 1, 'yellow', 1, 5, 60, 80, 's-yellow.png'),
-- (1, 'Orange Shirt', 'A very good orange shirt', 'f', 1, 'orange', 1, 5, 60, 80, 's-orange.png'),
-- (1, 'Red Shirt', 'A very good red shirt', 'f', 1, 'red', 1, 5, 60, 80, 's-red.png'),
-- (1, 'Black Shirt', 'A very good black shirt', 'f', 1, 'black', 1, 5, 60, 80, 's-black.png'),
-- (1, 'Blue Jeans', 'Very good blue jeans', 'f', 2, 'blue', 1, 5, 20, 75, 'p-j-blue.png'),
-- (1, 'White Shirt', 'A very good white shirt', 'f', 1, 'white', 1, 5, 60, 80, 's-white.png'),
-- (1, 'Blue Chino', 'Very good blue chinos', 'f', 2, 'blue', 1, 5, 20, 75, 'p-c-blue.png'),
-- (1, 'Black Chino', 'Very good black chinos', 'f', 2, 'black', 1, 5, 20, 75, 'p-c-black.png'),
-- (1, 'Overcoat', 'A collared winter Coat', 'f', 1, 'black', 2, 5, 0, 45, 's-null.png'),
-- (1, 'Long Sleeve', 'A long sleeve shirt', 'f', 1, 'tan', 1, 5, 40, 65, 's-null.png'),
-- (1, 'Hoodie', 'A pullover hoodie', 'f', 1, 'grey', 1, 5, 40, 65, 's-null.png'),
-- (1, 'Sweater', 'Knit sweater', 'f', 1, 'red', 1, 5, 35, 55, 's-null.png'),
-- (1, 'Coat', 'A lightweight coat', 'f', 1, 'blue', 1, 5, 20, 55, 's-null.png'),
-- (1, 'Shorts', 'Cotton shorts', 'f', 2, 'tan', 1, 5, 70, 100, 'p-null.png'),
-- (1, 'Track pants', 'black track pants', 'f', 2, 'black', 1, 5, 35, 75, 'p-null.png');
/*------------------------------------------*\
|*             TEST STATEMENT               *|
\*------------------------------------------*/
SELECT u.username AS "Owner", 
  c.name AS "Closet",
  a.name AS "Article Name", 
  a.dirty AS "Is Dirty",
  gt.name AS "Garment Type", 
  dc.name AS "Dress Code", 
  -- rt."ratingValue" AS "Rating",
  a."tempMin",
  a."tempMax",
  a.filepath as "File Name"
FROM article AS a
JOIN "garmentType" AS gt ON a."garmentTypeId" = gt."garmentTypeId"
JOIN "dressCode" AS dc ON a."dressCodeId" = dc."dressCodeId"
-- JOIN rating AS rt ON a."ratingId" = rt."ratingId"
JOIN closet AS c ON c."closetId" = a."closetId"
JOIN "user" AS u ON c."userId" = u."userId"
ORDER BY c."closetId";