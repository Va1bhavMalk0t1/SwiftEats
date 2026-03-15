const jwt = require("jsonwebtoken") ; 
const dotenv = require("dotenv") ; 
dotenv.config() ; 

const middleWare = (req,res,next)=>{

    const authHeader = req.headers.authorization ; 
    if(!authHeader){
    return res.status(401).json({
        message: "Access denied"
    });
    }
    const token = authHeader.split(" ")[1] ; 

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET) ; 
        req.user = decoded ; 
        next() ;
    }catch(e){
        return res.status(401).json({
            message : "Invalid or expired token" 
        })
    }
}

module.exports = {
    authMiddleware : middleWare 
}
