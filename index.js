const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'LawMaker';

let app = express();

app.set('view engine', 'ejs');

const { LoginController } = require("./controllers/login");
const { DashboardController } = require("./controllers/dashboard");
const { ArticleController } = require("./controllers/article");
const { TextController } = require("./controllers/text");
const { AmendmentsController } = require("./controllers/amendments");
const { CloseController } = require("./controllers/close");

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
    new DashboardController(app);
    new ArticleController(app);
    new TextController(app);
    new AmendmentsController(app);
    new CloseController(app);

    app.get("/",(req,res)=>{
        res.render("home");
    });

    app.listen(7575,()=>{
        console.log("Servidor iniciado en puerto 7575");
    });
});