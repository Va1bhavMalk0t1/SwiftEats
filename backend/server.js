const express = require('express') ; 
const cors = require('cors') ; 
const dotenv = require('dotenv') ; 
dotenv.config() ; 
const app = express() ;
app.use(express.json()); 
app.use(cors());  

const {restaurantRouter}  =  require('./routes/restaurantRouter') ; 
const  {authRouter}  = require('./routes/authRouter') ;
const  {foodsRouter}  = require('./routes/foodsRouter') ;
const {adminRouter}  = require('./routes/adminRouter') ;  
const {searchRouter} = require('./routes/searchRouter') ; 
const { cartRouter } = require('./routes/cartRoutes');
const { orderRouter } = require('./routes/orderRoutes');

// console.log(restaurantRouter) ; 
// console.log(autRouter) ; 
// console.log(foodsRouter) ; 
// console.log(adminRouter) ; 
// console.log(searchRouter) ; 

app.use('/api/v1/restaurants',restaurantRouter) ; 
app.use('/api/v1', authRouter) ; 
app.use('/api/v1/foods',foodsRouter) ; 
app.use('/api/v1/users',adminRouter) ;
app.use('/api/v1/search',searchRouter) ; 
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/orders', orderRouter);

app.listen(process.env.PORT , ()=>{
    console.log(`Server running on port ${process.env.PORT}`) ; 
}) ; 