exports.AmendmentsController = class AmendmentsController{
    constructor(app){
        app.get("/article/amendments/:id",this.amendments);
        app.get("/article/amendments/:id/:n/:option",this.vote);
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
                articles.updateOne({id: articleId},ok,(err,ok)=>{

                });
            });
        }
        if(option == "no"){
            articles.findOne({id: articleId},(err,ok)=>{
                console.log(ok);
                ok.amendments[amendmentId].votes_against.push(req.session.mail);
                articles.updateOne({id: articleId},ok,(err,ok)=>{

                });
            });
        }
        res.redirect(`/article/amendments/${articleId}`);
    }
}