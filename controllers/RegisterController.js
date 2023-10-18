import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

//**Fonction qui affiche le formulaire d'inscription */
export const Register = function (req, res) {
    res.render('layout', {template:'register'});
}

/**fonction qui gere les info passé par l'utilisateur dans le formulaire d'inscritption */
export const RegisterSubmit = function (req, res) {
    
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexFirstname = /^[a-zA-Z-]+$/;
    const regexLastname = /^[a-zA-Z-]+$/;

    if (!emailRegex.test(email)) {
        /** Si l'adresse e-mail entrée dans l'input n'est pas valide renvoi une erreur**/
        return res.status(400).send("invalide email");
    }
    if (!regexFirstname.test(firstname)) {
        /** Si l'adresse e-mail entrée dans l'input n'est pas valide renvoi une erreur**/
        return res.status(400).send("invalide firstname");
    }
    if (!regexLastname.test(lastname)) {
        /** Si l'adresse e-mail entrée dans l'input n'est pas valide renvoi une erreur**/
        return res.status(400).send("invalide lastname");
    }
    
    
    //***creation de l'utilisateur en base de donnée et hachage du MDP pour plus de securité */
    bcrypt.hash(req.body.password, 10, function (error, hash) {
        if (error) {
            console.log(error);
        } else {
            const newUser = {
                id: uuidv4(),
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: hash
            };

            pool.query('INSERT INTO users SET ?', [newUser], function (error, result) {
                if (error) {
                    console.error(error);
                    res.status(500).send('Erreur de base de données');
                } else {
                    req.session.role = 'visitor';
                    res.redirect('/');
                }
            });
        }
    });
}
