INSERT INTO outfit ("articleArticleId", "partnerArticleId", "name", "favorite", "createdAt", "updatedAt")
(SELECT "t"."articleId" as "articleArticleId", "btm"."articleId" as "partnerArticleId", 'CreatedOutfit' AS "name", false AS "favorite", NOW() as "createdAt", NOW() as "updatedAt" 
FROM article as t
CROSS JOIN (SELECT "articleId" FROM article WHERE "garmentTypeId" = 2 AND "closetId" = 2) AS btm
WHERE "t"."garmentTypeId" = 1 AND "t"."closetId" = 2)
UNION
(SELECT "articleId", "articleId", "name", false AS "favorite", NOW(), NOW()
FROM article
where "garmentTypeId" = 3 AND "closetId" = 2);
