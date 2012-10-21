PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE files(
	item varchar(6) NOT NULL PRIMARY KEY, 
	timestamp timestamp, 
	path varchar(256), 
	filename varchar(100), 
	tags varchar(100)
);
CREATE UNIQUE INDEX `item_unique` on `files` (`item` ASC);
CREATE UNIQUE INDEX `path_unique` on `files` (`path` ASC);
CREATE INDEX `timestamp` on `files` (`timestamp` ASC);
COMMIT;
