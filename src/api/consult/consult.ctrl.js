const Joi = require('joi');
const { consult, user } = require('../../databases');
const { setADM } = require('../../databases/models/user');

exports.create = async (ctx)=>{
    const { type } = ctx.params;

    if(type === 'interior'){
        const params = Joi.object({
            consult_name : Joi.string().required(), // 상담의 이름
            consult_req_email : Joi.string().email().required(),

            consult_req_name : Joi.string().required(), // 상담 요청한 사람의 이름
            // consult_req_type : (30), 처음 받은 기획서에서 상담사항에 해당하는 부분임 위에서 가져오면 됨
            consult_req_phone : Joi.string().required(), // 상담 요청한 사람의 전화번호
            // -----------------------------------------------------------------
        }).validate(ctx.request.body)
        if(params.error) {
            ctx.throw(400, "잘못된 요청입니다");
        }
        consult.insert({
            ...params.value,
            consult_req_type: 'interior',
            consult_req_sector: '-'
        });
        ctx.body = {
            status : 200,
        }
    }else if(type === 'franchise'){
        const params = Joi.object({
            consult_name : Joi.string().required(), // 상담의 이름
            consult_req_email : Joi.string().email().required(),

            consult_req_name : Joi.string().required(), // 상담 요청한 사람의 이름
            // consult_req_type : (30), 처음 받은 기획서에서 상담사항에 해당하는 부분임 위에서 가져오면 됨
            consult_req_phone : Joi.string().required(), // 상담 요청한 사람의 전화번호
            // -----------------------------------------------------------------
            consult_req_sector : Joi.string().required() // 상담 요청한 업종
        }).validate(ctx.request.body)
        if(params.error) {
            ctx.throw(400, "잘못된 요청입니다");
        }
        consult.insert({
            ...params.value,
            consult_req_type: 'franchise',
        });
        ctx.body = {
            status : 200
        }
    }
}
/*
 TODO: 이 API 를 호출하는 유저를 토큰으로 특정가능?
 1. 위의 요청이 가능한 건가? 가능하다면 create 과정에서 user table 에서 정보 가져와서
 삽입해야 함
 2. 즉 ./api/consult/index.js 의 .post('/createNewSale',authmiddleware, consultCtrl.createNewSale)
 이 부분에서 authmiddleware 부분에서 인증처리하고 next 로 user 테이블을 확정짓고
 그 row 의 realty_name, realty_owner_phone 를 넘겨줄 수 있으면 해결 가능
*/

/*
TODO: create 과정에서 부동산 관련사항(부동산이름, 부동산전화번호) 입력해야 함
위의 2가지 추가 삽입은 토큰으로 회원특정해서 user 테이블에서 가져올 거임
*/
// newSale 상담요청
exports.createNewSale = async (ctx) => {
    const params = Joi.object({
        consult_name : Joi.string().required(), // 상담의 이름
        consult_req_email : Joi.string().email().required(),

        consult_req_name : Joi.string().required(), // 상담 요청한 사람의 이름
        // consult_req_type : (30), 처음 받은 기획서에서 상담사항에 해당하는 부분임 위에서 가져오면 됨
        consult_req_phone : Joi.string().required(), // 상담 요청한 사람의 전화번호
        // -----------------------------------------------------------------
        consult_req_found : Joi.string().required(), // 상담 요청한 찾는 물건
    }).validate(ctx.request.body)
    if(params.error) {
        ctx.throw(400);
    }

    consult.insert({
        ...params.value,
        consult_req_type: 'newSale',
        consult_req_sector: '-'
    });

    ctx.body ={
        status: 200
    }
}

exports.setManager = async (ctx)=>{

    const params = Joi.object({
        id: Joi.number().integer().required(),
        manager: Joi.string().required()
    }).validate(ctx.query);

    if(params.error){
        ctx.throw(400, "잘못된 요청입니다.")
    }

    const { id, manager } = params.value;

    const mngExist = await user.checkADM(2, manager)

    if(mngExist.length === 0){  // 담당자가 존재하지 않으면 에러 뱉어냄
        ctx.body = {
            status: 400,
            msg: `존재하지 않는 담당자 입니다.`
        }
    }else{  // 담당자가 존재하면 상담번호와 담당자 이름 넘겨주면 됨
        await consult.update(id, {
            consult_manager_name: manager
            });
        ctx.body = {
            status: 200
        }
    }
}

// 아래 함수에서 type 은 view 는 조회순, date 는 날짜순
exports.pagenate = async (ctx) => {
    // api/consult/show?type={}&order={}&pagenum={}
    const params = Joi.object({
        type: Joi.string().regex(/\bnoFilter\b|\binterior\b|\bfranchise\b/).required(),
        order: Joi.string().regex(/\bdesc\b|\basc\b/).required(),
        pagenum: Joi.number().integer().required(),
        manager: Joi.string().required()
    }).validate(ctx.query)

    if(params.error){
        ctx.throw(400, "잘못된 요청입니다.")
    }

    const { type, order, pagenum, manager } = params.value;

    const result = await consult.filteredPagination(type, manager, order, pagenum, 15);

    ctx.body = {
        status: 200,
        result
    }

}

exports.pagenateNewSale = async (ctx) => {
    // api/consult/showNewSalea?type={}&order={}&pagenum={}
    const params = Joi.object({
        realtyName: Joi.string().required(),
        found: Joi.string().required(),
        manager: Joi.string().required(),
        order: Joi.string().regex(/\bdesc\b|\basc\b/).required(),
        page: Joi.number().integer().required()
    }).validate(ctx.query)

    if(params.error){
        ctx.throw(400, "잘못된 요청입니다.")
    }

    const { realtyName, found, manager, order, page } = params.value;

    const result = await consult.filteredPaginateNewSale(realtyName, found, manager, order, page, 15);

    ctx.body = {
        status: 200,
        result
    }

}

exports.delete = async(ctx) => {
    const params = Joi.object({
        id: Joi.number().integer().required()
    }).validate(ctx.params);

    if(params.error){
        ctx.throw(400, "잘못된 요청입니다.")
    }

    const { id } = ctx.params;

    // console.log(ctx.params);
    //isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
    if(consult.isExist(id)){
        await consult.delete(id)
        ctx.body = {
            status : 200
        }
    }else{
        ctx.throw(400)
    }
}


// TODO: consult DB 에 상담완료 관련한 칼럼 추가해야 함