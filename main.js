const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController"); 
const coursesController = require("./controllers/coursesController");


// Configuration de la connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/ai_academy", { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.once("open", () => {
    console.log("Connexion réussie à MongoDB en utilisant Mongoose!");
});

const app = express();
const methodOverride = require("method-override"); 
app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
  }));

// Configuration de base
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use((req, res, next) => {
    res.locals.pageTitle = "Accueil"; // Valeur par défaut pour toutes les pages
    next();
  });

// Routes principales
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/contact", homeController.contact);
app.post("/contact", homeController.processContact);
app.get("/faq", homeController.faq);

// Routes pour les abonnés (NOTE: l'ordre est important)
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/new", subscribersController.getSubscriptionPage);
app.post("/subscribers/create", subscribersController.saveSubscriber);
app.get("/subscribers/search", subscribersController.searchSubscribers); 
app.get("/subscribers/:id", subscribersController.show);
app.post("/subscribers/:id/delete", subscribersController.deleteSubscriber);
app.get("/subscribers/:id/edit", subscribersController.editSubscriber);
app.post("/subscribers/:id/update", subscribersController.updateSubscriber);

// Routes pour les utilisateurs
app.get("/users", usersController.index, usersController.indexView); 
app.get("/users/new", usersController.new);
app.post("/users/create", usersController.create, usersController.redirectView);
app.get("/users/:id", usersController.show, usersController.showView);
app.get("/users/:id/edit", usersController.edit);
app.put("/users/:id/update", usersController.update, usersController.redirectView); 
app.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

// Routes pour les cours
app.get("/courses", coursesController.index, coursesController.indexView);
app.get("/courses/new", coursesController.new);
app.post("/courses/create", coursesController.create, coursesController.redirectView); 
app.get("/courses/:id", coursesController.show, coursesController.showView);
app.get("/courses/:id/edit", coursesController.edit);
app.put("/courses/:id/update", coursesController.update, coursesController.redirectView); 
app.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);

// Gestion des erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Démarrer le serveur
app.listen(app.get("port"), () => {
    console.log(`Serveur démarré sur http://localhost:${app.get("port")}`);
});