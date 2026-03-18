const connection = require('../config/db') ; 

const restaurantListController = (req,res) =>{
    const query = "SELECT * FROM restaurants ORDER BY rating DESC " ; 
    connection.query(query,(err,result)=>{

        if(err){
            return res.status(500).json({
                success : false , 
                error : err.message , 
                message: "Error fetching restaurants"
            })
        }else{
            if (result.length === 0) {
                return res.status(404).json({
                success: false,
                message: "No restaurants found"
                });
            }
            return res.status(200).json({
                success: true,
                count: result.length,
                data: result
            }) ; 
        }
    })
} ; 

const restaurantSpecificController = (req,res) => {
       const id = parseInt(req.params.id) ; 
       const query = "Select * from restaurants where id = ? " ; 
       connection.query(query,[id],(err,result)=>{
        if(err){
            return res.status(500).json({
                success: false,
                message : "Error in fetching the restaurant" ,
                error: err.message
            })
        }
        if(result.length === 0){
            return res.status(404).json({
                success : false , 
                message: "Restaurant not found"
            })
        }
        return res.status(200).json({
            success : true , 
            data : result[0] 
        })
       })
}

module.exports = {
    restaurantListController , restaurantSpecificController
} ; 