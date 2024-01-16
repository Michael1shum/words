const express = require('express')
const {connectDb} = require("./helpers/db");
const {port, db} = require("./configuration");
const app = express()

const startServer =  () => {
    app.listen(port, async ()=> {
        console.log(`Service auth service started on port: ${port}`)
        console.log(`DataBase ${db}`)
    })
}

app.get('/test', (req, res)=> {
    res.send("Server is working! Auth service")
})



connectDb()
    .on('error', console.log)
    .on('disconnect', connectDb)
    .once('open', startServer)