const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const bcrypt= require('bcryptjs');
var jwt = require('jsonwebtoken');
const multer = require('multer')
//connect db
require('./db/mongoose');

app.use(express.json())

app.use(userRouter);
app.use(taskRouter);
/////////////////


app.listen(port,()=>{console.log('Server is running')})