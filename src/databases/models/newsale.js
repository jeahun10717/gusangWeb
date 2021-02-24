const db = require('../db');
exports.insert = async(query)=>{
    return await db.query('insert into newSale set ?', query);
}

exports.show = async(id) => {
    return await db.query('select * from newSale where id = ?', id);
}

exports.update = async(id,query)=>{
    return await db.query('update newSale set ? where id = ?', [query,id]);
}

exports.delete = async(id)=>{
    return await db.query('delete from newSale where id = ?', id);
}

// 최신순으로 정렬
exports.pageByNew = async(order, page, contents) =>{
    if(order === 'desc'){
        return await db.query(`select * from newSale order by id desc limit ? offset ?`
        ,[contents, page * contents]);
    }else if(order === 'asc'){
        return await db.query(`select * from newSale order by id asc limit ? offset ?`
        ,[contents, page * contents]);
    }
}
// 조회수순으로 정렬
exports.pageByView = async(order ,page, contents) =>{
    if(order === 'desc'){
        return await db.query(`select * from newSale order by views desc limit ? offset ?`
        ,[contents, page * contents]);
    }else if(order === 'asc'){
        return await db.query(`select * from newSale order by views asc limit ? offset ?`
        ,[contents, page * contents]);
    }
}

exports.pageForSearch = async(name1, name2, name3, page, contents) =>{
    return await db.query(`select
    *
    from newSale
    where contents_name like ? || contents_name like ? || contents_name like ?
    order by views desc limit ? offset ?`
    ,[`%${name1}%`, `%${name2}%`, `%${name3}%` ,contents, page * contents]);
}
//isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
exports.isExist = async(id)=>{
    const [result] = await db.query('select count(*) cnt from newSale where id = ?', id);
    return result.cnt;
}

exports.rowNum = async()=>{
    return await db.query('select count(*) cnt from newSale');
}

// exports.search = async(name1, name2, name3)=>{
//     return await db.query(`select * from newSale where contents_name like \'%${name1}%\' || contents_name like \'%${name2}%\' || contents_name like \'%${name3}%\'`
//     , [name1, name2, name3]);
// }

exports.search = async(name1, name2, name3)=>{

    indata1=`%${name1}%`;
    indata2=`%${name2}%`;
    indata3=`%${name3}%`;
    return await db.query(`select * from newSale where contents_name like ? || contents_name like ? || contents_name like ? order by views desc`
    , [indata1, indata2, indata3]);
}

exports.viewsUp = async(id)=>{
    return await db.query('update newSale set view = view +1 where id = ?', id);
}

exports.getImgs = async (id)=>{
    const [result] = await db.query(`select thumnail_image, vr_image, info_image from newSale where id = ?`,id);
    return result;
}

exports.getImgsFromField = async(id, field)=>{
    const [result] = await db.query(`select ${field} from newSale where id = ?`,id);
    return result;
}

exports.insertImgs = async (query, id)=>{
    await db.query(`update newSale set ? where id = ?`,[query, id]);
}