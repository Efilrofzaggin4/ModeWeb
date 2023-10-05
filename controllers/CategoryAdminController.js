import pool from "../config/database.js";
import fs from "fs"
import formidable from "formidable"

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

export const EditCategory = (req, res) => {
    
	let id = req.params.id;

	let sql = 'SELECT * FROM category WHERE id = ?';

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
            name: fields.name,
            content: fields.content
        }
        const regexName = /^[a-zA-Z0-9\sÀ-ÿ.,!?()'-]*$/;
        const regexContent = /^[a-zA-Z0-9\sÀ-ÿ\n\r.,!?()'-]*$/;

        if (!regexName.test(editCat.name)) {
            // Sécurité sur le champ "name"
            return res.status(400).send("Nom invalide");
        }
        if (!regexContent.test(editCat.content)) {
            // Sécurité sur le champ "content"
            return res.status(400).send("Contenu invalide");
        }

        if (err) {
            console.error(err);
            return res.status(500).send('Erreur lors du téléchargement de l\'image');
        }

        if (files.image.size > SIZE_MAX) {
            return res.status(500).send("L'image est trop lourde");
        }

        const imagePath = files.image.filepath;
        const imageExtension = files.image.originalFilename.split(".").pop();
        const newImagePath = "public/images/category/" + files.image.newFilename + "." + imageExtension;

        if (!authorizedExtention.includes(files.image.mimetype)) {
            return res.status(500).send("Extension incorrecte pour l'image de la catégorie");
        }

        const finalImagePath = "images/category/" + files.image.newFilename + "." + imageExtension;

        fs.copyFile(imagePath, newImagePath, (err) => {
            if (err) {
                console.log(err);
            }
        });

        const catId = req.params.id;
        
        // Récupérer l'emplacement de l'ancienne image depuis la base de données
        pool.query('SELECT image FROM category WHERE id = ?', [catId], function (error, results, fields) {
            if (error) {
                console.log(error);
                return res.status(500).send("Erreur lors de la récupération de l'emplacement de l'ancienne image");
            }

            // Stocker l'emplacement de l'ancienne image
            const oldImagePath = "../ModeWeb/public/"+results[0].image;

            // Supprimer l'ancienne image
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            // Mettre à jour la catégorie avec la nouvelle image
            const updateCat = {
                name: editCat.name,
                content: editCat.content,
                image: finalImagePath
            }
            

            let sql = 'UPDATE category SET ? WHERE id = ?';

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

