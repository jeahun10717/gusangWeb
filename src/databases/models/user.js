const db = require('../db');

exports.insert = async (query)=>{
    return await db.query("INSERT INTO users set ?", query);
}

exports.show = async (auth, order, page, contents)=>{ 
  if(auth == 'noFilter'){ // 전체
    return await db.query(`select * from users
    order by id ${order} limit ? offset ?`, [contents, page * contents])
  }else{
    if(auth === 'admin'){ // 관리자
      return await db.query(`select * from users where auth > 1
      order by id ${order} limit ? offset ?`, [contents, page * contents])
    }else if(auth == 'common'){ // 일반유저(부동산)
      return await db.query(`select * from users where auth < 2
      order by id ${order} limit ? offset ?`, [contents, page * contents])
    }
  }
}

exports.search = async(name1, name2, order, page, contents) =>{
  return await db.query(`select
  *
  from users
  where realty_name like ? || realty_name like ?
  order by id ${order} limit ? offset ?`
  ,[`%${name1}%`, `%${name2}%`, contents, page * contents]);
}

// 전체 수정( 예 개인정보 수정)
exports.update = async (id, query)=>{
    return await db.query("UPDATE users set ? where id = ?",[query, id]);
}
//TODO: 이 부분에서 id 부분 원래는 uuid 였는데 다른 곳에서 오류 생기면 바꿔야 함

// Auth 2- 일반관리자 권한 주기
exports.setADM = async (id) =>{
    return await db.query("UPDATE users set Auth= 2 where id = ?", id);
}

exports.checkADM = async (auth, name) => {
  return await db.query(`select name from users where auth >= ? && name = ?`, [auth, name])
}

exports.getAllADM = async () => {
  return await db.query(`select name from users where auth >= 2`)
}

exports.isExist = async (login_type, login_id) => {
    const [result] = await db.query("select hex(uuid) uuid, isnull(name) isNew from users where login_type = ? and login_id = ?",[login_type, login_id]);
    return result; // 있으면 객체, 없으면 undefined
}

exports.isExistFromID = async(id)=>{
  const [result] = await db.query('select count(*) cnt from franchise where id = ?', id);
  return result.cnt;
}



exports.getAuth = async (user_id) =>{
  const [result] = await db.query(`select Auth from Users where uuid = ?`,Buffer.from(user_id,'hex'));
  if(result) return result.Auth;
  return result;
}
