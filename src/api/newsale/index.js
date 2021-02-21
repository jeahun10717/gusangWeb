const Router = require('koa-router');
const newsale = new Router();
const newSaleCtrl = require('./newSale.ctrl')
const { auth } = require('../../lib');

// newsale.use(auth.login);
newsale.use(auth.level1)

newsale
.get('/detail/:id', newSaleCtrl.detail) // 한개의 정보전체를 뿌려주는 라우트
.get('/search', newSaleCtrl.search) // 검색 정렬을 위한 라우트 + 페이지네이션
.get('/show', newSaleCtrl.pagenate)   // 15개씩 보여주는 페이지를 위한 페이지네이션 포함 라우트
// /api/newsale/show?type=''&order=''&pagenum=''

newsale.use(auth.level2)

newsale
.post('/create', newSaleCtrl.create)
.post('/update/:id/:type', newSaleCtrl.update)
.delete('/remove/:id', newSaleCtrl.delete)

module.exports = newsale;
