import express from "express";

const router = express.Router();

                    //APPEL DES ROUTERS
import HomeController from "../controllers/HomeController.js"





//IMPORTATION DES ROUTES
router.get('/', HomeController);


export default router;
