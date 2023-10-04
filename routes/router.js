import express from "express";

const router = express.Router();

                    //APPEL DES ROUTERS VISITEUR
import HomeController from "../controllers/HomeController.js"



                    //APPEL DES ROUTERS ADMIN

import AdminController from "../controllers/AdminController.js"

//IMPORTATION DES ROUTES Visiteur
router.get('/', HomeController);

//Importation des routes admin
router.get('/admin', AdminController);
export default router;
