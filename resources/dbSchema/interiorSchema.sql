create table interior(
    id int unsigned auto_increment primary key,
    contents_name varchar(40), -- : 컨텐츠에 표시될 텍스트
    contents_type varchar(20), -- 영상,360 vr, 주거, 상가
    local_address varchar(10), -- : 지역명에 대한 정보 저장, ex) 연제구, 부산진구 등등
                               -- 프론트에서 데이터 정해줘야 할 듯
    thumnail_image varchar(256),
    -- auth ,  -- : 이 부분은 newSale 을 따로 뺐으니까 필요없을 듯함 
    preview_video_link varchar(256), -- 미리보기 영상 로컬링크
    youtube_link varchar(256), -- 해당 컨텐츠의 유튭 영상
    vr_link_old varchar(256), -- 시공 전 vr 영상을 위한 링크
    vr_link_new varchar(256), -- 시공 후 vr 영상을 위한 링크

    construct_time varchar(256), -- 인테리어/상세보기 부분 공사기간
    construct_cost varchar(256), -- 인테리어/상세보기 부분 공사비용
    construct_company varchar(256), -- 인테리어/상세보기 부분 공사업체
    construct_info varchar(256), -- 인테리어/상세보기 부분 공사내역

    image_link text, -- 사진 슬라이드에 들어갈 이미지 로컬링크
    -- 이미지가 여러개 인데 만약에 동적(사진 개수가 정해지지 않았을 때)일 경우에는 어떻게 해야 함?
    -- 위의 질문이 구현이 어렵다면 그냥 특정 개수로 태그를 달아서 하는 게 낫나?

    -- 견적관련
    interior_info_location varchar(256),  -- 1. 위치
    interior_info_width int,              -- 2. 평수
    interior_info_period varchar(256),    -- 3. 공사기간
    interior_info_price int,              -- 4. 비용
    interior_info_history varchar(256),   -- 5. 시공내역
    interior_info_etc varchar(256),       -- 6. 기타설명
    --

    -- 카카오 맵을 위한 위도 경도 주소
    kakaomap_info_latitude double,      -- 위도
    kakaomap_info_longtitude double,    -- 경도
    kakaomap_info_address varchar(256), -- 주소


    registAt datetime default now(),
    updateAt datetime,
    views int -- 조회수
)
