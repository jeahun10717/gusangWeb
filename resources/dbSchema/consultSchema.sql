create table consult (
    id int unsigned auto_increment primary key,
    consult_req_type varchar(30), -- 신규분양, 인테리어, 프랜차이즈(newSale, interior, franchise)
    consult_name varchar(256), -- 상담의 이름
    consult_req_email varchar(256),

    consult_realty_name varchar(50),
    consult_realty_phoneNum varchar(11),

    consult_req_name varchar(10), -- 상담 요청한 사람의 이름
    -- consult_req_type varchar(30), 처음 받은 기획서에서 상담사항에 해당하는 부분임 위에서 가져오면 됨
    consult_req_phone varchar(13), -- 상담 요청한 사람의 전화번호
    -- -----------------------------------------------------------------
    -- consult_req_sector : 이거는 모든 요청에 포함
    -- consult_req_found : 이거는 부동산에만 해당 나머지는 기본값으로
    consult_req_sector varchar(40), -- 상담 요청한 업종
    consult_req_found varchar(40), -- 상담 요청한 찾는 물건
    -- -----------------------------------------------------------------

<<<<<<< HEAD
    consult_manager_name varchar(10), -- 상담요청에 대한 담당자 이름

    registAt datetime default now(),
    updateAt datetime
=======
    consult_manager_name varchar(10) -- 상담요청에 대한 담당자 이름
>>>>>>> bd1f73d4256330cdd94a3223c4e6b546110af3dd
)
