const Joi = require('joi');
const { S3 } = require('../../lib');
const { franchise } = require('../../databases');
const contentNum = 2;
const tagArr = ["cafe","bakery","dessert","chicken","pizza",
"korean","chinese","japanese","special","snack",
"fastfood","pub","convStore","sale","laundry",
"pcRoom","game","studyCafe","education","life"]

// 아래 함수에서 type 은 view 는 조회순, date 는 날짜순
exports.pagenate = async (ctx) => {
    const params = Joi.object({
        order: Joi.string().regex(/\bdesc\b|\basc\b/).required(),
        tag: Joi.string().valid('noFilter',...tagArr).required(),
        type: Joi.string().regex(/\bviews\b|\bid\b/).required(),
        pagenum: Joi.number().integer().required()
    }).validate(ctx.query);
    console.log(params.error);

    if(params.error){
        ctx.throw(400, "잘못된 요청입니다.")
    }
    // conType 은 contents_type 에 들어가는 것 : preveiw_video, live 등등
    const { order, tag, type, pagenum } = params.value;
    // order : {desc , asc} / conType : {preview video, 360 vr, live, market}
    // type : {views, id} //> id 는 최신순 정렬하는 거
    // TODO: 밑의 2 부분 30 으로 바꿔야 함
    const result = await franchise.pagination( order, type, tag, pagenum, contentNum);
    const conNum = await franchise.contentCnt(tag);
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
        id: Joi.number().integer()
    }).validate(ctx.params);

    if(params.error) ctx.throw(400, "잘못된 요청입니다.")

    const { id } = params.value;

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

    const result = await franchise.pageForSearch(splitData[0],splitData[1],splitData[2], page, contentNum);
    // TODO: 위의 2 30 으로 바꾸기

    // const final = await franchise.pageForSearch(result, pagenum, 2)
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
    // const { franchise_name } = ctx.request.body
    // console.log(franchise_name);
    const params = Joi.object({
        franchise_name: Joi.string().required(), // : 컨텐츠에 표시될 텍스트, 검색될 이름
        franchise_tag: Joi.string().valid(...tagArr).required(), // : 프론트에서 정해줘야 함 ex) 양식, 중식, 분식 등등
        // franchise_logo: Joi.string().required(), // : franchise 로고

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
        // brand_menu: Joi.string().required(), // 브랜드 정보 / 브랜드 대표메뉴
        brand_menutext:Joi.string().required(),
        brand_competitiveness: Joi.string().required(), // 브랜드 정보 -> html 로 바로 넣을거임
        // brand_video: Joi.string().required(), // 브랜드 정보 / 브랜드 홍보영상

        blog_review: Joi.string().required()
    }).validate(ctx.request.body);
    // console.log(params.error);
    // console.log(params.value.brand_menutext);
    if(params.error) {
      const franchise_logo = ctx.files['franchise_logo'].map(i=>i.key);
      const brand_menu = ctx.files['brand_menu'].map(i=>i.key);
      const brand_video = ctx.files['brand_video'].map(i=>i.key);
      const allFile = [
        ...franchise_logo,
        ...brand_menu,
        ...brand_video,
      ]
      for (let i = 0; i < allFile.length; i++) {
        S3.delete(allFile[i]);
      }
      ctx.throw(400, "잘못된 요청입니다.")
    }

    // console.log(params.value[0].brand_menutext);
    // console.log();

    let franchise_logo = ctx.files['franchise_logo'].map(i=>i.key);
    let brand_menu = ctx.files['brand_menu'].map(i=>i.key);
    let brand_video = ctx.files['brand_video'].map(i=>i.key);
    // let brand_menutext = JSON.stringify(params.value.brand_menutext);
    franchise_logo = JSON.stringify(franchise_logo);
    brand_menu = JSON.stringify(brand_menu);
    brand_video = JSON.stringify(brand_video);

    await franchise.insert({
        ...params.value,
        franchise_logo,
        brand_video,
        brand_menu,
        // brand_menutext
    });

    ctx.body ={
        status: 200
    }
}

exports.update = async(ctx)=>{
  const { id } = ctx.params;
  if(await franchise.isExist(id)===0){
      ctx.throw(400, "없는 매물입니다")
  }

  const params = Joi.object({
    franchise_name: Joi.string().required(), // : 컨텐츠에 표시될 텍스트, 검색될 이름
    franchise_tag: Joi.string().valid(...tagArr).required(), // : 프론트에서 정해줘야 함 ex) 양식, 중식, 분식 등등
    // franchise_logo: Joi.string().required(), // : franchise 로고

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
    // brand_menu: Joi.string().required(), // 브랜드 정보 / 브랜드 대표메뉴
    brand_competitiveness: Joi.string().required(), // 브랜드 정보 -> html 로 바로 넣을거임
    // brand_video: Joi.string().required(), // 브랜드 정보 / 브랜드 홍보영상

    blog_review: Joi.string().required()
  }).validate(ctx.request.body);

  if(params.error) ctx.throw(400, "잘못된 요청입니다.");

  await franchise.update(id, {
    ...params.value,
    updateAt: new Date()
  });

  ctx.body = {
    status: 200
  }
}

