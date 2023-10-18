import pool from "../config/database.js";
import fs from "fs"
import formidable from "formidable"
import { v4 as uuidv4 } from 'uuid';

export const CreateClothingForm =  (req, res) => {
    res.render('layout', {template : 'createClothing'});
};

export const CreateCLothingSubmit = (req, res) => {
    
    const SIZE_MAX = 5 * 1024 * 1024

    const authorizedExtention = ["image/jpeg","image/png","image/jpg",]

    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {

        const createCLoth = {
            name: fields.name,
            price: fields.price,
            sexe: fields.sexe
        }
        // const chooseCat = {
        //     catName: fields.catname,
        // }

        const regexName = /^[a-zA-Z0-9\sÀ-ÿ.,!?()'-]*$/;
        const regexPrice=/^[a-zA-Z0-9\sÀ-ÿ\n\r.,!?()'-]*$/;

        if (!regexName.test(createCLoth.name)) {
            //security on name input
            return res.status(400).send("invalid name");   
        }
        if (!regexPrice.test(createCLoth.price)) {
            //security on content input
            return res.status(400).send("invalid content");
        }

        if (err) {
            console.error(err);
            return res.status(500).send('error on uploading image');
        }

        if(files.image1.size > SIZE_MAX){
            return res.status(500).send("image 1 is too heavy")
        }

        if(files.image2.size > SIZE_MAX){
            return res.status(500).send("image 2 is too heavy")
        }

        if(files.image3.size > SIZE_MAX){
            return res.status(500).send("image 3 is too heavy")
        }

        if(files.image4.size > SIZE_MAX){
            return res.status(500).send("image 4 is too heavy")
        }

        const image1Path = files.image1.filepath
        const image2Path = files.image2.filepath
        const image3Path = files.image3.filepath
        const image4Path = files.image4.filepath

        // console.log("imagePath"+imagePath)
        const image1Extension = files.image1.originalFilename.split(".").pop()
        const image2Extension = files.image2.originalFilename.split(".").pop()
        const image3Extension = files.image3.originalFilename.split(".").pop()
        const image4Extension = files.image4.originalFilename.split(".").pop()

        const newImage1Path = "public/images/clothing/"+files.image1.newFilename+"."+image1Extension

        const newImage2Path = "public/images/clothing/"+files.image2.newFilename+"."+image2Extension

        const newImage3Path = "public/images/clothing/"+files.image3.newFilename+"."+image3Extension

        const newImage4Path = "public/images/clothing/"+files.image4.newFilename+"."+image4Extension
        
        
        if(!authorizedExtention.includes(files.image1.mimetype)){
            return res.status(500).send("wrong extension for clothing image 1")
        }

        if(!authorizedExtention.includes(files.image2.mimetype)){
            return res.status(500).send("wrong extension for clothing image 2")
        }

        if(!authorizedExtention.includes(files.image3.mimetype)){
            return res.status(500).send("wrong extension for clothing image 3")
        }

        if(!authorizedExtention.includes(files.image4.mimetype)){
            return res.status(500).send("wrong extension for clothing image 4")
        }

        const finalImage1Path = "images/clothing/"+files.image1.newFilename+"."+image1Extension

        const finalImage2Path = "images/clothing/"+files.image2.newFilename+"."+image2Extension

        const finalImage3Path = "images/clothing/"+files.image3.newFilename+"."+image3Extension

        const finalImage4Path = "images/clothing/"+files.image4.newFilename+"."+image4Extension

        fs.copyFile(image1Path, newImage1Path, (err) => {
            if (err) {
                console.log(err);
            }
        });
        fs.copyFile(image2Path, newImage2Path, (err) => {
            if (err) {
                console.log(err);
            }
        });
        fs.copyFile(image3Path, newImage3Path, (err) => {
            if (err) {
                console.log(err);
            }
        });
        fs.copyFile(image4Path, newImage4Path, (err) => {
            if (err) {
                console.log(err);
            }
        });

        const clothId = uuidv4();
        // const catId = uuidv4();

        pool.query('INSERT INTO clothing (id, name, price,sexe, image1, image2, image3, image4) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [clothId, fields.name, fields.price, fields.sexe, finalImage1Path, finalImage2Path, finalImage3Path, finalImage4Path], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Error on clothing insertion");
            }
        });

        const clothingId = result.insertId;

        if (categories && categories.length > 0) {
            const values = categories.map(categoryId => [clothingId, categoryId]);
            pool.query('INSERT INTO clothing_category (clothing_id, category_id) VALUES ?', [values], (catError) => {
              if (catError) {
                console.error(catError);
                return res.status(500).send('error on category insertion');
              }
            });
          } else {
            res.redirect('/admin/clothing'); // Redirigez vers la liste des vêtements ou une autre page de confirmation
          }
    });
}