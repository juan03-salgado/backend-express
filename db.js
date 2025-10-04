import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "notasdb" 
});

export default db;