import express from "express";

const router = express.Router();

                    //APPEL DES ROUTERS VISITEUR
import {Register, RegisterSubmit} from "../controllers/RegisterController.js";
import HomeController from "../controllers/HomeController.js";



                    //APPEL DES ROUTERS ADMIN

import AdminController from "../controllers/AdminController.js"

import {DisplayCategory, DeleteCategory, EditCategory, EditCategorySubmit} from "../controllers/CategoryAdminController.js"
import {CreateCategoryForm, CreateCategorySubmit} from "../controllers/CreateCategoryController.js"

import {DisplayClothing, DeleteClothing} from "../controllers/ClothingAdminController.js";
                    //IMPORTATION DES ROUTES Visiteur

router.get('/', HomeController);

router.get('/register', Register)
router.post('/register', RegisterSubmit)

                    //IMPORTATION DES ROUTES ADMIN
router.get('/admin', AdminController);

//category gestion
router.get('/admin/category', DisplayCategory)
router.delete('/admin/category/:id', DeleteCategory);
router.get('/admin/category/editCategory/:id', EditCategory);
router.post('/admin/category/editCategory/:id', EditCategorySubmit)
router.get('/admin/category/create_category', CreateCategoryForm)
router.post('/admin/category/create_category', CreateCategorySubmit)

//clothing gestion
router.get('/admin/clothing', DisplayClothing)
router.delete('/admin/clothing/:id', DeleteClothing);


export default router;
