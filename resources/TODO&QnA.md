# 1. TODO list

## 1.1. 회원정보 수정 method 작성
## 1.2. DB 스키마 확정되지 않은 정보를 제외하고 작성
## 1.3. 계약서 작성

---

# 2. Question

## 2.1. isNew 관련 질문

### 2.1.Q. : 파일 상 32 번째 줄

**[ ./src/lib/login/index.js ]**

```javascript
const { user } = require('../../databases');
const uuid = require("../uuid");
const token = require('../token');

exports.regist = async (query)=>{
    const userData = await user.isExist(query.login_type, query.login_id);
    // 가입이 된 유저인지 검증
    console.log(userData);
    if(userData){   //가입이 되어 있을 경우(userData 가 존재할 때)-->isExist 가 객체로 존재할 때 <1>
        // 토큰 생성 및 토큰 return
        return {
            isNew: userData.isNew,
            token: token.get({UUID: userData.uuid})
        };
    }else{
        // 가입이 안되있을 경우.
        // uuid 생성
        const UUID = uuid.get();

        // db insert
        const data = {
            ...query,
            uuid : Buffer.from(UUID, 'hex')
        }

        await user.insert(data);

        // token
        return {     // 가입이 위의 소스에서 insert 가 되었으므로 존재한다.   
            isNew: 1,// 가입이 되었으므로 isNew 에 1 을 넣는다.-->이거 정확히 왜 그런지 모르겠음
            token: token.get({UUID})
        };
    }
}
```

위의 `isNew` 부분은 `./src/databases/models/user.js` 의 `exports.isExist` 부분에서 회원정보가 존재하면 객체로 리턴, 없으면 `undefined` 가 뜨게 해 놓았는데 질문부분의 소스에서 `isNew` 를 `1` 로 설정한다. 또한 `isNew` 는 `/sc/databases/models/user.js` 의 `isExist` 의 `db.query` 부분에서 설정했는데 어떻게 한 건지 모르겠음. 이게 원래 `db` 쿼리문을 작성한건데 어떻게 `js` 의 객체의 컴포넌트로 들어간 건지 모르겠음

### 2.1.A

`/src/databases/models/user.js` 에 `exports.isExist` 의 `db.query` 부분에서 설정 한 거임.

## 2.1. DB 스키마 관련

### 2.1.Q1. 월별 연별 데이터를 입력받기

월, 년별 데이터를 입력 받아야 하는데 DB 에 넣을 때 어떤 형태로 넣어야 함?</br>단, 프론트에 넘겨줄 때 배열로 넘겨줘야 함.

### 2.1.Q2. DB 에 복수의 자료 저장

DB 에 여러개의 자료(복수의 사진) 을 입력할 때 어떻게 해야 함?</br>blob 이 아닌 서버의 로컬에 저장되어 있는 자료임.

1. DB 스키마에 img1, img2, img3 ... 형태로 저장
* 위와 같은 형태로 입력받으면 동적으로 사진 개수 조절이 안됨.
2. DB 스키마에 vr_image 만 선언하고 구분자로 받은 후 api 에 뿌려줄 때 분류해서 뿌려줌
* ex) `INSERT INTO newSale set ? ? ? ? ?` 이런 식으로 하면 5개 넣을 수 있는 거?
 
