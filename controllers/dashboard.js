exports.Dashboard = class DashboardController {
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
    }
    dashboard(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
        }
        let db = req.mongo;
        let articles = db.collection("articles");
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
    }

}