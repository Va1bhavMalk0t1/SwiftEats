const connection = require('../config/db') ; 

const adminMakerController = (req,res) =>{
    const id = parseInt(req.params.id) ; 
    if(isNaN(id)){
       return res.status(400).json({
           success : false , 
           message : "Invalid id "
       })
    }
    const qry = "update users set role = 'admin' where id = ? " ; 
    connection.query(qry,[id],(err,result)=>{
        if(err){
            return res.status(500).json({
                success : false , 
                message : "Cannot Update the role "
            })
        }

        if (result.affectedRows === 0) {
        return res.status(404).json({
        success: false,
        message: "User not found"
        });
        }

        return res.status(200).json({
            success : true , 
            message : "User is given role of admin"
        })
    })
}

const ownerMakerController = (req,res)=>{
    const id = parseInt(req.params.id) ; 
    if(isNaN(id)){
       return res.status(400).json({
        success : false , 
        message : "Invalid Id"
       })
    }
    
    const query = "update users set role = 'owner' where id = ?  " ; 

    connection.query(query,[id],(err,result)=>{
        if(err){
            return res.status(500).json({
                success : false , 
                message : "Unable to set owner"
            })
        }

        if (result.affectedRows === 0) {
        return res.status(404).json({
        success: false,
        message: "User not found"
        });
        }

        return res.status(200).json({
            success : true , 
            message : "Successfully upgraded the user to owner"
        })
    })

}

module.exports = {
    adminMakerController , ownerMakerController
}