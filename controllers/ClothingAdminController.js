import pool from "../config/database.js";
import fs from "fs"
import formidable from "formidable"


export const DisplayClothing =  (req, res) => {
    let sql = 'SELECT * FROM clothing ORDER BY name'

    pool.query(sql, function(error, clothing){
        if(error){
            console.log(error);
            res.status(500).send('Database error !');
        } else {
            res.render('layout', {template : 'clothingListAdmin', clothing : clothing })
        }
    });
};

export const DeleteClothing = (req, res) => {

}








