const Joi = require('joi');
const { S3 } = require('../../lib');
const { newsale } = require('../../databases');
//TODO: 퍼블리싱 하기 전 킽의 contentNum 을 15 로 고쳐야 함
const contentNum = 2;

exports.pagenate = async (ctx) => {
    const params = Joi.object({
        order: Joi.string().regex(/\bdesc\b|\basc\b/).required(),
        localCode: Joi.string().required(), // TODO: 문자 개수 로컬코드 갯수로 검증해야 함
        conType: Joi.string().regex(/\bcommon\b|\blive\b|\bmarket\b/).required(),
        type: Joi.string().regex(/\bviews\b|\bid\b/).required(),
        pagenum: Joi.number().integer().required()
    }).validate(ctx.query);
    console.log(params.error);
    if(params.error){
        ctx.throw(400)
    }
    // conType 은 contents_type 에 들어가는 것 : preveiw_video, live 등등
    const { order, localCode, conType, type, pagenum } = ctx.query;
    // order : {desc , asc} / conType : {preview video, 360 vr, live, market}
    // type : {views, id} --> id 는 최신순 정렬하는 거
    // TODO: 주거랑 상가 부분에서 지역별로 나눌 필요가 없는지 클라이언트한테 물어봐야 함
    const result = await newsale.pagination( order, type, localCode, conType, pagenum, contentNum);
    const conNum = await newsale.conNum();



    ctx.body = {
        status : 200,
        result,
        conNum: conNum[0].cnt,
        pageNum: Math.ceil(conNum[0].cnt/contentNum)
    }
}

exports.detail = async (ctx) => {
    const params = Joi.object({
        id: Joi.number().integer().required()
    }).validate(ctx.params);

    if(params.error){
        ctx.throw(400, "잘못된 요청입니다.")
    }

    const { id } = params.value;

    await newsale.upViews(id);

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
exports.search = async (ctx) => {
    const params = Joi.object({
        searchName: Joi.string().required(),
        conType: Joi.string().regex(/\bcommon\b|\blive\b|\bmarket\b/).required(),
        page: Joi.number().integer().required()
    }).validate(ctx.query);

    if(params.error){
      ctx.throw(400)
    }

    const { searchName, page, conType } = params.value;
    // searchName : 검색어 | page : {페이지 num} | conType : {preview video, 360 vr, live, market}
    const data = searchName.split(' ');

    const result = await newsale.pageForSearch(data[0],data[1],data[2],conType,page, contentNum);
    const conNum = await newsale.conNum();

    ctx.body = {
        status : 200,
        result,
        conNum: conNum[0].cnt,
        pageNum: Math.ceil(conNum[0].cnt/contentNum)
    }
}

exports.create = async (ctx) => {
    const params = Joi.object({
        contents_name : Joi.string().required(), // 컨텐츠에 표시될 텍스트, 검색될 때 사용
        contents_type : Joi.string().regex(/\bcommon\b|\blive\b|\bmarket\b/).required(),  // 영상, 360 vr, 주거, 상가
        local_address : Joi.string().required(), // : 지역명에 대한 정보 저장, ex) 연제구, 부산진구 등등
                                   // 프론트에서 데이터 정해줘야 할 듯
        // auth ,  // : 이 부분은 newSale 을 따로 뺐으니까 필요없을 듯함
        // thumnail_image : Joi.string().required(),
        // preview_video_link : Joi.string().required(), // 미리보기 영상 로컬링크
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
    let preview_video_link = ctx.files['preview_video_link'].map(i=>i.key);

    thumnail_image = JSON.stringify(thumnail_image)
    vr_image = JSON.stringify(vr_image)
    info_image = JSON.stringify(info_image)
    preview_video_link = JSON.stringify(preview_video_link)

    await newsale.insert({
        ...params.value,
        thumnail_image: thumnail_image,
        preview_video_link: preview_video_link,
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
    // TODO: 나중에 시간 나면 s3 에서 사진 지우는 코드 작성해야 함
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
    if(await newsale.isExist(id)===0){
        ctx.throw(400)
    }

    const params = Joi.object({
        contents_name : Joi.string().required(), // 컨텐츠에 표시될 텍스트, 검색될 때 사용
        contents_type : Joi.string().required(),  // 영상, 360 vr, 주거, 상가
        local_address : Joi.string().required(), // : 지역명에 대한 정보 저장, ex) 연제구, 부산진구 등등
                                   // 프론트에서 데이터 정해줘야 할 듯
        // auth ,  // : 이 부분은 newSale 을 따로 뺐으니까 필요없을 듯함
        // thumnail_image : Joi.string().required(),
        // preview_video_link : Joi.string().required(), // 미리보기 영상 로컬링크
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

// TODO: update at 설정하기

    // const thumnail_image = ctx.files['thumnail_image'].map(i=>i.key);
    // const vr_image = ctx.files['vr_image'].map(i=>i.key);
    // const info_image = ctx.files['info_image'].map(i=>i.key);

    // const Imgs = await newsale.getImgs(id);
    // await newsale.insertImgs({
    //     thumnail_image: [ ...JSON.parse(Imgs.thumnail_image),  ...thumnail_image],
    //     vr_image: [ ...JSON.parse(Imgs.vr_image), ...vr_image],
    //     info_image: [ ...JSON.parse(Imgs.info_image), ...info_image],
    // }, id);
    await newsale.update(id, {
        ...params.value,
        updateAt: new Date()
    });

    ctx.body = {
        status: 200
    }
    // console.log("thumnail_image : "+thumnail_image);
    // console.log("vr_image : "+vr_image);
    // console.log("info_image : "+info_image);

}

exports.delImg = async (ctx)=>{
    // TODO: id 가 존재하는 값인지 검증해야 함-->생각해보고 굳이 필요없겠다고 생각들면 안할것
    const { id } = ctx.params;
    const params = Joi.object({
        field: Joi.string().valid("thumnail_image","preview_video_link","vr_image","info_image").required(),
        key: Joi.string().required()
    }).validate(ctx.query);
    if(params.error) ctx.throw(400, '잘못된 요청');

    const { field, key } = params.value;

    const result = await newsale.getImgsFromField(id, field);
    const data = JSON.parse(result[field]);

    const idx = data.indexOf(key);
    if(idx == -1){
        ctx.body = {
            status: 400,
            msg: "없는 이미지 입니다"
        }
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
//key 와 field 로 추가하는 소스 필요함
exports.upImg = async (ctx)=>{
    const { id, field, imgIdx } = ctx.query;
    // console.log(typeof imgIdx);

    const result = await newsale.getImgsFromField(id, field);
    const data = JSON.parse(result[field])
    // console.log(data);

    let imgInfo = ctx.files[`${field}`]
    // console.log(imgInfo);
    imgName = imgInfo[0].key;
    // console.log(imgName);

    // console.log(data);
    data.splice(imgIdx, 0,imgName);
    // console.log(data);

    await newsale.insertImgs({
        [field]: JSON.stringify(data)
    }, id)

    ctx.body ={
        status: 200
    }
}
