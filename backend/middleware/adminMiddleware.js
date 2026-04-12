const {connection} = require('../config/db') ; 

const adminMiddleware = (req,res,next) =>{
    
    if (!req.user || !req.user.id) {
    return res.status(401).json({
        success: false,
        message: "Unauthorized"
    });
    }
    const id = req.user.id ; 
    const qry = "select id , role from users where id = ?" ; 
    connection.query(qry,[id],(err,result)=>{
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Server error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if(result[0].role !== 'admin'){
            return res.status(403).json({
                success : false , 
                message : "Access Denied. Admin Only"
            })
        }

        req.user = result[0] ; 
        next() ; 
    })
}

module.exports = {
    adminMiddleware
}