const Joi = require('joi');
const { S3 } = require('../../lib');
const { newsale } = require('../../databases');
const upload = S3.upload();
//TODO: 퍼블리싱 하기 전 킽의 contentNum 을 15 로 고쳐야 함
const contentNum = 2;

exports.pagenate = async (ctx) => {
    const params = Joi.object({
        order: Joi.string().regex(/\bdesc\b|\basc\b/).required(),
        localCode: Joi.string().required(), // TODO: 문자 개수 로컬코드 갯수로 검증해야 함
        conType: Joi.string().regex(/\bnoFilter\b|\bcommon\b|\blive\b|\bmarket\b/).required(),
        type: Joi.string().regex(/\bviews\b|\bid\b/).required(),
        page: Joi.number().integer().required()
    }).validate(ctx.query);
    console.log(params.error);
    if(params.error){
        ctx.throw(400)
    }
    // conType 은 contents_type 에 들어가는 것 : preveiw_video, live 등등
    const { order, localCode, conType, type, page } = ctx.query;
    // order : {desc , asc} / conType : {preview video, 360 vr, live, market}
    // type : {views, id} --> id 는 최신순 정렬하는 거
    // TODO: 주거랑 상가 부분에서 지역별로 나눌 필요가 없는지 클라이언트한테 물어봐야 함
    const result = await newsale.pagination( order, type, localCode, conType, page, contentNum);
    const conNum = await newsale.contentCnt(conType, localCode);
    // console.log(conNum, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

    ctx.body = {
        status : 200,
        result,
        conNum: conNum,
        pageNum: Math.ceil(conNum/contentNum)
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
        conType: Joi.string().regex(/\bnoFilter\b|\bcommon\b|\blive\b|\bmarket\b/).required(),
        page: Joi.number().integer().required()
    }).validate(ctx.query);

    if(params.error){
      ctx.throw(400)
    }

    const { searchName, page, conType } = params.value;
    // searchName : 검색어 | page : {페이지 num} | conType : {preview video, 360 vr, live, market}
    const data = searchName.split(' ');

    const result = await newsale.pageForSearch(data[0],data[1],data[2],conType,page, contentNum);
    const conNum = await newsale.contentCntForSearch(conType);

    ctx.body = {
        status : 200,
        result,
        conNum: conNum,
        pageNum: Math.ceil(conNum/contentNum)
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
        newsale_info_type : Joi.string().required(),            // 1. 타입
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
    }).validate(ctx.request.body);

    console.log(params.error);

    if(params.error) {
      let thumnail_image = ctx.files['thumnail_image'].map(i=>i.key);
      let vr_image = ctx.files['vr_image'].map(i=>i.key);
      let info_image = ctx.files['info_image'].map(i=>i.key);
      let preview_video_link = ctx.files['preview_video_link'].map(i=>i.key);
      let allFile = [
        ...thumnail_image,
        ...vr_image,
        ...info_image,
        ...preview_video_link
      ]
      for (let i = 0; i < allFile.length; i++) {
        S3.delete(allFile[i]);
      }
      ctx.throw(400, "잘못된 요청입니다.")
    }

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
    if(!(await newsale.isExist(id))) ctx.throw(400, "없는 매물입니다.")

    const binData = await newsale.getImgs(id);

    const thumnail_image = JSON.parse(binData.thumnail_image);
    const preview_video_link = JSON.parse(binData.preview_video_link);
    const vr_image = JSON.parse(binData.vr_image);
    const info_image = JSON.parse(binData.info_image);

    for (var i = 0; i < thumnail_image.length; i++) {
      S3.delete(thumnail_image[i]);
    }
    for (var i = 0; i < preview_video_link.length; i++) {
      S3.delete(preview_video_link[i]);
    }
    for (var i = 0; i < vr_image.length; i++) {
      S3.delete(vr_image[i]);
    }
    for (var i = 0; i < info_image.length; i++) {
      S3.delete(info_image[i]);
    }

    await newsale.delete(id);

    ctx.body = {
      status: 200
    }
}

exports.update = async (ctx) => {
    const { id } = ctx.params;
    if(await newsale.isExist(id)===0){
        ctx.throw(400)
    }

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
        ctx.throw(400, "잘못된 요청입니다.");
    }

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
    if(params.error) {
      // S3.delete(params.value.key);
      ctx.throw(400, '잘못된 요청 입니다.');
    }

    const { field, key } = params.value;

    const result = await newsale.getImgsFromField(id, field);
    const data = JSON.parse(result[field]);

    const idx = data.indexOf(key);
    if(idx == -1){
        ctx.throw(400, "없는 이미지입니다.")
    }else{
        // console.log({
        //     [field]: [...data.slice(0, idx), ...data.slice(idx+1, data.length)]
        // },JSON.stringify({
        //     [field]: [...data.slice(0, idx), ...data.slice(idx+1, data.length)]
        // }))
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
    const params = Joi.object({
      id: Joi.number().integer().required(),
      field: Joi.string().regex(/\bthumnail_image\b|\bpreview_video_link\b|\bvr_image\b|\binfo_image\b/).required(),
      imgIdx: Joi.number().integer().required()
    }).validate(ctx.query)

    if(params.error){
      S3.delete(ctx.files[`${params.value.field}`][0].key);
      ctx.throw(400, "잘못된 요청입니다.")
    }

    const { id, field, imgIdx } = params.value;

    const imgExist = await newsale.getImgs(id)
    const imgArr = JSON.parse(imgExist[`${field}`]);

    if(imgIdx > imgArr.length) {
      S3.delete(ctx.files[`${field}`][0].key);
      ctx.throw(400, "해당하는 인덱스의 이미지가 존재하지 않습니다")
    }

    if(field === 'thumnail_image'||field === 'preview_video_link'){
      if(imgExist[`${field}`] != '[]'){
        S3.delete(ctx.files[`${field}`][0].key);
        ctx.throw(400, "해당 필드는 데이터가 2개이상 들어갈 수 없습니다.(데이터가 이미 존재함).")
      }
    }

    if(await newsale.isExist(id)===0) {
      S3.delete(ctx.files[`${field}`][0].key);
      ctx.throw(400, "없는 매물입니다.")
    }

    // TODO: imgIdx 은 검증이 안됨. 나중에 검증 추가하기

    const result = await newsale.getImgsFromField(id, field);
    const data = JSON.parse(result[field])

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

exports.test = async(ctx)=>{
    const { text } = ctx.request.body;
    console.log(text);
    ctx.body = {
        text: text
    }    
}
