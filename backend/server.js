const express = require('express') ; 
const cors = require('cors') ; 
const dotenv = require('dotenv') ; 
dotenv.config() ; 
const app = express() ;
app.use(express.json()); 
app.use(cors());  

const {restaurantRouter}  =  require('./routes/restaurantRouter') ; 
const { authRouter } = require('./routes/authRouter') ;
const { foodsRouter } = require('./routes/foodsRouter') ; 

app.get('/apiV1/restaurants',restaurantRouter) ; 
app.get('/apiV1',authRouter) ; 
app.get('/apiV1/foods',foodsRouter) ; 

app.listen(process.env.PORT , ()=>{
    console.log(`Server running on port ${process.env.PORT}`) ; 
}) ; 