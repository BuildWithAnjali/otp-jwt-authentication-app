const express = require("express")
const mongoose = require ('mongoose')
const cors = require ('cors')
require('dotenv').config();
const userRouter= require ( './routes/userRoutes.js')
const cookieParser =require('cookie-parser');




const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:5173', // frontend domain
    credentials: true,
   
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.use(cors({credentials : true}));
app.use(express.json());
app.use(cookieParser());



mongoose.connect('mongodb+srv://anjalivaishnav2000:ujnbap0O8JGi6SmO@cluster0.wxzwap5.mongodb.net/').then(()=>console.log('mongoDB connected')).catch((error)=>console.log(error));


//API ENDPOINT
app.get("/" , (req,res)=> res.send("API working "))

app.use('/api/auth' , userRouter);



app.use(express.urlencoded({ extended: true })); 





app.listen(PORT , ()=> console.log(`server is running at port : ${PORT}`)
);
