const Router = require('koa-router');
const interior = new Router();
const interiorCtrl = require('./interior.ctrl.js');
const { auth, S3 } = require('../../lib');

interior
.get('/')
.get('/detail/:id', interiorCtrl.detail) // 한개의 정보전체를 뿌려주는 라우트
.get('/search', interiorCtrl.search) // 검색 정렬을 위한 라우트 + 페이지네이션
.get('/show', interiorCtrl.pagenate)   // 15개씩 보여주는 페이지를 위한 페이지네이션 포함 라우트
// type:{date, veiws}, order:{desc, asc}, pagenum:{int num}

interior.use(auth.login);
interior.use(auth.level2);

interior
.post('/create', interiorCtrl.create)
.post('/update/:id/:type', interiorCtrl.update)
.delete('/remove/:id', interiorCtrl.delete)

module.exports = interior;
