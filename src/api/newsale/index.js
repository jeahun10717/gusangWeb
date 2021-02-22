const Router = require('koa-router');
const newsale = new Router();
const newSaleCtrl = require('./newSale.ctrl')
const { auth, S3 } = require('../../lib');

const upload = S3.upload();
// TODO: 다른 api 도 auth.login 수정해야 함

newsale.use(auth.login);

newsale.use(auth.level1)

newsale
.get('/detail/:id', newSaleCtrl.detail) // 한개의 정보전체를 뿌려주는 라우트
.get('/search', newSaleCtrl.search) // 검색 정렬을 위한 라우트 + 페이지네이션
.get('/show', newSaleCtrl.pagenate)   // 15개씩 보여주는 페이지를 위한 페이지네이션 포함 라우트
// /api/newsale/show?type=''&order=''&pagenum=''

newsale.use(auth.level2)

// TODO mascount 수정
newsale
.post('/create'
,upload.fields([
    {name: "thumnail_image", maxCount: 1},
    {name: "vr_image", maxCount: 2},
    {name: "info_image", maxCount: 2}
])
,newSaleCtrl.create)
.post('/update/:id',
    upload.fields([
    {name: "thumnail_image", maxCount: 1},
    {name: "vr_image", maxCount: 2},
    {name: "info_image", maxCount: 2}
]), newSaleCtrl.update)
.delete('/remove/:id', newSaleCtrl.delete)
.delete('/delImg/:id', newSaleCtrl.delImg)
// body : field, key

module.exports = newsale;
