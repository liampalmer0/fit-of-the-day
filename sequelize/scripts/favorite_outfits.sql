SELECT "article"."articleId",
 "article"."name",
 "partner"."articleId" AS "partner.articleId",
 "partner"."name" AS "partner.name",
 "partner->outfit"."articleArticleId" AS "partner.outfit.articleArticleId",
 "partner->outfit"."partnerArticleId" AS "partner.outfit.partnerArticleId",
 "partner->outfit"."name" AS "partner.outfit.name",
 "partner->outfit"."favorite" AS "partner.outfit.favorite"
 FROM "public"."article" AS "article" 
 INNER JOIN ( "public"."outfit" AS "partner->outfit" 
  INNER JOIN "public"."article" AS "partner" ON "partner"."articleId" = "partner->outfit"."partnerArticleId"
  ) ON "article"."articleId" = "partner->outfit"."articleArticleId" 
  AND "partner"."garmentTypeId" IN (2,3) 
  WHERE ("article"."closetId" = $1 
    AND "article"."garmentTypeId" IN (1,3) 
    AND "partner->outfit"."favorite" = 't');