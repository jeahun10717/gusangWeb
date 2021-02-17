create table newSale(
    id int unsigned auto_increment primary key,
    contents_name varchar(40), -- : 컨텐츠에 표시될 텍스트, 검색될 때 사용
    contents_type varchar(30), -- 영상,360 vr, 주거, 상가
    local_address varchar(10), -- : 지역명에 대한 정보 저장, ex) 연제구, 부산진구 등등
                               -- 프론트에서 데이터 정해줘야 할 듯
    thumnail_image varchar(256), -- : 대표 이미지
    -- auth ,  -- : 이 부분은 newSale 을 따로 뺐으니까 필요없을 듯함 
    preview_video_link varchar(256), -- 미리보기 영상 로컬링크
    youtube_info_link varchar(256), -- 안내영상 링크(youtube link)
    youtube_inner_link varchar(256), -- 내부영상 링크(youtube link)
    vr_link_inner varchar(256), -- 내부 vr 영상을 위한 링크(youtube link)
    vr_link_outer varchar(256), -- 외부 vr 영상을 위한 링크(youtube link)
    vr_link_typeA varchar(256), -- type A vr 링크
    vr_link_typeB varchar(256), -- type B vr 링크

    vr_image text, -- 사진 슬라이드에 들어갈 이미지 로컬링크
    -- 이미지가 여러개 인데 만약에 동적(사진 개수가 정해지지 않았을 때)일 경우에는 어떻게 해야 함?
    -- 위의 질문이 구현이 어렵다면 그냥 특정 개수로 태그를 달아서 하는 게 낫나?

    info_image text, -- 안내자료에 들어갈 이미지 로컬링크

    -- 설명 부분
    newsale_info_type int,            -- 1. 타입
    newsale_info_housenum int,        -- 2. 총 세대수
    newsale_info_parknum int,         -- 3. 주차대수
    newsale_info_width int,           -- 4. 평형대
    newsale_info_price int,           -- 5. 가격
    newsale_info_perprice int,        -- 6. 평당가격
    newsale_info_roomnum int,         -- 7. 방 개수
    newsale_info_bathroomnum int,     -- 7. 욕실
    newsale_info_option varchar(10),  -- 8. 옵션
    newsale_info_floornum int,        -- 9. 층수
    newsale_info_etc varchar(256),    -- 10. 기타설명

    -- 카카오 맵을 위한 위도 경도 주소
    kakaomap_info_latitude double,      -- 위도
    kakaomap_info_longtitude double,    -- 경도
    kakaomap_info_address varchar(256), -- 주소

    registAt datetime default now(),
    updateAt datetime,
    views int -- 조회수
)