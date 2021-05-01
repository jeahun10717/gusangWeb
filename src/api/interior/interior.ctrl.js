const Joi = require('joi');
const { S3 } = require('../../lib');
const { interior } = require('../../databases');
//TODO: 퍼플리싱 하기 전에 밑에 contentNum 15로 고쳐야 함.
const contentNum = 15;


// 아래 함수에서 type 은 view 는 조회순, date 는 날짜순
exports.pagenate = async (ctx) => {
    const params = Joi.object({
        order: Joi.string().regex(/\bdesc\b|\basc\b/).required(),
        localCode: Joi.string().required(), // TODO: 문자 개수 로컬코드 갯수로 검증해야 함
        conType: Joi.string().regex(/\bnoFilter\b|\bcommon\b|\blive\b|\bmarket\b/).required(),
        type: Joi.string().regex(/\bviews\b|\bid\b/).required(),
        page: Joi.number().integer()
    }).validate(ctx.query)

    // console.log(params.error);

    if(params.error){
        ctx.throw(400)
    }
    // show/:type/:id
    // 위의 api router 에서 type 은 최신순, 조회순
    // conType 은 contents_type 에 들어가는 것 : preveiw_video, live 등등
    const { order, localCode, conType, type, page } = params.value;
    // order : {desc , asc} / conType : {preview video, 360 vr, live, market}
    // type : {views, id} --> id 는 최신순 정렬하는 거
    // console.log(ctx.query);
    // TODO: query 에서 원하는 값이 안들어오면 400 띄우는 소스 필요
    // TODO: 주거랑 상가 부분에서 지역별로 나눌 필요가 없는지 클라이언트한테 물어봐야 함
    const result = await interior.pagination( order, type, localCode, conType, page, contentNum);
    console.log(result);
    const conNum = await interior.contentCnt(conType, localCode);
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
        id: Joi.number().integer().required(),
        views: Joi.number().integer().required()
    }).validate(ctx.params)

    if(params.error){
        ctx.throw(400);
    }

    const { id, views } = params.value;

    if(views === 1){
      await interior.upViews(id)
    }
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
        searchName: Joi.string().required(),
        conType: Joi.string().regex(/\bnoFilter\b|\bcommon\b|\blive\b|\bmarket\b/).required(),
        page: Joi.number().integer().required()
    }).validate(ctx.query);

    if(params.error){
        ctx.throw(400);
    }

    const { searchName, page, conType } = params.value;

    data = searchName.split(' ');
    if(data[1]===undefined) data[1]=''
    if(data[2]===undefined) data[2]=''
    const result = await interior.pageForSearch(data[0],data[1],data[2],conType,page, contentNum);
    const conNum = await interior.contentCntForSearch(data[0],data[1],data[2],conType);

    ctx.body = {
        status : 200,
        result,
        conNum: conNum,
        pageNum: Math.ceil(conNum/contentNum)
    }
}

