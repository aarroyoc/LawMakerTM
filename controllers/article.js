const uuidv4 = require('uuid/v4');

exports.ArticleController = class ArticleController {
    /* Desde un artículo se puede:
    * Visualizar
    * Añadir propuesta
    * Comentar
    * Votar (en periodo final)
    * Suscribirse (enlace a /notifyTo)
    * [ADMIN] Cambiar de estado
    * Filtros de palabras
    */
    constructor(app){
        app.get("/article/view/:id",this.article);
        app.post("/addProposal/:id",this.addProposal);
        app.post("/addArticleComment/:id",this.addArticleComment);
    }
    article(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
        }
        let db = req.mongo;
        let articleId = req.params.id;
        let articles = db.collections("articles");
        articles.findOne({id: articleId},(err,res)=>{
            let texts = db.collection("texts");
            texts.find({articleId: articleId}).toArray((err,texts)=>{
                res.render("article", {
                    article: texts
                });
            });    
        });
    }
    addProposal(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
        }
        let db = req.mongo;
        let texts = db.collections("texts");
        let articleId = req.params.id;
        let textId = uuidv4();
        texts.insertOne({
            id: textId,
            articleId: articleId,
            parent: req.body.parent || null,
            text: req.body.text,
            votes_favour: [],
            votes_against: [],
            comments: []
        });
        res.redirect(`/article/text/${textId}`);
    }
    addArticleComment(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
        }
        let db = req.mongo;
        let articleId = req.params.id;
        let articles = db.collections("articles");
        articles.updateOne({id: articleId},{
            $push: { "comments" : {
                text: req.body.text,
                name: req.body.name
            }}
        },(err,ok)=>{

        });
        res.redirect(`/article/view/${articleId}`);
    }

}