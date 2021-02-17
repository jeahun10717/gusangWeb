const Router = require('koa-router');
const franchise = new Router();
const franchiseCtrl = require('./franchise.ctrl.js')

franchise
.get('/')
.get('/detail/:id', franchiseCtrl.detail) // 한개의 정보전체를 뿌려주는 라우트
.get('/search', franchiseCtrl.search) // 검색 정렬을 위한 라우트 + 페이지네이션
.get('/show', franchiseCtrl.pagenate)   // 15개씩 보여주는 페이지를 위한 페이지네이션 포함 라우트
// search/ ? type={views, date} & order={desc, asc} & pagenum = {int num}
.post('/create', franchiseCtrl.create)
.post('/update/:id/:type', franchiseCtrl.update)
.delete('/remove/:id', franchiseCtrl.delete)

module.exports = franchise;