exports.create = async (ctx) => {
    const params = Joi.object({
        contents_name : Joi.string().required(), // 컨텐츠에 표시될 텍스트
        contents_type : Joi.string().regex(/\blive\b|\bmarket\b/).required(), // 영상,360 vr, 주거, 상가
        local_address : Joi.string().required(), // : 지역명에 대한 정보 저장, ex) 연제구, 부산진구 등등
                                   // 프론트에서 데이터 정해줘야 할 듯
        // thumnail_image : Joi.string().required(),

        // preview_video_link : Joi.string().required(), // 미리보기 영상 로컬링크
        youtube_link : Joi.string(), // 해당 컨텐츠의 유튭 영상
        youtube_link_text : Joi.string(),
        vr_link_old : Joi.string(), // 시공 전 vr 영상을 위한 링크
        vr_link_new : Joi.string(), // 시공 후 vr 영상을 위한 링크

        construct_time : Joi.string().required(), // 인테리어/상세보기 부분 공사기간
        construct_cost : Joi.string().required(), // 인테리어/상세보기 부분 공사비용
        construct_company : Joi.string().required(), // 인테리어/상세보기 부분 공사업체
        construct_info : Joi.string(), // 인테리어/상세보기 부분 공사내역

        // image_link : Joi.string().required(), // 사진 슬라이드에 들어갈 이미지 로컬링크
        // 이미지가 여러개 인데 만약에 동적(사진 개수가 정해지지 않았을 때일 경우에는 어떻게 해야 함?
        // 위의 질문이 구현이 어렵다면 그냥 특정 개수로 태그를 달아서 하는 게 낫나?

        // 견적관련
        interior_info_location : Joi.string().required(),  // 1. 위치
        interior_info_width : Joi.number().required(),              // 2. 평수
        interior_info_period : Joi.string().required(),    // 3. 공사기간
        interior_info_price : Joi.number().required(),              // 4. 비용
        interior_info_history : Joi.string(),   // 5. 시공내역
        interior_info_etc : Joi.string(),       // 6. 기타설명
        //

        // 카카오 맵을 위한 위도 경도 주소
        kakaomap_info_latitude : Joi.number().required(),      // 위도
        kakaomap_info_longtitude : Joi.number().required(),    // 경도
        kakaomap_info_address : Joi.string().required(), // 주소
    }).validate(ctx.request.body)
    // console.log(params.error);
    if(params.error) {
      const thumnail_image = ctx.files['thumnail_image'].map(i=>i.key);
      const thumnail_image_vr = ctx.files['thumnail_image_vr'].map(i=>i.key);
      const preview_video_link = ctx.files['preview_video_link'].map(i=>i.key);
      const image_link = ctx.files['image_link'].map(i=>i.key);
      const allFile = [
        ...thumnail_image,
        ...thumnail_image_vr,
        ...preview_video_link,
        ...image_link,
      ]
      for (let i = 0; i < allFile.length; i++) {
        S3.delete(allFile[i]);
      }
      ctx.throw(400, "잘못된 요청입니다.")
    }

    let thumnail_image = ctx.files['thumnail_image'].map(i=>i.key);
    let thumnail_image_vr = ctx.files['thumnail_image_vr'].map(i=>i.key);
    let preview_video_link = ctx.files['preview_video_link'].map(i=>i.key);
    let image_link = ctx.files['image_link'].map(i=>i.key);

    thumnail_image = JSON.stringify(thumnail_image)
    thumnail_image_vr = JSON.stringify(thumnail_image_vr)
    preview_video_link = JSON.stringify(preview_video_link)
    image_link = JSON.stringify(image_link)

    await interior.insert({
        ...params.value,
        thumnail_image: thumnail_image,
        thumnail_image_vr: thumnail_image_vr,
        preview_video_link: preview_video_link,
        image_link: image_link,
        views:0
    });

    ctx.body ={
        status: 200
    }

}

