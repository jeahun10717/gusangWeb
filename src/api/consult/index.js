const Router = require('koa-router');
const consult = new Router();
const consultCtrl = require('./consult.ctrl')

consult
.post('/create/:type', consultCtrl.create) //상담 생성(franchise, interior)
.post('/createNewSale', consultCtrl.createNewSale) // 상담 생성(newSale)
// TODO: 권한인증 미들웨어 필요
.post('/setManager/:id', consultCtrl.setManager) // 매니저 삽입(첫 삽입과 수정이 같은 api 사용)
.get('/show', consultCtrl.pagenate)   // 상담 페이지네이션 후 가져오기(인테리어, 프랜차이즈)
// get : api/show ?type={newSale/interior/franchise} &order={desc/asc} &pagenum={int num}
.get('/showNewSale', consultCtrl.pagenateNewSale) // 상담 페이지네이션 후 가져오기(신규매매)
.delete('/remove/:id', consultCtrl.delete) // 상담 삭제

module.exports = consult;
