testing serverless / sql stuff ftw! 🌌

## ui

- [ ] table

## drivers

- [x] mysql / planetscale

## schema

- [ ] prisma

## orm

- [x] database-js / raw
- [ ] prisma
- [ ] drizzle
- [ ] Kysely

## common

- [x] test common joins query
- [x] test virtual generated column (raw only)
- [x] test stored generated column (raw only)
- [x] test on duplicate update query
- [x] test on duplicate ignore query
- [x] test EXPLAIN query
- [x] test access query CONST aka -> select * from table where id = 100
- [x] test index with cuid id
- [x] test index with auto_increment id
- [x] test prefixed selectivity
- [ ] test many2many index query
- [ ] test many2many no-index query
- [ ] test dummy FULL OUTER JOIN

## advanced

- [x] test composite index
- [x] test covering index
- [ ] test function-based index (raw only)
- [ ] test json-based index (raw only)
- [*] test wildcard index
- [ ] test derived data instead of a wildcard (raw only)

## full-text

- [x] test access query FULL-TEXT aka -> select * from table match(col) against
- [x] test access query FULL-TEXT in Boolean mode

## queries

- [x] analyze
- [x] query obfuscation
- [x] redundant queries
- [x] subqueries
- [x] cte
- [x] recursive cte
- [x] union
- [x] windows functions
- [x] sort
- [x] deterministic sort
- [x] indexed sort
- [x] composite indexed sort
- [x] conditional counting

## scenarios

- [x] composite primary key vs composite unique
- [x] hashing with md5 for compacting data
- [x] simple queue
- [x] summary tables
- [ ] meta tales: SELECT * FROM film_narrow INNER JOIN film_addendum ON
      film_narrow.id = film_addendum.film_id
- [x] offset pagination
- [x] cursor pagination
