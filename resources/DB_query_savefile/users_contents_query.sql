use gusang;
select * from users;

create table users(
	id int unsigned auto_increment primary key ,
    uuid binary(16) unique,
    login_type int, -- 1 : 네이버, 2 : 카카오
    login_id varchar(256) unique,
    Auth int default 0, -- 3: 총관리자, 2: 일반관리자, 1: 부동산유저, 0: 일반유저
	pw varchar(60),
    phone varchar(11),
    name varchar(10),
    realty_name varchar(10),
    realty_adress varchar(256),
    realty_owner_name varchar(10),
	realty_owner_phone varchar(11),
    registAt datetime default now()
);