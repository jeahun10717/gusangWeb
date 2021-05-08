const Router = require('koa-router');
const franchise = new Router();
const franchiseCtrl = require('./franchise.ctrl');
const { auth, S3 } = require('../../lib');

const upload = S3.upload();

franchise
// .get('/', (ctx, next)=>{ctx.body="adfasdfadfasdfasdfasdf"})
.get('/detail/:id/:views', franchiseCtrl.detail) // 한개의 정보전체를 뿌려주는 라우트
.get('/search', franchiseCtrl.search) // 검색 정렬을 위한 라우트 + 페이지네이션
.get('/show', franchiseCtrl.pagenate)   // 15개씩 보여주는 페이지를 위한 페이지네이션 포함 라우트
// search/ ? type={views, date} & order={desc, asc} & pagenum = {int num}

franchise.use(auth.login);
franchise.use(auth.level2);

franchise
.post('/create',
upload.fields([
    {name: "franchise_logo", maxcount: 1},
    {name: "brand_menu", maxcount: 30},
    {name: "brand_video", maxcount: 1}
]),
franchiseCtrl.create)
.post('/update/:id', franchiseCtrl.update)
.post('/upImg',
upload.fields([
    {name: "franchise_logo", maxcount: 1},
    {name: "brand_menu", maxcount: 1},
    {name: "brand_video", maxcount: 1}
]),
franchiseCtrl.upImg)
.post('/compUpImg',
upload.fields([
    {name: "brand_comp_imgs", maxcount: 30}
]),
franchiseCtrl.compUpImg)
.post('/compImgUpdate',
upload.fields([
    {name: "brand_comp_imgs", maxcount: 30}
]),
franchiseCtrl.compImgUpdate)
// .post('/update/:id/:type', franchiseCtrl.update)
.delete('/delImg/:id', franchiseCtrl.delImg)
.delete('/remove/:id', franchiseCtrl.delete)


module.exports = franchise;
