const Joi = require('joi');
const { franchise } = require('../../databases');

// 아래 함수에서 type 은 view 는 조회순, date 는 날짜순
exports.pagenate = async (ctx) => {
    // show/:type/:id
    // 위의 api router 에서 type 은 최신순, 조회순
    const { order, type, pagenum } = ctx.query;

    // 페이지네이션을 위해서는 db 데이터의 개수를 알아야 함
    // const rowNum = await franchise.rowNum();

    // console.log(rowNum);
    // NaN 오류 발생 함. id 에
    if(type === 'views'){ //조회수순
        if(order === 'desc'){ // 내림차순(큰게 위로)
            // pageByView(페이지개수, 페이지컨텐츠개수)
            const result = await franchise.pageByView( order, pagenum, 2);
            ctx.body = {
                status : 200,
                result
            }
        }else if(order === 'asc'){ // 오름차순(작은게 위로)
            // pageByView(페이지개수, 페이지컨텐츠개수)
            const result = await franchise.pageByView( order, pagenum, 2);
            ctx.body = {
                status : 200,
                result
            }
        }else{
            ctx.body = {
                status : 400,
                message : 'order 는 desc 나 asc 만 가능합니다.'
            }
        }
    }else if(type === 'date'){ // 업로드 날짜(신규순)
        if(order === 'desc'){
            const result = await franchise.pageByNew( order, pagenum, 2);
            ctx.body = {
                status : 200,
                result
            }
        }else if(order === 'asc'){
            const result = await franchise.pageByNew( order, pagenum, 2);
            ctx.body = {
                status : 200,
                result
            }
        }else{
            ctx.body = {
                status : 400,
                message : 'order 는 order 나 asc 만 가능합니다.'
            }
        }
    }else {
        ctx.throw(400);
    }
}

exports.detail = async (ctx) => {
    const { id } = ctx.params;

    // Promise 함수인데 await 안붙히면 Promise 리턴해서 무조건 true 값이 됨. VSS
    //isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
    if(await franchise.isExist(id)){
        // 결과 값을 받았으면 담아야지
        const result = await franchise.show(id)
        ctx.body = {
            status : 200,
            result
       }
    }else{
        ctx.throw(400)
    }
}

// /search/:type/:input api 라우트에 쓸 함수
// type 은 검색할 db의 column 의 종류, input 은 검색어 종류
exports.search = async (ctx) => {
    const params = Joi.object({
        q: Joi.string().required(),
        p: Joi.number().integer().required()
    }).validate(ctx.query);
    const { q, p } = params.value;
    searchName = q.split(' ');
    console.log(searchName);
    const result = await franchise.pageForSearch(searchName[0],searchName[1],searchName[2], p, 2);

    //search pagenation 구현하기
    // const final = await newsale.pageForSearch(result, pagenum, 2)
    ctx.body = {
        status : 200,
        result
    }
    // ctx.body = input
    // console.log(ctx.body);
    // console.log(ctx.request.query);
    // console.log(ctx.query , ' : 쿼리 확인용');
}

