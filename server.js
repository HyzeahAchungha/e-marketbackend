const express = require('express')
const PORT=  4000;
const app = express('');
const cors = require('cors')
const mongoose = require('mongoose')
const MONGO_URI = 'mongodb://localhost:27017/DG';
require('dotenv').config()
 const fileUpload=require('express-fileupload')
const cookiespaser=require('cookie-parser')

app.use(express.json())
app.use(cookiespaser)
app.use(cors)
app.use(fileUpload ({
    useTempFile:true
}))
//Routes
app.use('/user',require('./Routes/userRoutes'))
app.use('/user',require('./Routes/categoriesRouter'))
app.use('/user',require('./Routes/upload'))
app.use('/user',require('./Routes/productRouter'))



const start = () => {
	mongoose.connect(MONGO_URI, (errr) => {
		if (errr) {
			return console.log('Failed to connect to mongoDB');
		}
		console.log('Connected to DB');
	});
 app.listen(PORT,()=>console.log(`server is runing on ${PORT}`))
}
 start()