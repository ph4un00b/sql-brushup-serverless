testing serverless / sql stuff ftw! 🌌

## drivers

- [x] mysql / planetscale

## orm

- [ ] prisma
- [ ] drizzle
- [x] raw / database-js

## common

- [x] test common joins query
- [x] test virtual generated column
- [x] test stored generated column
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

- [ ] test composite index
- [ ] test access query REF aka -> select * from table where col = 'some'
- [ ] test access query FULLTEXT aka -> select * from table match(col) against
      'some'
- [ ] test access query RANGE aka -> select * from table where id < 100
- [ ] test access query INDEX aka -> select col from table where index =! 'some'
- [ ] test access query ALL aka -> select * from table where index =! 'some'
