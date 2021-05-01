const Router = require('koa-router');
const interior = new Router();
const interiorCtrl = require('./interior.ctrl.js');
const { auth, S3 } = require('../../lib');

const upload = S3.upload();

interior
.get('/detail/:id/:views', interiorCtrl.detail) // 한개의 정보전체를 뿌려주는 라우트
.get('/search', interiorCtrl.search) // 검색 정렬을 위한 라우트 + 페이지네이션
.get('/show', interiorCtrl.pagenate)   // 15개씩 보여주는 페이지를 위한 페이지네이션 포함 라우트
// type:{date, veiws}, order:{desc, asc}, pagenum:{int num}

interior.use(auth.login);
interior.use(auth.level2);

// TODO: maxcount 기능에 맞게 바꾸기
interior
.post('/create', upload.fields([
    {name: "thumnail_image", maxcount: 1},
    {name: "thumnail_image_vr", maxCount: 1},
    {name: "preview_video_link", maxcount: 1},
    {name: "image_link", maxcount: 2}
]), interiorCtrl.create)
.post('/update/:id', interiorCtrl.update)
.post('/upImg',
upload.fields([
    {name: "thumnail_image", maxCount: 1},
    {name: "thumnail_image_vr", maxCount: 1},
    {name: "preview_video_link", maxcount: 1},
    {name: "image_link", maxCount: 1},
]), interiorCtrl.upImg) // 1개씩 이미지 올리는 route ==> for update
.delete('/delImg/:id', interiorCtrl.delImg)
.delete('/remove/:id', interiorCtrl.delete)

module.exports = interior;
