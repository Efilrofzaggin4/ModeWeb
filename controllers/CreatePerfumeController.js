import pool from "../config/database.js";
import fs from "fs";
import formidable from "formidable";
import { v4 as uuidv4 } from 'uuid';

export const CreatePerfumeForm =  (req, res) => {
    res.render('layout', {template : 'createPerfume'});
};

export const CreatePerfumeSubmit = (req, res) => {
    
    const SIZE_MAX = 5 * 1024 * 1024

    const authorizedExtention = ["image/jpeg","image/png","image/jpg",]

    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {

        const createPerf = {
            name: fields.name,
            brand: fields.brand,
            price: fields.price,
            description: fields.description,
            gender: fields.gender
        }

        const regexName = /^[a-zA-Z0-9\sÀ-ÿ.,!?()'-]*$/;
        const regexBrand=/^[a-zA-Z0-9\sÀ-ÿ\n\r.,!?()'-]*$/;
        const regexPrice = /^\d+(\.\d{2})?$/
        const regexDescription = /^[a-zA-Z0-9\sÀ-ÿ\n\r.,!?()'-]*$/;


        if (!regexName.test(createPerf.name)) {
            //security on name input
            return res.status(400).send("invalid name");   
        }
        if (!regexBrand.test(createPerf.brand)) {
            //security on brand input
            return res.status(400).send("invalid brand");
        }
        if (!regexPrice.test(createPerf.price)) {
            //security on price input
            return res.status(400).send("invalid price");
        }
        if (!regexDescription.test(createPerf.description)) {
            //security on description input
            return res.status(400).send("invalid description");
        }

        if (err) {
            console.error(err);
            return res.status(500).send('error on uploading image');
        }

        if(files.image.size > SIZE_MAX){
            return res.status(500).send("image is too heavy")
        }

        const imagePath = files.image.filepath

        // console.log("imagePath"+imagePath)
        const imageExtension = files.image.originalFilename.split(".").pop()

        const newImagePath = "public/images/perfume"+files.image.newFilename+"."+imageExtension
        // console.log("newImagePath"+newImagePath)
        
        if(!authorizedExtention.includes(files.image.mimetype)){
            return res.status(500).send("wrong extension for perfume image")
        }

        const finalImagePath = "images/perfume/"+files.image.newFilename+"."+imageExtension

        fs.copyFile(imagePath, newImagePath, (err) => {
            if (err) {
                console.log(err);
            }
        });

        const perfumeId = uuidv4();

        pool.query('INSERT INTO perfume (perfume_id, perfume_name, perfume_brand, perfume_price, perfume_description, perfume_image, perfume_gender) VALUES (?, ?, ?, ?, ?, ?, ?)', [perfumeId, fields.name, fields.brand, fields.price, fields.description, fields.gender, finalImagePath], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Error on perfume insertion");
        }
            res.redirect('/admin/perfume');
        });
            
    });
}