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

exports.pagination = async(orderBy, order, page, contents)=>{
    return await db.query(`select * from consult order by ${orderBy} ${order} limit ? offset ?`
    , [contents, page * contents])
}

exports.filteredPagination = async(type, manager, order, page, contents) => {
    if(type == 'noFilter'){
        if(manager == 'noFilter'){ // type 필터 X, manager 필터 X
            return await db.query(`select
            *
            from consult
            where consult_req_type = "interior" or
            consult_req_type = "franchise"
            order by id ${order} limit ? offset ?`
            ,[contents, page * contents ]);
        }else{  // type 필터 X, manager 필터 O
            return await db.query(`select
            *
            from consult
            where consult_req_type = "interior" or
            consult_req_type = "franchise" or
            consult_manager_name = ?
            order by id ${order} limit ? offset ?`
            ,[ manager, contents, page * contents ]);
        }
    }else if(type == 'interior'){
        if(manager == 'noFilter'){ // type 필터 O, manager 필터 X
            return await db.query(`select
            *
            from consult
            where consult_req_type = ?
            order by id ${order} limit ? offset ?`
            ,[ type ,contents, page * contents ]);
        }else{ // type 필터 O, manager 필터 O
            return await db.query(`select
            *
            from consult
            where consult_req_type = ? and
            consult_manager_name = ?
            order by id ${order} limit ? offset ?`
            ,[ type, manager, contents, page * contents ]);
        }
    }else if(type == 'franchise'){
        if(manager == 'noFilter'){ // type 필터 O, manager 필터 X
            return await db.query(`select
            *
            from consult
            where consult_req_type = ?
            order by id ${order} limit ? offset ?`
            ,[ type ,contents, page * contents ]);
        }else{ // type 필터 O, manager 필터 O
            return await db.query(`select
            *
            from consult
            where consult_req_type = ? and
            consult_manager_name = ?
            order by id ${order} limit ? offset ?`
            ,[ type, manager, contents, page * contents ]);
        }
    }
}

exports.filteredPaginateNewSale = async(realtyName, found, manager, order, page, contents) => {
    if(realtyName === 'noFilter'){
        if(found === 'noFilter'){
            if(manager === 'noFilter'){ // realtyName 필터 X, found 필터 X, manager 필터 X
                return await db.query(`select *
                from consult
                where consult_req_type = "newSale"
                order by id ${order} limit ? offset ?`
                ,[contents, page * contents ]);
            }else{ // realtyName 필터 X, found 필터 X, manager 필터 O
                return await db.query(`select
                *
                from consult
                where consult_manager_name = ? and
                consult_req_type = "newSale"
                order by id ${order} limit ? offset ?`
                ,[manager, contents, page * contents ]);
            }
        }else{
            if(manager === 'noFilter'){ // realtyName 필터 X, found 필터 O, manager 필터 X
                return await db.query(`select
                *
                from consult
                where consult_req_found = ? and
                consult_req_type = "newSale"
                order by id ${order} limit ? offset ?`
                ,[found, contents, page * contents ]);
            }else{ // realtyName 필터 X, found 필터 O, manager 필터 O
                return await db.query(`select
                *
                from consult
                where consult_req_found = ? and
                consult_manager_name = ? and
                consult_req_type = "newSale"
                order by id ${order} limit ? offset ?`
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
                order by id ${order} limit ? offset ?`
                ,[realtyName, contents, page * contents ]);
            }else{ // realtyName 필터 O, found 필터 X, manager 필터 O
                return await db.query(`select
                *
                from consult
                where consult_realty_name = ? and
                consult_manager_name = ? and
                consult_req_type = "newSale"
                order by id ${order} limit ? offset ?`
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
                order by id ${order} limit ? offset ?`
                ,[realtyName, found, contents, page * contents ]);
            }else{ // realtyName 필터 O, found 필터 O, manager 필터 O
                return await db.query(`select
                *
                from consult
                where consult_realty_name = ? and
                consult_req_found = ? and
                consult_manager_name = ? and
                consult_req_type = "newSale"
                order by id ${order} limit ? offset ?`
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

exports.conCnt = async(type, manager)=>{
    if(type == 'noFilter'){
        if(manager == 'noFilter'){ // type 필터 X, manager 필터 X
            return await db.query('select count(*) cnt from consult');
        }else{  // type 필터 X, manager 필터 O
            return await db.query('select count(*) cnt from consult where consult_manager_name = ?', manager);
        }
    }else if(type == 'interior'){
        if(manager == 'noFilter'){ // type 필터 O, manager 필터 X
            return await db.query('select count(*) cnt from consult where consult_req_type = ?', type);
        }else{ // type 필터 O, manager 필터 O
            return await db.query('select count(*) cnt from consult where consult_req_name = ? and consult_manager_name = ?', [manager, type]);
        }
    }else if(type == 'franchise'){
        if(manager == 'noFilter'){ // type 필터 O, manager 필터 X
            return await db.query('select count(*) cnt from consult where consult_req_type = ?', type);
        }else{ // type 필터 O, manager 필터 O
            return await db.query('select count(*) cnt from consult where consult_req_name = ? and consult_manager_name = ?', [manager, type]);
        }
    }
}

exports.conCntNewSale = async(realtyName, found, manager) => {
    if(realtyName === 'noFilter'){
        if(found === 'noFilter'){
            if(manager === 'noFilter'){ // realtyName 필터 X, found 필터 X, manager 필터 X
                return await db.query('select count(*) cnt from consult');
            }else{ // realtyName 필터 X, found 필터 X, manager 필터 O
                return await db.query('select count(*) cnt from consult where consult_manager_name = ?', manager);
            }
        }else{
            if(manager === 'noFilter'){ // realtyName 필터 X, found 필터 O, manager 필터 X
                return await db.query('select count(*) cnt from consult where consult_req_found = ?', found);
            }else{ // realtyName 필터 X, found 필터 O, manager 필터 O
                return await db.query('select count(*) cnt from consult where consult_req_found = ? and consult_manager_name = ?',[found, manager]);
            }
        }
    }else{
        if(found === 'noFilter'){
            if(manager === 'noFilter'){ // realtyName 필터 O, found 필터 X, manager 필터 X
                return await db.query('select count(*) cnt from consult where consult_realty_name = ?', realtyName);
            }else{ // realtyName 필터 O, found 필터 X, manager 필터 O
                return await db.query('select count(*) cnt from consult where consult_realty_name = ? and consult_manager_name = ?', [realtyName, manager]);
            }
        }else{
            if(manager === 'noFilter'){ // realtyName 필터 O, found 필터 O, manager 필터 X
                return await db.query('select count(*) cnt from consult where consult_realty_name = ? and consult_req_found = ?', [realtyName, found]);
            }else{ // realtyName 필터 O, found 필터 O, manager 필터 O
                return await db.query('select count(*) cnt from consult where consult_realty_name = ? and consult_req_found = ?, consult_manager_name = ?', [realtyName, found, manager]);
            }
        }
    }
}
