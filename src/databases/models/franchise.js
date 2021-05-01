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

exports.upViews = async(id)=>{
    return await db.query('update franchise set views = views +1 where id = ?', id);
}

// order 는 desc, asc / type 은 views, id
exports.pagination = async(order, type, tag, page, contents) =>{
  if(tag === 'noFilter'){
    return await db.query(`
    select id, franchise_name, franchise_logo, franchise_tag, registAt
    from franchise
    order by ${type} ${order} limit ? offset ?`
    ,[contents, page * contents]);
  }else{
    return await db.query(`
    select id, franchise_name, franchise_logo, franchise_tag, registAt
    from franchise
    where franchise_tag = ?
    order by ${type} ${order} limit ? offset ?`
    ,[tag, contents, page * contents]);
  }

}

// search 후 pagination
// exports.pageForSearch = async(name1, name2, name3, tag, page, contents) =>{
//   if(tag==='noFilter'){
//     return await db.query(`select case
//   	when franchise_name like ? then locate(?, franchise_name)+100
//   	when franchise_name like ? then locate(?, franchise_name)+200
//   	when franchise_name like ? then locate(?, franchise_name)+300
//       else 10000
//   	end as zorder, id, franchise_logo, franchise_name, franchise_tag
//       from franchise
//       order by
//   	    zorder
//           limit ? offset ?`
//     ,[`%${name1}%`,name1, `%${name2}%`, name2, `%${name3}%`, name3, contents, page * contents]);
//   }else{
//     return await db.query(`select case
//     when franchise_name like ? then locate(?, franchise_name)+100
//     when franchise_name like ? then locate(?, franchise_name)+200
//     when franchise_name like ? then locate(?, franchise_name)+300
//       else 10000
//     end as zorder, id, franchise_logo, franchise_name, franchise_tag
//       from franchise
//       where franchise_tag = ?
//       order by
//         zorder
//           limit ? offset ?`
//     ,[`%${name1}%`,name1, `%${name2}%`, name2, `%${name3}%`, name3, tag, contents, page * contents]);
//   }
// }

exports.pageForSearch = async(name1, name2, name3, tag, page, contents) =>{
  if(tag === 'noFilter'){
    return await db.query(`select id, franchise_logo, franchise_name, franchise_tag, registAt
      from franchise where franchise_name like ? limit ? offset ?`
      , [`%${name1}%${name2}%${name3}%` , contents, page*contents])
  }else{
    return await db.query(`select id, franchise_logo, franchise_name, franchise_tag, registAt
      from franchise where franchise_name like ? and franchise_tag = ? limit ? offset ?`
      , [`%${name1}%${name2}%${name3}%`, tag, contents, page*contents])
  }

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

exports.getImgs = async (id)=>{
    const [result] = await db.query(`select franchise_logo, brand_menu, brand_video, brand_comp_imgs from franchise where id = ?`,id);
    return result;
}

exports.getImgsFromField = async(id, field)=>{
    const [result] = await db.query(`select ${field} from franchise where id = ?`,id);
    return result;
}

exports.insertImgs = async (query, id)=>{
    await db.query(`update franchise set ? where id = ?`,[query, id]);
}

exports.getMenuData = async (id)=>{
  return await db.query(`select brand_menutext from franchise where id = ?`, id)
}

exports.contentCnt = async(tag)=>{
    if(tag === 'noFilter'){
      const [result] = await db.query(`select count(*) cnt from franchise`);
      return result.cnt;
    }else{
      const [result] = await db.query(`select count(*) cnt from franchise
      where franchise_tag = ?`, tag);
      return result.cnt;
    }
}

exports.contentCntForSearch = async (name1, name2, name3, tag) =>{
  if(tag==='noFilter'){
    const [result] = await db.query(`SELECT COUNT(*) as cnt FROM
    (SELECT * FROM franchise where franchise_name LIKE ?)c`, [`%${name1}%${name2}%${name3}%`]);
    return result.cnt;
  }else{
    const [result] = await db.query(`SELECT COUNT(*) as cnt FROM
    (SELECT * FROM franchise where franchise_name LIKE ? & franchise_tag = ?)c`, [`%${name1}%${name2}%${name3}%`, tag]);
    return result.cnt;
  }
}

// exports.contentCntForSearch = async (tag) =>{
//   if(tag==='noFilter'){
//     const [result] = await db.query(`select count(*) cnt from franchise`);
//     return result.cnt;
//   }else{
//     const [result] = await db.query(`select count(*) cnt from franchise
//     where franchise_tag = ?`, tag);
//     return result.cnt;
//   }
// }