exports.create = async (ctx) => {
    const params = Joi.object({
        franchise_name : Joi.string().required(), // : 컨텐츠에 표시될 텍스트, 검색될 이름
        franchise_tag : Joi.string().required(), // : 프론트에서 정해줘야 함 ex) 양식, 중식, 분식 등등
        franchise_logo : Joi.string().required(), // : franchise 로고

        // 가맹정보 부분 //////////////////////////////////////////////////
        franchise_storenum : Joi.number().required(),     // 매장 수
        franchise_cost : Joi.number().required(),         // 창업 비용
        franchise_monthSale : Joi.number().required(),    // 월 평균 매출액
        // franchise_name //> 이 부분은 위에 등록 해 두었음 : 상호명
        franchise_ceo : Joi.string().required(),  // 대표
        franchise_type : Joi.string().required(), // 사업자 유형
        franchise_address : Joi.string().required(), // 주소
        franchise_registnum : Joi.string().required(), // 사업자등록번호
        franchise_crn : Joi.string().required(),  // 법인등록번호
        franchise_phone : Joi.string().required(), // 대표 번호
        franchise_fax : Joi.string().required(),  // 대표 팩스 번호
        franchise_detailsale : Joi.string().required(), // 브랜드 창업 비용
                                           // 도표에 들어가는 자료인데 구분자로 여래개 받아서 넣을 듯
        // 그래프용 월평균 매출
        // 그래프용 가맹점 증감추이
        // 그래프용 가맹점 계약 현황
        // ////////////////////////////////////////////////////////////////

        brand_introduce : Joi.string().required(), // 브랜드 정보 / 브랜드 소개
        brand_menu : Joi.string().required(), // 브랜드 정보 / 브랜드 대표메뉴
        brand_competitiveness : Joi.string().required(), // 브랜드 정보 / 브랜드 경쟁력
        brand_video : Joi.string().required(), // 브랜드 정보 / 브랜드 홍보영상

        }).validate(ctx.request.body)

    if(params.error) {
        ctx.throw(400);
    }
    franchise.insert(params.value);

    ctx.body ={
        status: 200
    }
}

exports.delete = async(ctx) => {
    const { id } = ctx.params;

    console.log(ctx.params);
    //isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
    if(franchise.isExist(id)){
        await franchise.delete(id)
        ctx.body = {
            status : 200
        }
    }else{
        ctx.throw(400)
    }
}

exports.update = async (ctx) => {
    const { type, id } = ctx.params;
    if(await franchise.isExist(id)===0){
        ctx.throw(400)
    }
    if(type === 'basicInfo'){ // 기본 정보 수정
        const params = Joi.object({
            franchise_name : Joi.string(),
            franchise_tag : Joi.string(),
        }).validate(ctx.request.body);
        console.log(params.value);
        if(params.error) {
            ctx.throw(400);
        }
        await franchise.update(id, params.value);

        ctx.body ={
            status: 200
        }
    }else if(type === 'franchiseInfo'){ // 견적정보 수정
        const params = Joi.object({
            franchise_storenum : Joi.number(),     // 매장 수
            franchise_cost : Joi.number(),         // 창업 비용
            franchise_monthSale : Joi.number(),    // 월 평균 매출액
            // franchise_name --> 이 부분은 위에 등록 해 두었음 : 상호명
            franchise_ceo : Joi.string(),  // 대표
            franchise_type : Joi.string(), // 사업자 유형
            franchise_address : Joi.string(), // 주소
            franchise_registnum : Joi.string(), // 사업자등록번호
            franchise_crn : Joi.string(),  // 법인등록번호
            franchise_phone : Joi.string(), // 대표 번호
            franchise_fax : Joi.string(),  // 대표 팩스 번호
            franchise_detailsale : Joi.string(), // 브랜드 창업 비용
        }).validate(ctx.request.body);
        if(params.error) {
            ctx.throw(400);
        }
        await franchise.update(id, params.value);

        ctx.body ={
            status: 200
        }
    }else if(type === 'videoLink'){ //
        const params = Joi.object({
            youtube_info_link : Joi.string(), // 안내영상 링크(youtube link)
            youtube_inner_link : Joi.string() // 내부영상 링크(youtube link)
        }).validate(ctx.request.body);
        if(params.error) {
            ctx.throw(400);
        }
        await franchise.update(id, params.value);

        ctx.body ={
            status: 200
        }
    }else if(type === 'kakaoMap'){ //
        const params = Joi.object({
            kakaomap_info_latitude : Joi.number(),
            kakaomap_info_longtitude : Joi.number(),
            kakaomap_info_address : Joi.string()
        }).validate(ctx.request.body);
        if(params.error) {
            ctx.throw(400);
        }
        await franchise.update(id, params.value);

        ctx.body ={
            status: 200
        }
    }else if(type === 'infoImage'){
        const params = Joi.object({
            info_image : Joi.string() // 안내자료에 들어갈 이미지 로컬링크
        })
        if(params.error) {
            ctx.throw(400);
        }
        await franchise.update(id, params.value);

        ctx.body ={
            status: 200
        }
    }
}
