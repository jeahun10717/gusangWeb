const db = require('../db');

exports.insert = async (query)=>{
    return await db.query("INSERT INTO users set ?", query);
}

// 전체 수정( 예 개인정보 수정)
exports.update = async (uuid, query)=>{
    return await db.query("UPDATE users set ? where uuid = ?",[query, uuid]);
}

// Auth 2- 일반관리자 권한 주기
exports.setADM = async (id) =>{
    return await db.query("UPDATE users set Auth= 2 where id = ?", id);
}

exports.isExist = async (login_type, login_id) => {
    const [result] = await db.query("select hex(uuid) uuid, isnull(name) isNew from users where login_type = ? and login_id = ?",[login_type, login_id]);
    return result; // 있으면 객체, 없으면 undefined
}