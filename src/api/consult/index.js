const Router = require('koa-router');
const consult = new Router();
const consultCtrl = require('./consult.ctrl');
const { auth } = require('../../lib');

consult
.post('/create/:type', consultCtrl.create) //상담 생성(franchise, interior)

consult.use(auth.login);
consult.use(auth.level1);

consult
.post('/createNewSale', consultCtrl.createNewSale) // 상담 생성(newSale)

consult.use(auth.level2);

consult
.get('/show', consultCtrl.pagenate)   // 상담 페이지네이션 후 가져오기(인테리어, 프랜차이즈)
.get('/showNewSale', consultCtrl.pagenateNewSale) // 상담 페이지네이션 후 가져오기(신규매매)
.delete('/remove/:id', consultCtrl.delete) // 상담 삭제
.post('/setManager', consultCtrl.setManager) // 매니저 삽입(첫 삽입과 수정이 같은 api 사용)

module.exports = consult;
