import pool from "../config/database.js"

export default (req, res) => {
    res.render('layout', {template :'home'})   
}