const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoClient = require('mongodb').MongoClient;

let app = express();

app.use(session({
    secret: "NatosWaor",
    resave: true,
    saveUninitialized: true,
}));
app.use(express.static("static"));
app.use(bodyParser.urlencoded());

app.listen(7575,()=>{
    console.log("Servidor iniciado en puerto 7575");
});