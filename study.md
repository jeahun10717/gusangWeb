# 외주하면서 공부한 것들

## 1. REST API Request

REST API 를 공부하면서 프레임워크로 Koa 를 사용했는데 헷갈리는 Request 요청을 정리해 볼 것이다.

* **ctx.params**
* **ctx.query**
* **ctx.body**


1. **ctx.parmas**
예제 api url : `http://localhost:4000/api/search/:local/:pagenum`
주소에 포함된 변수들을 담는다. 위의 url 에서는 아래와 같이 담을 수 있다. (라우트는 search 까지이다.)

```javascript
const { local, pagenum } = ctx.params;
```

2. **ctx.query**
예제 api url : `http://localhost:4000/api/search`(`?local='서면' & ?pagenum=2`)
주소에 포함된 정보들 중 ? 이후를 담게 된다. 위의 url 에서 query 의 형태를 괄호 안이라고 생각하면 아래와 같이 담을 수 있게 된다.

```javascript
const { local, pagenum } = ctx.query;
```

3. **ctx.body**
예제 api url : `http://localhost:4000/api/search`
ctx.body 같은 경우에는 주소에는 정보가 담겨있지 않다. XML, HTML, JSON 등등 의 데이터를 담게 된다. 위의 링크로 갔을 때 화면에 표시된 자료가 아래와 같다고 가정하자.

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head></head>
  <body>
    <pre style="word-wrap: break-word; white-space: pre-wrap;">{
      "items": [
        {
          "statistics": {
            "viewCount": "48733172",
            "subscriberCount": "234000",
            "hiddenSubscriberCount": false,
            "videoCount": "130"
          }
        }
      ]
      }
</pre>
  </body>
</html>
```

위의 소스에서 `pre` 태그 안의 데이터를 담고 싶다면 아래와 같이 사용하면 된다.

```javascript
const body = ctx.body
```  

여기서 ctx.body 의 값은 아래와 같다.
```
"items": [
  {
    "statistics": {
      "viewCount": "48733172",
      "subscriberCount": "234000",
      "hiddenSubscriberCount": false,
      "videoCount": "130"
    }
  }
]
}
```

## 2. `const {var} = name`

`const {var1, var2, var3 ...} = state` 은 `state` 객체의 값들이 `var` 에 맵핑된다. 단, `state` 의 각각의 이름과 `var` 의 이름이 일치해야 한다. 밑의 예를 보자.

**[ source ]**

```javascript
state = {
    gender: 'male',
    age: 23,
    phone: 'none'
}
const { gender, age, phone } = state;
console.log(gender, age, phone);
```

**[ console ]**

```
male 23 none
```

위에서 볼 수 있듯이 state 각각의 프로퍼티들이 새로 만들어진 gender, age, phone 에 저장이 되었다. 하지만 위에서도 언급했듯이 변수명이 달라지면 맵핑이 되지 않는다.

**[ source ]**

```javascript
state = {
    gender: 'male',
    age: 23,
    phone: 'none'
}
const { a, b, phone } = state;
console.log(a, b, phone);
```

**[ console ]**

```
undefined undefined none
```

위의 소스의 결과값에서 볼 수 있듯이 phone 만 맵핑되었다. 이러한 기능은 ES6 이후부터 지원 되는 기능으로 위의 소스는 아래와 똑같이 동작한다.

``` javascript
state = {
    gender: 'male',
    age: 23,
    phone: 'none'
}
const gender = state.gender;
const age = state.age;
const phone = state.phone;
```

이러한 기록을 남기는 이유는 내가 koa 로 백엔드 작업을 할 때 아래와 같은 소스를 사용해서 문제가 생겼었다.

```javascript
// /:code 에서 params 받아옴
const code = ctx.params;

await kakaomapModel.isExist(code);
```
위의 소스에서 나는 code 가 string 일 것을 기대했다. 하지만 code 는 객체였고 이에 따라 오류가 발생했다. 이제 위의 소스를 고쳐서 써보면 아래와 같다.

```javascript
const { code } = ctx.params
```
정리해 보자.

1. `ctx.params`, `ctx.query`, `ctx.body` 는 당연히 객체이다.
2. 이러한 객체의 정보를 받아오려면 `var.properties` 형태를 하거나 위의 소스를 활용한다.
