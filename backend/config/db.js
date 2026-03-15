const sql = require('mysql2') ; 
const connection = sql.createConnection({
    host : "localhost" , 
    user : "root" , 
    password : "Golu2005" , 
    database : "project1" 
}) ; 
connection.connect(); 
module.exports = {
    connection 
}