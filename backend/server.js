const express = require('express') ; 
const cors = require('cors') ; 
const dotenv = require('dotenv') ; 
dotenv.config() ; 
const app = express() ;
app.use(express.json()); 
app.use(cors());  

const {restaurantRouter}  =  require('./routes/restaurantRouter') ; 

app.get('/apiV1/restaurants',restaurantRouter) ; 
app.listen(process.env.PORT , ()=>{
    console.log(`Server running on port ${process.env.PORT}`) ; 
}) ; 