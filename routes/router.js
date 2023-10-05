import express from "express";

const router = express.Router();

                    //APPEL DES ROUTERS VISITEUR
import HomeController from "../controllers/HomeController.js"



                    //APPEL DES ROUTERS ADMIN

import AdminController from "../controllers/AdminController.js"

import {DisplayCategory, DeleteCategory, EditCategory} from "../controllers/CategoryAdminController.js"
import {CreateCategoryForm, CreateCategorySubmit} from "../controllers/CreateCategoryController.js"
                    //IMPORTATION DES ROUTES Visiteur

router.get('/', HomeController);

                    //IMPORTATION DES ROUTES ADMIN
router.get('/admin', AdminController);

router.get('/admin/category', DisplayCategory)
router.delete('/admin/category/:id', DeleteCategory);
router.get('/admin/category/editCategory/:id', EditCategory);


router.get('/admin/category/create_category', CreateCategoryForm)
router.post('/admin/category/create_category', CreateCategorySubmit)



export default router;
