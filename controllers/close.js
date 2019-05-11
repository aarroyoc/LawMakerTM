exports.CloseController = class CloseController {
    constructor(app) {
        app.get("/article/finalclose/:id", this.close);
        app.post("/article/finalclose/:id", this.save);
    }
    close(req, res) {
        if (!req.session.mail) {
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let articles = db.collection("articles");
        let articleId = req.params.id;
        articles.findOne({ id: articleId }, (err, article) => {
            res.render("close", {
                proposedText: article.proposedText,
                amendments: article.amendments.filter((amendment) => {
                    return amendment.votes_favour.length > amendment.votes_against.length;
                })
            });
        });
    }
    save(req, res) {
        if (!req.session.mail) {
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let articles = db.collection("articles");
        let articleId = req.params.id;
        articles.updateOne({ id: articleId }, {
            $set: {
                "status": "close",
                "proposedText": req.body.proposedText
            }
        }, (err, ok) => {
            res.redirect(`/article/view/${articleId}`);
        });

    }
}