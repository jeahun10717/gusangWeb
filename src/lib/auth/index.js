const { user } = require('../../databases');

exports.login = (ctx, next) => {
  if(ctx.request.user) return next();
  else ctx.throw(401,'인증 오류');
}

async function levelChk(user_id, level){
  const auth = await user.getAuth(user_id);
  return level <= auth;
}
exports.level1 = async (ctx, next) =>{
  const { UUID } = ctx.request.user;
  if(await levelChk(UUID, 1)) return next();
  else ctx.throw(401,'인증 오류');
}

exports.level2 = async (ctx, next) =>{
  const { UUID } = ctx.request.user;
  if(await levelChk(UUID, 2)) return next();
  else ctx.throw(401,'인증 오류');
}

exports.level3 = async (ctx, next) =>{
  const { UUID } = ctx.request.user;
  if(await levelChk(UUID, 3)) return next();
  else ctx.throw(401,'인증 오류');
}
