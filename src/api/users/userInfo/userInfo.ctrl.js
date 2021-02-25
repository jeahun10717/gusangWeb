const Joi = require('joi');
const { user } = require('../../../databases');

exports.show = async(ctx)=>{
    // auth == noFilter : 전체 회원 보여줌
    // auth == admin : auth == 2 || auth == 3
    // auth == common : auth == 0 || auth == 1
    // order 오름차순 내림차순
    const { auth, page, order } = ctx.query;

    // TODO: contents 부분(show 함수의 매개변수 1 부분) 30개로 바꿔야 함
    const result = await user.show(auth, order, page, 1);

    ctx.body = {
        status:200,
        result
    }
}

// TODO: user talbe 에 값 여러개 입력하고 밑의 소스 검증해야 함
exports.search = async(ctx)=>{
    const { search, order, page } = ctx.query;
    const name = search.split(' ');
    //TODO: 여기서 1 부분 30 으로 바꾸기
    const result = await user.search(name[0], name[1], order, page, 1)

    ctx.body = {
        status:200,
        result
    }
}

exports.update = async(ctx)=>{
    const { id } = ctx.query;
    if(await user.isExistFromID===0){ // 해당 id 가 존재하면 실행
        ctx.throw(400);
    }
    const params = Joi.object({
        phone: Joi.string().regex(/^[0-9]{10,13}$/).required(), // 회원전화번호
        name: Joi.string().required(),  // 회원 이름
        realty_name: Joi.string().required(),
        realty_address: Joi.string().required(),
        realty_owner_name: Joi.string().required(),
        realty_owner_phone: Joi.string().regex(/^[0-9]{10,13}$/).required()
    }).validate(ctx.request.body);
    if(params.error) ctx.throw(400, 'bed request');

    await user.update(id, params.value);

    ctx.body = {
        status:200,
    }
}