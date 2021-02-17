use gusang;
select * from localCode;
ALTER TABLE localCode CONVERT TO character SET utf8; -- 한글 가능하도록 설정
drop table localCode;

create table localCode (
    city varchar(30),
    gu varchar(12),
    code varchar(10) primary key -- newSale.local_address 에 저장하기
)
