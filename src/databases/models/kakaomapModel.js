const db = require('../db');

exports.insert = async(query)=>{
    return await db.query('insert into localCode set ?', query);
}

exports.showAll = async() => {
    return await db.query('select * from localCode')
}

// exports.showOne = async(guName) => {
//     return await db.query('select * from localCode where gu = ?', guName)
// }

exports.delete = async(code) => {
    return await db.query('delete from localCode where code = ?', code)
}

// isExist 는 값이 존재하면 1 존재하지 않으면 0
exports.isExist = async(code)=>{
    const [result] = await db.query('select count(*) cnt from localCode where code = ?', code);
    return result.cnt;
}
