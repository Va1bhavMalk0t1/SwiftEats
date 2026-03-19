const express = require('express') ; 
const router = express.Router() ; 
const { adminMakerController , ownerMakerController } = require('../controllers/adminController') ; 
const { adminMiddleware} = require('../middleware/adminMiddleware'); 
const { authMiddleware} = require('../middleware/authMiddleware'); 

router('/make-admin/:id',authMiddleware,adminMiddleware,adminMakerController) ; 
router('/make-owner/:id',authMiddleware,adminMiddleware,ownerMakerController) ; 

module.exports = {
    router 
}