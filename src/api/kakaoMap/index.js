const Router = require('koa-router');
const kakaoMap = new Router();
const kakaoMapCtrl = require('./kakaoMap.ctrl');
const { auth } = require('../../lib')

kakaoMap
.get('/getAllCode', kakaoMapCtrl.getAllCode) // 모든 지역코드 보여주기 : '/kakaoMap/getCode'

kakaoMap.use(auth.login);
kakaoMap.use(auth.level2);

kakaoMap
.post('/insert', kakaoMapCtrl.create) // 지역코드 추가 : '/kakaoMap/insert?local=부산광역시 남구'
.delete('/remove/:code', kakaoMapCtrl.remove) // 지역 code 로 데이터 제거 : '/remove/:code'

module.exports = kakaoMap;
