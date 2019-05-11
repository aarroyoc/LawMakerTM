exports.LoginController = class LoginController {
    constructor(app) {
        app.post("/login", this.login);
    }
    login(req, res) {
        let db = req.mongo;
        /*let users = db.collection("users");
        users
        .find({'email': req.body.email, 'password': req.body.password})
        .toArray(function(err,users){

        });*/
        if (req.body.email == "josefrancisco@valladolid.es") {
            req.session.mail = "josefrancisco@valladolid.es";
            req.session.name = "José Francisco";
            req.session.admin = true;
        }
        if (req.body.email == "luciaespada@murcia.net") {
            req.session.mail = "luciaespada@murcia.net";
            req.session.name = "Lucía Espada";
            req.session.admin = false;
        }
        res.redirect("/dashboard");
    }
}



