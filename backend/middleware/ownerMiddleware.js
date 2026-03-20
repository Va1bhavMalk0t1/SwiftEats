const { connection } = require("../config/db");

const isOwner = (req,res,next) => {
    const id = parseInt(req.user.id) ; 
    if(isNaN(id)){
        return res.status(400).json({
            success : false , 
            message : "Invalid id"
        })
    }

    const qry = "select * from users where id = ?" ; 
    connection.query(qry,[id],(err,result)=>{

        if(err){
            return res.status(500).json({
                success : false , 
                message : "Server Error" 
            })
        }

        if(result.length === 0){
            return res.status(404).json({
                success : false , 
                message : "User not found"
            })
        }

        if (result[0].role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Not an owner"
            });
        }
        
        next() ; 

    }) ;
} ; 

module.exports = {
    isOwner
}