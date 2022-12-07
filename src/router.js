const router = require('express').Router()
const controller = require('./controller')

router.get('/', async (req, res, next) => {
    const result = await controller.getData()

    if (result.length > 0) {
        return res.send({usersData: result})
    }

    return res.send('Data not found')
})

router.get('/:id', async (req, res, next) => {
    const { params } = req
    const conditions = { kduser: params.id }
    const result = await controller.getData(conditions)

    if (result.length > 0) {
        return res.send({usersData: result[0]})
    }

    return res.send('Data not found')
})

router.post('/', async (req, res, next) => {
    const { body } = req
    const result = await controller.insertData(body)

    return res.send(result)
})

router.put('/:id', async (req, res, next) => {
    const { params, body } = req
    const conditions = { kduser: params.id }
    const result = await controller.updateData(body, conditions)

    return res.send(result)
})

router.delete('/:id', async (req, res, next) => {
    const { params } = req
    const conditions = { kduser: params.id }
    const result = await controller.deleteData(conditions)

    return res.send(result)
})

// for non-existing route
router.all('*', (req, res) => {
    res.send('Resource not Found')
})

module.exports = router
