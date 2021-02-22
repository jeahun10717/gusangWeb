const Joi = require('joi')
const { S3 } = require('../../lib');
const { Content } = require('../../databases');
const { IMG_BASE_URL } = process.env;
let { MAX_IMG } = process.env;
MAX_IMG *= 1;

exports.get = async ctx=>{
  ctx.body = {
    status: 200,
    data: await Content.get()
  }
}

exports.detail = async ctx=>{
  const params = Joi.object({
    content_id: Joi.number().integer().min(1).required()
  }).validate(ctx.params);
  if(params.error) ctx.throw(400, 'bad request');

  const { content_id } = params.value;

  const detail = await Content.detail(content_id);
  if(!detail) ctx.throw(400, '없는 게시물');
  ctx.body = {
    status: 200,
    data: {
      ...detail,
      imgs: await Content.getImgs(content_id)
    }
  }

}

exports.regist = async ctx=>{
  const params = Joi.object({
    title: Joi.string().empty('',null),
    body: Joi.string().empty('',null),
    imgs: Joi.string().empty('',null)
  }).validate(ctx.request.body);
  if(params.error) ctx.throw(400, 'bad request');

  const { title, body } = params.value;

  const result = await Content.regist({
    title,body
  });
  const content_id = result.insertId;

  if(ctx.files){
    let idx = 0;

    for(let i = 0 ; i < ctx.files.length ; i++){
      if(idx < MAX_IMG){
        await Content.imgs({
          content_id,
          base_url: IMG_BASE_URL,
          img_url: ctx.files[i].key,
          idx
        });
        idx++;
      }else{
        S3.delete(ctx.files[i].key);
      }
    }
  }

  ctx.body = {
    status: 200
  }
}

exports.update = async ctx =>{
  const idParams = Joi.object({
    content_id: Joi.number().integer().min(1).required()
  }).validate(ctx.params);
  if(idParams.error) ctx.throw(400, 'bad request');

  const { content_id } = idParams.value;

  const params = Joi.object({
    title: Joi.string().empty('',null),
    body: Joi.string().empty('',null),
  }).validate(ctx.request.body);
  if(params.error) ctx.throw(400, 'bad request');

  const { title, body } = params.value;

  const result = await Content.update(content_id, {
    title,
    body
  });

  if(result.affectedRows < 1) ctx.throw(404, '없는 게시물');

  ctx.body = {
    status: 200
  }
}

exports.delImg = async ctx =>{
  const params = Joi.object({
    content_id: Joi.number().integer().min(0).required(),
    img_idx: Joi.number().integer().min(-1).max(MAX_IMG-1).required(),
  }).validate(ctx.request.body);
  if(params.error) ctx.throw(400,'bad request');

  const { content_id, img_idx } = params.value;

  // TODO 수정 권한이 있는지

  const imgUrl = await Content.getImgUrl(content_id, img_idx);
  if(!imgUrl) ctx.throw(400,'없는 이미지');

  // S3에서 img_url 삭제
  S3.delete(imgUrl);

  await Content.delImg(content_id, img_idx);

  ctx.body = {
    status: 200
  }
}

exports.upImg = async ctx =>{
  const params = Joi.object({
    content_id: Joi.number().integer().min(0).required(),
    img_idx: Joi.number().integer().min(-1).max(MAX_IMG-1).required(),
    img: Joi.string().empty('',null)
  }).validate(ctx.request.body);
  if(params.error){
    if(ctx.file) S3.delete(ctx.file.key);
    ctx.throw(400,'bad request');
  }

  const { content_id, img_idx } = params.value;

  if(!ctx.file) ctx.throw(400,'사진이 없네?');

  // TODO 수정 권한이 있는지

  if(img_idx === -1){ // insert
    const idx = await Content.getMaxImgIdx(content_id);
    if(idx < MAX_IMG){
      try{
        await Content.imgs({
          content_id,
          base_url: IMG_BASE_URL,
          img_url: ctx.file.key,
          idx
        });
      }catch(e){
        S3.delete(ctx.file.key);
        if(e.errno === 1452)  ctx.throw(400, '없는 게시물');
        else ctx.throw(500,e);
      }
    }else{
      S3.delete(ctx.file.key);
    }
  }else{ // update
    // 업데이트할 img_url을 가져옴
    const imgUrl = await Content.getImgUrl(content_id, img_idx);
    if(!imgUrl){
      S3.delete(ctx.file.key);
      ctx.throw(400,'없는 이미지');
    }

    // S3에서 img_url 삭제
    S3.delete(imgUrl);

    // 데이터 업데이트
    await Content.upImgUrl(content_id, img_idx, ctx.file.key);
  }

  ctx.body = {
    status: 200
  }
}
