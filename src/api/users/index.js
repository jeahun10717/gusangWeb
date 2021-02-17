const Router = require('koa-router');
const kakao = require('./kakao')
const add = require('./add');
const users = new Router();

users.get('/', (ctx, next)=>{
    ctx.body = 'this is users page'
})

users.use('/kakao', kakao.routes());
users.use('/add', add.routes());

module.exports = users;