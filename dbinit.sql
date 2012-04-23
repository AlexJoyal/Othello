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
  uid int,
  game varchar(1000),
  tstamp date,
  primary key (gid),
  foreign key (uid) references users (uid)
);

