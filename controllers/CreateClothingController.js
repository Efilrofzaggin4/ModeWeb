import pool from "../config/database.js";
import fs from "fs";
import formidable from "formidable";
import { v4 as uuidv4 } from 'uuid';

export const CreateClothingForm = (req, res) => {
    let sql = `
        SELECT clothing.*, category.category_id, category.category_name
        FROM clothing
        RIGHT JOIN category ON clothing.clothing_category_id = category.category_id
    `;

    pool.query(sql, function (error, results) {
        if (error) {
            console.log(error);
            res.status(500).send('Database error !');
        } else {
            res.render('layout', { template: 'createClothing', data: results });
        }
    });
};

export const CreateCLothingSubmit = (req, res) => {
    const SIZE_MAX = 5 * 1024 * 1024;
    const authorizedExtention = ["image/jpeg", "image/png", "image/jpg"];

    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        const createClothing = {
            name: fields.name,
            price: fields.price,
            sex: fields.sex,
            collection: fields.collection,
            clothing_category_id: fields.clothing_category_id,
        };

        const regexName = /^[a-zA-Z0-9\sÀ-ÿ.,!?()'-]*$/;
        const regexPrice = /^[a-zA-Z0-9\sÀ-ÿ\n\r.,!?()'-]*$/;
        const regexSex = /^[a-zA-Z0-9\sÀ-ÿ.,!?()'-]*$/;
        const regexCollection = /^[a-zA-Z0-9\sÀ-ÿ.,!?()'-]*$/;

        if (!regexName.test(createClothing.name)) {
            return res.status(400).send("Invalid name");
        }
        if (!regexPrice.test(createClothing.price)) {
            return res.status(400).send("Invalid price");
        }
        if (!regexSex.test(createClothing.sex)) {
            return res.status(400).send("Invalid sex");
        }
        if (!regexCollection.test(createClothing.collection)) {
            return res.status(400).send("Invalid collection");
        }

        if (err) {
            console.error(err);
            return res.status(500).send('Error on uploading image');
        }

        // image size validation
        if (files.image1.size > SIZE_MAX ||
            files.image2.size > SIZE_MAX ||
            files.image3.size > SIZE_MAX ||
            files.image4.size > SIZE_MAX) {
            return res.status(500).send("Une ou plusieurs images sont trop volumineuses");
        }

        // image path creation
        const image1Path = files.image1.filepath;
        const image2Path = files.image2.filepath;
        const image3Path = files.image3.filepath;
        const image4Path = files.image4.filepath;

        // image extension creation
        const image1Extension = files.image1.originalFilename.split(".").pop();
        const image2Extension = files.image2.originalFilename.split(".").pop();
        const image3Extension = files.image3.originalFilename.split(".").pop();
        const image4Extension = files.image4.originalFilename.split(".").pop();

        // image new path creation
        const newImage1Path = "public/images/clothing/" + files.image1.newFilename + "." + image1Extension;
        const newImage2Path = "public/images/clothing/" + files.image2.newFilename + "." + image2Extension;
        const newImage3Path = "public/images/clothing/" + files.image3.newFilename + "." + image3Extension;
        const newImage4Path = "public/images/clothing/" + files.image4.newFilename + "." + image4Extension;

        // image extension validation
        if (!authorizedExtention.includes(files.image1.mimetype) ||
            !authorizedExtention.includes(files.image2.mimetype) ||
            !authorizedExtention.includes(files.image3.mimetype) ||
            !authorizedExtention.includes(files.image4.mimetype)) {
            return res.status(500).send("wrong extension");
        }

        // image final path
        const finalImage1Path = "images/clothing/" + files.image1.newFilename + "." + image1Extension;
        const finalImage2Path = "images/clothing/" + files.image2.newFilename + "." + image2Extension;
        const finalImage3Path = "images/clothing/" + files.image3.newFilename + "." + image3Extension;
        const finalImage4Path = "images/clothing/" + files.image4.newFilename + "." + image4Extension;

        // copy image in folder
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
        const clothingId = uuidv4();

        //data base insertion
        pool.query('INSERT INTO clothing (clothing_id, clothing_name, clothing_price, clothing_sex, clothing_image1, clothing_image2, clothing_image3, clothing_image4, clothing_collection, clothing_category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [clothingId, createClothing.name, createClothing.price, createClothing.sex, finalImage1Path, finalImage2Path, finalImage3Path, finalImage4Path, createClothing.collection, createClothing.clothing_category_id], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send("Error on clothing insertion");
            }
            res.redirect('/admin/clothing');
        });
    });
};

