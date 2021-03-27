# TODO List

## 1. 이번 주 내로 해결

* franchise, interior, newSale delete api 에서 S3 데이터 지우는 소스 추가해야 함.
* franchise, interior, newSale 바이너리 데이터를 사용하는 api 들 모두 200 이 아닌 다른 status 가 떴을 때
  S3 에 업로드 된 자료들 지워야 함.
* 링크가 직접 들어가는(https:// 를 포함하는) api 들은 joi 검증 만들어야 함
* S3 업로드를 하는 api 들 중 갯수제한이 있을 때 그 갯수를 `{file}.ctrl.js` 파일에서 검증하는 소스 필요함.
* xss 적용하기
* S3 모듈 중에 extention 적용하기
* naver, kakao 퍼블리싱 게정 적용하기
* franchise create 부분 마무리 (대표메뉴부분)
* 엔터가 포함된 긴 텍스트가 프론트에서 넘어올 때 \n, </br> 중 어느 것인지 확인하기

## 2. publishing 이후 수정해야 할 것

* naver, kakao Oauth client 아이디로 수정할 것.
 > 위에 거 처리할 때 domain 정해지면 그걸로 수정

* domain 구매
* aws 서버 client 것으로 바꿀 것.
* ssl 적용하기

# Question List

## 1. to back-end engineer

1. `newsale`, `interior`, `frachise` 의 바이너리 데이터를 다루는 api 에서 만약 `400` 을 던져줄 때 S3 에서 데이터 지우는 건 구현 했음. 혹시 내가 한 방법 말고 조금 더 간단한 방법은 없나?
2. `newSale.ctrl.js` 파일에서 `exports.delete` 함수에서 반복적으로 사용되는 것들 간략화 하는 방법 없나?

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
