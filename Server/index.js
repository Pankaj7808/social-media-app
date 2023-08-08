import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import AuthRoute from './Routes/AuthRoute.js';
import cors from 'cors'
import bodyParser from 'body-parser';
import connectDb from './db/connectDb.js';
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'

const app = express()

const DATABASE_URL = process.env.DATABASE_URL
const port = process.env.port || 5000


// MiddleWare
app.use(bodyParser.json({limit:'30mb', extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb', extended:true}))
app.use(cors())
connectDb(DATABASE_URL)


// Routingg.....
app.use('/auth', AuthRoute)
app.use('/user',UserRoute)
app.use('/post',PostRoute)


app.listen(port, '192.168.0.105', ()=>{
    console.log(`Server Listening at port ${port}`)
})