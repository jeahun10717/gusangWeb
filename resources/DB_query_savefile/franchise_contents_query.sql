use gusang;
select * from franchise;
-- test query------------------------------------------------------------------------------
drop table franchise;
alter table franchise add brand_comp_imgs text;

alter table franchise add  brandcost_fran int;
alter table franchise add  brandcost_edu int;
alter table franchise add  brandcost_depo int;
alter table franchise add  brandcost_etc int;
alter table franchise add  brandcost_intr int;
-- ----------------------------------------------------------------------------------------
create table franchise(
    id int unsigned auto_increment primary key,
    franchise_name varchar(40), -- : 컨텐츠에 표시될 텍스트, 검색될 이름
    franchise_tag varchar(10), -- : 프론트에서 정해줘야 함 ex) 양식, 중식, 분식 등등
    franchise_logo text, -- : franchise 로고
    
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
	brandcost_standard_width int,
	brandcost_fran int,
    brandcost_edu int,
    brandcost_depo int,
    brandcost_etc int,
    brandcost_intr int,
    -- 아래 3개의 정보들은 배열로 넣는데 2010~2021 순인데 년도가 수정되면 추가할 수 있음
    -- 그래프용 연별 매출
    franchise_month_sales varchar(256),
    -- 그래프용 가맹점 증감추이
    franchise_market_num varchar(256),
    -- 그래프용 가맹점 계약 현황
    franchise_market_contract varchar(256),
    
    -- ////////////////////////////////////////////////////////////////

    brand_introduce text, -- 브랜드 정보 / 브랜드 소개
    brand_menu text, -- 브랜드 정보 / 브랜드 대표메뉴
	brand_menutext text,
	brand_competitiveness text, -- 브랜드 정보 / 브랜드 경쟁력-->pdf 로 처리할거임
    brand_comp_imgs text,
    brand_video text, -- 브랜드 정보 / 브랜드 홍보영상
    -- 위의 brand_video 는 영상파일인지 youtube 링크인지 구분해서 넣어줄 것

		blog_review varchar(256),
    
    registAt datetime default now(),
    updateAt datetime,
    views int default 0 -- 조회수
);
