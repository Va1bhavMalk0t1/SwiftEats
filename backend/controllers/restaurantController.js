const connection = require('../config/db') ; 

const restaurantListController = (req, res) => {
  const desiredQueries = ["city", "is_open"];

  let page = parseInt(req.query.page, 10) || 1;
  if (page < 1) page = 1;

  const limit = 10;
  const offset = (page - 1) * limit;

  const fields = [];
  const values = [];

  for (let item of desiredQueries) {
    if (req.query[item] !== undefined) {
      fields.push(`${item} = ?`);
      values.push(req.query[item]);
    }
  }

  let baseQuery = "FROM restaurants WHERE 1=1";
  if (fields.length > 0) {
    baseQuery += " AND " + fields.join(" AND ");
  }

  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
  const countValues = [...values]; 

  connection.query(countQuery, countValues, (err, countResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Error counting restaurants",
      });
    }

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    const dataQuery = `SELECT * ${baseQuery} LIMIT ? OFFSET ?`;
    const dataValues = [...values, limit, offset];

    connection.query(dataQuery, dataValues, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Error fetching restaurants",
        });
      }

      return res.status(200).json({
        success: true,
        page,
        limit,
        total,
        totalPages,
        count: result.length,
        data: result,
      });
    });
  });
};

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

const updateRestaurant = (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  const allowedFields = [
    "name",
    "description",
    "address",
    "city",
    "state",
    "pincode",
    "latitude",
    "longitude",
    "phone",
    "email",
    "opening_time",
    "closing_time",
    "image_url",
    "is_open",
  ];

  let updates = [];
  let values = [];

  for (let field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(req.body[field]);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No fields to update",
    });
  }

  const setClause = updates.join(", ");
  const query = `UPDATE restaurants SET ${setClause} WHERE id = ?`;

  values.push(id);

  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
    });
  });
};

module.exports = {
    restaurantListController , restaurantSpecificController , restaurantMenuController , createRestaurant , 
    deleteRestaurant , updateRestaurant
} ; 