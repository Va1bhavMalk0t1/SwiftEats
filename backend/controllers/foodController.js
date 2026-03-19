const connection = require('../config/db') ; 

const getSomeFoods = (req,res)=>{
    const query = "select * from foods where is_available = 1" ;
    connection.query(query,(err,result)=>{
        if(err){
            return res.status(500).json({
                success : false , 
                message : err.message 
            })
        }

        const groupedFoods = {} ;
        result.forEach((item)=>{
            const category = item.category || "Others"
            if(!groupedFoods[category]){
                groupedFoods[category] = [] ; 
            }
            groupedFoods[category].push(item) ; 
        })

        const formattedData = Object.keys(groupedFoods).map((category) => {
            return {
                category: category,
                foods: groupedFoods[category].slice(0,5)
            };
        });

        return res.status(200).json({
            success : true , 
            data : formattedData , 
            message : "Foods fetched Successfully "
        })
    })
}; 

const getCategories = (req,res)=>{
    const query = "select distinct category from foods where is_available = 1 AND category IS NOT NULL " ; 
    connection.query(query,(err,result)=>{
        if(err){
         return res.status(500).json({
            success : false , 
            message : "Unable to fetch categories"
         })
        }

        const categoriesArr = [] ; 
        result.forEach((item)=>{
           if (item.category) {
            categoriesArr.push(item.category);
            }
        })
        categoriesArr.sort();

        return res.status(200).json({
            success : true , 
            count :  categoriesArr.length , 
            data : categoriesArr , 
            message: "Categories fetched successfully"
       })
    })
};

const getSpecificFoods = (req,res)=>{
    const category = req.params.category ; 
    if (!category) {
    return res.status(400).json({
        success: false,
        message: "Category is required"
    });
    }
    const query = "select * from foods where lower(category) = lower(?) and is_available = 1" ; 
    connection.query(query,[category],(err,result)=>{
        if(err){
            return res.status(500).json({
                success : false , 
                message : "Unable to fetch the foods"
            })
        }
        return res.status(200).json({
            success : true , 
            count : result.length , 
            data : result
        })
    })
};

module.exports = {
    getSomeFoods , getCategories , getSpecificFoods
}