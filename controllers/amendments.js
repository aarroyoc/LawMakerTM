exports.AmendmentsController = class AmendmentsController{
    constructor(app){
        app.get("/article/amendments/:id",this.amendments);
        app.get("/article/amendments/:id/:n/:option",this.vote);
        app.post("/article/amendments/:id",this.submitAmendment);
        app.get("/closeAmendments",this.closeAmendments);
    }
    amendments(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
        }
        let db = req.mongo;
        let articleId = req.params.id;
        let articles = db.collection("articles");
        articles.findOne({id: articleId},(err,article)=>{
            res.render("amendments",{
                article: article,
                mail: req.session.mail,
                admin: req.session.admin
            });
        });

    }
    vote(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let articles = db.collection("articles");
        let articleId = req.params.id;
        let amendmentId = req.params.n;
        let option = req.params.option;
        if(option == "yes"){
            articles.findOne({id: articleId},(err,ok)=>{
                ok.amendments[amendmentId].votes_favour.push(req.session.mail);
                console.log(ok);
                articles.replaceOne({id: articleId},ok,(err,ok)=>{

                });
            });
        }
        if(option == "no"){
            articles.findOne({id: articleId},(err,ok)=>{
                console.log(ok);
                ok.amendments[amendmentId].votes_against.push(req.session.mail);
                articles.replaceOne({id: articleId},ok,(err,ok)=>{

                });
            });
        }
        res.redirect(`/article/amendments/${articleId}`);
    }
    submitAmendment(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let articles = db.collection("articles");
        let articleId = req.params.id;
        articles.updateOne({id: articleId},{$push: {
            "amendments" : {
                text: req.body.amendment,
                votes_favour: [],
                votes_against: []
            }
        }},(err,ok)=>{

        });
        res.redirect(`/article/amendments/${articleId}`);
    }

    closeAmendments(req,res){
        if(!req.session.mail || !req.admin){
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let articles = db.collection("articles");
        let articleId = req.params.id;
        articles.updateOne({id: articleId},{
            $set: {
                "status" : "review"
            }
        },(err,ok)=>{

        });
        res.redirect(`/article/finalclose/${articleId}`);
    }
}