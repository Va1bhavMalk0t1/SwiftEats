const express = require('express') ;
const router = express.Router() ; 

router.get('/restaurants', restaurantListController) ;
router.get('/restaurants/:id', restaurantSpecificController) ;

module.exports = {
    restaurantRouter : router 
} ;

 
