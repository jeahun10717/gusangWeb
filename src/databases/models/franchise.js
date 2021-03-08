const db = require('../db');

exports.insert = async(query)=>{
    return await db.query('insert into franchise set ?', query);
}


exports.show = async(id) => {
    return await db.query('select * from franchise where id = ?', id);
}

exports.update = async(id,query)=>{
    return await db.query('update franchise set ? where id = ?', [query,id]);
}

exports.delete = async(id)=>{
    return await db.query('delete from franchise where id = ?', id);
}

// order 는 desc, asc / type 은 views, id
exports.pagination = async(order, type, tag, page, contents) =>{
    return await db.query(`
    select id, franchise_name, franchise_logo, franchise_tag
    from franchise 
    where franchise_tag = ? 
    order by ${type} ${order} limit ? offset ?`
    ,[tag, contents, page * contents]);
}

// search 후 pagination
exports.pageForSearch = async(name1, name2, name3, page, contents) =>{
    return await db.query(`select case
	when franchise_name like ? then locate(?, franchise_name)+100
	when franchise_name like ? then locate(?, franchise_name)+200
	when franchise_name like ? then locate(?, franchise_name)+300
    else 10000
	end as zorder, id, franchise_logo, franchise_name, franchise_tag
    from franchise
    order by 
	    zorder
        limit ? offset ?`
    ,[`%${name1}%`,name1, `%${name2}%`, name2, `%${name3}%`, name3, contents, page * contents]);
}
//isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
exports.isExist = async(id)=>{
    const [result] = await db.query('select count(*) cnt from franchise where id = ?', id);
    return result.cnt;
}

exports.rowNum = async()=>{
    return await db.query('select count(*) cnt from franchise');
}

// exports.search = async(name1, name2, name3)=>{
//     return await db.query(`select * from franchise where contents_name like \'%${name1}%\' || contents_name like \'%${name2}%\' || contents_name like \'%${name3}%\'`
//     , [name1, name2, name3]);
// }
