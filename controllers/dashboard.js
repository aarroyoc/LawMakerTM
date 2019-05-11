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
    * -----
    * ESTADOS:
    * PROPOSED -> OPEN -> VOTE -> CLOSE
    * */
    constructor(app){
        app.get("/dashboard",this.dashboard);
        app.post("/proposeArticle",this.proposeArticle);
        app.get("/notifyTo/:id/:sub",this.notifyTo);
        app.get("/newArticle",this.newArticle);
    }
    dashboard(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let articles = db.collection("articles");

        articles.find({"status" : "open"}).toArray((err,openArticles)=>{
            articles.find({"status" : "close"}).toArray((err,closedArticles)=>{
                articles.find({"status" : "proposed"}).toArray((err,proposedArticles)=>{
                    articles.find({"starred_by" : req.session.mail}).toArray((err,starredArticles)=>{
                        articles.find({"status":"amendment"}).toArray((err,amendmentArticles)=>{
                             // RENDERIZAR
                            res.render("dashboard",{
                                openArticles,
                                closedArticles,
                                proposedArticles,
                                starredArticles,
                                amendmentArticles,
                                mail: req.session.mail
                            });
                        });
                    });
                })
            });
        });
    }

    newArticle(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
            return;
        }
        res.render("new_article");
    }

    proposeArticle(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let articles = db.collection("articles");
        let articleId = uuidv4();
        articles.insertOne({
            "id" : articleId,
            "n_article" : req.body.n_article,
            "status" : "proposed",
            "starred_by" : [],
            "tags" : req.body.tags.split(","),
            "title" : req.body.title,
            "motivation" : req.body.motivation,
            "votes_favour" : [],
            "votes_against" : [],
            "comments" : [],
            "amendments" : [],
            "proposedText" : ""
        },(err,res)=>{

        });
        res.redirect(`/article/view/${articleId}`);
    }

    notifyTo(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
            return;
        }
        let id = req.params.id;
        let sub = req.params.sub;
        let db = req.mongo;
        let articles = db.collection("articles");
        if(sub == "follow"){
            articles.updateOne({"id": id},{ $push : {
                "starred_by" : req.session.mail
            }},(err,ok)=>{

            });
        }
        if(sub == "unfollow"){
            articles.updateOne({"id":id},{$pull: {
                "starred_by" : req.session.mail
            }},(err,ok)=>{

            });
        }
        res.redirect("/dashboard");

    }

}