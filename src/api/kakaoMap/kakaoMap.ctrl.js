const Joi = require('joi');
const { kakaomapModel } = require('../../databases')
const { kakaomap } = require('../../lib');

// /kakaoMap/getcode?local=부산 연제구
// api 요청은 위와 같이 하면 됨
exports.getAllCode = async (ctx) => {
    const result = await kakaomapModel.showAll();
    ctx.body={
        status:200,
        result
    }
}

exports.create = async (ctx) => {
    const { local } = ctx.request.body
    const localInfo = await kakaomap.kakaomap(local)
    if(localInfo.documents.length === 0){
      ctx.body = {
        status: 200,
        result: null
      }
      return;
    }
    const query = {
        city : localInfo.documents[0].address.region_1depth_name,
        gu : localInfo.documents[0].address.region_2depth_name,
        code : localInfo.documents[0].address.b_code
    }
    const params = Joi.object({
        city : Joi.string().required(),
        gu : Joi.string().required(),
        code : Joi.number().required()
    }).validate(query)

    try{
      await kakaomapModel.insert(params.value);

    }catch(e){
      if(e.errno === 1062) ctx.throw(400,'이미 있음');
      else ctx.throw(400, e);
    }

    ctx.body={
        status:200,
        result : params.value
    }
}

exports.remove = async (ctx)=>{
    const { code } = ctx.params;

    if(await kakaomapModel.isExist(code)){
        await kakaomapModel.delete(code)
        ctx.body={
            status : 200
        }
    }else{
        ctx.body={
            status: 400,
            message: `이 코드 : ${code} 는 DB 에 없습니다`
        }
    }
}
