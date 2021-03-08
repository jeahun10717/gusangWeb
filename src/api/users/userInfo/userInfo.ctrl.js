const Joi = require('joi');
const { user } = require('../../../databases');

exports.show = async(ctx)=>{

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

// TODO: 밑의 setADM, setMasterADM 함수는 유저 여러명 가능할 때 따로 검증해야 함.(검증 안했음)
exports.setADM = async (ctx)=>{ 
    // adm 이 2일 때 1을 2로 승급
    // adm 이 1일 때 2를 1로 강등
    const params = Joi.object({
        uuid: Joi.string().custom(v=>Buffer.from(v,'hex')).required(),
        adm: Joi.number().integer().required()
    }).validate(ctx.request.body);
    
    if(params.error){
        ctx.throw(400, "잘못된 요청입니다");
    }

    const { uuid, adm } = params.value;

    if(params.error){
        ctx.throw(400, "없는 관리자 number 입니다.");
    }

    await user.setADM(uuid, adm);
}

exports.setMasterADM = async (ctx)=>{
    const params = Joi.object({
        uuid: Joi.string().custom(v=>Buffer.from(v,'hex')).required(),
        adm: Joi.number().integer().required()
    }).validate(ctx.request.body);
    
    if(params.error){
        ctx.throw(400, "잘못된 요청입니다");
    }

    const { uuid, adm } = params.value;

    if(params.error){
        ctx.throw(400, "없는 관리자 number 입니다.");
    }

    if(adm === 3){ // 일반 관리자(auth 2) 를 최고 관리자(auth 3)로 승급 
        await user.setADM(uuid, adm)
    }else if(adm == 2){ // 다른 최고관리자(auth 3) 을 일반 관리자(auth 2)로 강등
        if(await user.chkMstAdmExist <= 1){
            ctx.body={
                status: 400,
                msg: `최고관리자가 1명 이하이므로 해당 동작을 수행할 수 없습니다.`
            }
        }
        await user.setADM(uuid, adm);
    }
}