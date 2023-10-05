import pool from "../config/database.js";
import fs from "fs"
import formidable from "formidable"
import { v4 as uuidv4 } from 'uuid';

export const CreateCategoryForm =  (req, res) => {
    res.render('layout', {template : 'createCategory'});
};

export const CreateCategorySubmit = (req, res) => {
    
    const SIZE_MAX = 5 * 1024 * 1024

    const authorizedExtention = ["image/jpeg","image/png","image/jpg",]

    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {

        const createCat = {
            name: fields.name,
            content: fields.content
        }
        const regexName = /^[a-zA-Z0-9\sÀ-ÿ.,!?()'-]*$/;
        const regexContent=/^[a-zA-Z0-9\sÀ-ÿ\n\r.,!?()'-]*$/;

        if (!regexName.test(createCat.name)) {
            //security on name input
            return res.status(400).send("invalid name");   
        }
        if (!regexContent.test(createCat.content)) {
            //security on content input
            return res.status(400).send("invalid content");
        }

        if (err) {
            console.error(err);
            return res.status(500).send('error on uploading image');
        }

        if(files.image.size > SIZE_MAX){
            return res.status(500).send("image is too heavy")
        }

        const imagePath = files.image.filepath

        console.log("imagePath"+imagePath)
        const imageExtension = files.image.originalFilename.split(".").pop()

        const newImagePath = "public/images/category/"+files.image.newFilename+"."+imageExtension
        console.log("newImagePath"+newImagePath)
        
        if(!authorizedExtention.includes(files.image.mimetype)){
            return res.status(500).send("wrong extension for category image")
        }

        const finalImagePath = "images/category/"+files.image.newFilename+"."+imageExtension

        fs.copyFile(imagePath, newImagePath, (err) => {
            if (err) {
                console.log(err);
            }
        });

        const catId = uuidv4();

        pool.query('INSERT INTO category (id, name, content, image) VALUES (?, ?, ?, ?)', [catId, fields.name, fields.content, finalImagePath], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Error on category insertion");
        }
            res.redirect('/admin/category');
        });
            
    });
}