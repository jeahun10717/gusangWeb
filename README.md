# TODO List
## 1. 이번 주 내로 해결

* **S3 코드 적용하기**
  > 1. s3 코드 관련해서 의문점 질문하고 해결하기
  > 2. s3 에 의한 newsale, interior, franchise 소스 수정
  > ==> 위는 create 관련해서 이미지, 영상에 해당하는 db 스키마를 따로 처리해야 함.
  > ==> create, update 부분은 따로 빼서 정리해야 함
  > 3. DB image 관련 스키마 다시 정하기 --> text 1줄이 아니라 여러개로 정리

* newSale api 권한 설정하기
* kakao oauth 과정에서 전화번호 가져오기
* naver oauth 적용시키기
* search 검색에 대한 거 다시 코딩해야 함
  > search 에서 첫번째 우선순위 필터는 검색어 2번째 필터는 조회수순으로 할 것

* consult api 에서 auth 설정해야 함. **`./api/consult/consult.ctrl.js` 39번째 줄**
  > 1. interior, franchise 상담요청은 auth == 0
  > 2. newSale 상담요청은 auth == 1 || 2 || 3
  > 3. 상담 리스트 접근권한은 auth == 2 || 3
  > 4. 상담 리스트 삭제권한은 auth == 2 || 3

* consult pagination api 에서 검색 기능 추가해야 함.
* 모든 api 의 auth 설정하기

* 모든 api 의 pagination 에서 contents 변수 갯수 수정해야 함
  > newSale, franchise, interior 는 15개
  > consult 부분은 30개

* DB schema 수정 : 모두 수정한 뒤 mysql 에서 alter 로 수정해야 함
 > 1. interior, newSale db schema 중에 평수 관련 double 로 수정
 > 2. 전화번호 관련 태그들 전부 varchar(13) 으로 통일해야 함
 > 3. users realty_name varchar(50) 으로 변경
 > 4. users realty_adress -> realty_address 로 수정

* franchise 부분 DB 스키마 추가 작성해야 함

* ~~모든 api route 에서 search 관련 api 들 조회수순, 날짜순이 필요?~~ => 조회수순만 할거임
* ~~위도 경도 관련 알아보기~~
* ~~localCode CRUD 작성해야 함~~
* ~~최신순, 조회수순 up, down 도 설정해야 함(위의 `order=desc` 부분)~~
* ~~`newsale.get('/show/:type/:pagenum')`
-->`newsale.get('/show?type=views&pagenum=3&order=desc&local={지역코드}')` 로 바꾸기~~
* ~~DB model 소스 간략화~~
* ~~상담요청 DB 작성, CRUD 작성~~
* ~~부동산 관련자들이 자신이 요청한 정보를 볼 수 있게 해야 함?~~
* ~~admin 페이지에서 상담요청한 목록 불러 올 때 부동산 사람들한테 보여줄 표에서 필터 걸기~~
* ~~newSale 에서 회원가입 할 때 추가기입사항 안했을 때 어떻게 해야 함?~~


## 2. 비교적 이후 우선순위

* 공정거래위원회 api 사용가능한지 확인
* swagger 정리하기
* DB 전화번호 관련한 스키마 `-` 빼고 수정하기
* 저장소에 올릴 DB 스키마는 empty로 처리하기
* select * where ~ 에서 * 부분 특정하기
* ~~RDS, local DB 물어보기
rds 는 가격이 비싼 대신 자동백업등을 지원해서 안전함. local DB 는 가격이 싼 대신 DB 가 날아가면 복구가 불가능함~~

## 3. publishing 이후 수정해야 할 것

* naver, kakao Oauth client 아이디로 수정할 것.
 > 위에 거 처리할 때 domain 정해지면 그걸로 수정

* domain 구매
* aws 서버 client 것으로 바꿀 것.
* kosis(franchise api) client 것으로 바꿀 것.

# Question List

## 1. to back-end engineer

1. search api 에서 aaa bbb ccc 로 검색했을 때 aaa 가 먼저 정렬되도록 하려면 어떻게?
2. 이미지, 동영상을 업로드 할 때 create 를 할 때 링크를 따로 넣어줘야 함?
3. DB 에 대한 필터링 걸 때 노하우? if 문이 너무 많아져서 복잡해 보임.

## 2. to front-end engineer

## 3. to client

1. admin 페이지에서 업종, 찾는 물건은 정해진 값인가?
    --> 업종은 프랜차이즈에서 정한 20개
    --> 찾는 물건은 정해진 값이 아님
2. 업종이랑 찾는 물건의 차이점은?
