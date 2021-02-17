create table realtyConsult (
    id int unsigned auto_increment primary key,
    realty_name varchar(50), -- 부동산 이름
    realty_phone varchar(13), -- 부동산 전화번호
    realty_contents varchar(50), -- 찾는 물건
    realty_etc varchar(256), -- 기타사항

    request_time datatime default now(), -- 요청시간
    manager_name varchar(10) -- 담당자
)

