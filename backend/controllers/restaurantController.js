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

const restaurantMenuController = (req,res)=>{
    const id = parseInt(req.params.id) ; 
    if (!id) {
    return res.status(400).json({
        success: false,
        message: "Invalid restaurant id"
    });
    }
    const query = "select * from foods where restaurant_id = ? AND is_available = 1 " ; 
    connection.query(query,[id],(err,result)=>{
        if(err){
            return res.status(500).json({
                success : false , 
                error : err.message 
            })
        }
        
        return res.status(200).json({
            success : true ,  
            count : result.length , 
            data : result 
        }) ;
    })
}

const createRestaurant = (req,res) =>{
    const {
        name,
        description,
        address,
        city,
        state,
        pincode,
        latitude,
        longitude,
        phone,
        email,
        opening_time,
        closing_time,
        image_url
    } = req.body;

    const id = req.user.id ; 

    if (!name || !address || !city) {
        return res.status(400).json({
            success: false,
            message: "Name, address and city are required"
        });
    }

    const query = " INSERT INTO restaurants (name, description, address, city, state, pincode, latitude, longitude, phone, email, opening_time, closing_time, owner_id, image_url)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " ;

    connection.query(query,[name,
            description,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            phone,
            email,
            opening_time,
            closing_time,
            id,
            image_url] , (err,result)=>{
                if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
                }

                return res.status(201).json({
                success: true,
                message: "Restaurant created successfully",
                restaurantId: result.insertId
                });
            })

}

const deleteRestaurant = (req,res) => {
    const id = parseInt(req.params.id) ; 
    if(!id || isNaN(id)){
        return res.status(400).json({
            success : false , 
            message : "Invalid Id"
        })
    }

    const qry = "delete from restaurants where id = ? " ;
    connection.query(qry,[id],(err,result)=>{
        if(err){
            return res.status(500).json({
                success : false , 
                message : "Server Error"
            })
        }

        if(result.affectedRows === 0){
            return res.status(404).json({
                success : false , 
                message : "No such restaurant"
            })
        }

        return res.status(200).json({
            success : true , 
            message : "Restaurant Deleted Successfully "
        })
    }) 
}

module.exports = {
    restaurantListController , restaurantSpecificController , restaurantMenuController , createRestaurant , 
    deleteRestaurant 
} ; 