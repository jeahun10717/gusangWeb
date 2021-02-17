// 주소로 해당 장소의 정보 가져오는 kakaomap api

const { KAKAO_CLIENT_ID } = process.env;

const axios = require('axios');
const qs = require('querystring');

function getBcode(address){
    const config = {
        headers : {
            "Authorization" : 'KakaoAK ' + KAKAO_CLIENT_ID
        },
        params : {
            "query" : `${address}`
        }
    }

    return new Promise(
        (resolve, reject)=>{
            axios.get(`https://dapi.kakao.com/v2/local/search/address.json`, config)
                .then((res)=>{
                    if(res.status == 200){
                        resolve(res.data);
                    }
                    reject(false)
                })
                .catch(e=>{
                    console.log(e.response.data);
                    reject(false);
                })
        }
    )
}

exports.kakaomap = async(address)=>{
    let data;
    try {
        data = await getBcode(address);
    } catch (e) {
        console.log(`error`, e);
    }
    return data;
}
