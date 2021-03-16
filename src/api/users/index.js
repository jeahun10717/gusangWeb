const Router = require('koa-router');
const kakao = require('./kakao')
const add = require('./add');
const userInfo = require('./userInfo')

const users = new Router();
const Joi = require('joi');
const { user : User } = require('../../databases');
const { oauth,token,auth } = require('../../lib');

users.get('/', (ctx, next)=>{
    ctx.body = 'this is users page'
})

users.post('/exist', async ctx=>{
  const params = Joi.object({
    login_type: Joi.number().integer().min(1).max(2).required(),
    access_token: Joi.string().required()
  }).validate(ctx.request.body);
  if(params.error) ctx.throw(400, '잘못된 요청');

  const { login_type, access_token } = params.value;
  let login_id;
  // kakao
  if(login_type === 2){
    const kakaoData = await oauth.kakaoData(access_token);
    login_id = `kakao:${kakaoData.id}`;
  }else if(login_type === 1){
    const naverData = await oauth.naverData(access_token);
    login_id = `naver:${naverData.id}`;
  }
  const isExist = await User.isExist(login_type, login_id);

  const bufUUID = Buffer.from(isExist.uuid, 'hex');
  const result = await User.isExistFromUUID(bufUUID);

  let myToken;

  if(isExist){
    myToken = token.get({UUID: isExist.uuid});
  }

  ctx.body = {
    status: 200,
    data: {
      isExist: isExist ? true : false,
      access_token: myToken,
      Auth: result.Auth
    }
  }
});

users.use('/kakao', kakao.routes());
users.use('/naver', require('./naver').routes())
users.use('/add', add.routes());
users.use('/userInfo', userInfo.routes());

module.exports = users;
