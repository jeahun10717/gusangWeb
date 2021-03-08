const Router = require('koa-router');
const add = new Router();
const { user } = require('../../../databases')
const { oauth,login, token } = require('../../../lib');

const Joi = require("joi")

add.post ('/', async (ctx,next) => {   //부동산 관련 가입 시 로그인 외 추가정보 기입을 위한 메소드
    const params = Joi.object({
        login_type: Joi.number().integer().min(1).max(2).required(),
        access_token: Joi.string().required(),
        phone: Joi.string().regex(/^[0-9]{10,13}$/).required(), // 회원전화번호
        name: Joi.string().required(),  // 회원 이름
        realty_name: Joi.string().required(),
        realty_address: Joi.string().required(),
        realty_owner_name: Joi.string().required(),
        realty_owner_phone: Joi.string().regex(/^[0-9]{10,13}$/).required()
    }).validate(ctx.request.body);

    if(params.error) ctx.throw(400, 'bed request');
    
    const { access_token, login_type, ...rest } = params.value;
    
    let login_id;

    if(login_type === 2){   // kakao login
      const kakaoData = await oauth.kakaoData(access_token);
      login_id = `kakao:${kakaoData.id}`;
    }
    else if(login_type === 1){  // naver login
      const naverData = await oauth.naverData(access_token);
      console.log(naverData);
      login_id = `naver:${naverData.id}`; 
    }

    // try{ // TODO: 이 부분에 왜 try-catch 로 했는지 확인하고 나중에 수정하기
      const userToken = await login.regist({
        login_type,
        login_id,
        ...rest
      })
    //   });
    // }catch(e){
    //   throw(400,e);
    // }
    // console.log(params);
    // console.log(params.value);
    // console.log(ctx.request.user);
    // console.log(UUID);

    // query=ctx.request.body
    // user.update(Buffer.from(UUID, 'hex'), query);

    ctx.status = 200;
    ctx.body = {
        status: 200,
        data: {
          userToken: userToken.token
        }
    };
});

module.exports=add;
