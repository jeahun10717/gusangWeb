const Router = require('koa-router');
const userInfo = new Router();
const userInfoCtrl = require('./userInfo.ctrl');
const { auth } = require('../../../lib');
// TODO: 밑에 부분 작성 다 끝나면 auth.login, auth.level 부분 작성해야 함
userInfo// create 은 user 라우트 단계에서 처리됨.
.get('/show', userInfoCtrl.show) // api/users/userInfo/show?auth={auth filter}
              // auth 상관없이 모두 보여주는 건 nofilter
              // 전체 회원정보 페이지네이션 후 보여줌
.get('/search', userInfoCtrl.search)  // user.name 으로 검색한 결과 페이지네이션 후 보여줌
.post('/update', userInfoCtrl.update)  // 회원정보 수정
.delete('/remove/:id', userInfoCtrl.delete)  // 회원삭제
.post('/setAdmin')  // 회원 관리자 승격/강등 관리


module.exports = userInfo;
