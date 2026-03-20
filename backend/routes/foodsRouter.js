const express = require('express') ; 
const router = express.Router() ; 

const { getSomeFoods , getCategories , getSpecificFoods , createFood } = require('../controllers/foodController') ; 
const {authMiddleware} = require('../middleware/authMiddleware') ; 
const { isOwner } = require('../middleware/ownerMiddleware') ; 

router.get('/home',authMiddleware , getSomeFoods) ; 
router.get('/home/categories',authMiddleware,getCategories) ; 
router.get('/home/categories/:category',authMiddleware,getSpecificFoods) ;
router.post('/',authMiddleware,isOwner,createFood) ;  


module.exports = {
    router 
}