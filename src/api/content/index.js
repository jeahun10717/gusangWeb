const Content = new require("koa-router")();
const Ctrl = require('./content.ctrl');
const { S3 } = require("../../lib");

const upload = S3.upload();

Content
.get('/', Ctrl.get)
.get('/:content_id', Ctrl.detail)
.post('/', upload.array('imgs'), Ctrl.regist)
.patch('/:content_id', Ctrl.update)

// TODO 관리자만 접근 가능
.post('/img/d', Ctrl.delImg)
.post('/img/iu',upload.single('img'), Ctrl.upImg)

module.exports = Content;
