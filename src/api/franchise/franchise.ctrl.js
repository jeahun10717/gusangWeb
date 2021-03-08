const Joi = require('joi');
const { franchise } = require('../../databases');
const tagArr = ["cafe","bakery","dessert","chicken","pizza",
"korean","chinese","japanese","special","snack",
"fastfood","pub","convStore","sale","laundry",
"pcRoom","game","studyCafe","education","life"]

// 아래 함수에서 type 은 view 는 조회순, date 는 날짜순
exports.pagenate = async (ctx) => {
    const params = Joi.object({
        order: Joi.string().regex(/\bdesc\b|\basc\b/).required(),
        tag: Joi.string().valid(...tagArr).required(),
        type: Joi.string().regex(/\bviews\b|\bid\b/).required(),
        pagenum: Joi.number().integer().required()
    }).validate(ctx.query);
    console.log(params);
    if(params.error){
        ctx.throw(400)
    }
    // conType 은 contents_type 에 들어가는 것 : preveiw_video, live 등등
    const { order, tag, type, pagenum } = params.value;
    // order : {desc , asc} / conType : {preview video, 360 vr, live, market}
    // type : {views, id} //> id 는 최신순 정렬하는 거
    // TODO: 밑의 2 부분 30 으로 바꿔야 함
    const result = await franchise.pagination( order, type, tag, pagenum, 2);

    ctx.body = {
        status : 200,
        result
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
        searchName: Joi.string().required(),
        page: Joi.number().integer().required()
    }).validate(ctx.query);
    const { searchName, page } = params.value;
    splitData = searchName.split(' ');

    const result = await franchise.pageForSearch(splitData[0],splitData[1],splitData[2], page, 2);
    // TODO: 위의 2 30 으로 바꾸기
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

// TODO: 전화번호 관련해서 Joi 검증 소스 수정하기
exports.create = async (ctx) => {
    const params = Joi.object({
        franchise_name: Joi.string().required(), // : 컨텐츠에 표시될 텍스트, 검색될 이름
        franchise_tag: Joi.string().valid(...tagArr).required(), // : 프론트에서 정해줘야 함 ex) 양식, 중식, 분식 등등
        franchise_logo: Joi.string().required(), // : franchise 로고
        
        // 가맹정보 부분 //////////////////////////////////////////////////
        franchise_storenum: Joi.number().integer().required(),     // 매장 수
        franchise_cost: Joi.number().integer().required(),         // 창업 비용
        franchise_monthSale: Joi.number().integer().required(),    // 월 평균 매출액
        // franchise_name //> 이 부분은 위에 등록 해 두었음 : 상호명   
        franchise_ceo: Joi.string().required(),  // 대표
        franchise_type: Joi.string().required(), // 사업자 유형
        franchise_address: Joi.string().required(), // 주소
        franchise_registnum: Joi.string().required(), // 사업자등록번호
        franchise_crn: Joi.string().required(),  // 법인등록번호
        franchise_phone: Joi.string().required(), // 대표 번호
        franchise_fax: Joi.string().required(),  // 대표 팩스 번호
        franchise_detailsale: Joi.string().required(), // 브랜드 창업 비용
                                        //: 도표에 들어가는 자료인데 구분자로 여래개 받아서 넣을 듯
        // 아래 3개의 정보들은 배열로 넣는데 2010~2021 순인데 년도가 수정되면 추가할 수 있음
        // 그래프용 연별 매출
        franchise_month_sales: Joi.string().required(),
        // 그 가맹점 증감추이
        franchise_market_num: Joi.string().required(),
        // 그 가맹점 계약 현황
        franchise_market_contract: Joi.string().required(),
        
        // ////////////////////////////////////////////////////////////////

        brand_introduce: Joi.string().required(), // 브랜드 정보 / 브랜드 소개
        brand_menu: Joi.string().required(), // 브랜드 정보 / 브랜드 대표메뉴
        brand_competitiveness: Joi.string().required(), // 브랜드 정보 / 브랜드 경쟁력//>pdf 로 처리할거임
        brand_video: Joi.string().required(), // 브랜드 정보 / 브랜드 홍보영상

        blog_review: Joi.string().required(),
        
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

// exports.update = async(ctx)=>{
    
// }