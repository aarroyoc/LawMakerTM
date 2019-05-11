exports.TextController = class TextController {
    /* En un texto se puede:
    * - Visualizar
    * - Añadir comentarios
    * - Votar
    */
    constructor(app){
        app.get("/article/text/:id",this.text);
        app.post("/addTextComment/:id",this.addTextComment);
        app.get("/article/voteText/:id/:option",this.vote);
    }
    text(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let texts = db.collection("texts");
        let textId = req.params.id;
        texts.findOne({id: textId},(err,text)=>{
            // RENDERIZAR
            res.render("text",{
                text: text,
                mail: req.session.mail,
                name: req.session.name
            });
        });
    }
    addTextComment(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let texts = db.collection("texts");
        let textId = req.params.id;
        texts.updateOne({id: textId},{
            $push: { "comments" : {
                text: req.body.text,
                name: req.body.name
            }}
        },(err,ok)=>{

        });
        res.redirect(`/article/text/${textId}`);
    }

    vote(req,res){
        if(!req.session.mail){
            res.status(403).send("No autorizado");
            return;
        }
        let db = req.mongo;
        let texts = db.collection("texts");
        let textId = req.params.id;
        let option = req.params.option;
        if(option == "yes"){
            texts.updateOne({id: textId},{
                $push: { "votes_favour" : req.session.mail}
            },(err,ok)=>{

            });
        }
        if(option == "no"){
            texts.updateOne({id: textId},{
                $push: { "votes_against" : req.session.mail}
            },(err,ok)=>{

            });
        }
        res.redirect(`/article/text/${textId}`);
    }

    
}