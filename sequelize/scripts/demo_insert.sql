INSERT INTO event("userId", "name", "desc", "dressCodeId", "dateTimeStart", "dateTimeEnd") 
VALUES 
(2,'Study at Velma''s', 'History & Archaeology', 1, TIMESTAMP '2021-03-07 18:00:00-05', TIMESTAMP '2021-03-07 21:00:00-05'),
(2,'Study at Velma''s', 'Biological Diversity', 1, TIMESTAMP '2021-03-07 18:00:00-05' + interval '1 week', TIMESTAMP '2021-03-07 21:00:00-05' + '1 week'),
(2,'Study at Velma''s', 'Faust & Astrophysics', 1, TIMESTAMP '2021-03-07 18:00:00-05' + interval '2 weeks', TIMESTAMP '2021-03-07 21:00:00-05' + '2 weeks'),
(2,'Cara & John Wedding', 'Outdoor wedding', 3, (CURRENT_TIMESTAMP - interval '2 weeks 3 days'), (CURRENT_TIMESTAMP - interval '2 weeks 2 days')),
(2,'Aisha Farewell Party', 'Moving to EU', 2, (CURRENT_TIMESTAMP - interval '1 week 3 days'), (CURRENT_TIMESTAMP - interval '1 week 2 days 21 hours')),
(2,'Mystery with Daphne & Fred', 'Spooky Carnival', 2, (CURRENT_TIMESTAMP - interval '2 days 6 hours'), (CURRENT_TIMESTAMP - interval '2 days 2 hours')),
(2,'IT Presentation','School presentation', 1, (CURRENT_TIMESTAMP + interval '3 hour'), (CURRENT_TIMESTAMP + interval '5 hours')),
(2,'Lunch with Shaggy & Scooby', 'Dog food for some reason', 1, (CURRENT_TIMESTAMP + interval '5 hours'), (CURRENT_TIMESTAMP + interval '7 hours')),
(2,'Omar Party','Friendly get together', 1, (CURRENT_TIMESTAMP + interval '3 days'), (CURRENT_TIMESTAMP + interval '3 days 5 hours')),
(2,'Dinner w/ Sofia','Date with Sofia from Tallinn', 2, (CURRENT_TIMESTAMP + interval '1 week'), (CURRENT_TIMESTAMP + interval '1 week 2 hours')),
(2,'Henry''s Birthday','Henry''s surprise birthday party at his place', 1, (CURRENT_TIMESTAMP + interval '2 weeks'), (CURRENT_TIMESTAMP + interval '2 weeks 4 hours'));

INSERT INTO article ("closetId", "name", "desc", dirty, "garmentTypeId", "dressCodeId", "tempMin", "tempMax", "filepath", "color")
VALUES 
(2, 'T-Shirt', 'Green T-shirt', 'f', 1, 1, 60, 80, 'green.png', 9158994),
(2, 'T-Shirt', 'Blue T-shirt', 'f', 1,  1, 60, 80, 'blue.png', 2922736),
(2, 'T-Shirt', 'Big yellow T-shirt', 'f', 1,  1, 60, 80, 'yellow.png', 16707710),
(2, 'T-Shirt', 'Orange T-shirt', 'f', 1, 1, 60, 80, 'orange.png', 16619303),
(2, 'T-Shirt', 'Red T-shirt', 'f', 1, 1, 60, 80, 'red.png', 14826299),
(2, 'T-Shirt', 'Black T-shirt', 'f', 1, 1, 60, 80, 'black.png', 2171169),
(2, 'T-Shirt', 'White T-shirt', 'f', 1, 1, 60, 80, 's-white.png', 16777215),
(2, 'T-Shirt', 'Pink T-shirt', 'f', 1, 1, 60, 80, 'pink.png', 16698834),
(2, 'Jeans', 'Black jeans', 'f', 2, 1, 25, 75, 'j-black.png', 3158064),
(2, 'Pants', 'Blue chino', 'f', 2, 2, 25, 70, 'p-blue.png', 3294285),
(2, 'Pants', 'Brown chino', 'f', 2, 2, 25, 70, 'p-brown.png', 3294285),
(2, 'Jeans', 'Blue jeans', 'f', 2, 1, 30, 80, 'j-blue.png', 6454665),
(2, 'Shorts', 'Cotton shorts', 'f', 2,  1, 70, 120, 'sh-black.png', 2171169),
(2, 'Sweatshirt', 'grey sweatshirt', 'f', 1,  1, 45, 65, 'sw-grey.png', 10395294),
(2, 'Sweatshirt', 'tan sweatshirt', 'f', 1, 1, 45, 65, 'sw-tan.png', 10521216),
(2, 'Button up', 'Cotton button up shirt', 'f', 1, 2, 45, 70, 's-null.png', 10395294),
(2, 'Tuxedo', 'Fancy tuxedo', 'f', 3, 3, 40, 70, 's-null.png', 0),
(2, 'Ball gown', 'Fancy dress', 'f', 3, 3, 40, 80, 's-null.png', 2922736),
(2, 'Sundress', 'casual dress', 'f', 3, 1, 65, 90, 's-null.png', 14826299);