// Imports
const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const httpStatus = require("http-status-codes");
const routes = require("./routes/index");


// Configuration de la connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/ai_academy", {
  useNewUrlParser: true
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connexion réussie à MongoDB en utilisant Mongoose!");
});

// Initialisation de l'application Express
const app = express();

// Configuration de l'application
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));

// Configuration des cookies et des sessions
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

// Configuration du User model pour Passport
const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware pour rendre les variables locales disponibles dans toutes les vues
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});



// Utilisation des routes

app.use("/", routes);

// Démarrage du serveur
app.listen(app.get("port"), () => {
  console.log(`Le serveur a démarré et écoute sur le port: ${app.get("port")}`);
  console.log(`Serveur accessible à l'adresse: http://localhost:${app.get("port")}`);
});