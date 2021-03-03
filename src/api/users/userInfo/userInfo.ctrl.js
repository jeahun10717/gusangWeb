const Joi = require('joi');
const { user } = require('../../../databases');

exports.show = async(ctx)=>{
    console.log(ctx.query);
    const params = Joi.object({
        auth: Joi.string().valid('noFilter','admin','common').default('noFilter'),
        page: Joi.number().integer().required(),
        order: Joi.string().valid('desc','asc').required()
    }).validate(ctx.query);
    if(params.error) ctx.throw(400,'잘못된 요청');

    // auth == noFilter : 전체 회원 보여줌
    // auth == admin : auth == 2 || auth == 3
    // auth == common : auth == 0 || auth == 1
    // order 오름차순 내림차순
    const { auth, page, order } = params.value;

    // TODO: contents 부분(show 함수의 매개변수 1 부분) 30개로 바꿔야 함
    const result = await user.show(auth, order, page, 1);

    ctx.body = {
        status:200,
        result
    }
}

// TODO: user talbe 에 값 여러개 입력하고 밑의 소스 검증해야 함
exports.search = async(ctx)=>{
    const params = Joi.object({
        search: Joi.string().required(),
        order: Joi.string().required(),
        page: Joi.number().integer().required()
    }).validate(ctx.query);

    if(params.error){
        ctx.throw(400, "잘못된 요청입니다.")
    }

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
    const { UUID } = ctx.request.user;
    const user_id = Buffer.from(UUID, 'hex');

    const params = Joi.object({
        phone: Joi.string().regex(/^[0-9]{10,13}$/).required(), // 회원전화번호
        name: Joi.string().required(),  // 회원 이름
        realty_name: Joi.string().required(),
        realty_address: Joi.string().required(),
        realty_owner_name: Joi.string().required(),
        realty_owner_phone: Joi.string().regex(/^[0-9]{10,13}$/).required()
    }).validate(ctx.request.body);
    if(params.error) ctx.throw(400, 'bed request');
    
    const result = await user.update(user_id, params.value);
    if(result.affectedRows === 0) ctx.throw(400, "id 가 존재하지 않음");
    
    ctx.body = {
        status:200,
    }
}

exports.delete = async (ctx)=>{
    const params = Joi.object({
        id: Joi.string().custom(v=>Buffer.from(v,'hex')).required()
    }).validate(ctx.params);
    // TODO params.error
    const { id } = params.value;

    const result = await user.delete(id);
    if(result.affectedRows === 0) ctx.throw(400, "id 가 존재하지 않음");
    
        ctx.body = {
            status: 200,
        }
}

/* TODO: 최고관리자는 복수로 가능. 최고관리자 관련해서 front 에서 alert 띄워줘야 함
auth 3 이 auth 1 한테 auth 2 부여할 때 : front 재확인 필요 없음
auth 3 이 auth 2 한테 auth 1 부여할 때 : front 재확인 필요 없음
auth 3 이 auth 2 한테 auth 3 부여할 때 : front 재확인 필요
auth 3 이 auth 3 한테 auth 2 부여할 때 : front 재확인 필요 + DB 에서 검증이 필요
*/
// TODO: 밑의 소스 다시 auth 3 관련한 부분 다시 짜야 할 듯

exports.setADM = async (ctx)=>{
    const { UUID } = ctx.request.user;
    const user_id = Buffer.from(UUID, 'hex');

    const params = Joi.object({
        adm: Joi.number().integer().required()
    }).validate(ctx.query);

    if(params.error){
        ctx.throw(400, "없는 관리자 number 입니다.");
    }

    await user.setADM(user_id, adm);
}

