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


// order 는 desc, asc / type 은 views, id
exports.pagination = async(order, type, localCode, conType, page, contents) =>{
    if(localCode === 'noFilter'){
      if(conType === 'noFilter'){
        return await db.query(`select id, contents_name, contents_type, local_address, thumnail_image, thumnail_image_vr, preview_video_link, views, registAt
          from newSale
          order by ${type} ${order} limit ? offset ?`
        ,[contents, page * contents]);
      }else{
        return await db.query(`select id, contents_name, contents_type, local_address, thumnail_image, thumnail_image_vr, preview_video_link, views, registAt
          from newSale
          where contents_type = ? order by ${type} ${order} limit ? offset ?`
        ,[conType, contents, page * contents]);
      }
    }else{
      if(conType === 'noFilter'){
        return await db.query(`select id, contents_name, contents_type, local_address, thumnail_image, thumnail_image_vr, preview_video_link, views, registAt
          from newSale
          where local_address = ? order by ${type} ${order} limit ? offset ?`
        ,[localCode, contents, page * contents]);
      }else{
        return await db.query(`select id, contents_name, contents_type, local_address, thumnail_image, thumnail_image_vr, preview_video_link, views, registAt
          from newSale
          where contents_type = ? and local_address = ? order by ${type} ${order} limit ? offset ?`
        ,[conType, localCode, contents, page * contents]);
      }
    }
}

exports.pageForSearch = async(name1, name2, name3, conType, page, contents) =>{
  if(conType === 'noFilter'){
    return await db.query(`select id, contents_name, contents_type, local_address, thumnail_image, thumnail_image_vr, preview_video_link, views, registAt
      from newSale where contents_name like ? limit ? offset ?`
      , [`%${name1}%${name2}%${name3}%` , contents, page*contents])
  }else{
    return await db.query(`select id, contents_name, contents_type, local_address, thumnail_image, thumnail_image_vr, preview_video_link, views, registAt
      from newSale where contents_name like ? and contents_type = ? limit ? offset ?`
      , [`%${name1}%${name2}%${name3}%`, conType, contents, page*contents])
  }
}

// exports.pageForSearch = async(name1, name2, name3, conType, page, contents) =>{
//   if(conType === 'noFilter'){
//     return await db.query(`select case
// 	when contents_name like ? then locate(?, contents_name)+100
// 	when contents_name like ? then locate(?, contents_name)+200
// 	when contents_name like ? then locate(?, contents_name)+300
//   else 10000
// 	end as zorder, id, contents_name, contents_type, local_address, thumnail_image, preview_video_link, views
//     from newSale
//     order by
// 	    zorder
//         limit ? offset ?`
//     ,[`%${name1}%`,name1, `%${name2}%`, name2, `%${name3}%`, name3, contents, page * contents]);
//   }else{
//     return await db.query(`select case
// 	when contents_name like ? then locate(?, contents_name)+100
// 	when contents_name like ? then locate(?, contents_name)+200
// 	when contents_name like ? then locate(?, contents_name)+300
//   else 10000
// 	end as zorder, id, contents_name, contents_type, local_address, thumnail_image, preview_video_link, views
//     from newSale
//     where contents_type = ?
//     order by
// 	    zorder
//         limit ? offset ?`
//     ,[`%${name1}%`,name1, `%${name2}%`, name2, `%${name3}%`, name3, conType, contents, page * contents]);
//   }
// }

//isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
exports.isExist = async(id)=>{
    const [result] = await db.query('select count(*) cnt from newSale where id = ?', id);
    return result.cnt;
}

exports.rowNum = async()=>{
    return await db.query('select count(*) cnt from newSale');
}

exports.viewsUp = async(id)=>{
    return await db.query('update newSale set view = view +1 where id = ?', id);
}

exports.getImgs = async (id)=>{
    const [result] = await db.query(`select thumnail_image, thumnail_image_vr, preview_video_link, vr_image, info_image from newSale where id = ?`,id);
    return result;
}

exports.getImgsFromField = async(id, field)=>{
    const [result] = await db.query(`select ${field} from newSale where id = ?`,id);
    return result;
}

exports.insertImgs = async (query, id)=>{
    await db.query(`update newSale set ? where id = ?`,[query, id]);
}

exports.upViews = async(id)=>{
    await db.query(`update newSale set views=views+1 where id = ?`, id)
}

exports.conNum = async() => {
  return await db.query(`select count(*) cnt from newSale`)
}

exports.contentCnt = async(conType, localCode)=>{
  if(conType === 'noFilter'){
    if(localCode === 'noFilter'){
      const [result] = await db.query(`select count(*) cnt from newSale`);
      return result.cnt;
    }else{
      const [result] = await db.query(`select count(*) cnt from newSale
      where local_address = ?`, localCode);
      return result.cnt;
    }
  }else{
    if(localCode === 'noFilter'){
      const [result] = await db.query(`select count(*) cnt from newSale
      where contents_type = ?`, conType);
      return result.cnt;
    }else{
      const [result] = await db.query(`select count(*) cnt from newSale
      where contents_type = ? and local_address = ?`, [conType, localCode]);
      return result.cnt;
    }
  }
}

exports.contentCntForSearch = async (name1, name2, name3, conType) =>{
  if(conType==='noFilter'){
    const [result] = await db.query(`SELECT COUNT(*) as cnt FROM
    (SELECT * FROM newSale where contents_name LIKE ?)c`, [`%${name1}%${name2}%${name3}%`]);
    return result.cnt;
  }else{
    const [result] = await db.query(`SELECT COUNT(*) as cnt FROM
    (SELECT * FROM newSale where contents_name LIKE ? and contents_type = ?)c`, [`%${name1}%${name2}%${name3}%`, conType]);
    return result.cnt;
  }
}
