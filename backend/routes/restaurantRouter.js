const express = require('express') ;
const router = express.Router() ; 
const middleware = require('../middleware/authMiddleware') ; 
const { restaurantListController , restaurantSpecificController , restaurantMenuController } = require('../controllers/restaurantController') ; 

router.get('/', middleware ,  restaurantListController) ;
router.get('/:id', middleware , restaurantSpecificController) ;
router.get('/:id/menu', middleware , restaurantMenuController) ; 

module.exports = {
    router 
} ;

 
