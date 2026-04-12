const express = require('express') ; 
const router = express.Router() ; 
const {authMiddleware} = require('../middleware/authMiddleware') ; 
const { signupController , signinController , userController } = require('../controllers/authController') ;
router.post('/signup',signupController) ;
router.post('/signin',signinController) ; 
router.get('/user', authMiddleware , userController) ; 

module.exports = {
    authRouter : router 
}

