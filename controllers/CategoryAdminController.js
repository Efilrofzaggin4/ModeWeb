import pool from "../config/database.js";
import fs from "fs"
// import formidable from "formidable"

// 
export const DisplayCategory =  (req, res) => {
    let sql = 'SELECT * FROM category ORDER BY name'

    pool.query(sql, function(error, category){
        if(error){
            console.log(error);
            res.status(500).send('Database error !');
        } else {
            res.render('layout', {template : 'category_admin', category : category})
        }
    });
};


export const DeleteCategory = (req, res) => {
    let id = req.params.id;

    // Récupérez d'abord le chemin de l'image associée à la catégorie que vous supprimez
    pool.query('SELECT image FROM category WHERE id = ?', [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send({
                error: 'Error when fetching category image path'
            });
        }

        if (result.length === 0) {
            return res.status(404).send({
                error: 'Category not found'
            });
        }

        const imagePath = "../ModeWeb/public/"+result[0].image;
        console.log(imagePath)
        // Maintenant, supprimez le fichier image du système de fichiers
        fs.unlink(imagePath, (unlinkError) => {
            if (unlinkError) {
                console.error(unlinkError);
                return res.status(500).send({
                    error: 'Error when deleting category image'
                });
            }

            // Après avoir supprimé le fichier image, supprimez la catégorie de la base de données
            pool.query('DELETE FROM category WHERE id = ?', [id], (deleteError) => {
                if (deleteError) {
                    console.log(deleteError);
                    return res.status(500).send({
                        error: 'Error when deleting category'
                    });
                }

                res.status(204).send();
            });
        });
    });
};
