const express = require('express')
const server = express()

server.use(express.static('public'))

server.use(express.urlencoded({ extended:true }))

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'Baleia007',
    host: 'localhost',
    port: 5432,
    database: 'DOE'
})

const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})

server.get('/', function(req, res) {
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post('/', function( req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    const query = `
    INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        if (err) {
            console.log(err)
              return res.send("erro no banco de dados.")
            }

        return res.redirect("/")
    })    
})

server.listen(3000, function() {
    console.log("Oi")
})