const express = require('express')
const app = express()
const config = require('./src/config')
const router = require('./src/router')

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// router for users
app.use(router)

app.listen(config.app.port, (err) => {
    if (err) {
        console.error(`server error`)
    } else {
        console.log(`App is up and running for ${config.app.env} environment | PORT: ${config.app.port}`)
    }
})
