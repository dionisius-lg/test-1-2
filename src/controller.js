const _ = require('lodash')
const config = require('./config')
const dbConn = require('./config/database')
const bcrypt = require('bcrypt')
const table = 'users'

const checkColumn = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${config.db.name}' AND TABLE_NAME = '${table}'`
        
        dbConn.query(query, (err, results, fields) => {
            if (err) {
                // throw err
                console.error(err)
                return
            }

            const columns = results.map(function (c) {
                return c.COLUMN_NAME
            })

            resolve(columns)
        })
    })
}

const checkMax = (column) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT MAX(${column}) as max FROM ${table}`

        dbConn.query(query, (err, results, fields) => {
            if (err) {
                // throw err
                console.error(err)
                resolve(err)
            }

            resolve(results[0].max)
        })
    })
}

exports.getData = (conditions) => {
    return new Promise(async (resolve, reject) => {
        let query = `SELECT * FROM ${table}`

        if (!_.isEmpty(conditions) && _.isPlainObject(conditions)) {
            let clause = []

            for (let key in conditions) {
                let val = _.trim(conditions[key])

                if (!_.isEmpty(val)) {
                    clause.push(`${key} = ${dbConn.escape(val)}`)
                }
            }

            let condition = _.join(clause, ' AND ')
            query += ` WHERE ${condition}`
        }

        dbConn.query(query, (err, results, fields) => {
            if (err) {
                return resolve(err)
            }

            return resolve(results)
        })
    })
}

exports.insertData = async (data) => {
    return new Promise(async (resolve, reject) => {
        let res = {
            status: 'Error'
        }

        if (_.isEmpty(data) || !_.isPlainObject(data)) {
            return resolve({...res, message: 'Invalid body'})
        }

        let columns = await checkColumn()

        Object.keys(data).forEach(function(key) {
            if(columns.indexOf(key) == -1 || 'kduser' === key) {
                delete data[key]
            }
        })

        if (_.isEmpty(data)) {
            return resolve({...res, message: 'Invalid body'})
        }

        if (typeof data.password !== 'undefined') {
            data.password = bcrypt.hashSync(data.password, 10)
        } else {
            data.password = bcrypt.hashSync('password', 10)
        }

        let maxKd = await checkMax('kduser')
        data.kduser = 1

        if (!_.isNull(maxKd)) {
            data.kduser = parseInt(maxKd) + 1
        }

        let keys   = Object.keys(data)
        let column = _.join(keys, ', ')
        let query  = `INSERT INTO ${table} (${column}) VALUES ?`
        let values = []

        let tempVal = Object.keys(data).map(key => {
            let val = data[key]

            if (typeof val !== undefined) {
                val = _.trim(val)
            } else {
                val = null
            }

            return val
        })

        values.push(tempVal)

        dbConn.query(query, [values], (err, results, fields) => {
            if (err) {
                // throw err
                console.error(err)
                return resolve({...res, message: 'Failed to insert data'})
            }

            res = {
                status: 'Success',
                message: 'Data inserted successfully'
            }

            return resolve(res)
        })
    })
}


exports.updateData = async (data, conditions) => {
    return new Promise(async (resolve, reject) => {
        let res = {
            status: 'Error'
        }

        if (_.isEmpty(data) || !_.isPlainObject(data)) {
            return resolve({...res, message: 'Invalid body'})
        }

        if (_.isEmpty(conditions) || !_.isPlainObject(conditions)) {
            return resolve({...res, message: 'Invalid param'})
        }

        let columns = await checkColumn()

        Object.keys(data).forEach(function(key) {
            if(columns.indexOf(key) == -1 || 'kduser' === key) {
                delete data[key]
            }
        })

        if (_.isEmpty(data)) {
            return resolve({...res, message: 'Invalid body'})
        }

        if (typeof data.password !== 'undefined') {
            data.password = bcrypt.hashSync(data.password, 10)
        }

        let checkUser = await this.getData(conditions)

        if (_.isEmpty(checkUser)) {
            return resolve({...res, message: 'Data not found'})
        }

        let query  = `UPDATE ${table}`
        let queryData = []
        let queryCondition = []

        Object.keys(data).forEach((key) => {
            let val = _.trim(data[key])

            if (!_.isEmpty(val)) {
                queryData.push(`${key} = ${dbConn.escape(_.trim(val))}`)
            }
        })

        Object.keys(conditions).forEach((key) => {
            let val = _.trim(conditions[key])

            if (!_.isEmpty(val)) {
                queryCondition.push(`${key} = ${dbConn.escape(_.trim(val))}`)
            }
        })

        if (_.isEmpty(queryData) || _.isEmpty(queryCondition)) {
            return resolve({...res, message: 'Invalid body or param'})
        }

        queryData = _.join(queryData, ', ')
        queryCondition = _.join(queryCondition, ' AND ')
        
        query += ` SET ${queryData} WHERE ${queryCondition}`

        dbConn.query(query, (err, results, fields) => {
            if (err) {
                // throw err
                console.error(err)
                return resolve({...res, message: 'Failed to update data'})
            }

            res = {
                status: 'Success',
                message: 'Data updated successfully'
            }

            return resolve(res)
        })
    })
}

exports.deleteData = async (conditions) => {
    return new Promise(async (resolve, reject) => {
        let res = {
            status: 'Error'
        }

        if (_.isEmpty(conditions) || !_.isPlainObject(conditions)) {
            return resolve({...res, message: 'Invalid param'})
        }

        let checkUser = await this.getData(conditions)

        if (_.isEmpty(checkUser)) {
            return resolve({...res, message: 'Data not found'})
        }

        let query  = `DELETE FROM ${table}`
        let queryCondition = []

        Object.keys(conditions).forEach((key) => {
            let val = _.trim(conditions[key])

            if (!_.isEmpty(val)) {
                queryCondition.push(`${key} = ${dbConn.escape(_.trim(val))}`)
            }
        })

        if (_.isEmpty(queryCondition)) {
            return resolve({...res, message: 'Invalid param'})
        }

        queryCondition = _.join(queryCondition, ' AND ')
        
        query += ` WHERE ${queryCondition}`

        dbConn.query(query, (err, results, fields) => {
            if (err) {
                // throw err
                console.error(err)
                return resolve({...res, message: 'Failed to delete data'})
            }

            res = {
                status: 'Success',
                message: 'Data deleted successfully'
            }

            return resolve(res)
        })
    })
}
