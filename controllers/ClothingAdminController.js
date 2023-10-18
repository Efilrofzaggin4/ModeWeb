import pool from "../config/database.js";
import fs from "fs"
import formidable from "formidable"

// 
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









// Table des vêtements (clothing_items) :

// ID (auto-incrémenté)
// Nom du vêtement
// Description du vêtement
// Prix du vêtement
// Image du vêtement
// Autres informations spécifiques aux vêtements
// Table des tailles (sizes) :

// ID (auto-incrémenté)
// Nom de la taille (par exemple, "S", "M", "L", "XL", etc.)
// Table de relation (clothing_size_relations) :

// ID (auto-incrémenté)
// ID du vêtement (clé étrangère faisant référence à la table des vêtements)
// ID de la taille (clé étrangère faisant référence à la table des tailles)
// Quantité disponible (pour chaque combinaison vêtement-taille)