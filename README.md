# TODO List

## 1. 이번 주 내로 해결

* franchise create 부분 마무리 (대표메뉴부분)
* 사진데이터 파싱해서 넘겨주기
* 엔터가 포함된 긴 텍스트가 프론트에서 넘어올 때 \n, </br> 중 어느 것인지 확인하기

## 2. 비교적 이후 우선순위

* DB 전화번호 관련한 스키마 `-` 빼고 수정하기
* 모든 페이지네이션 관련 api 들 contents 부분 15개, 30개로 수정

## 3. publishing 이후 수정해야 할 것

* naver, kakao Oauth client 아이디로 수정할 것.
 > 위에 거 처리할 때 domain 정해지면 그걸로 수정

* domain 구매
* aws 서버 client 것으로 바꿀 것.

# Question List

## 1. to back-end engineer

1. ~~search api 에서 aaa bbb ccc 로 검색했을 때 aaa 가 먼저 정렬되도록 하려면 어떻게?~~
2. ~~이미지, 동영상을 업로드 할 때 create 를 할 때 링크를 따로 넣어줘야 함?~~
3. ~~DB 에 대한 필터링 걸 때 노하우? if 문이 너무 많아져서 복잡해 보임~~
4. ~~views 를 올리는 기준은 detail api 인데 이 api가 get method 이다. 그런데 views 를 올리려면 update 가 있어야 한다. 즉 post 를 써야 하는데 이 문제는 어떻게 해결해야 함? 지금 생각나는 건 2가지~~
~~--> 1. get() 으로 정보 가져오고 이후 바로 post 로 views update~~
~~--> 2. 애초에 detail api 를 post 로 요청해서 views update 를 동시에 처리~~
5. ~~naver Oauth api 관련해서 `/api/users/exist` 와 `/api/users/add` 2개의 api 가 던져주는 access_token 의 차이점은? 기본적으로 BearerAuth 검증을 위한 token 은 exist 에 존재.~~
6. client 가 만약 쿠키에 토큰을 가지고 있을 때 그 토큰이 유효한지 어떻게 검증해야 함?
7. front 에서 넘어오는 개행이 포함된 문자열은 db 에 저장할 때 `\n` 로 저장됨?

## 2. to front-end engineer

# 요청사항

## 1. To Front-End

1. kakao, naver login 부분에서 토큰 넘겨주면 front 측에서 쿠키에 담아줘야 함
2. naver 같은 경우에 callback 처리중입니다... 가 body 에 뜨는 부분은 쿠키에 임시로 토큰 담아서 /add 로 리다이렉트 해 줘야 함. 이후 임시로 썼던 쿠키는 삭제하고 add 이후에 response 에 access_token 을 쿠키에 담아야 함.

## To Client

1. admin 페이지에서 업종, 찾는 물건은 정해진 값인가?
    --> 업종은 프랜차이즈에서 정한 20개
    --> 찾는 물건은 정해진 값이 아님
2. 업종이랑 찾는 물건의 차이점은?