exports.update = async (ctx) => {
    const { id } = ctx.params;
    if(await interior.isExist(id)===0){
        ctx.throw(400)
    }

    const params = Joi.object({
        contents_name : Joi.string().required(), // 컨텐츠에 표시될 텍스트
        contents_type : Joi.string().regex(/\bcommon\b|\blive\b|\bmarket\b/).required(), // 영상,360 vr, 주거, 상가
        local_address : Joi.string().required(), // : 지역명에 대한 정보 저장, ex) 연제구, 부산진구 등등
                                   // 프론트에서 데이터 정해줘야 할 듯
        // thumnail_image : Joi.string().required(),

        // preview_video_link : Joi.string().required(), // 미리보기 영상 로컬링크
        youtube_link : Joi.string().empty('').default(null), // 해당 컨텐츠의 유튭 영상
        youtube_link_text : Joi.string().empty('').default(null),
        vr_link_old : Joi.string().empty('').default(null), // 시공 전 vr 영상을 위한 링크
        vr_link_new : Joi.string().empty('').default(null), // 시공 후 vr 영상을 위한 링크

        construct_time : Joi.string().required(), // 인테리어/상세보기 부분 공사기간
        construct_cost : Joi.string().required(), // 인테리어/상세보기 부분 공사비용
        construct_company : Joi.string().required(), // 인테리어/상세보기 부분 공사업체
        construct_info : Joi.string().empty('').default(null), // 인테리어/상세보기 부분 공사내역

        // image_link : Joi.string().required(), // 사진 슬라이드에 들어갈 이미지 로컬링크
        // 이미지가 여러개 인데 만약에 동적(사진 개수가 정해지지 않았을 때일 경우에는 어떻게 해야 함?
        // 위의 질문이 구현이 어렵다면 그냥 특정 개수로 태그를 달아서 하는 게 낫나?

        // 견적관련
        interior_info_location : Joi.string().required(),  // 1. 위치
        interior_info_width : Joi.number().required(),              // 2. 평수
        interior_info_period : Joi.string().required(),    // 3. 공사기간
        interior_info_price : Joi.number().required(),              // 4. 비용
        interior_info_history : Joi.string().empty('').default(null),   // 5. 시공내역
        interior_info_etc : Joi.string().empty('').default(null),       // 6. 기타설명
        //

        // 카카오 맵을 위한 위도 경도 주소
        kakaomap_info_latitude : Joi.number().required(),      // 위도
        kakaomap_info_longtitude : Joi.number().required(),    // 경도
        kakaomap_info_address : Joi.string().required(), // 주소
    }).validate(ctx.request.body)


    if(params.error) {
        ctx.throw(400);
    }

    await interior.update(id, {
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
        field: Joi.string().valid("thumnail_image","thumnail_image_vr","preview_video_link","image_link").required(),
        key: Joi.string().required()
    }).validate(ctx.query);
    if(params.error) ctx.throw(400, '잘못된 요청');

    const { field, key } = params.value;

    const result = await interior.getImgsFromField(id, field);
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
        await interior.insertImgs({
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
        field: Joi.string().valid('thumnail_image',"thumnail_image_vr",'preview_video_link','image_link').required(),
        imgIdx: Joi.number().integer().required()
    }).validate(ctx.query);

    if(params.error){
      S3.delete(ctx.files[`${params.value.field}`][0].key);
      ctx.throw(400, "잘못된 요청입니다.")
    }

    const { id, field, imgIdx } = params.value;

    const imgExist = await interior.getImgs(id)
    const imgArr = JSON.parse(imgExist[`${field}`]);

    if(imgIdx > imgArr.length) {
      S3.delete(ctx.files[`${field}`][0].key);
      ctx.throw(400, "해당하는 인덱스의 이미지가 존재하지 않습니다")
    }

    if(field === 'thumnail_image'||field === 'preview_video_link'||field === "thumnail_image_vr"){
      if(imgExist[`${field}`] != '[]'){
        S3.delete(ctx.files[`${field}`][0].key);
        ctx.throw(400, "해당 필드는 데이터가 2개이상 들어갈 수 없습니다.(데이터가 이미 존재함).")
      }
    }

    if(await interior.isExist(id)===0) {
      S3.delete(ctx.files[`${field}`][0].key);
      ctx.throw(400, "없는 매물입니다.")
    }

    // TODO: imgIdx 은 검증이 안됨. 나중에 검증 추가하기

    const result = await interior.getImgsFromField(id, field);
    const data = JSON.parse(result[field])

    let imgInfo = ctx.files[`${field}`]
    // console.log(imgInfo);
    imgName = imgInfo[0].key;
    // console.log(imgName);

    // console.log(data);
    data.splice(imgIdx, 0,imgName);
    // console.log(data);

    await interior.insertImgs({
        [field]: JSON.stringify(data)
    }, id)

    ctx.body ={
        status: 200,
        imgName
    }
}

exports.delete = async(ctx) => {
  const { id } = ctx.params;
  //isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
  if(!(await interior.isExist(id))) ctx.throw(400, "없는 매물입니다.")

  const binData = await interior.getImgs(id);

  const thumnail_image = JSON.parse(binData.thumnail_image);
  const thumnail_image_vr = JSON.parse(binData.thumnail_image_vr);
  const preview_video_link = JSON.parse(binData.preview_video_link);
  const image_link = JSON.parse(binData.image_link);

  for (var i = 0; i < thumnail_image.length; i++) {
    S3.delete(thumnail_image[i]);
  }
  for (var i = 0; i < thumnail_image_vr.length; i++) {
    S3.delete(thumnail_image_vr[i]);
  }
  for (var i = 0; i < preview_video_link.length; i++) {
    S3.delete(preview_video_link[i]);
  }
  for (var i = 0; i < image_link.length; i++) {
    S3.delete(image_link[i]);
  }

  await interior.delete(id);

  ctx.body = {
    status: 200
  }
}
