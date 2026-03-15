const express = require('express') ; 
const router = express.Router() ; 

router.post('/signup',signupController) ;
router.post('/signin',signinController) ; 

module.exports = {
    authRouter : router 
}

