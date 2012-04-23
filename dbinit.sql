-- Create message table + sequence
CREATE SEQUENCE user_id_seq;
CREATE TABLE users (
  uid int not null default nextval('user_id_seq'),
  username varchar(20),
  password varchar(20),
  email varchar(30),
  tstamp date,
  primary key (uid)
);

CREATE SEQUENCE game_id_seq;
CREATE TABLE games (
  gid int not null default nextval('game_id_seq'),
  uid foreign key (uid),
  game varchar(500)
  tstamp date,
  primary key (uid)
);

-- Test Data:
#INSERT INTO messages VALUES (default, 'Test message 1' , now());
#INSERT INTO messages VALUES (default, 'Test message 2' , now());
#INSERT INTO messages VALUES (default, 'Test message 3' , now());
#INSERT INTO messages VALUES (default, 'Test message 4' , now());
#INSERT INTO messages VALUES (default, 'Test message 5' , now());
#INSERT INTO messages VALUES (default, 'Test message 6' , now());
#INSERT INTO messages VALUES (default, 'Test message 7' , now());
#INSERT INTO messages VALUES (default, 'Test message 8' , now());
#INSERT INTO messages VALUES (default, 'Test message 9' , now());
#INSERT INTO messages VALUES (default, 'Test message 10', now());
