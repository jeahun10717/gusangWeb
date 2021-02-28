const db = require('../db');

exports.insert = async(query)=>{
    return await db.query('insert into interior set ?', query);
}


exports.show = async(id) => {
    return await db.query('select * from interior where id = ?', id);
}

exports.update = async(id,query)=>{
    return await db.query('update interior set ? where id = ?', [query,id]);
}

exports.delete = async(id)=>{
    return await db.query('delete from interior where id = ?', id);
}

// interior.get('/show') 의 함수로 쓰일 거
exports.pagination = async(order, type, localCode, conType, page, contents) =>{
    return await db.query(`select * from interior where contents_type = ? and local_address = ? order by ${type} ${order} limit ? offset ?`
    ,[conType, localCode, contents, page * contents]);
}

exports.pageForSearch = async(name1, name2, name3, conType, page, contents) =>{
    return await db.query(`select case
	when contents_name like ? then locate(?, contents_name)+100
	when contents_name like ? then locate(?, contents_name)+200
	when contents_name like ? then locate(?, contents_name)+300
    else 10000
	end as zorder, contents_name, contents_type, local_address, thumnail_image, preview_video_link, views
    from interior
    where contents_type = ?
    order by 
	    zorder
        limit ? offset ?`
    ,[`%${name1}%`,name1, `%${name2}%`, name2, `%${name3}%`, name3, conType, contents, page * contents]);
}

//isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
exports.isExist = async(id)=>{
    const [result] = await db.query('select count(*) cnt from interior where id = ?', id);
    return result.cnt;
}

exports.rowNum = async()=>{
    return await db.query('select count(*) cnt from interior');
}

exports.upViews = async(id)=>{
    await db.query(`update interior set views=views+1 where id = ?`, id)
}
