const Router = require('koa-router');
const add = new Router(); 
const { user } = require('../../../databases')

const Joi = require("joi")

add.post ('/',(ctx,next) => {   //부동산 관련 가입 시 로그인 외 추가정보 기입을 위한 메소드
    const { UUID } = ctx.request.user;

    const params = Joi.object({
        realty_name: Joi.string().required(),
        realty_adress: Joi.string().required(),
        realty_owner_name: Joi.string().required(),
        realty_owner_phone: Joi.string().regex(/^[0-9]{10,11}$/).required()
    }).validate(ctx.request.body);

    if(params.error) ctx.throw(400, 'bed request');
    
    // console.log(params);
    // console.log(params.value);
    // console.log(ctx.request.user);
    // console.log(UUID);

    query=ctx.request.body
    user.update(Buffer.from(UUID, 'hex'), query);

    ctx.status = 200;
    ctx.body = {
        status: 200
    };
});

module.exports=add;