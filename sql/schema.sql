-- windows ps:  Get-Content .\schema.sql | pscale shell flux-database dev
create table json_test (
	`data` json,
	`email_quoted` varchar(255) as (`data`->"$.email"),
	`email_unquoted` varchar(255) as (`data`->>"$.email") stored,
	`domain_virtual` varchar(255) as (substring_index(`email_quoted`,'@', -1)) virtual,
	`domain_stored` varchar(255) as (substring_index(`email_unquoted`, '@', -1)) stored
);

insert into json_test (data) values ("{ \"name\": \"jamon\", \"email\": \"jamon@jamon.com\" }")
