INSERT INTO closet ("userId", "name", "desc")
VALUES
(6, 'TensorCloset', NULL);

INSERT INTO article (closetId, "name", "desc", dirty, garmentTypeId, color, dressCodeId, ratingId, tempMin, tempMax, filepath)
VALUES 
(5, 'TShirt', '', 'f', 1, 'white', 1, 5, 60, 80, 's-white.png'),
(5, 'Longsleeve', '', 'f', 1, 'tan', 1, 5, 40, 65, 'null.png'),
(5, 'Coat', '', 'f', 1, 'black', 2, 5, 0, 45, 'null.png'),
(5, 'Hoodie', '', 'f', 1, 'grey', 1, 5, 40, 65, 'null.png'),
(5, 'Sweater', '', 'f', 1, 'red', 1, 5, 35, 55, 'null.png'),
(5, 'Jeans', '', 'f', 2, 'black', 1, 5, 20, 75, 'p-j-black.png'),
(5, 'Pants', '', 'f', 2, 'brown', 1, 5, 20, 75, 'p-brown.png'),
(5, 'Chino', '', 'f', 2, 'blue', 1, 5, 20, 75, 'p-c-blue.png'),
(5, 'Sweatpants', '', 'f', 2, 'black', 1, 5, 35, 75, 'null.png'),
(5, 'Shorts', '', 'f', 2, 'tan', 1, 5, 70, 100, 'null.png');