exports.delImg = async (ctx)=>{
    const { id } = ctx.params;
    if(await franchise.isExist(id)===0){
        ctx.throw(400, "없는 매물입니다")
    }
    const params = Joi.object({
        field: Joi.string().valid("franchise_logo","brand_menu","brand_video").required(),
        key: Joi.string().required()
    }).validate(ctx.query);
    if(params.error) ctx.throw(400, '잘못된 요청');

    const { field, key } = params.value;

    if(field == "brand_menu"){
      const result = await franchise.getImgsFromField(id, field);
      // console.log(result);
      const data = JSON.parse(result[field]);

      const menuText = await franchise.getMenuData(id);
      // console.log(menuText[0].brand_menutext);
      const brandMenuText = JSON.parse(menuText[0].brand_menutext);
      // console.log(brandMenuText);
      const idx = data.indexOf(key);
      // console.log(idx);
      if(idx == -1){
          ctx.throw(400, "없는 사진입니다.")
      }else{
          await franchise.insertImgs({
              [field]: JSON.stringify([...data.slice(0, idx), ...data.slice(idx+1, data.length)]),
              brand_menutext: JSON.stringify([...brandMenuText.slice(0, idx), ...brandMenuText.slice(idx+1, brandMenuText.length)])
          }, id)
          S3.delete(key);
      }
      // TODO: 변경이 적용되었는지 알아내는 방법?
      ctx.body = {
          status: 200
      }
    } else {
      const result = await franchise.getImgsFromField(id, field);
      const data = JSON.parse(result[field]);

      const idx = data.indexOf(key);
      if(idx == -1){
          ctx.throw(400, "없는 사진입니다.")
      }else{
          await franchise.insertImgs({
              [field]: JSON.stringify([...data.slice(0, idx), ...data.slice(idx+1, data.length)])
          }, id)
          S3.delete(key);
      }

      ctx.body = {
          status: 200
      }
    }

}
//key 와 field 로 추가하는 소스 필요함
exports.upImg = async (ctx)=>{
    const params = Joi.object({
        id: Joi.number().integer().required(),
        field: Joi.string().valid("franchise_logo","brand_menu","brand_video").required(),
        imgIdx: Joi.number().integer().required(),
        menuText: Joi.string()
    }).validate(ctx.request.body);

    if(params.error){
        S3.delete(ctx.files[`${params.value.field}`][0].key);
        ctx.throw(400, "잘못된 요청입니다.");
    }

    if(params.value.field == "brand_menu"){
      const { id, field, imgIdx, menuText } = params.value;
      // console.log(params.value);

////////////검증관련 - 200 외의 status 는 들어온 S3 소스 지우는 소스/////////////////////
      const imgExist = await franchise.getImgs(id)
      const imgArr = JSON.parse(imgExist[`${field}`]);
      // console.log(ctx.files);
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

      if(await franchise.isExist(id)===0) {
        S3.delete(ctx.files[`${field}`][0].key);
        ctx.throw(400, "없는 매물입니다.")
      }
////////////////////////////////////////////////////////////////////////////////

      const result = await franchise.getImgsFromField(id, field);
      const data = JSON.parse(result[field])
      // console.log(data);

      let imgInfo = ctx.files[`${field}`]
      // console.log(imgInfo);
      const imgName = imgInfo[0].key;
      // console.log(imgName);
      const menuData = await franchise.getMenuData(id);
      let brandMenuText = JSON.parse(menuData[0].brand_menutext);
      console.log(brandMenuText);
      // console.log(data);
      data.splice(imgIdx, 0, imgName);
      // console.log(data);
      brandMenuText.splice(imgIdx, 0, menuText);
      await franchise.insertImgs({
          [field]: JSON.stringify(data),
          brand_menutext: JSON.stringify(brandMenuText)
      }, id)

      ctx.body ={
          status: 200
      }
    }else{
      const { id, field, imgIdx } = params.value;

////////////검증관련 - 200 외의 status 는 들어온 S3 소스 지우는 소스/////////////////////
      const imgExist = await franchise.getImgs(id)
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

      if(await franchise.isExist(id)===0) {
        S3.delete(ctx.files[`${field}`][0].key);
        ctx.throw(400, "없는 매물입니다.")
      }
////////////////////////////////////////////////////////////////////////////////

      // console.log(params.value);
      if(await franchise.isExist(id)===0){
          ctx.throw(400, "없는 매물입니다")
      }

      const result = await franchise.getImgsFromField(id, field);
      const data = JSON.parse(result[field])
      // console.log(data);

      let imgInfo = ctx.files[`${field}`]
      // console.log(imgInfo);
      const imgName = imgInfo[0].key;
      // console.log(imgName);

      // console.log(data);
      data.splice(imgIdx, 0, imgName);
      // console.log(data);

      await franchise.insertImgs({
          [field]: JSON.stringify(data)
      }, id)

      ctx.body ={
          status: 200
      }
    }
}

exports.delete = async(ctx) => {
    const { id } = ctx.params;
    // TODO: 나중에 시간 나면 s3 에서 사진 지우는 코드 작성해야 함
    //isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
    if(!(await franchise.isExist(id))) ctx.throw(400, "없는 매물입니다.")

    const binData = await franchise.getImgs(id);

    const franchise_logo = JSON.parse(binData.franchise_logo);
    const brand_menu = JSON.parse(binData.brand_menu);
    const brand_video = JSON.parse(binData.brand_video);

    for (var i = 0; i < franchise_logo.length; i++) {
      S3.delete(franchise_logo[i]);
    }
    for (var i = 0; i < brand_menu.length; i++) {
      S3.delete(brand_menu[i]);
    }
    for (var i = 0; i < brand_video.length; i++) {
      S3.delete(brand_video[i]);
    }

    await franchise.delete(id);

    ctx.body = {
      status: 200
    }
}
