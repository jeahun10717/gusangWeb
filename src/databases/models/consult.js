const db = require('../db');
exports.insert = async(query)=>{
    return await db.query('insert into consult set ?', query);
}

exports.show = async(id) => {
    return await db.query('select * from consult where id = ?', id);
}

exports.update = async(id,query)=>{
    return await db.query('update consult set ? where id = ?', [query,id]);
}

exports.delete = async(id)=>{
    return await db.query('delete from consult where id = ?', id);
}

// 최신순으로 정렬
exports.pageByNew = async(order, page, contents) =>{
    if(order === 'desc'){
        return await db.query(`select * from consult order by consult_name desc limit ? offset ?`
        ,[contents, page * contents]);
    }else if(order === 'asc'){
        return await db.query(`select * from consult order by consult_name asc limit ? offset ?`
        ,[contents, page * contents]);
    }
}
// 조회수순으로 정렬
exports.pageByView = async(order ,page, contents) =>{
    if(order === 'desc'){
        return await db.query(`select * from consult order by views desc limit ? offset ?`
        ,[contents, page * contents]);
    }else if(order === 'asc'){
        return await db.query(`select * from consult order by views asc limit ? offset ?`
        ,[contents, page * contents]);
    }
}
/*
 TODO: 지금 현재 type, manager 필터링은 구현 했는데 order 도 구현해야 함
 order 는 현재 기본값이 asc 이다. 기본적으로 먼저 들어온 상담을 먼저 처리해야 하기 때문
 굳이 desc 와 asc 를 나눌 필요가 없다면 필터링은 안하고 싶음
*/
exports.filteredPagination = async(type, manager, order, page, contents) => {
    if(type == 'noFilter'){
        if(manager == 'noFilter'){ // type 필터 X, manager 필터 X
            return await db.query(`select
            *
            from consult
            where consult_req_type = "interior" or
            consult_req_type = "franchise"
            order by id asc limit ? offset ?`
            ,[contents, page * contents ]);
        }else{  // type 필터 X, manager 필터 O
            return await db.query(`select
            *
            from consult
            where consult_req_type = "interior" or
            consult_req_type = "franchise" or
            consult_manager_name = ?
            order by id asc limit ? offset ?`
            ,[ manager, contents, page * contents ]);
        }
    }else if(type == 'interior'){
        if(manager == 'noFilter'){ // type 필터 O, manager 필터 X
            return await db.query(`select
            *
            from consult
            where consult_req_type = ?
            order by id asc limit ? offset ?`
            ,[ type ,contents, page * contents ]);
        }else{ // type 필터 O, manager 필터 O
            return await db.query(`select
            *
            from consult
            where consult_req_type = ? and
            consult_manager_name = ?
            order by id asc limit ? offset ?`
            ,[ type, manager, contents, page * contents ]);
        }
    }else if(type == 'franchise'){
        if(manager == 'noFilter'){ // type 필터 O, manager 필터 X
            return await db.query(`select
            *
            from consult
            where consult_req_type = ?
            order by id asc limit ? offset ?`
            ,[ type ,contents, page * contents ]);
        }else{ // type 필터 O, manager 필터 O
            return await db.query(`select
            *
            from consult
            where consult_req_type = ? and
            consult_manager_name = ?
            order by id asc limit ? offset ?`
            ,[ type, manager, contents, page * contents ]);
        }
    }
}

exports.filteredPaginateNewSale = async(realtyName, found, manager, order, page, contents) => {
    if(realtyName === 'noFilter'){
      // let str = 'select * from consult where consult_req_type = ? '
      // let i = 1
      // let arr = [tmp]
      // str += found === 'noFilter' ? "and " : "";
      //
      // str += ? "orcder by "
      // const TABLENAME = "newSale"
      // `select * from ${TABLENAME}`

      await db.query(str, arr)
        if(found === 'noFilter'){
            if(manager === 'noFilter'){ // realtyName 필터 X, found 필터 X, manager 필터 X
                return await db.query(`select *
                from consult
                where consult_req_type = "newSale"
                order by id asc limit ? offset ?`
                ,[contents, page * contents ]);
            }else{ // realtyName 필터 X, found 필터 X, manager 필터 O
                return await db.query(`select
                *
                from consult
                where consult_manager_name = ? and
                consult_req_type = "newSale"
                order by id asc limit ? offset ?`
                ,[manager, contents, page * contents ]);
            }
        }else{
            if(manager === 'noFilter'){ // realtyName 필터 X, found 필터 O, manager 필터 X
                return await db.query(`select
                *
                from consult
                where consult_req_found = ? and
                consult_req_type = "newSale"
                order by id asc limit ? offset ?`
                ,[found, contents, page * contents ]);
            }else{ // realtyName 필터 X, found 필터 O, manager 필터 O
                return await db.query(`select
                *
                from consult
                where consult_req_found = ? and
                consult_manager_name = ? and
                consult_req_type = "newSale"
                order by id asc limit ? offset ?`
                ,[found, manager, contents, page * contents ]);
            }
        }
    }else{
        if(found === 'noFilter'){
            if(manager === 'noFilter'){ // realtyName 필터 O, found 필터 X, manager 필터 X
                return await db.query(`select
                *
                from consult
                where consult_realty_name = ? and
                consult_req_type = "newSale"
                order by id asc limit ? offset ?`
                ,[realtyName, contents, page * contents ]);
            }else{ // realtyName 필터 O, found 필터 X, manager 필터 O
                return await db.query(`select
                *
                from consult
                where consult_realty_name = ? and
                consult_manager_name = ? and
                consult_req_type = "newSale"
                order by id asc limit ? offset ?`
                ,[realtyName, manager, contents, page * contents ]);
            }
        }else{
            if(manager === 'noFilter'){ // realtyName 필터 O, found 필터 O, manager 필터 X
                return await db.query(`select
                *
                from consult
                where consult_realty_name = ? and
                consult_req_found = ? and
                consult_req_type = "newSale"
                order by id asc limit ? offset ?`
                ,[realtyName, found, contents, page * contents ]);
            }else{ // realtyName 필터 O, found 필터 O, manager 필터 O
                return await db.query(`select
                *
                from consult
                where consult_realty_name = ? and
                consult_req_found = ? and
                consult_manager_name = ? and
                consult_req_type = "newSale"
                order by id asc limit ? offset ?`
                ,[realtyName, found, manager, contents, page * contents ]);
            }
        }
    }
}

// isExist 는 값이 DB 에 있으면 1, 없으면 0 출력
exports.isExist = async(id)=>{
    const [result] = await db.query('select count(*) cnt from consult where id = ?', id);
    return result.cnt;
}

exports.rowNum = async()=>{
    return await db.query('select count(*) cnt from consult');
}
