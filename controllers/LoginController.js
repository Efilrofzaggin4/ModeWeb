import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

//**CETTE FONCTION GERE L'AFFICHAGE DU FORMULAIRE DE CONNEXION */
export const Login = function (req, res) {
    res.render('layout', {template:'login'});
}


//cette fonction a pour but de comparer les informations envoyées par l'utilisateur dans le formulaire et verifier si les infos existe en base de données*//

export const LoginSubmit = function (req, res) {
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        /** Si l'adresse e-mail entrée dans l'input n'est pas valide renvoi une erreur**/
        return res.status(400).send("informations incorrect");
        
    }
    
    pool.query('SELECT * from users WHERE email = ?', [email], function (error, result) {
        if (error) { //gestion d'erreur
            console.error(error);
            res.status(500).send('Erreur de base de données');
        } else { //redirection sur la page home si les infos ne sont pas présentes en base de données
            if (result.length < 1) {
                res.redirect('/login');
            } else {
                //**si le mot de passe est bon bcrypt compare le mot de passe entrée par l'utilsateur et celui enregistrer en base de données */
                bcrypt.compare(password, result[0].password, function(error, isAllowed) {
                    if (isAllowed) { //si le mot de passe est correct la session est mise en place et si cet utilisateur à le role admin il est redirigé vers la page admin
                        req.session.role = result[0].role;
                        res.redirect('/admin');
                    } else {
                        res.redirect('/login');
                    }
                })
            }

        }
    });
}

/**CETTE FONCTION GERE LA DECONNEXION */
export const Logout = function (req, res) {
    req.session.destroy(function (error) { // destruction de session
        if (error) {
            console.error(error);
        }
        
        // Redirection sur page d'accueil
        res.redirect('/login');
    });
};