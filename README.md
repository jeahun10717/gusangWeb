# TODO List

## 1. 이번 주 내로 해결

* newSale, interior api 에서 contents_type 으로 필터링 해야 함.
* franchise 부분에  

* franchise 부분 DB 스키마 추가 작성해야 함
  > 1. 브랜드 소개 부분은 일단은 text 로 넣고 나중에 pdf 로 서빙할지 정하기
  > 2. 브랜드정보-대표메뉴 부분은 이미지만 --> 이미지 + 이미지이름 까지 할지 정하기
  > 3. 브랜드정보-브랜드소개,브랜드 경쟁력 --> pdf 로 처리해야 할지 나중에 물어보기


* S3 관련 작성
  > 1. franchise, interior 에 소스 적용
  > 2. upImg api 에서 에러처리 확인해야 함

* swagger 정리하기
* detail 호출하는 모든 api 에서 views 올려야 함(이거 관련 질문사항 있음)
* user table 에 대한 CRUD 작성
* kakao oauth 과정에서 전화번호 가져오기
* naver oauth 적용시키기
* user api 의 CRUD 작성해야 함
* consult setManager api 담당자가 있는지 체크해야 함
* consult pagination api 에서 검색 기능 추가해야 함.
* 모든 api 의 auth 설정하기

* 모든 api 의 pagination 에서 contents 변수 갯수 수정해야 함
  > newSale, franchise, interior 는 15개
  > consult 부분은 30개


## 2. 비교적 이후 우선순위

* 공정거래위원회 api 사용가능한지 확인
* DB 전화번호 관련한 스키마 `-` 빼고 수정하기
* 저장소에 올릴 DB 스키마는 empty로 처리하기
* select * where ~ 에서 * 부분 특정하기
* 모든 페이지네이션 관련 api 들 contents 부분 15개, 30개로 수정
* x

## 3. publishing 이후 수정해야 할 것

* naver, kakao Oauth client 아이디로 수정할 것.
 > 위에 거 처리할 때 domain 정해지면 그걸로 수정

* domain 구매
* aws 서버 client 것으로 바꿀 것.

# Question List

## 1. to back-end engineer

1. search api 에서 aaa bbb ccc 로 검색했을 때 aaa 가 먼저 정렬되도록 하려면 어떻게?
2. 이미지, 동영상을 업로드 할 때 create 를 할 때 링크를 따로 넣어줘야 함?
3. DB 에 대한 필터링 걸 때 노하우? if 문이 너무 많아져서 복잡해 보임
4. views 를 올리는 기준은 detail api 인데 이 api가 get method 이다. 그런데 views 를 올리려면 update 가 있어야 한다. 즉 post 를 써야 하는데 이 문제는 어떻게 해결해야 함? 지금 생각나는 건 2가지
--> 1. get() 으로 정보 가져오고 이후 바로 post 로 views update
--> 2. 애초에 detail api 를 post 로 요청해서 views update 를 동시에 처리

## 2. to front-end engineer

## 3. to client

1. admin 페이지에서 업종, 찾는 물건은 정해진 값인가?
    --> 업종은 프랜차이즈에서 정한 20개
    --> 찾는 물건은 정해진 값이 아님
2. 업종이랑 찾는 물건의 차이점은?
