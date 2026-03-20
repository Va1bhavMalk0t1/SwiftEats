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
const { adminRouter } = require('./routes/adminRouter') ;  

app.use('/apiV1/restaurants',restaurantRouter) ; 
app.use('/apiV1',authRouter) ; 
app.use('/apiV1/foods',foodsRouter) ; 
app.use('/apiV1/users',adminRouter) ;

app.listen(process.env.PORT , ()=>{
    console.log(`Server running on port ${process.env.PORT}`) ; 
}) ; 