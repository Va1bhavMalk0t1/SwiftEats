const {connection} = require("../config/db");

const searchController = (req, res) => {
  try {
    const search = req.query.search?.trim()?.toLowerCase();

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Invalid Search"
      });
    }

    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const searchValue = `%${search}%`;

    const restaurantQuery = `
      SELECT id, name, city
      FROM restaurants
      WHERE LOWER(name) LIKE ?
      LIMIT ? OFFSET ?
    `;

    connection.query(
      restaurantQuery,
      [searchValue, limit, offset],
      (err, restaurants) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error fetching restaurants",
            error: err.message
          });
        }

        const foodQuery = `
          SELECT 
            foods.id,
            foods.price,   
            foods.name,
            foods.restaurant_id,
            restaurants.name AS restaurant_name
          FROM foods
          JOIN restaurants 
          ON foods.restaurant_id = restaurants.id
          WHERE LOWER(foods.name) LIKE ?
          LIMIT ? OFFSET ?
        `;

        connection.query(
          foodQuery,
          [searchValue, limit, offset],
          (err, foods) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Error fetching foods",
                error: err.message
              });
            }

            const combinedResults = [
              ...restaurants.map(r => ({
                id: r.id,
                name: r.name,
                city: r.city,
                type: "restaurant"
              })),
              ...foods.map(f => ({
                id: f.id,
                name: f.name,
                price: f.price, 
                restaurant_id: f.restaurant_id,
                restaurant_name: f.restaurant_name,
                type: "food"
              }))
            ];

            return res.status(200).json({
              success: true,
              message: "Search results fetched successfully",
              total: combinedResults.length,
              page,
              limit,
              data: combinedResults
            });
          }
        );
      }
    ); 
  }catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected Error",
      error: error.message
    });
  }
} ;  

module.exports = {
    searchController
}