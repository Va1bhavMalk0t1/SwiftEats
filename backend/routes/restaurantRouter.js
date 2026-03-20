const express = require('express') ;
const router = express.Router() ; 

const { authMiddleware } = require('../middleware/authMiddleware') ; 
const { restaurantListController , restaurantSpecificController , restaurantMenuController , createRestaurant } = require('../controllers/restaurantController') ; 
const {isOwner} = require('../middleware/ownerMiddleware') ; 

router.get('/', authMiddleware ,  restaurantListController) ;
router.get('/:id',authMiddleware, restaurantSpecificController) ;
router.get('/:id/menu',authMiddleware, restaurantMenuController) ;

router.put('/' , authMiddleware , isOwner , createRestaurant  ) ; 

module.exports = {
    router 
} ;

 
