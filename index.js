const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'LawMaker';

let app = express();

const { LoginController } = require("./controllers/login");

app.use(session({
    secret: "NatosWaor",
    resave: true,
    saveUninitialized: true,
}));
app.use(express.static("static"));
app.use(bodyParser.urlencoded());

MongoClient.connect(url,{
    poolSize: 10
}, function(err, client) {
    app.use((req,res,next)=>{
        req.mongo = client.db(dbName);
        next();
    });

    new LoginController(app);

    app.listen(7575,()=>{
        console.log("Servidor iniciado en puerto 7575");
    });
});