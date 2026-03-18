const {connection} = require('../config/db') ;  
const bcrypt = require('bcrypt') ; 
const jwt = require('jsonwebtoken') ; 
const dotenv = require('dotenv') ; 
dotenv.config() ; 

const signinController = async (req,res) => {
    const {email , password} = req.body ; 
    const query = "select * from users where email = ?" ; 
    connection.query(query,[email],async (err,result)=>{
        if(err){
            return res.status(500).json({message:"Database error"}); 
        }
        if(result.length == 0){
            return res.status(404).json({
                message : "User not found" 
            })
        }
            const user = result[0] ; 
            const isMatch = await bcrypt.compare(password,user.password) ; 
            if(isMatch){
            const token = jwt.sign({
                id : user.id 
            }, process.env.JWT_SECRET , {
                expiresIn : "1h"
            }) ; 
            return res.status(200).json({
                token : token 
            })
            }else{
                return res.status(401).json({
                    message : "Invalid Password or Email" 
                })
            }
            
    })
} 

const signupController = async (req,res) => {

   const role = 'user';
   const {name , age , email , password } = req.body ; 
   const query1 = "select * from users where email = ? " ; 
          connection.query(query1,[email],async (err,result)=>{
            if(err){
            return res.status(500).json({message:"Database error"});
            }
            if(result.length > 0){
                return res.status(409).json({
                    message : "User already exists"
                })
            }else{
                const hashedPassword = await bcrypt.hash(password,10) ; 
                const query = "insert into users(name , age , password , email , role) values (?,?,?,?)" ; 
                connection.query(query,[name,age,hashedPassword,email,role],(err,result)=>{
                    if(err){
                        console.log("Cannot create user !!") ; 
                        return res.status(400).json({
                                message : "User can't be created "
                        })
                    }else{

                        return res.status(201).json({
                        message  :  "User created successfully" 
                        })
            }

   })
            }
    })
   
}

module.exports = {
    signinController , signupController
}
