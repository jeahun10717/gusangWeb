const Joi = require('joi');
const { S3 } = require('../../lib');
const { newsale } = require('../../databases');

// 아래 함수에서 type 은 view 는 조회순, date 는 날짜순
exports.pagenate = async (ctx) => {
    // show/:type/:id
    // 위의 api router 에서 type 은 최신순, 조회순
    const { order, type, pagenum } = ctx.query;

    console.log(ctx.query);
    // 페이지네이션을 위해서는 db 데이터의 개수를 알아야 함
    // const rowNum = await newsale.rowNum();

    if(type === 'views'){ //조회수순
        if(order === 'desc'){ // 내림차순(큰게 위로)
            // pageByView(페이지개수, 페이지컨텐츠개수)
            const result = await newsale.pageByView( order, pagenum, 2);
            ctx.body = {
                status : 200,
                result
            }
        }else if(order === 'asc'){ // 오름차순(작은게 위로)
            // pageByView(페이지개수, 페이지컨텐츠개수)
            const result = await newsale.pageByView( order, pagenum, 2);
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
            const result = await newsale.pageByNew( order, pagenum, 2);
            ctx.body = {
                status : 200,
                result
            }
        }else if(order === 'asc'){
            const result = await newsale.pageByNew( order, pagenum, 2);
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
    if(await newsale.isExist(id)){
        // 결과 값을 받았으면 담아야지
        const result = await newsale.show(id)
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
// q : 검색어 | p : page 숫자
exports.search = async (ctx) => {
    const params = Joi.object({
        q: Joi.string().required(),
        p: Joi.number().integer().required()
    }).validate(ctx.query);
    const { q, p } = params.value;
    searchName = q.split(' ');

    const result = await newsale.pageForSearch(searchName[0],searchName[1],searchName[2], p, 2);

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
        contents_name : Joi.string().required(), // 컨텐츠에 표시될 텍스트, 검색될 때 사용
        contents_type : Joi.string().required(),  // 영상, 360 vr, 주거, 상가
        local_address : Joi.string().required(), // : 지역명에 대한 정보 저장, ex) 연제구, 부산진구 등등
                                   // 프론트에서 데이터 정해줘야 할 듯
        // auth ,  // : 이 부분은 newSale 을 따로 뺐으니까 필요없을 듯함
        // thumnail_image : Joi.string().required(),
        preview_video_link : Joi.string().required(), // 미리보기 영상 로컬링크
        youtube_info_link : Joi.string().required(), // 안내영상 링크(youtube link)
        youtube_inner_link : Joi.string().required(), // 내부영상 링크(youtube link)
        vr_link_inner : Joi.string().required(), // 내부 vr 영상을 위한 링크(youtube link)
        vr_link_outer : Joi.string().required(), // 외부 vr 영상을 위한 링크(youtube link)
        vr_link_typeA : Joi.string().required(), // type A vr 링크
        vr_link_typeB : Joi.string().required(), // type B vr 링크

        // vr_image : Joi.string().required(), // 사진 슬라이드에 들어갈 이미지 로컬링크
        // 이미지가 여러개 인데 만약에 동적(사진 개수가 정해지지 않았을 때)일 경우에는 어떻게 해야 함?
        // 위의 질문이 구현이 어렵다면 그냥 특정 개수로 태그를 달아서 하는 게 낫나?

        // info_image : Joi.string().required(), // 안내자료에 들어갈 이미지 로컬링크

        // 설명 부분
        newsale_info_type : Joi.number().required(),            // 1. 타입
        newsale_info_housenum : Joi.number().required(),        // 2. 총 세대수
        newsale_info_parknum : Joi.number().required(),         // 3. 주차 대수
        newsale_info_width : Joi.number().required(),           // 4. 평형대
        newsale_info_price : Joi.number().required(),           // 5. 가격
        newsale_info_perprice : Joi.number().required(),        // 6. 평당가격
        newsale_info_roomnum : Joi.number().required(),         // 7. 방 개수
        newsale_info_bathroomnum : Joi.number().required(),     // 7. 욕실
        newsale_info_option : Joi.string().required(),  // 8. 옵션
        newsale_info_floornum : Joi.number().required(),        // 9. 층수
        newsale_info_etc : Joi.string().required(),    // 10. 기타설명
        //

        kakaomap_info_latitude : Joi.number().required(),
        kakaomap_info_longtitude : Joi.number().required(),
        kakaomap_info_address : Joi.string().required(),
    }).validate(ctx.request.body)
    if(params.error) {
        ctx.throw(400);
    }

    // console.log(ctx.files);
    let thumnail_image = ctx.files['thumnail_image'].map(i=>i.key);
    let vr_image = ctx.files['vr_image'].map(i=>i.key);
    let info_image = ctx.files['info_image'].map(i=>i.key);

    thumnail_image = JSON.stringify(thumnail_image)
    vr_image = JSON.stringify(vr_image)
    info_image = JSON.stringify(info_image)
    
    console.log(vr_image+" : adfasdfasdfasdfad");
    await newsale.insert({
        ...params.value,
        thumnail_image: thumnail_image,
        vr_image: vr_image,
        info_image: info_image,
        views:0
    });

    ctx.body ={
        status: 200
    }
}

exports.delete = async(ctx) => {
    const { id } = ctx.params;
    // TODO: 나중에 시간 나면 s3 지우는 코드 작성해야 함
    //isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
    if(newsale.isExist(id)){
        await newsale.delete(id)
        ctx.body = {
            status : 200
        }
    }else{
        ctx.throw(400)
    }
}
exports.update = async (ctx) => {
    const { id } = ctx.params;
    if(await interior.isExist(id)===0){
        ctx.throw(400)
    }
    
    const params = Joi.object({
        contents_name : Joi.string().required(), // 컨텐츠에 표시될 텍스트, 검색될 때 사용
        contents_type : Joi.string().required(),  // 영상, 360 vr, 주거, 상가
        local_address : Joi.string().required(), // : 지역명에 대한 정보 저장, ex) 연제구, 부산진구 등등
                                   // 프론트에서 데이터 정해줘야 할 듯
        // auth ,  // : 이 부분은 newSale 을 따로 뺐으니까 필요없을 듯함
        // thumnail_image : Joi.string().required(),
        preview_video_link : Joi.string().required(), // 미리보기 영상 로컬링크
        youtube_info_link : Joi.string().required(), // 안내영상 링크(youtube link)
        youtube_inner_link : Joi.string().required(), // 내부영상 링크(youtube link)
        vr_link_inner : Joi.string().required(), // 내부 vr 영상을 위한 링크(youtube link)
        vr_link_outer : Joi.string().required(), // 외부 vr 영상을 위한 링크(youtube link)
        vr_link_typeA : Joi.string().required(), // type A vr 링크
        vr_link_typeB : Joi.string().required(), // type B vr 링크

        // vr_image : Joi.string().required(), // 사진 슬라이드에 들어갈 이미지 로컬링크
        // 이미지가 여러개 인데 만약에 동적(사진 개수가 정해지지 않았을 때)일 경우에는 어떻게 해야 함?
        // 위의 질문이 구현이 어렵다면 그냥 특정 개수로 태그를 달아서 하는 게 낫나?

        // info_image : Joi.string().required(), // 안내자료에 들어갈 이미지 로컬링크

        // 설명 부분
        newsale_info_type : Joi.number().required(),            // 1. 타입
        newsale_info_housenum : Joi.number().required(),        // 2. 총 세대수
        newsale_info_parknum : Joi.number().required(),         // 3. 주차 대수
        newsale_info_width : Joi.number().required(),           // 4. 평형대
        newsale_info_price : Joi.number().required(),           // 5. 가격
        newsale_info_perprice : Joi.number().required(),        // 6. 평당가격
        newsale_info_roomnum : Joi.number().required(),         // 7. 방 개수
        newsale_info_bathroomnum : Joi.number().required(),     // 7. 욕실
        newsale_info_option : Joi.string().required(),  // 8. 옵션
        newsale_info_floornum : Joi.number().required(),        // 9. 층수
        newsale_info_etc : Joi.string().required(),    // 10. 기타설명
        //

        kakaomap_info_latitude : Joi.number().required(),
        kakaomap_info_longtitude : Joi.number().required(),
        kakaomap_info_address : Joi.string().required(),
    }).validate(ctx.request.body)
    if(params.error) {
        ctx.throw(400);
    }
    
    newsale.update({
        ...params.value,
    });
// TODO: update at 설정하기    

    const thumnail_image = ctx.files['thumnail_image'].map(i=>i.key);
    const vr_image = ctx.files['vr_image'].map(i=>i.key);
    const info_image = ctx.files['info_image'].map(i=>i.key);

    const Imgs = await newsale.getImgs(id);
    await newsale.insertImgs({
        thumnail_image: [ ...JSON.parse(Imgs.thumnail_image),  ...thumnail_image],
        vr_image: [ ...JSON.parse(Imgs.vr_image), ...vr_image], 
        info_image: [ ...JSON.parse(Imgs.info_image), ...info_image], 
    }, id);
    
    // console.log("thumnail_image : "+thumnail_image);
    // console.log("vr_image : "+vr_image);
    // console.log("info_image : "+info_image);
}

exports.delImg = async (ctx)=>{
    const { id } = ctx.params;
    const params = Joi.object({
        field: Joi.string().valid("thumnail_image","vr_image","info_image").required(),
        key: Joi.string().required()
    }).validate(ctx.request.body);
    if(params.error) ctx.throw(400, '잘못된 요청');

    const { field, key } = params.value;

    const result = await newsale.getImgsFromField(id, field);
    const data = JSON.parse(result[field]);

    const idx = data.indexOf(key);
    if(idx == -1){
        // TODO 없는 이미지
    }else{
        console.log({
            [field]: [...data.slice(0, idx), ...data.slice(idx+1, data.length)]
        },JSON.stringify({
            [field]: [...data.slice(0, idx), ...data.slice(idx+1, data.length)]
        }))
        await newsale.insertImgs({
            [field]: JSON.stringify([...data.slice(0, idx), ...data.slice(idx+1, data.length)])
        }, id)
        S3.delete(key);
    }

    ctx.body = {
        status: 200
    }
}

// exports.upImg = async (ctx)=>{
//     const params = Joi.object({
//         field: Joi.string().required()
//     }).validate(ctx.request.body);
//     if(params.error) ctx.throw(400, '잘못된 요청');
//     const {field} = 
//     ctx.body = {
//         status: 200
//     }
// }