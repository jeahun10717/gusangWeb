create table franchise(
    id int unsigned auto_increment primary key,
    franchise_name varchar(40), -- : 컨텐츠에 표시될 텍스트, 검색될 이름
    franchise_tag varchar(10), -- : 프론트에서 정해줘야 함 ex) 양식, 중식, 분식 등등
    franchise_logo varchar(256), -- : franchise 로고
    
    -- 가맹정보 부분 //////////////////////////////////////////////////
    franchise_storenum int,     -- 매장 수
    franchise_cost int,         -- 창업 비용
    franchise_monthSale int,    -- 월 평균 매출액
    -- franchise_name --> 이 부분은 위에 등록 해 두었음 : 상호명   
    franchise_ceo varchar(10),  -- 대표
    franchise_type varchar(10), -- 사업자 유형
    franchise_address varchar(256), -- 주소
    franchise_registnum varchar(20), -- 사업자등록번호
    franchise_crn varchar(20),  -- 법인등록번호
    franchise_phone varchar(11), -- 대표 번호
    franchise_fax varchar(20),  -- 대표 팩스 번호
    franchise_detailsale varchar(256), -- 브랜드 창업 비용
                                       -- 도표에 들어가는 자료인데 구분자로 여래개 받아서 넣을 듯
    -- 그래프용 월평균 매출
    -- 그래프용 가맹점 증감추이
    -- 그래프용 가맹점 계약 현황
    -- ////////////////////////////////////////////////////////////////

    brand_introduce varchar(256), -- 브랜드 정보 / 브랜드 소개
    brand_menu varchar(256), -- 브랜드 정보 / 브랜드 대표메뉴
    brand_competitiveness varchar(256), -- 브랜드 정보 / 브랜드 경쟁력
    brand_video varchar(256), -- 브랜드 정보 / 브랜드 홍보영상


    registAt datetime default now(),
    updateAt datetime,
    views int, -- 조회수
)
