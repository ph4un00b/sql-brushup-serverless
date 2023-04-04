CREATE TABLE names_100 (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- from chatgpt
INSERT INTO names_100 (name)
SELECT CONCAT(
    SUBSTRING('abcdefghijklmnopqrstuvwxyz', FLOOR(RAND() * 26) + 1, 1),
    SUBSTRING('abcdefghijklmnopqrstuvwxyz', FLOOR(RAND() * 26) + 1, 1),
    SUBSTRING('abcdefghijklmnopqrstuvwxyz', FLOOR(RAND() * 26) + 1, 1),
    SUBSTRING('abcdefghijklmnopqrstuvwxyz', FLOOR(RAND() * 26) + 1, 1),
    SUBSTRING('abcdefghijklmnopqrstuvwxyz', FLOOR(RAND() * 26) + 1, 1),
    SUBSTRING('abcdefghijklmnopqrstuvwxyz', FLOOR(RAND() * 26) + 1, 1),
    SUBSTRING('abcdefghijklmnopqrstuvwxyz', FLOOR(RAND() * 26) + 1, 1)
)
FROM (
    SELECT n FROM (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) a,
                 (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) b
) numbers
LIMIT 100;
