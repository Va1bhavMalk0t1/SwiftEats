const express = require('express') ; 
const router = express.Router() ; 
const { getSomeFoods , getCategories , getSpecificFoods } = require('../controllers/foodController') ; 

router.get('/home',getSomeFoods) ; 
router.get('/home/categories',getCategories) ; 
router.get('/home/categories/:category',getSpecificFoods) ; 

module.exports = {
    router 
}