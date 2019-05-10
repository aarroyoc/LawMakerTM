const uuidv4 = require('uuid/v4');

exports.DashboardController = class DashboardController {
    /*
    Desde el dashboard se puede:
    * Ver artículos abiertos
    * Proponer artículos nuevos
    * Ver artículos cerrados
    * Ver artículos propuestos
    * Proponer cambios de estructura
    * Notificaciones
    * */
    constructor(app){
        app.get("/dashboard",this.dashboard);
        app.post("/proposeArticle",this.proposeArticle);
        app.get("/notifyTo/:id",this.notifyTo);
    }
    dashboard(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
        }
        let db = req.mongo;
        let articles = db.collection("articles");
        res.send("OK");

        articles.find({"status" : "open"}).toArray((err,openArticles)=>{
            articles.find({"status" : "close"}).toArray((err,closedArticles)=>{
                articles.find({"status" : "proposed"}).toArray((err,proposedArticles)=>{
                    articles.find({"starred_by" : req.session.mail}).toArray((err,starredArticles)=>{
                        // RENDERIZAR
                    });
                })
            });
        });
    }

    proposeArticle(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
        }
        let db = req.mongo;
        let articles = db.collection("articles");
        articles.insertOne({
            "id" : uuidv4(),
            "status" : "proposed",
            "starred_by" : [],
            "tags" : [],
            "title" : req.body.title,
            "motivation" : req.body.motivation,
            "votes_favour" : [],
            "votes_against" : [],
            "comments" : []
        },(err,res)=>{

        });
        res.redirect("/article/:id");
    }

    notifyTo(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
        }
        let id = req.params.id;
        let db = req.mongo;
        let articles = db.collection("articles");
        articles.updateOne({"id": id},{ $push : {
            "starred_by" : req.session.mail
        }},(err,ok)=>{

        });
        res.redirect("/dashboard");

    }

}