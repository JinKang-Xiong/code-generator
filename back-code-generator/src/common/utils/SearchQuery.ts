import { isEmpty } from "lodash"

//搜索根据参数的值生成查询条件
export function CreateQuery(obj) {
    let query = { isDelete: 0 }

    for (let key in obj) {
        if (key === 'userId') {
            query[key] = obj[key]
        }
        if (!isEmpty(obj[key])) {
            query[key] = { '$regex': new RegExp(obj[key]) }
        }
    }
    return query
}


export function CreateOrQuery(obj) {
    let query = []

    for (let key in obj) {
        query.push({ [key]: { '$regex': new RegExp(obj[key]) } })
    }

    return query
}