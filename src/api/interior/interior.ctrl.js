const Joi = require('joi');
const { params } = require('.');
const { interior } = require('../../databases');

// 아래 함수에서 type 은 view 는 조회순, date 는 날짜순
exports.pagenate = async (ctx) => {
    // show/:type/:id
    // 위의 api router 에서 type 은 최신순, 조회순
    const { order, type, pagenum } = ctx.query;

    // 페이지네이션을 위해서는 db 데이터의 개수를 알아야 함
    // const rowNum = await interior.rowNum();

    if(type === 'views'){ //조회수순
        if(order === 'desc'){ // 내림차순(큰게 위로)
            // pageByView(페이지개수, 페이지컨텐츠개수)
            const result = await interior.pageByView( order, pagenum, 2);
            ctx.body = {
                status : 200,
                result
            }
        }else if(order === 'asc'){ // 오름차순(작은게 위로)
            // pageByView(페이지개수, 페이지컨텐츠개수)
            const result = await interior.pageByView( order, pagenum, 2);
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
            const result = await interior.pageByNew( order, pagenum, 2);
            ctx.body = {
                status : 200,
                result
            }
        }else if(order === 'asc'){
            const result = await interior.pageByNew( order, pagenum, 2);
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
    if(await interior.isExist(id)){
        // 결과 값을 받았으면 담아야지
        const result = await interior.show(id)
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
    const result = await interior.pageForSearch(searchName[0],searchName[1],searchName[2], p, 2);

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
        contents_name : Joi.string().required(), // 컨텐츠에 표시될 텍스트
        contents_type : Joi.string().required(), // 영상,360 vr, 주거, 상가
        local_address : Joi.string().required(), // : 지역명에 대한 정보 저장, ex) 연제구, 부산진구 등등
                                   // 프론트에서 데이터 정해줘야 할 듯
        thumnail_image : Joi.string().required(),

        preview_video_link : Joi.string().required(), // 미리보기 영상 로컬링크
        youtube_link : Joi.string().required(), // 해당 컨텐츠의 유튭 영상
        vr_link_old : Joi.string().required(), // 시공 전 vr 영상을 위한 링크
        vr_link_new : Joi.string().required(), // 시공 후 vr 영상을 위한 링크

        construct_time : Joi.string().required(), // 인테리어/상세보기 부분 공사기간
        construct_cost : Joi.string().required(), // 인테리어/상세보기 부분 공사비용
        construct_company : Joi.string().required(), // 인테리어/상세보기 부분 공사업체
        construct_info : Joi.string().required(), // 인테리어/상세보기 부분 공사내역

        image_link : Joi.string().required(), // 사진 슬라이드에 들어갈 이미지 로컬링크
        // 이미지가 여러개 인데 만약에 동적(사진 개수가 정해지지 않았을 때일 경우에는 어떻게 해야 함?
        // 위의 질문이 구현이 어렵다면 그냥 특정 개수로 태그를 달아서 하는 게 낫나?

        // 견적관련
        interior_info_location : Joi.string().required(),  // 1. 위치
        interior_info_width : Joi.number().required(),              // 2. 평수
        interior_info_period : Joi.string().required(),    // 3. 공사기간
        interior_info_price : Joi.number().required(),              // 4. 비용
        interior_info_history : Joi.string().required(),   // 5. 시공내역
        interior_info_etc : Joi.string().required(),       // 6. 기타설명
        //

        // 카카오 맵을 위한 위도 경도 주소
        kakaomap_info_latitude : Joi.number().required(),      // 위도
        kakaomap_info_longtitude : Joi.number().required(),    // 경도
        kakaomap_info_address : Joi.string().required(), // 주소
    }).validate(ctx.request.body)

    if(params.error) {
        ctx.throw(400);
    }
    interior.insert(params.value);

    ctx.body ={
        status: 200
    }
}

exports.delete = async(ctx) => {
    const { id } = ctx.params;

    console.log(ctx.params);
    //isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
    if(interior.isExist(id)){
        await interior.delete(id)
        ctx.body = {
            status : 200
        }
    }else{
        ctx.throw(400)
    }
}

exports.update = async (ctx) => {
    const { type, id } = ctx.params;
    if(await interior.isExist(id)===0){
        ctx.throw(400)
    }
    if(type === 'basicInfo'){ // 기본 정보 수정
        const params = Joi.object({
            contents_name : Joi.string(), // 컨텐츠에 표시될 텍스트, 검색될 때 사용
            contents_type : Joi.string(),  // 영상, 360 vr, 주거, 상가
            local_address : Joi.string(), // : 지역명에 대한 정보 저장, ex) 연제구, 부산진구 등등
        }).validate(ctx.request.body);
        console.log(params.value);
        if(params.error) {
            ctx.throw(400);
        }
        await interior.update(id, params.value);

        ctx.body ={
            status: 200
        }
    }else if(type === 'vrContents'){ // vr 컨텐츠 관련 정보 수정
        const params = Joi.object({
            vr_link_old : Joi.string(), // 내부 vr 영상을 위한 링크(youtube link)
            vr_link_new : Joi.string(), // 외부 vr 영상을 위한 링크(youtube link)
        }).validate(ctx.request.body);
        if(params.error) {
            ctx.throw(400);
        }
        await interior.update(id, params.value);

        ctx.body ={
            status: 200
        }
    }else if(type === 'estimateInfo'){ // 견적정보 수정
        const params = Joi.object({
            interior_info_location : Joi.string(),  // 1. 위치
            interior_info_width : Joi.number(),              // 2. 평수
            interior_info_period : Joi.string(),    // 3. 공사기간
            interior_info_price : Joi.number(),              // 4. 비용
            interior_info_history : Joi.string(),   // 5. 시공내역
            interior_info_etc : Joi.string()       // 6. 기타설명
        }).validate(ctx.request.body);
        if(params.error) {
            ctx.throw(400);
        }
        await interior.update(id, params.value);

        ctx.body ={
            status: 200
        }
    }else if(type === 'youtubeLink'){ // vr 컨텐츠 관련 정보 수정
        const params = Joi.object({
            youtube_link : Joi.string()
        }).validate(ctx.request.body);
        if(params.error) {
            ctx.throw(400);
        }
        await interior.update(id, params.value);

        ctx.body ={
            status: 200
        }
    }else if(type === 'kakaoMap'){
        const params = Joi.object({
            kakaomap_info_latitude : Joi.number(),
            kakaomap_info_longtitude : Joi.number(),
            kakaomap_info_address : Joi.string()
        }).validate(ctx.request.body);
        if(params.error) {
            ctx.throw(400);
        }
        await interior.update(id, params.value);

        ctx.body ={
            status: 200
        }
    }else if(type === 'kakaoMap'){
        const params = Joi.object({
            construct_time : Joi.string(), /// 인테리어/상세보기 부분 공사기간
            construct_cost : Joi.string(), /// 인테리어/상세보기 부분 공사비용
            construct_company : Joi.string(), /// 인테리어/상세보기 부분 공사업체
            construct_info : Joi.string() /// 인테리어/상세보기 부분 공사내역
        }).validate(ctx.request.body);
        if(params.error) {
            ctx.throw(400);
        }
        await interior.update(id, params.value);

        ctx.body ={
            status: 200
        }
    }
}
