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
    constructor(app) {
        app.get("/article/view/:id", this.article);
        app.post("/addProposal/:id", this.addProposal);
        app.post("/addArticleComment/:id", this.addArticleComment);
        app.get("/article/close/:id", this.closeArticle); // Cierra votaciones y pasamos a enmiendas.
    }
    article(req, res) {
        if (!req.session.mail) {
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let articleId = req.params.id;
        let articles = db.collection("articles");
        articles.findOne({ id: articleId }, (err, ttt) => {
            let texts = db.collection("texts");
            texts.find({ articleId: articleId }).toArray((err, texts) => {
                res.render("article", {
                    article: ttt,
                    texts,
                    req
                });
            });
        });
    }
    addProposal(req, res) {
        if (!req.session.mail) {
            res.status(403).send("No autorizado");
            return;
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
    addArticleComment(req, res) {
        if (!req.session.mail) {
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let articleId = req.params.id;
        let articles = db.collection("articles");
        articles.updateOne({ id: articleId }, {
            $push: {
                "comments": {
                    text: req.body.text,
                    name: req.body.name
                }
            }
        }, (err, ok) => {

        });
        res.redirect(`/article/view/${articleId}`);
    }
    closeArticle(req, res) {
        if (!req.session.admin) {
            res.status(403).send("No autorizado. Sólo un administrador puede cerrar una votación.");
            return;
        } else {
            let db = req.mongo;
            let articleId = req.params.id;
            let articles = db.collection("articles");
            // Pasamos a estado de enmienda. 
            articles.updateOne({ "id": articleId },
                {
                    $set: { "status": "amendment" }
                }, (err, ok) => {
                    console.log(err)
                });
            res.redirect(`/article/view/${articleId}`);
        }
    }
}