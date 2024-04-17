\c nc_news_test;
-- article_id, title, topic, author, created_at, votes, article_img_url
SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at;


--psql -f scratchPad.sql > output.txt


