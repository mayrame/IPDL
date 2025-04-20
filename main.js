const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const authController = require("./controllers/authController");
const coursesController = require("./controllers/coursesController");

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/ai_academy")
  .then(() => console.log("Connexion réussie à MongoDB en utilisant Mongoose!"))
  .catch(err => console.error("Erreur de connexion MongoDB:", err));

const app = express();

// Configuration de l'application
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(layouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

// Configuration des cookies et sessions
app.use(cookieParser("secret_passcode"));
app.use(session({
  secret: "secret_passcode",
  cookie: { maxAge: 4000000 },
  resave: false,
  saveUninitialized: false
}));

// Configuration de flash messages
app.use(flash());

// Configuration de Passport
app.use(passport.initialize());
app.use(passport.session());

const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Variables locales accessibles dans toutes les vues
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.pageTitle = "Accueil";
  next();
});

// Routes principales
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/contact", homeController.contact);
app.post("/contact", homeController.processContact);
app.get("/faq", homeController.faq);

// Routes pour les abonnés
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/new", subscribersController.getSubscriptionPage);
app.post("/subscribers/create", subscribersController.saveSubscriber);
app.get("/subscribers/search", subscribersController.searchSubscribers);
app.get("/subscribers/:id", subscribersController.show);
app.post("/subscribers/:id/delete", subscribersController.deleteSubscriber);
app.get("/subscribers/:id/edit", subscribersController.editSubscriber);
app.post("/subscribers/:id/update", subscribersController.updateSubscriber);

// Routes pour les utilisateurs (toutes protégées)
app.use("/users", authController.ensureLoggedIn);
app.get("/users", usersController.index, usersController.indexView);
app.get("/users/new", usersController.new);
app.post("/users/create", usersController.create, usersController.redirectView);
app.get("/users/:id", usersController.show, usersController.showView);
app.get("/users/:id/edit", usersController.edit);
app.put("/users/:id/update", usersController.update, usersController.redirectView);
app.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

// Routes pour les cours
app.get("/courses", coursesController.index, coursesController.indexView);
app.get("/courses/new", 
  authController.ensureLoggedIn,
  coursesController.new
);
app.post("/courses/create", 
  authController.ensureLoggedIn,
  coursesController.create, 
  coursesController.redirectView
);
app.get("/courses/:id", coursesController.show, coursesController.showView);
app.get("/courses/:id/edit", 
  authController.ensureLoggedIn,
  coursesController.edit
);
app.put("/courses/:id/update", 
  authController.ensureLoggedIn,
  coursesController.update, 
  coursesController.redirectView
);
app.delete("/courses/:id/delete", 
  authController.ensureLoggedIn,
  coursesController.delete, 
  coursesController.redirectView
);

// Routes d'authentification
app.get("/login", authController.login);
app.post("/login", authController.authenticate);
app.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.flash("success", "Vous avez été déconnecté avec succès!");
    res.redirect("/");
  });
});
app.get("/signup", authController.signup);
app.post("/signup", authController.register, usersController.redirectView);

// Gestion des erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Lancement du serveur
app.listen(app.get("port"), () => {
  console.log(`Serveur démarré sur http://localhost:${app.get("port")}`);
});