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

// TODO maxcount 수정
// TODO 이미지 올리는 라우트들 확장자 검증해야 함
// detail 부분에서 조회수 올리는 미들웨어 필요함.
newsale
.post('/create',
upload.fields([
    {name: "thumnail_image", maxCount: 1},
    {name: "preview_video_link", maxcount: 1},
    {name: "vr_image", maxCount: 5},
    {name: "info_image", maxCount: 5}
]),
newSaleCtrl.create)
.post('/update/:id', newSaleCtrl.update)
.delete('/remove/:id', newSaleCtrl.delete)
.post('/upImg',
upload.fields([
    {name: "thumnail_image", maxCount: 1},
    {name: "preview_video_link", maxcount: 1},
    {name: "vr_image", maxCount: 1},
    {name: "info_image", maxCount: 1}
]),
newSaleCtrl.upImg
)     // 1개씩 이미지 올리는 route ==> for update
.delete('/delImg/:id', newSaleCtrl.delImg)
// body : field, key
module.exports = newsale;
