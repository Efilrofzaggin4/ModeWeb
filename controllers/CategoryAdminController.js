import pool from "../config/database.js";
import fs from "fs"
import formidable from "formidable"

// 
export const DisplayCategory =  (req, res) => {
    let sql = 'SELECT * FROM category ORDER BY category_name'

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
    let category_id = req.params.category_id;

    
    pool.query('SELECT category_image FROM category WHERE category_id = ?', [category_id], (error, result) => {
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

        const imagePath = "../ModeWeb/public/"+result[0].category_image;
        console.log(imagePath)
        
        fs.unlink(imagePath, (unlinkError) => {
            if (unlinkError) {
                console.error(unlinkError);
                return res.status(500).send({
                    error: 'Error when deleting category image'
                });
            }

            
            pool.query('DELETE FROM category WHERE category_id = ?', [category_id], (deleteError) => {
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

export const EditCategory = (req, res) => {
    
	let id = req.params.category_id;

	let sql = 'SELECT * FROM category WHERE category_id = ?';

	pool.query(sql, [id], function (error, rows, fields) {
		const category = rows;

	        res.render('layout', {template :'editCategory',  category: rows[0] });
	 });
}



export const EditCategorySubmit = (req, res) => {
    const SIZE_MAX = 5 * 1024 * 1024
    const authorizedExtention = ["image/jpeg", "image/png", "image/jpg"]
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        const editCat = {
            category_name: fields.category_name,
            category_content: fields.category_content
        }
        const regexName = /^[a-zA-Z0-9\sÀ-ÿ.,!?()'-]*$/;
        const regexContent = /^[a-zA-Z0-9\sÀ-ÿ\n\r.,!?()'-]*$/;

        if (!regexName.test(editCat.category_name)) {
            // Sécurité sur le champ "name"
            return res.status(400).send("Nom invalide");
        }
        if (!regexContent.test(editCat.category_content)) {
            // Sécurité sur le champ "content"
            return res.status(400).send("Contenu invalide");
        }

        if (err) {
            console.error(err);
            return res.status(500).send('Erreur lors du téléchargement de l\'image');
        }

        if (files.category_image.size > SIZE_MAX) {
            return res.status(500).send("L'image est trop lourde");
        }


        const imagePath = files.category_image.filepath;
        const imageExtension = files.category_image.originalFilename.split(".").pop();
        const newImagePath = "public/images/category/" + files.category_image.newFilename + "." + imageExtension;

        if (!authorizedExtention.includes(files.category_image.mimetype)) {
            return res.status(500).send("Extension incorrecte pour l'image de la catégorie");
        }

        const finalImagePath = "images/category/" + files.category_image.newFilename + "." + imageExtension;

        fs.copyFile(imagePath, newImagePath, (err) => {
            if (err) {
                console.log(err);
            }
        });

        const catId = req.params.category_id;
        
        
        pool.query('SELECT category_image FROM category WHERE category_id = ?', [catId], function (error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(500).send("Erreur lors de la récupération de l'emplacement de l'ancienne image");
            }

            
            const oldImagePath = "../ModeWeb/public/"+results[0].category_image;

            
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            
            const updateCat = {
                category_name: editCat.category_name,
                category_content: editCat.category_content,
                category_image: finalImagePath
            }
            

            let sql = 'UPDATE category SET ? WHERE category_id = ?';

            pool.query(sql, [updateCat, catId], function (error, result, fields) {
                if (error) {
                    console.log(error);
                    return res.status(500).send("Erreur lors de la mise à jour de la catégorie");
                }
                res.redirect('/admin/category');
            });
        });
    });
}

