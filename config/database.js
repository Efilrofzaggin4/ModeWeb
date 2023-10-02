import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();



let pool  = mysql.createPool({
  connectionLimit : 10000,
    host: process.env.DB_HOST,// on rentre l'hôte l'adresse url où se trouve la bdd
    user: process.env.DB_USER, // identifiant BDD
    password: process.env.DB_PASSWORD, // le password
    database: process.env.DB_DATABASE, // nom de la base de donnée
});

export default pool;
