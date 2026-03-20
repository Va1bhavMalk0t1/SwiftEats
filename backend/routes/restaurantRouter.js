const express = require('express') ;
const router = express.Router() ; 

const { authMiddleware } = require('../middleware/authMiddleware') ; 
const { restaurantListController , restaurantSpecificController , restaurantMenuController , createRestaurant , deleteRestaurant
    , updateRestaurant  } = require('../controllers/restaurantController') ; 
const {isOwner} = require('../middleware/ownerMiddleware') ; 

router.get('/', authMiddleware ,  restaurantListController) ;
router.get('/:id',authMiddleware, restaurantSpecificController) ;
router.get('/:id/menu',authMiddleware, restaurantMenuController) ;

router.put('/' , authMiddleware , isOwner , createRestaurant ) ; 
router.delete('/:id' , authMiddleware , isOwner , deleteRestaurant) ; 
router.update('/:id',authMiddleware,isOwner,updateRestaurant); 

module.exports = {
    router 
} ;

 
