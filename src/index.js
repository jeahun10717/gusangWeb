require('dotenv').config();
const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const xss = require('xss');
const helmet = require('koa-helmet')


const app = new koa();
const router = new Router();

const serve = require('koa-static');

const api = require('./api')

const { oauth, token, error } = require('./lib');

const { KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI, NAVER_CLIENT_ID, NAVER_REDIRECT_URI } = process.env;

// router.get('/',ctx=>{
//    ctx.body = `
//       <!DOCTYPE html>
//       <html>
//          <head>
//             <meta charset="utf-8"/>
//             <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width"/>
//             <title>Login Demo - Kakao JavaScript SDK</title>
//             <script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>
//             <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.js"></script>
//          </head>
//          <body>
//             <div id="yes">
//                <p id ='yesText'></p>
//             </div>
//             <div id="no">
//                <button onclick ="location.href='https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code'"><img src="/kakao_button" /></button>
//                <a href='https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code'>get code</a>
//             </div>
//             <script>
//                const token = Cookies.get('token');
//
//                if(token){
//                   document.querySelector('#yes').style="";
//                   document.querySelector('#yesText').innerHTML = "토큰 값: "+token;
//                }else{
//                   document.querySelector('#no').style="";
//                }
//             </script>
//             <a id="kakao-login-btn"></a>
//          </body>
//       </html>
//    `
// });
//
// router.get('/naver', ctx=>{
//    let html = `
//    <html lang="ko">
//    <head>
//       <script type="text/javascript" src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js" charset="utf-8"></script>
//    </head>
//    <body>
//       <!-- 네이버아이디로로그인 버튼 노출 영역 -->
//       <div id="naverIdLogin"></div>
//       <!-- //네이버아이디로로그인 버튼 노출 영역 -->
//
//       <!-- 네이버아디디로로그인 초기화 Script -->
//       <script type="text/javascript">
//          var naverLogin = new naver.LoginWithNaverId(
//             {
//                clientId: "[[NAVER_CLIENT_ID]]",
//                callbackUrl: "[[NAVER_REDIRECT_URI]]",
//                responseType: 'code',
//                isPopup: false, /* 팝업을 통한 연동처리 여부 */
//                loginButton: {color: "green", type: 3, height: 60} /* 로그인 버튼의 타입을 지정 */
//             }
//          );
//
//          /* 설정정보를 초기화하고 연동을 준비 */
//          naverLogin.init();
//
//       </script>
//       <!-- // 네이버아이디로로그인 초기화 Script -->
//    </body>
//    </html>
//    `;
//
//    html = html.replace(/\[\[NAVER_CLIENT_ID\]\]/g, NAVER_CLIENT_ID);
//    html = html.replace(/\[\[NAVER_REDIRECT_URI\]\]/g, NAVER_REDIRECT_URI)
//
//    ctx.body = html;
// })
//
// router.get('/kakao_button', ctx=>{
//    const fs = require('fs');
//    ctx.type = 'png';
//    ctx.body = fs.readFileSync(`${__dirname}/../pulblic/kakao_login_medium_narrow.png`);
// })
//
// router.get('/add', ctx=>{
//    ctx.body=`
//    <!DOCTYPE html>
// <html>
//     <head>
//         <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
//         <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.1/js.cookie.min.js"></script>
//     </head>
//     <body>
//         <input type="text" id='company'> 부동산 중개소 이름
//         <input type="text" id='adress'> 부동산 중개소 주소
//         <input type="text" id='name'> 부동산 중개소 소장 이름
//         <input type="text" id='phone'> 부동산 중개소 소장 전화번호
//         <input type="button" onclick="addDataSend()"> 추가정보 전송
//
//         <script>
//             function addDataSend(){
//                 axios.post('/api/users/add', {
//                     realty_name:document.querySelector('#company').value,
//                     realty_adress:document.querySelector('#adress').value,
//                     realty_owner_name:document.querySelector('#name').value,
//                     realty_owner_phone:document.querySelector('#phone').value,
//                 },{
//                    headers: {
//                       Authorization: 'bearer ' + Cookies.get('token')
//                    }
//                 }).then(res=>{
//                     const {status} = res.data;
//
//                     if(status==200){
//                         location.href='/'
//                     }
//                 }).catch(err=>{
//                     console.log(err);
//                 })
//             }
//         </script>
//     </body>
// </html>
//    `
// });
//

// router.get('/oauth',async ctx=>{
//    const { code } = ctx.query;

//    const kakaoData = await oauth.kakao(code);
//    ctx.body = kakaoData;
// });
app.use(// koa helmet 적용- 보안관련
  helmet({
    contentSecurityPolicy: false,
  })
);
router.use('/api', api.routes());
app.use(serve(__dirname + '/build'))
app.use(cors());
app.use(serve('./public'))
app.use(bodyParser({
    jsonLimit: '50mb', extended: true}))
app.use(require('koa-morgan')('dev'));
app.use(error);
app.use(token.jwtMiddleware);
app.use(router.routes()).use(router.allowedMethods());
app.use(require('./swagger'))

app.listen(4000, ()=>{
   console.log("kakao OAuth test server port: 4000");
});
