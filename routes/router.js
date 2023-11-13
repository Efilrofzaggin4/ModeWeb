import express from "express";

const router = express.Router();

                    //APPEL DES ROUTERS VISITEUR
import {Register, RegisterSubmit} from "../controllers/RegisterController.js";
import HomeController from "../controllers/HomeController.js";
import {Login, LoginSubmit, Logout} from "../controllers/LoginController.js";


                    //APPEL DES ROUTERS ADMIN

import AdminController from "../controllers/AdminController.js"

import {DisplayCategory, DeleteCategory, EditCategory, EditCategorySubmit} from "../controllers/CategoryAdminController.js"
import {CreateCategoryForm, CreateCategorySubmit} from "../controllers/CreateCategoryController.js"

import {DisplayClothing, DeleteClothing} from "../controllers/ClothingAdminController.js";
import { CreateClothingForm, CreateCLothingSubmit} from "../controllers/CreateClothingController.js";

import { CreatePerfumeForm, CreatePerfumeSubmit } from "../controllers/CreatePerfumeController.js";
                    //IMPORTATION DES ROUTES Visiteur

router.get('/', HomeController);

router.get('/register', Register)
router.post('/register', RegisterSubmit)

router.get('/login', Login)
router.post('/login', LoginSubmit)

router.get('/logout', Logout);

                    //IMPORTATION DES ROUTES ADMIN
router.get('/admin', AdminController);

//category gestion
router.get('/admin/category', DisplayCategory)
router.delete('/admin/category/:category_id', DeleteCategory);
router.get('/admin/category/editCategory/:category_id', EditCategory);
router.post('/admin/category/editCategory/:category_id', EditCategorySubmit)
router.get('/admin/category/create_category', CreateCategoryForm)
router.post('/admin/category/create_category', CreateCategorySubmit)

//clothing gestion
router.get('/admin/clothing', DisplayClothing)
router.delete('/admin/clothing/:clothing_id', DeleteClothing);
router.get('/admin/clothing/createClothing', CreateClothingForm);
router.post('/admin/clothing/createClothing', CreateCLothingSubmit);
//edit à faaire !!!!!

router.get('/admin/perfume/createPerfume', CreatePerfumeForm);


//IMPORTATION DES ROUTES Visiteur)


export default router;

