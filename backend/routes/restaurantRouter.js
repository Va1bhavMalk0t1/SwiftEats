const express = require('express') ;
const router = express.Router() ; 
const middleware = require('../middleware/authMiddleware') ; 
const { restaurantListController , restaurantSpecificController } = require('../controllers/restaurantController') ; 

router.get('/', middleware ,  restaurantListController) ;
router.get('/:id',middleware , restaurantSpecificController) ;

module.exports = {
    restaurantRouter : router 
} ;

 
